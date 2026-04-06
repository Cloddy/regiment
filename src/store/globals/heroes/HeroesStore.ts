import { FieldModel, ListModel } from '@ktsstudio/mediaproject-stores';
import { makeAutoObservable } from 'mobx';

import { ENDPOINTS } from 'config/api';
import { USE_MOCKS } from 'config/env';
import { createHero, MOCK_HEROES } from 'entities/hero';
import { IGlobalStore } from 'store/interfaces';
import { ApiRequest } from 'store/models/ApiRequest';
import { Form } from 'store/models/Form';

import { RootStoreType } from '../root';

import { GetHeroesResponse } from './types';

export class HeroesStore implements IGlobalStore {
  // загруженные анкеты с бэка
  private readonly _forms = new ListModel<Form>([], (form) => form.id);

  private readonly _skipFirstHeroesLoad = new FieldModel<boolean>(false);

  private readonly _request: ApiRequest<GetHeroesResponse>;

  constructor(readonly rootStore: RootStoreType) {
    makeAutoObservable(this);

    this._request = this.rootStore.apiStore.createRequest(ENDPOINTS.getHeroList);
  }

  readonly init = async (): Promise<boolean> => {
    return await this.loadHeroes(true);
  };

  get hasAtLeastOneHero(): boolean {
    return this._forms.length > 0;
  }

  get isLoading(): boolean {
    return this._request.isLoading;
  }

  get formsCount(): number {
    return this._forms.length;
  }

  get heroes(): Form[] {
    return this._forms.items;
  }

  /** список анкет */
  loadHeroes = async (calledFromAuth = false): Promise<boolean> => {
    if (this.isLoading) {
      return false;
    }

    if (calledFromAuth) {
      this._skipFirstHeroesLoad.changeValue(true);
    } else if (this._skipFirstHeroesLoad.value) {
      this._skipFirstHeroesLoad.changeValue(false);

      return false;
    }

    if (USE_MOCKS) {
      void this.rootStore.statsStore.sendViewHeroes(MOCK_HEROES.length);

      this._forms.addEntities({
        entities: MOCK_HEROES.map(createHero),
        isInitial: true,
      });

      if (!this.hasAtLeastOneHero) {
        this._skipFirstHeroesLoad.changeValue(false);
      }

      return true;
    }

    const { data, isError } = await this._request.fetch();

    if (data && !isError) {
      void this.rootStore.statsStore.sendViewHeroes(data.heroes.length);

      if (data.heroes?.length) {
        this._forms.addEntities({
          entities: data.heroes.map(createHero),
          isInitial: true,
        });
      } else {
        this._forms.reset();
      }

      if (!this.hasAtLeastOneHero) {
        this._skipFirstHeroesLoad.changeValue(false);
      }
    }

    return !isError;
  };

  readonly getFormById = (heroID: string): Form | null => {
    return this._forms.getEntityByKey(heroID);
  };

  readonly addForm = (form: Form) => {
    this._forms.addEntity({ entity: form });
  };

  readonly removeForm = (heroID: string) => {
    this._forms.removeEntity(heroID);
  };

  destroy = () => {
    this._forms.reset();
  };
}

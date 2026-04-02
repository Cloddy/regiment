import { FieldModel } from '@ktsstudio/mediaproject-stores';
import { makeObservable } from 'mobx';

import { RootStoreType } from 'store/globals/root';
import { ILocalStore } from 'store/interfaces';
import { Form } from 'store/models/Form';
import { FormList } from 'store/models/FormList';

class FormPageStore implements ILocalStore {
  readonly formList: FormList;

  readonly heroId = new FieldModel<string | null>(null);

  constructor(private readonly _rootStore: RootStoreType) {
    this.formList = new FormList(this._rootStore);

    makeObservable(this);
  }

  get currentForm(): Form | null {
    if (!this.heroId.value) {
      return this.formList.buffForm.value;
    }

    return this._rootStore.heroesStore.getFormById(this.heroId.value);
  }

  get militaryUnitsOptions(): { label: string; value: string }[] {
    const currentMilitaryUnit = this.currentForm?.militaryUnit.value ?? '';

    // чтобы при открытии формы в инпуте было текущее значение до первого запроса на бэк
    if (this.formList.militaryUnits.length === 0 && currentMilitaryUnit) {
      return [{ label: currentMilitaryUnit.value, value: currentMilitaryUnit.id }];
    }

    return this.formList.militaryUnits.map((unit) => ({ label: unit.value, value: unit.id }));
  }

  init = async (heroId = '', isEdit = false) => {
    // обнуление ошибки
    this.formList.setError();
    this.heroId.changeValue(heroId);

    if (isEdit && heroId) {
      await this.formList.loadHero(heroId);

      this.formList.rememberImages(heroId);

      return;
    }

    this.formList.resetBuffForm();
  };

  destroy = () => {
    this.formList.reset();
    this.heroId.reset();
  };
}

export default FormPageStore;

import * as Sentry from '@sentry/react';
import Konva from 'konva';

import { images } from 'assets/img/share';
// import { militaryBranches } from 'config/militaryBranch';
import { loadOnlyImage } from 'utils/loadImages';

import { config } from './config';
import { splitHyphen } from './strings';
import { DrawProps } from './types';

export default async ({
  firstName,
  lastName,
  middleName,
  birthday,
  deathDate: deathday,
  photo,
  alive,
  callback,
  // militaryBranch,
}: DrawProps): Promise<boolean> => {
  console.log('photo', photo);
  const container = document.createElement('div');
  const canvas = new Konva.Stage({
    container,
    ...config.stage,
  });

  /** добавление слоя */
  const layer = new Konva.Layer();

  canvas.add(layer);

  /** предзагрузить картинки */
  try {
    // фон
    const backgroundImage = await loadOnlyImage(images.backgroundStory);
    const background = new Konva.Image({
      image: backgroundImage,
      ...config.background,
    });

    layer.add(background);

    /** группа белого прямоугольника
     * сюда будут складываться все элементы
     * у элементов группы отсчет координат относительно групповго элемента
     */
    const group = new Konva.Group({
      x: 247,
      y: 517,
      width: 585,
      height: 1027, // изменится ниже по коду
    });

    /** белый прямоугольник */
    const whiteRect = new Konva.Rect(config.whiteRect);

    group.add(whiteRect);

    /** фото героя */
    let heroImage: HTMLImageElement | '' = '';

    try {
      heroImage = await loadOnlyImage(photo ? photo : images.placeholder);
    } catch (e) {
      Sentry.captureException(e);

      console.log('photoImage error', e);

      /** если по какой-то причине фото героя не загрузилось, например CORS, то подставляем фото-плейсхолдер */
      heroImage = await loadOnlyImage(images.placeholder);
    }

    const photoKonvaImage = new Konva.Image({
      image: heroImage,
      ...config.photo,
    });

    group.add(photoKonvaImage);

    /** подсчет дополнительного вертикального расстояния */
    let deltaY = 0;

    // решили вообще убрать блок, так как не договорились как сокращать названия
    // оставила на всякий случай
    // if (militaryBranch) {
    //   /** войска */
    //   /** название войска */
    //   const militaryBranchKonvaText = new Konva.Text({
    //     text: militaryBranches[militaryBranch].shortTitle,
    //     ...config.militaryBranch,

    //     /** расположить по центру по горизонтали */
    //     x: whiteRect.x() + whiteRect.width() / 2,
    //   });
    //   const width = militaryBranchKonvaText.getWidth();

    //   /** расположить по центру по горизонтали */
    //   militaryBranchKonvaText.offsetX(militaryBranchKonvaText.getWidth() / 2);

    //   /** посчитать какой ширины текст "войска" и подобрать подходящую ширину и картирнку блока */
    //   const width2 = width + 30;
    //   let rectImage = await loadOnlyImage(images.rectangleS);
    //   let rectWidth = 350;

    //   if (width2 > 350 && width2 <= 450) {
    //     rectImage = await loadOnlyImage(images.rectangleM);
    //     rectWidth = 450;
    //   } else if (width2 > 450) {
    //     rectImage = await loadOnlyImage(images.rectangleL);
    //     rectWidth = 550;
    //   }

    //   /** лента под названием войска */
    //   const rectMilitaryBranch = new Konva.Image({
    //     image: rectImage,
    //     ...config.rectMilitaryBranch,
    //     width: rectWidth,

    //     /** расположить по центру по горизонтали */
    //     x: whiteRect.x() + whiteRect.width() / 2,
    //   });

    //   /** расположить по центру по горизонтали */
    //   rectMilitaryBranch.offsetX(rectMilitaryBranch.width() / 2);
    //   group.add(rectMilitaryBranch);

    //   group.add(militaryBranchKonvaText);
    // } else {
    //   deltaY = -37;
    // }

    deltaY = -37;

    /** фамилия */
    const lastNameKonvaText = new Konva.Text({
      text: lastName,
      ...config.lastName,
      y: deltaY + config.lastName.y!,

      /** расположить по центру по горизонтали */
      x: whiteRect.x() + whiteRect.width() / 2,
    });

    /** расположить по центру по горизонтали */
    lastNameKonvaText.offsetX(lastNameKonvaText.getWidth() / 2);
    group.add(lastNameKonvaText);

    const lastNameKonvaWidth = lastNameKonvaText.getWidth();

    if (lastNameKonvaWidth > config.whiteRect.width!) {
      /** фамилия: подсчет размеров */
      const lastNameParts = splitHyphen(lastName);

      lastNameKonvaText.setText(lastNameParts[0]);
      lastNameKonvaText.offsetX(lastNameKonvaText.getWidth() / 2);

      if (lastNameParts.length > 1) {
        deltaY += lastNameKonvaText.getHeight();
        const lastNameKonvaText2 = new Konva.Text({
          text: lastNameParts[1],
          ...config.lastName,

          /** расположить по центру по горизонтали */
          x: whiteRect.x() + whiteRect.width() / 2,
          y: deltaY + config.lastName.y!,
        });

        /** расположить по центру по горизонтали */
        lastNameKonvaText2.offsetX(lastNameKonvaText2.getWidth() / 2);
        group.add(lastNameKonvaText2);
      }
    }

    /**  имя отчество */
    const nameKonvaText = new Konva.Text({
      text: middleName ? `${firstName} ${middleName}` : firstName,
      ...config.name,

      /** расположить по центру по горизонтали */
      x: whiteRect.x() + whiteRect.width() / 2,
      y: deltaY + config.name.y!,
    });

    /** расположить по центру по горизонтали */
    nameKonvaText.offsetX(nameKonvaText.getWidth() / 2);
    group.add(nameKonvaText);

    // если название не влезло
    if (nameKonvaText.getWidth() > config.whiteRect.width!) {
      nameKonvaText.setText(firstName);
      nameKonvaText.offsetX(nameKonvaText.getWidth() / 2);
      deltaY += nameKonvaText.getHeight();

      /** отчество */
      const middleNameKonvaText = new Konva.Text({
        text: middleName,
        ...config.name,

        /** расположить по центру по горизонтали */
        x: whiteRect.x() + whiteRect.width() / 2,
        y: deltaY + config.name.y!,
      });

      /** расположить по центру по горизонтали */
      middleNameKonvaText.offsetX(middleNameKonvaText.getWidth() / 2);

      group.add(middleNameKonvaText);
    }

    /** добавить полоску */
    const lineKonvaLine = new Konva.Line({
      points: [108, 929 + deltaY, 108 + 362, 929 + deltaY], // x1, y1, x2, y2
      stroke: '#B78B45',
      strokeWidth: 1.36669,
    });

    group.add(lineKonvaLine);

    /** добавить даты жизни */
    let datesText = '';

    if (deathday && birthday) {
      datesText = `${birthday} – ${deathday}`;
    } else if (birthday && !deathday) {
      if (alive) {
        datesText = `${birthday} - по настоящее время`;
      } else {
        datesText = birthday;
      }
    } else if (!birthday && deathday) {
      datesText = `... - ${deathday}`;
    } else if (alive) {
      datesText = '... - по настоящее время';
    }

    if (datesText) {
      const datesKonvaText = new Konva.Text({
        text: datesText,
        ...config.dates,

        /** расположить по центру по горизонтали */
        x: whiteRect.x() + whiteRect.width() / 2,
        y: deltaY + config.dates.y!,
      });

      /** расположить по центру по горизонтали */
      datesKonvaText.offsetX(datesKonvaText.width() / 2);
      group.add(datesKonvaText);
    }

    /** посчитать общую высоту белого блока - внести  высоту в group */
    const groupHeight = group.getClientRect().height;

    if (groupHeight > config.whiteRect.height!) {
      /** установить получившуюся высоту
       * 30 - доп отступ снизу
       */
      whiteRect.height(groupHeight + 30);
    }

    /** добавить всю грппу на слоя */
    layer.add(group);

    // для теста
    // const dataURL = canvas.toDataURL();
    // const link = document.createElement('a');

    // link.download = 'post';
    // link.href = dataURL;
    // link.target = '_parent';
    // link.click();

    void canvas.toCanvas().toBlob(async (blob: Blob | null) => {
      console.log('blob', blob);
      await callback(blob);
    }, 'image/jpeg');

    return true;
  } catch (error) {
    Sentry.captureException(error);

    console.log('canvas error', error);

    return false;
  }
};

export enum ViewEnum {
  main = 'main',
}

export enum PanelEnum {
  /** стартовая страница */
  start = 'start',

  /** анкета героя */
  form = 'form',

  /** список анкет героев */
  heroes = 'heroes',

  /** ошибка */
  error = 'error',
}

export enum ModalEnum {
  /** выбор региона */
  region = 'region',

  /** удаление анкеты */
  deleteForm = 'deleteForm',

  /** обрезка фото */
  crop = 'crop',

  /** успешная отправка анкеты */
  formSent = 'formSent',

  /** заявка удалена */
  formDeleted = 'formDeleted',

  /** отмена заполнения/редактирования анкеты */
  cancelForm = 'cancelForm',
}

# vk-mini-app regiment-25-front

### О проекте

`regiment-25-front` — фронтенд VK Mini App для проекта «Бессмертный полк».

Приложение позволяет:

- создать и отправить анкету героя;
- редактировать и удалять анкеты;
- просматривать список анкет;
- делиться историей/карточкой через инструменты платформы VK/OK.

### Технологии

- React
- React Router v6
- CSS Modules with babel-plugin
- styled-components
- MobX
- Typescript
- Webpack 5 + Babel
- Eslint + Prettier + Stylelint

### Интеграции

- **VK Mini Apps**: `@vkontakte/vk-bridge`, `@vkontakte/vk-bridge-react`, `@vkontakte/vkui` (инициализация, launch params, адаптивность, swipe-back, VK события).
- **Sentry**: `@sentry/react` + `@sentry/webpack-plugin` (runtime-ошибки и загрузка sourcemaps).
- **Backend API**: запросы через `@kts-front/call-api` с базовым URL из `API_URL`/шаблона в `index.html`.
- **KTS ecosystem**: `@ktsstudio/mediaproject-*` (сторы, утилиты, стили, VK-хелперы).
- **Dev debugging**: `eruda` в dev-режиме.

### Структура проекта

```
|regiment-25-front
|--/libs <- локальные .tgz-пакеты для file: зависимостей
|--/src
   |--/assets <- общие медиа файлы
   |--/assets/images <- общие картинки
   |--/components <- общие компоненты
   |--/config <- общие конфиги
   |--/entities <- клиенты/нормализация сущностей API
   |--/pages <- компоненты-страниц приложения
   |--/static <- папка со статикой, которая копируется при сборке
   |--/store <- глобальные и локальные mobx-сторы
   |--/styles <- глобальные стили, общие миксины и переменные
   |--/types <- глобальные типы
   |--/utils <- общие утилиты
   |--index.html.ejs <- шаблон базовой HTML страницы для webpack
   |--App.tsx <- главный компонент приложения
   |--main.tsx <- точка входа в приложение
|--/tools/fonts <- генерация preload и @font-face для шрифтов
|--/tools/images <- утилиты оптимизации изображений
```

### Описание проекта

На старте в [main.tsx](src/main.tsx) вызывает [VKWebAppInit](https://dev.vk.com/bridge/VKWebAppInit) и инициализирует [параметры запуска vk-mini-app](https://dev.vk.com/mini-apps/development/launch-params).

В главном компоненте [App](src/App.tsx) создается компонент [RootLayoutPage](src/pages/RootLayoutPage/RootLayoutPage.tsx), который отвечает за роутинг и рендер страниц приложения, а также за показ экрана загрузки во время предзагрузки ресурсов и авторизации и экрана ошибки.

Внутри [RootLayoutPage](src/pages/RootLayoutPage/RootLayoutPage.tsx) осуществляется навигация с использованием [VKUI views & panels](https://vkcom.github.io/VKUI/#/Structure) и [react-router](https://reactrouter.com/en/main/start/overview).

Навигация реализована с помощью самописной обертки над react-router'ом, которая лежит в [src/utils/router](src/utils/router).

URL'ы для страниц создаются в следующем формате: `/view/panel`. Вью и панели приложения хранятся в [конфиге](src/config/routes) в виде enum.

Также к проекту подключен [MobX](https://mobx.js.org/), который создает глобальный стор [RootStore](src/store/globals/root/RootStore.ts), содержащий подсторы приложения.

### Особенности `libs`

В проекте используются локальные пакеты из директории `libs`, подключенные через `file:` зависимости в `package.json`:

- `@kts-front/call-api`: `file:./libs/kts-front/call-api-1.0.3.tgz`
- `@kts-front/types`: `file:./libs/kts-front/types-0.0.5.tgz`

Что важно учитывать:

- Папка `libs` обязательна для `yarn install` и для Docker-сборки (в `Dockerfile` есть `COPY libs/ ./libs/`).
- Это не исходники библиотек, а уже упакованные артефакты (`.tgz`).
- При обновлении версии библиотеки нужно:
  1) положить новый `.tgz` в `libs/kts-front`,
  2) обновить путь/версию в `package.json`,
  3) выполнить `yarn install`.

### Настройка шрифтов на сетапе проекта

Для внедрения шрифтов используются конфиг [tools/fonts/config.ts](tools/fonts/config.ts):
```typescript
/*
  например для файлов шрифтов `SF Pro Display` и `VK Sans Display`

    path_or_url/to/font/SFProDisplay/SFProDisplay-Regular.woff
    path_or_url/to/font/SFProDisplay/SFProDisplay-Regular.woff2
    path_or_url/to/font/SFProDisplay/SFProDisplay-Bold.woff
    path_or_url/to/font/SFProDisplay/SFProDisplay-Bold.woff2
    path_or_url/to/font/VKSansDisplay/VKSansDisplay_Light.woff
    path_or_url/to/font/VKSansDisplay/VKSansDisplay_Light.woff2
    path_or_url/to/font/VKSansDisplay/VKSansDisplay_Medium.woff
    path_or_url/to/font/VKSansDisplay/VKSansDisplay_Medium.woff2

  конфиг может выглядеть так:
*/

export type Font = 'VK_SANS_DISPLAY' | 'SF_PRO_DISPLAY';

export const FONT_PROPS: Record<Font, FontProps> = {
  SF_PRO_DISPLAY: {
    name: 'SF Pro Display',
    genericFamily: 'sans-serif',
    basePath: 'path_or_url/to/font/SFProDisplay/SFProDisplay',
    variants: [
      {
        fileNamePostfix: '-Regular',
        weight: 400,
      },
      {
        fileNamePostfix: '-Bold',
        weight: 700,
      },
    ],
    formats: ['woff2'],
    display: 'swap',
  },
  VK_SANS_DISPLAY: {
    name: 'VK Sans Display',
    genericFamily: 'sans-serif',
    basePath: 'path_or_url/to/font/VKSansDisplay/VKSansDisplayy',
    variants: [
      {
        fileNamePostfix: '_Light',
        weight: 300,
      },
      {
        fileNamePostfix: '_Medium',
        weight: 500,
      },
    ],
    formats: ['woff2'],
    display: 'swap',
  },
};
```

Заполненный конфиг с помощью утилит [tools/fonts/utils.ts](tools/fonts/utils.ts) преобразуется в ссылки для предзагрузки и наборы правил `@font-face`, которые на этапе сборки внедряются в шаблон страницы плагином `html-webpack-plugin`.

Для удобства использования шрифтов в стилях можно добавить простые миксины с ними в файл [src/styles/typography.scss](src/styles/typography.scss):
```scss
/// Задает основной шрифт: **SF Pro Display**
///
/// @param {number} $weight
///   Допустимые значения 400, 700
@mixin font-primary($weight: 400) {
  font-family: "SF Pro Display", sans-serif;
  font-weight: $weight;
}
```

### Особенности работы с SVG

Результат импортирования SVG файла зависит от наличия/отсутствия специального параметра в пути, и от его размера:
- Для получения react-компонента в конец пути к файлу нужно добавить параметр `react`: `path/to/image.svg?react`
- Без параметра в пути, в зависимости от размера файла, будет получена ссылка или base64-строка на изображение

Для примера:

```typescript
import logoImg from 'assets/images/logo.svg';
import LogoComponent from 'assets/images/logo.svg?react';

const Demo: React.FC = () => (
  <div>
    <img src={logoImg} alt="logo" className="logo" />
    <LogoComponent  className="logo" />
  </div>
);
```

### Переменные окружения (`env.example`)

Файл `env.example` — шаблон переменных окружения для сборки и запуска.  
Скопируй его в `.env` (или экспортируй переменные в окружение CI/локально) и заполни значениями под среду.

```bash
cp env.example .env
```

> Важно: в текущей конфигурации webpack переменные приходят из `process.env`.  
> Если запускаешь проект локально, убедись, что переменные реально экспортированы в shell/CI или переданы через `cross-env`.

#### Расшифровка полей `env.example`

- `NODE_ENV`  
  Режим сборки (`development` / `production`).  
  Влияет на webpack-режим, оптимизации, dev/prod плагины и флаги в приложении.

- `API_URL`  
  Базовый URL для API в фронте (`process.env.API_URL`).  
  Используется в `src/config/api/apiUrl.ts` и попадает в бандл через `DefinePlugin`.  
  Рекомендация:
  - если фронт и бэк на одном домене — указывать `/api/`,
  - если на разных — полный URL вида `https://api.example.com/api/`.
  
  Приоритет выбора API в коде:
  1) `window.API_URL_FROM_TEMPLATE` (инжект из `index.html`/nginx),  
  2) `process.env.API_URL`,  
  3) fallback `/api/`.

- `SENTRY_DSN`  
  DSN для клиентской инициализации Sentry (`src/utils/init/sentry.ts`).  
  Без значения ошибки в Sentry с фронта отправляться не будут.

- `SENTRY_AUTH_TOKEN`  
  Токен для `@sentry/webpack-plugin` на этапе production-сборки.  
  Нужен для загрузки sourcemaps в Sentry. Используется только в build-time.

- `SENTRY_URL`  
  Базовый URL Sentry-инстанса (например, self-hosted).  
  Используется webpack-плагином Sentry при публикации артефактов.

- `SENTRY_ORG`  
  Идентификатор организации в Sentry для загрузки релизных артефактов.

- `SENTRY_PROJECT`  
  Идентификатор проекта в Sentry для загрузки sourcemaps и связки релиза.

#### Где обычно задаются значения

- Локальная разработка: `yarn dev` уже задает `API_URL=/api/` и `NODE_ENV=development`.
- Локальная/ручная сборка: переменные можно экспортировать перед `yarn build`.
- CI/CD и Docker: значения пробрасываются как `ARG`/переменные пайплайна (см. `Dockerfile`, `.gitlab-ci.yml`).

### Основные скрипты

* Запуск dev-сервера:
```
yarn dev
```

* Запуск dev-сервера и проксирование запросов к API на `localhost:3000` (порт можно поменять в `package.json`):
```
yarn dev:local-api
```

* Локальный туннель для VK Mini Apps (HTTPS/WSS на `9091`):
```
yarn vk-tunnel
```

* Сборка:
```
yarn build
```

* Сборка [odr-архива](https://dev.vk.com/mini-apps/development/on-demand-resources):
```
yarn build-odr
```

* Запуск eslint:

```
yarn lint
```

или

```
yarn lint:fix
```

* Запуск stylelint:

```
yarn stylelint
```

или

```
yarn stylelint:fix
```

* Запуск ts:

```
yarn tsc:check
```

### Требования

- husky работает только с гитом версии **выше 2.9**
- для локальной разработки и CI рекомендуется **Node.js 20+** (в CI используется `node:20`)

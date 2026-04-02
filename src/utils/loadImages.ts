export const loadOnlyImage = async (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.setAttribute('crossorigin', 'anonymous');

    image.onload = () => {
      console.log('resolve', src);
      resolve(image);
    };

    image.src = src;

    image.onerror = (e) => {
      console.log('error', e, src);
      reject(null);
    };
  });

export const loadImage = async (src: string, onLoaded: () => void) =>
  new Promise<void>((resolve) => {
    const curImage = new Image();

    curImage.src = src;

    curImage.onload = () => {
      onLoaded();
      resolve();
    };

    // если какой-то картинки не будет, все равно резолвим, чтобы приложение смогло загрузиться
    curImage.onerror = (e: any) => {
      console.log('error loadImage', e);
      resolve();
    };
  });

export default async (images: string[], onNextLoaded = () => {}) => {
  await Promise.all(images.map((i) => loadImage(i, onNextLoaded)));
};

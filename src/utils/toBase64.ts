export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    // @ts-ignore
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();

  return new File([blob], fileName.concat('.png'), { type: 'image/png' });
};

export const isOldImage = (image: string): boolean => {
  return image.startsWith('http');
};

export const preloadImage = async (url: string) => {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.onabort = reject;
    image.src = url;
  });
};

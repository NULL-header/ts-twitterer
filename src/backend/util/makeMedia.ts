/* eslint-disable camelcase */
export const makeMedia = (mediaData: any[]) => {
  const indicesArray: [number, number][] = [];
  const media: any[] = [];
  mediaData.forEach((e, i) => {
    const { indices, media_url, sizes, type: mediaType } = e;
    indicesArray[i] = indices;
    media[i] = { media_url, sizes, type: mediaType };
  });
  return { indicesArray, media };
};

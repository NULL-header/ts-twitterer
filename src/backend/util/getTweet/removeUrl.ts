export const removeUrl = (
  indicesArray: [number, number][],
  contentData: string,
) =>
  indicesArray.reduce(
    (a, [firstIndex, lastIndex]) =>
      a.slice(0, firstIndex) +
      (contentData.length - 1 === lastIndex ? "" : a.slice(lastIndex)),
    contentData,
  );

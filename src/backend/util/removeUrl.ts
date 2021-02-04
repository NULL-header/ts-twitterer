export const removeUrl = (
  indicesArray: [number, number][],
  contentData: string
) => {
  return indicesArray.reduce(
    (a, [firstIndex, lastIndex]) => a.slice(0, firstIndex) + a.slice(lastIndex),
    contentData
  );
};

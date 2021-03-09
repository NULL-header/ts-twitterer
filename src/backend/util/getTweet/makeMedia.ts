type Maker = (
  mediaData: any[],
) => { indicesArray: [number, number][]; media: Media } | undefined;

const makeFromVideo: Maker = (mediaData) => {
  const videoData = mediaData[0];
  if (videoData.type !== "video") return;
  const {
    video_info: { variants },
    indices,
  } = videoData;
  const largestVideo = (variants as any[]).slice(1).reduce((a, e) => {
    if (e.content_type !== "video/mp4") return a;
    return e.bitrate > a.bitrate ? e : a;
  }, variants[0]);
  return {
    indicesArray: [indices as [number, number]],
    media: { type: "video", mediaUrl: largestVideo.url as string },
  };
};

const makeFromPhoto: Maker = (mediaData) => {
  if (mediaData[0].type !== "photo") return;
  const indicesArray: [number, number][] = [];
  const mediaUrl = [] as string[];
  mediaData.forEach((e, i) => {
    const { indices, media_url: url } = e;
    indicesArray[i] = indices;
    mediaUrl[i] = url;
  });
  return { indicesArray, media: { type: "photo", mediaUrl } };
};

const makeFromGif: Maker = (mediaData) => {
  const gifData = mediaData[0];
  if (gifData.type !== "animated_gif") return;
  const {
    indices,
    video_info: {
      variants: [{ url: mediaUrl }],
    },
  } = gifData;
  return {
    media: { type: "animated_gif", mediaUrl },
    indicesArray: [indices],
  };
};

const makers = [makeFromVideo, makeFromPhoto, makeFromGif];

export const extractDataFromMedia = (mediaData: any[]) =>
  makers.reduce(
    (a, e) => (a == null ? e(mediaData) : a),
    undefined as ReturnType<Maker>,
  );

/* eslint-disable camelcase */
import { makeMedia } from "./makeMedia";
import { removeUrl } from "./removeUrl";
export const makeTweetLow = (tweetData: any) => {
  const {
    full_text: contentData,
    id_str: dataid,
    created_at,
    user: { screen_name: userid, name: username, profile_image_url: icon_url },
    entities: { media: mediaData },
  } = tweetData;
  let content: string;
  let media;
  if (mediaData != null) {
    const { indicesArray, media: mediaNonNullable } = makeMedia(mediaData);
    media = mediaNonNullable;
    content = removeUrl(indicesArray, contentData);
  } else {
    media = undefined;
    content = contentData;
  }
  return {
    content,
    dataid,
    created_at,
    userid,
    username,
    icon_url,
    media,
  } as const;
};

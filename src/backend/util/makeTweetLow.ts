/* eslint-disable camelcase */
import { extractDataFromMedia } from "./makeMedia";
import { removeUrl } from "./removeUrl";
export const makeTweetLow = (tweetData: any, listId: string) => {
  const {
    full_text: contentData,
    id_str: dataid,
    created_at,
    user: { screen_name: userid, name: username, profile_image_url: icon_url },
    extended_entities,
  } = tweetData;
  let content: string = contentData;
  let media;
  if (extended_entities != null) {
    const { indicesArray, media: mediaNonNullable } = extractDataFromMedia(
      extended_entities.media
    );
    media = mediaNonNullable;
    content = removeUrl(indicesArray, contentData);
  }
  return {
    content,
    dataid,
    created_at,
    userid,
    username,
    icon_url,
    list_id: listId,
    media,
  } as TweetColumns;
};

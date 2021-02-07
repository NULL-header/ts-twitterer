export const makeTweets = async (
  tweetLows: TweetColumns[]
): Promise<Tweet[]> => {
  return tweetLows.map((e) => {
    const {
      content,
      media: mediaColumns,
      id,
      created_at: createdAt,
      icon_url: iconUrl,
      userid,
      dataid,
      username,
      list_id: listId,
    } = e;
    const media: Media | undefined = mediaColumns
      ? { type: mediaColumns.type, mediaUrl: mediaColumns.media_url as any }
      : undefined;
    return {
      content,
      media,
      id,
      createdAt,
      iconUrl,
      userid,
      dataid,
      username,
      listId,
    };
  });
};

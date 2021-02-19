import React from "react";
import { useStyles } from "./style";

const makeMediaElement = (tweet: Tweet, className: string) => {
  if (tweet.media == null) return;
  switch (tweet.media.type) {
    case "photo": {
      return (
        <div>
          {tweet.media.mediaUrl.map((e, i) => (
            // no it changes
            // eslint-disable-next-line react/no-array-index-key
            <img src={e} key={i} className={className} alt="media" />
          ))}
        </div>
      );
    }
    case "animated_gif": {
      break;
    }
    case "video": {
      break;
    }
    default: {
      throw new Error("An error occurred in showing media");
    }
  }
};

const makeUsername = (username: string) =>
  username.length > 20 ? `${username.slice(0, 21)}…` : username;
export const Tweet: React.FC<{ tweet: Tweet }> = React.memo((props) => {
  console.log(props.tweet);
  const username = makeUsername(props.tweet.username);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {props.tweet.isRetweeted && (
        <>
          <div>{`${props.tweet.retweeterName}さんがリツイート`}</div>
          <hr />
        </>
      )}
      <div className={classes.tweetContainer}>
        <img src={props.tweet.iconUrl} className={classes.icon} alt="icon" />
        <div className={classes.user}>
          <div>{username}</div>
          <div>{`@${props.tweet.userid}`}</div>
        </div>
        <div className={classes.tweetContent}>{props.tweet.content}</div>
      </div>
      {makeMediaElement(props.tweet, classes.media)}
    </div>
  );
});

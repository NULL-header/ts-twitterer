import React from "react";
import { useStyles } from "./style";

export const Tweet: React.FC<{ tweet: Tweet }> = React.memo((props) => {
  console.log(props.tweet);
  const username = makeUsername(props.tweet.username);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {props.tweet.isRetweeted && (
        <>
          <div>{props.tweet.retweeterName + "さんがリツイート"}</div>
          <hr />
        </>
      )}
      <div className={classes.tweetContainer}>
        <img src={props.tweet.iconUrl} className={classes.icon}></img>
        <div className={classes.user}>
          <div>{username}</div>
          <div>{"@" + props.tweet.userid}</div>
        </div>
        <div className={classes.tweetContent}>{props.tweet.content}</div>
      </div>
      <div>{makeMediaElement(props.tweet, classes.media)}</div>
    </div>
  );
});

const makeMediaElement = (tweet: Tweet, className: string) => {
  if (tweet.media == null) return;
  switch (tweet.media.type) {
    case "photo": {
      return tweet.media.mediaUrl.map((e, i) => (
        <img src={e} key={i} className={className} />
      ));
    }
    case "animated_gif": {
      return;
    }
    case "video": {
      return;
    }
  }
};

const makeUsername = (username: string) => {
  return username.length > 20 ? username.slice(0, 21) + "…" : username;
};

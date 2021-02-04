import React from "react";

export const Tweet: React.FC<{ tweet: Tweet }> = React.memo((props) => {
  console.log(props.tweet.media);
  return (
    <div>
      <img src={props.tweet.iconUrl} alt="icon"></img>
      <div>
        <span>{props.tweet.username}</span>
        <span>{props.tweet.userid}</span>
      </div>
      <div>{props.tweet.content}</div>
      {props.tweet.media &&
        props.tweet.media.map((e, i) => (
          <img src={e.mediaUrl} alt={"image" + i} key={i}></img>
        ))}
    </div>
  );
});

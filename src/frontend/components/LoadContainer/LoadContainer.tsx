import React from "react";
import { useSelector } from "src/src/frontend/globalState";
import { HelloWorld } from "src/frontend/components/HelloWorld";
import { useStyles } from "./style";
import { TimeLine, Config } from "..";

export const LoadContainer: React.FC = React.memo((_props) => {
  const state = useSelector((state) => state);
  console.log({ state });
  const isInit = useSelector((state) => state.isInitializing);
  const classes = useStyles();
  if (isInit == null) return <div>Starting</div>;
  else if (isInit) return <div>Loading</div>;
  else
    return (
      <div className={classes.root}>
        <HelloWorld />
        <TimeLine />
        <Config />
      </div>
    );
});

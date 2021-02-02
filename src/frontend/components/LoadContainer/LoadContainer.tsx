import React from "react";
import { useSelector } from "src/frontend/globalState";
import { HelloWorld } from "src/frontend/components/HelloWorld";
import { UpdateButton } from "./UpdateButton";

export const LoadContainer: React.FC = React.memo((_props) => {
  const state = useSelector((state) => state);
  console.log({ state });
  const isInit = useSelector((state) => state.isInitializing);
  if (isInit == null) return <div>Starting</div>;
  else if (isInit) return <div>Loading</div>;
  else
    return (
      <>
        <HelloWorld />
        <UpdateButton />
      </>
    );
});

import React from "react";
import { useTracked } from "frontend/globalState";

const Data = () => {
  const [state] = useTracked();
  const { limitData } = state;
  return <>{JSON.stringify(limitData)}</>;
};

export { Data };

import React from "react";
import { useTracked } from "frontend/globalState";

export const Data: React.FC = React.memo(() => {
  const [state] = useTracked();
  const { limitData } = state;
  return (
    <div aria-label="data" role="article">
      {JSON.stringify(limitData)}
    </div>
  );
});

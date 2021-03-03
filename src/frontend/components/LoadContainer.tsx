import React from "react";
import { useTracked } from "frontend/globalState";
import { ScreenContainer } from "./ScreenContainer";

export const LoadContainer: React.FC = React.memo(() => {
  const [state] = useTracked();
  if (state.isInitializing == null) return <div>Starting</div>;
  if (state.isInitializing) return <div>Loading</div>;
  return <ScreenContainer />;
});

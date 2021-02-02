import React from "react";
import { Provider } from "./globalState";
import { LoadContainer } from "./components";

export const App = () => (
  <Provider>
    <LoadContainer />
  </Provider>
);

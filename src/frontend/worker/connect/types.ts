import { State } from "frontend/globalState/types";

export type Work = (args: State) => Promise<State | undefined>;

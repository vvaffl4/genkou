import { editManuscript, Manuscript } from "./manuscript";
import { editWorkspace, Workspace } from "./workspace";
import { Action } from "redux";
import { defaultState } from "../store";

export interface RootState {
  workspace: Workspace,
  manuscript: Manuscript
}

export const rootReducer = (state: RootState = defaultState, action: Action): RootState => {
  return {
    workspace: editWorkspace(state.workspace, action as any, state),
    manuscript: editManuscript(state.manuscript, action as any, state)
  };
};

// export const rootReducer = combineReducers({
//   workspace: editWorkspace,  
//   manuscript: editManuscript,
//   pages: editPages,
//   sections: editSections
// });

// export type RootState = ReturnType<typeof rootReducer>
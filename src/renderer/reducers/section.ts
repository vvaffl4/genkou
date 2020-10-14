import { Action } from "redux";
import { Table } from "./tables";
import { RootState } from ".";

export type SectionType = "title" | "heading" | "paragraph";

export interface Section {
  id: number
  type: SectionType
  content: string
}

export interface SectionTable extends Table<number, Section> {}

const initialState: SectionTable = {
  byId: {},
  allIds: [],
  availableIds: [...Array(10).keys()]
}

export const SECTION_DIR = 'SECTION';
export const ADD_CONTENT = `MANUSCRIPT/ADD_CONTENT`;
export const SET_CONTENT = `SECTION/SET_CONTENT`;

export interface AddContentAction extends Action<typeof ADD_CONTENT> {
  id: number
  addition: string
}

export interface SetContentAction extends Action<typeof SET_CONTENT> {
  id: number
  content: string
}

export const addContent = (id: number, addition: string) => ({
  id,
  addition,
  type: ADD_CONTENT
});

export const setContent = (id: number, content: string): SetContentAction => ({
  id,
  content,
  type: SET_CONTENT
});

export type SectionsActionTypes = AddContentAction | SetContentAction;

export const editSections = (
  state: SectionTable = initialState, 
  action: SectionsActionTypes, 
  rootState: RootState
): SectionTable => {
  switch (action.type) {
    case ADD_CONTENT:
      const caret = rootState.workspace.caret;
      const content = state.byId[action.id].content;
      const index = rootState.manuscript
        .pages[caret.pageIndex]
        .selections[caret.selectionIndex]
        .lines[caret.lineIndex].start + caret.position
     
      const newContent = content.slice(0, index) + action.addition + content.slice(index);

      console.log(newContent);

      return {
        byId: {
          ...state.byId, 
          [action.id]: {
            ...state.byId[action.id], 
            content: newContent
          }
        },
        allIds: state.allIds,
        availableIds: state.availableIds
      }
    case SET_CONTENT:
      return {
        byId: {
          ...state.byId, 
          [action.id]: {
            ...state.byId[action.id], 
            content: action.content
          }
        },
        allIds: state.allIds,
        availableIds: state.availableIds
      }
    default:
      return state;
  }
}
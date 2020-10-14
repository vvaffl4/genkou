import { Action } from "redux";

export interface Author {
  firstname: string
  lastname: string
}

export interface Metadata {
  title: string
  subtitle: string
  author: Author
  date: string
}

const initialState: Metadata = {
  title: "",
  subtitle: "",
  author: { 
    firstname: "",
    lastname: ""
  },
  date: ""
}

export const METADATA_DIR = 'METADATA';
export const SET_TITLE = `METADATA/SET_TITLE`;
export const SET_SUBTITLE = `METADATA/SET_SUBTITLE`;
export const SET_AUTHOR = `METADATA/SET_AUTHOR`;
export const SET_DATE = `METADATA/SET_DATE`;

interface SetTitleAction extends Action<typeof SET_TITLE> {
  title: string
}

interface SetSubTitleAction extends Action<typeof SET_SUBTITLE> {
  subtitle: string
}

interface SetAuthorAction extends Action<typeof SET_AUTHOR> {
  author: Author
}

interface SetDateAction extends Action<typeof SET_DATE> {
  date: string
}

export type MetadataActionTypes = 
  SetTitleAction | 
  SetSubTitleAction | 
  SetAuthorAction | 
  SetDateAction;

export const editMetadata = (state: Metadata = initialState, action: MetadataActionTypes): Metadata => {
  switch (action.type) {
    case SET_TITLE:
      return {
        ...state,
        title: action.title
      }
    case SET_SUBTITLE:
      return {
        ...state,
        subtitle: action.subtitle
      }
    case SET_AUTHOR:
      return {
        ...state,
        author: action.author
      }
    case SET_DATE:
      return {
        ...state,
        date: action.date
      }
    default:
      return state;
  }
}
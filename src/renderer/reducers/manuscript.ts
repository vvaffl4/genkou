import {
  ManuscriptPage,
  editPages,
  PagesActionTypes,
  editSectionsInPage,
  SectionsInPageActionTypes,
  PAGE_DIR
} from './page';
import {
  Metadata,
  MetadataActionTypes,
  editMetadata,
  METADATA_DIR
} from './metadata';
import { SectionTable, SectionsActionTypes, editSections, SET_CONTENT, SECTION_DIR, ADD_CONTENT } from './section';
import { RootState } from '.';

export interface Author {
  firstname: string;
  lastname: string;
}

export interface Manuscript {
  metadata: Metadata;
  sections: SectionTable;
  pages: ManuscriptPage[];
}

const initialState: Manuscript = {
  metadata: {
    title: '',
    subtitle: '',
    author: {
      firstname: '',
      lastname: ''
    },
    date: ''
  },
  sections: {
    byId: {},
    allIds: [],
    availableIds: []
  },
  pages: []
};

export const MANUSCRIPT_DIR = 'MANUSCRIPT';

export type ManuscriptActionTypes =
  | MetadataActionTypes
  | SectionsActionTypes
  | PagesActionTypes
  | SectionsInPageActionTypes;

export const editManuscript = (
  state: Manuscript = initialState,
  action: ManuscriptActionTypes,
  rootState: RootState
): Manuscript => {
  if (action.type.startsWith(PAGE_DIR) || action.type === ADD_CONTENT) return {
    metadata: state.metadata,
    sections: editSections(state.sections, action as SectionsActionTypes, rootState),
    pages: editPages(state.pages, action as PagesActionTypes, rootState)
  };
  if (action.type.startsWith(METADATA_DIR)) return {
    metadata: editMetadata(state.metadata, action as MetadataActionTypes),
    sections: state.sections,
    pages: state.pages
  }; 
  if (action.type.startsWith(MANUSCRIPT_DIR)) return {
    metadata: state.metadata,
    ...editSectionsInPage(state, action as SectionsInPageActionTypes)
  }; 
  if (action.type.startsWith(SECTION_DIR)) return {
    metadata: state.metadata,
    sections: editSections(state.sections, action as SectionsActionTypes, rootState),
    pages: state.pages
  }; 
  return state;
};

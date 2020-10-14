import { Action } from 'redux';
import { Manuscript, MANUSCRIPT_DIR } from './manuscript';
import {
  Section,
  SectionType,
  SectionTable,
  SET_CONTENT,
  SetContentAction,
  AddContentAction,
  ADD_CONTENT
} from './section';
import { RootState } from '.';
import { Caret } from './workspace';

export interface Line {
  start: number;
  end: number;
  length: number;
}

export interface ManuscriptSectionSelection {
  id: number;
  lines: Line[];
}

export interface ManuscriptPage {
  selections: ManuscriptSectionSelection[];
}

const initialState: ManuscriptPage[] = [];

export const PAGE_DIR = 'PAGE';
export const ADD_PAGE = `PAGE/ADD_PAGE`;
export const REMOVE_PAGE = `PAGE/REMOVE_PAGE`;

export interface AddPageAction extends Action<typeof ADD_PAGE> {
  page: ManuscriptPage;
}

export interface RemovePageAction extends Action<typeof REMOVE_PAGE> {
  index: number;
}

export type PagesActionTypes = AddPageAction | RemovePageAction | AddContentAction;

const updateSelection = (
  selection: ManuscriptSectionSelection, 
  caret: Caret, 
  additionLength: number
): ManuscriptSectionSelection => {
  const line = selection.lines[caret.lineIndex];
  const predictedLength = line.length + additionLength;
  const overflow = Math.max(0, predictedLength - 20);

  console.log(line);
  console.log(predictedLength);
  console.log(overflow);

  const changes = [
    { start: line.start, 
      end: line.start + predictedLength - overflow, 
      length: predictedLength - overflow 
    }
  ];

  if ( overflow > 0) changes.push({ 
    start: changes[0].end + 1, 
    end: changes[0].end + overflow + 1, 
    length: overflow 
  })

  console.log(changes);

  const newLines = [
    ...selection.lines.slice(0, caret.lineIndex), 
    ...changes, 
    ...selection.lines.slice(caret.lineIndex + 1)
  ];

  console.log(newLines);

  const newSelection = {
    id: selection.id,
    lines: newLines.map((line, lineIndex) =>
      caret.lineIndex > lineIndex + changes.length
        ? { 
          start: line.start + additionLength, 
          end: predictedLength + overflow, 
          length: predictedLength - line.start + additionLength
        }
        : line
    )
  }
  
  return newSelection;
};

export const editPages = (
  state: ManuscriptPage[] = initialState,
  action: PagesActionTypes,
  rootState: RootState
): ManuscriptPage[] => {
  switch (action.type) {
    case ADD_PAGE:
      return [...state, action.page];
    case REMOVE_PAGE:
      return state.filter((_, index) => index !== action.index);
    case ADD_CONTENT:
      const caret = rootState.workspace.caret;
      const additionLength = action.addition.length;

      const newState = state.map((page, pageIndex) =>
        caret.pageIndex === pageIndex
          ? {
            selections: page.selections.map((selection, selectionIndex) =>
              caret.selectionIndex === selectionIndex
                ? updateSelection(selection, caret, additionLength)
                : selection
            )
          }
          : page
      );

      console.log(newState);
      return newState;
    default:
      return state;
  }
};

export const ADD_SECTION = `MANUSCRIPT/ADD_SECTION`;
export const REMOVE_SECTION = `MANUSCRIPT/REMOVE_SECTION`;

export interface AddSectionToPageAction extends Action<typeof ADD_SECTION> {
  pageId: number;
  sectionIndex: number;
  section: Section;
}

export interface RemoveSectionFromPageAction extends Action<typeof REMOVE_SECTION> {
  pageId: number;
  sectionId: number;
}

export const addSectionToPage = (
  pageId: number,
  sectionIndex: number,
  type: SectionType,
  content: string
): AddSectionToPageAction => ({
  pageId,
  sectionIndex,
  section: { type, content, id: -1 },
  type: ADD_SECTION
});

export const removeSectionFromPage = (
  pageId: number,
  sectionId: number
): RemoveSectionFromPageAction => ({
  pageId,
  sectionId,
  type: REMOVE_SECTION
});

export type SectionsInPageActionTypes = AddSectionToPageAction | RemoveSectionFromPageAction;

export const editSectionsInPage = (
  { sections, pages }: Manuscript,
  action: SectionsInPageActionTypes
): { sections: SectionTable; pages: ManuscriptPage[] } => {
  switch (action.type) {
    case ADD_SECTION:
      return {
        sections: {
          byId: {
            ...sections.byId,
            [sections.availableIds[0]]: { ...action.section, id: sections.availableIds[0] }
          },
          allIds: [...sections.allIds, sections.availableIds[0]],
          availableIds: [
            ...sections.availableIds.slice(1),
            sections.allIds.length + sections.availableIds.length
          ]
        },
        pages: [
          ...pages,
          {
            selections: [
              ...pages[action.pageId].selections.slice(0, action.sectionIndex),
              { id: sections.availableIds[0], lines: [{ start: 0, end: 0, length: 0 }] },
              ...pages[action.pageId].selections.slice(action.sectionIndex)
            ]
          }
        ]
      };
    case REMOVE_SECTION:
      const { [action.sectionId]: removed, ...remainder } = sections.byId;
      return {
        sections: {
          byId: remainder,
          allIds: sections.allIds.filter(id => id !== action.sectionId),
          availableIds: [...sections.availableIds, action.sectionId].sort()
        },
        pages: pages.map((value, index) =>
          index === action.pageId
            ? {
                ...value,
                selections: value.selections.filter((_, index) => index !== action.sectionId)
              }
            : value
        )
      };
    default:
      return {
        sections,
        pages
      };
  }
};

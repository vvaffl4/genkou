import { Action } from 'redux';
import { Direction } from './types';
import { ManuscriptPage } from './page';
import { RootState } from '.';
import { ADD_CONTENT, AddContentAction } from './section';

export interface Caret {
  pageIndex: number;
  selectionIndex: number;
  lineIndex: number;
  position: number;
}

export interface SectionSelection {
  sectionId: number;
  start: number;
  end: number;
}

export interface Workspace {
  caret: Caret;
  scroll: number;
  selection: SectionSelection[];
}

const initialState: Workspace = {
  caret: {
    pageIndex: 0,
    selectionIndex: 0,
    lineIndex: 0,
    position: 0
  },
  scroll: 0,
  selection: []
};

export const SET_CARET = 'SET_CARET';
export const MOVE_CARET = 'MOVE_CARET';
export const SET_SELECTION = 'SET_SELECTION';
export const SCROLL_WORKSPACE = 'SCROLL_WORKSPACE';

interface SetCaretAction extends Action<typeof SET_CARET> {
  pageIndex: number;
  selectionIndex: number;
  lineIndex: number;
  position: number;
}

interface MoveCaretAction extends Action<typeof MOVE_CARET> {
  sectionId: number;
  direction: Direction;
}

interface SetSelectionAction extends Action<typeof SET_SELECTION> {
  selections: SectionSelection[];
}

interface ScrollWorkspaceAction extends Action<typeof SCROLL_WORKSPACE> {
  scroll: number;
}

export type ManuscriptActionTypes =
  | AddContentAction
  | SetCaretAction
  | MoveCaretAction
  | SetSelectionAction
  | ScrollWorkspaceAction;

export const scrollWorkspace = (scroll: number): ScrollWorkspaceAction => ({
  scroll,
  type: SCROLL_WORKSPACE
});

export const setCaret = (
  pageIndex: number,
  selectionIndex: number,
  lineIndex: number,
  position: number
): SetCaretAction => ({
  pageIndex,
  selectionIndex,
  lineIndex,
  position,
  type: SET_CARET
});

export const moveCaret = (sectionId: number, direction: Direction): MoveCaretAction => ({
  sectionId,
  direction,
  type: MOVE_CARET
});

const caretMoveUp = (caret: Caret, pages: ManuscriptPage[]): Caret => {
  if (0 > caret.position - 1) {
    if (0 > caret.lineIndex - 1) {
      if (0 > caret.selectionIndex - 1) {
        if (0 > caret.pageIndex - 1) return caret;

        const newPageIndex = caret.pageIndex - 1;
        const newSelectionIndex = pages[newPageIndex].selections.length - 1;
        const newLineIndex = pages[newPageIndex].selections[newSelectionIndex].lines.length - 1;

        return {
          ...caret,
          selectionIndex: newSelectionIndex,
          pageIndex: newPageIndex,
          lineIndex: pages[newPageIndex].selections[caret.selectionIndex].lines.length - 1,
          position: pages[newPageIndex].selections[newSelectionIndex].lines[newLineIndex].length
        };
      }

      const newSelectionIndex = caret.selectionIndex - 1;
      const newLineIndex = pages[caret.pageIndex].selections[newSelectionIndex].lines.length - 1;

      return {
        ...caret,
        selectionIndex: newSelectionIndex,
        lineIndex: newLineIndex,
        position: pages[caret.pageIndex].selections[newSelectionIndex].lines[newLineIndex].length
      };
    }
    
    const newLineIndex = caret.lineIndex - 1;

    return {
      ...caret,
      lineIndex: newLineIndex,
      position:
        pages[caret.pageIndex].selections[caret.selectionIndex].lines[newLineIndex].length
    };
  }
  return { ...caret, position: caret.position - 1 };
};

const caretMoveDown = (caret: Caret, pages: ManuscriptPage[]): Caret => {
  const line = pages[caret.pageIndex].selections[caret.selectionIndex].lines[caret.lineIndex];

  if (line.length < caret.position + 1) {
    if (pages[caret.pageIndex].selections[caret.selectionIndex].lines.length <= caret.lineIndex + 1) {
      if (pages[caret.pageIndex].selections.length <= caret.selectionIndex + 1) {
        if (pages.length <= caret.pageIndex + 1) return caret;

        return {
          ...caret,
          pageIndex: caret.pageIndex + 1,
          selectionIndex: 0,
          lineIndex: 0,
          position: 0
        };
      }

      return {
        ...caret,
        selectionIndex: caret.selectionIndex + 1,
        lineIndex: 0,
        position: 0
      };
    }

    return {
      ...caret,
      lineIndex: caret.lineIndex + 1,
      position: 0
    };
  }
  return { ...caret, position: caret.position + 1 };
};

const caretMoveLeft = (caret: Caret, pages: ManuscriptPage[]): Caret => {
  const selection = pages[caret.pageIndex].selections[caret.selectionIndex];

  if (selection.lines.length <= caret.lineIndex + 1) {
    if (pages[caret.pageIndex].selections.length <= caret.selectionIndex + 1) {
      if (pages.length <= caret.pageIndex + 1) return {
        ...caret,
        position: selection.lines[caret.lineIndex].length
      };

      return {
        ...caret,
        pageIndex: caret.pageIndex + 1,
        selectionIndex: 0,
        lineIndex: 0,
        position: Math.min(caret.position, pages[caret.pageIndex + 1].selections[0].lines[0].length)
      };
    }

    return {
      ...caret,
      selectionIndex: caret.selectionIndex + 1,
      lineIndex: 0,
      position: Math.min(
        caret.position,
        pages[caret.pageIndex].selections[caret.selectionIndex + 1].lines[0].length
      )
    };
  }

  return {
    ...caret,
    lineIndex: caret.lineIndex + 1,
    position: Math.min(caret.position, selection.lines[caret.lineIndex + 1].length)
  };
};

const caretMoveRight = (caret: Caret, pages: ManuscriptPage[]): Caret => {
  const selection = pages[caret.pageIndex].selections[caret.selectionIndex];

  if (0 > caret.lineIndex - 1) {
    if (0 > caret.selectionIndex - 1) {
      if (0 > caret.pageIndex - 1)
        return {
          ...caret,
          position: 0
        };

      const newPageIndex = caret.pageIndex - 1;
      const newSelectionIndex = pages[newPageIndex].selections.length - 1;
      const newLineIndex = pages[newPageIndex].selections[newSelectionIndex].lines.length - 1;

      return {
        ...caret,
        selectionIndex: newSelectionIndex,
        lineIndex: newLineIndex,
        pageIndex: newPageIndex,
        position: Math.min(
          caret.position,
          pages[newPageIndex].selections[newSelectionIndex].lines[newLineIndex].end
        )
      };
    }

    const newSelectionIndex = caret.selectionIndex - 1;
    const newLineIndex = pages[caret.pageIndex].selections[newSelectionIndex].lines.length - 1;

    return {
      ...caret,
      selectionIndex: newSelectionIndex,
      lineIndex: newLineIndex,
      position: Math.min(
        caret.position,
        pages[caret.pageIndex].selections[newSelectionIndex].lines[newLineIndex].end
      )
    };
  }

  return {
    ...caret,
    lineIndex: caret.lineIndex - 1,
    position: Math.min(caret.position, selection.lines[caret.lineIndex - 1].end)
  };
};

const updatePosition = (caret: Caret, direction: Direction, pages: ManuscriptPage[]): Caret => {
  switch (direction) {
    case 'up':
      return caretMoveUp(caret, pages);
    case 'down':
      return caretMoveDown(caret, pages);
    case 'left':
      return caretMoveLeft(caret, pages);
    case 'right':
      return caretMoveRight(caret, pages);
    default:
      return caret;
  }
};

export const editWorkspace = (
  state: Workspace = initialState,
  action: ManuscriptActionTypes,
  rootState: RootState
): Workspace => {
  switch (action.type) {
    case SET_CARET:
      return {
        ...state,
        caret: {
          position: action.position,
          pageIndex: action.pageIndex,
          lineIndex: action.lineIndex,
          selectionIndex: action.selectionIndex
        }
      };
    // case ADD_CONTENT:
    //   return {
    //     ...state,
    //     caret: {
    //       ...state.caret,
    //       position: state.caret.position + action.addition.length
    //     }
    //   };
    case MOVE_CARET:
      return {
        ...state,
        caret: updatePosition(state.caret, action.direction, rootState.manuscript.pages)
      };
    case SET_SELECTION:
      return {
        ...state,
        selection: action.selections
      };
    case SCROLL_WORKSPACE:
      return {
        ...state,
        scroll: action.scroll
      };
    default:
      return state;
  }
};

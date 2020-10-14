import { createStore, Store } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
import { devToolsEnhancer } from 'redux-devtools-extension';

import { rootReducer, RootState } from '../reducers';

const configureStore = (initialState?: RootState): Store<RootState> => {
  return createStore(rootReducer, initialState, devToolsEnhancer({}));
};

export const defaultState: RootState = {
  workspace: {
    caret: { pageIndex: 0, selectionIndex: 0, lineIndex: 0, position: 0 },
    scroll: 0,
    selection: []
  },
  manuscript: {
    metadata: {
      title: 'First',
      subtitle: 'Second',
      author: { firstname: 'Pat', lastname: 'Wob' },
      date: 'The future'
    },
    sections: {
      byId: {
        0: {
          id: 0,
          type: 'title',
          content: 'タイトル'
        },
        1: {
          id: 1,
          type: 'paragraph',
          content: 'コンテンツ最もテキスト'
        },
        2: {
          id: 2,
          type: 'paragraph',
          content: 'コンテンツ'
        },
        3: {
          id: 3,
          type: 'paragraph',
          content: 'コンテンツ'
        },
        4: {
          id: 4,
          type: 'paragraph',
          content: 'コンテンツ'
        },
        5: {
          id: 5,
          type: 'paragraph',
          content: 'コンテンツ'
        }
      },
      allIds: [0, 1, 2, 3, 4, 5],
      availableIds: [6, 7, 8, 9, 10, 11]
    },
    pages: [
      {
        selections: [
          { id: 0, lines: [{ start: 0, end: 3, length: 4 }] },
          { id: 1, lines: [{ start: 0, end: 4, length: 5 }, { start: 5, end: 11, length: 6 }] },
          { id: 2, lines: [{ start: 0, end: 4, length: 5 }] },
          { id: 3, lines: [{ start: 0, end: 4, length: 5 }] },
          { id: 4, lines: [{ start: 0, end: 4, length: 5 }] },
          { id: 5, lines: [{ start: 0, end: 4, length: 5 }] }
        ]
      },
      {
        selections: [
          { id: 0, lines: [{ start: 0, end: 3, length: 4 }] },
          { id: 1, lines: [{ start: 0, end: 4, length: 5 }, { start: 5, end: 11, length: 6 }] },
          { id: 2, lines: [{ start: 0, end: 4, length: 5 }] },
          { id: 3, lines: [{ start: 0, end: 4, length: 5 }] },
          { id: 4, lines: [{ start: 0, end: 4, length: 5 }] },
          { id: 5, lines: [{ start: 0, end: 4, length: 5 }] }
        ]
      }
    ]
  }
};

const store = configureStore(defaultState);

if (typeof module.hot !== 'undefined') {
  module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').rootReducer));
}

export default store;

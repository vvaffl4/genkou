import * as React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import { Section, setContent, addContent } from '../../reducers/section';
import { ManuscriptSectionSelection, addSectionToPage } from '../../reducers/page';
import { Dispatch } from 'redux';
import { moveCaret, Caret, setCaret } from '../../reducers/workspace';
import { Direction } from '../../reducers/types';

interface ManuscriptSectionElementOwnProps {
  pageIndex: number
  selectionIndex: number
  selection: ManuscriptSectionSelection
}

interface ManuscriptSectionElementProps {
  caret: Caret
  scroll: number
  side: string
  height: number
  pageIndex: number
  selectionIndex: number
  selection: ManuscriptSectionSelection
  section: Section
  onMoveCaret: (sectionId: number, direction: Direction) => void
  onNewSection: () => void
  onAddContent: (addition: string) => void
  onSetContent: (content: string) => void
  onSetCaret: (lineIndex: number, position: number) => void
}

const mapState = (state: RootState, { selection }: ManuscriptSectionElementOwnProps) => ({
  selection,
  caret: state.workspace.caret,
  scroll: state.workspace.scroll,
  section: state.manuscript.sections.byId[selection.id]
});

const mapDispatch = (
  dispatch: Dispatch,
  { pageIndex, selectionIndex, selection }: ManuscriptSectionElementOwnProps
) => ({
  onMoveCaret: (sectionId: number, direction: Direction) =>
    dispatch(moveCaret(sectionId, direction)),
  onAddContent: (addition: string) => 
    dispatch(addContent(selection.id, addition)),
  onSetCaret: (lineIndex: number, position: number) => 
    dispatch(setCaret(pageIndex, selectionIndex, lineIndex, position)),
  onNewSection: () => dispatch(addSectionToPage(pageIndex, selectionIndex + 1, 'paragraph', '')),
  onSetContent: (content: string) => dispatch(setContent(selection.id, content))
});

const connector = connect(mapState, mapDispatch);

class ManuscriptSectionElement extends React.Component<ManuscriptSectionElementProps> {
  contentRef: React.RefObject<HTMLDivElement>;

  constructor(props: ManuscriptSectionElementProps) {
    super(props);

    this.state = {
      text: ''
    };

    this.contentRef = React.createRef<HTMLDivElement>();

    this.changeHandle = this.changeHandle.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  changeHandle = (event: ContentEditableEvent) => {
    // console.log(event.target.value);

    // console.log((event.nativeEvent as InputEvent));

    // this.props.onAddContent((event.nativeEvent as InputEvent).data!);
    // this.props.onSetContent(event.target.value.split('\n').join());
  };

  handleBlur = () => {};

  moveCaret = (movement: number) => {
    const selection = document.getSelection()!;
    const range = selection.getRangeAt(0);
    const position = range.startOffset + movement;
    const length = this.props.section.content.length;
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.keyCode) {
      case 13:
        if (event.shiftKey) this.props.onSetContent(
          this.props.section.content /* [...this.props.section.content, ''] */);
        else {
          this.props.onNewSection();
        }
        event.preventDefault();
        break;
      case 38:
        this.props.onMoveCaret(this.props.selection.id, 'up');
        event.preventDefault();
        break;
      case 40:
        this.props.onMoveCaret(this.props.selection.id, 'down');
        event.preventDefault();
        break;
      case 37:
        this.props.onMoveCaret(this.props.selection.id, 'left');
        event.preventDefault();
        break;
      case 39:
        this.props.onMoveCaret(this.props.selection.id, 'right');
        event.preventDefault();
        break;
    }
  };

  handleMouseUp() {
    const selection = document.getSelection()!;
    const range = selection.getRangeAt(0);

    console.log(this.props.selection);
    console.log(range.startOffset);

    const index = this.props.selection.lines.findIndex(line => 
      line.start <= range.startOffset &&
      line.end >= range.startOffset);

    this.props.onSetCaret(index, range.startOffset - this.props.selection.lines[index].start);
  }

  componentDidMount() {
    const content = this.contentRef.current!;

    content.addEventListener('compositionstart', (genericEvent: Event) => {
      const event = genericEvent as CompositionEvent;

      // console.log(event);
    });

    content.addEventListener('compositionupdate', (genericEvent: Event) => {
      const event = genericEvent as CompositionEvent;

      // console.log(event);
      // this.props.onAddContent(event.data);
    });

    content.addEventListener('compositionend', (genericEvent: Event) => {
      const event = genericEvent as CompositionEvent;

      console.log(event);
      this.props.onAddContent(event.data);
    });
  }

  componentDidUpdate() {
    if (
      this.props.caret.selectionIndex === this.props.selectionIndex &&
      this.props.caret.pageIndex === this.props.pageIndex
    ) {
      const content = this.contentRef.current!;

      if (content.firstChild) {
        console.log(this.props.caret);

        const selection = document.getSelection()!;
        const position = this.props.selection.lines[this.props.caret.lineIndex].start + this.props.caret.position + this.props.caret.lineIndex;

        const range = new Range();
        range.setStart(this.contentRef.current!.firstChild!, position);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        const caret = document.createElement("div");
        caret.style.display = 'inline';
        caret.style.width = '0px';
        caret.style.height = '0px';
        // caret.style.borderTop = "3px solid black";

        range.insertNode(caret);

        // content.scrollIntoView();
      }
    }
  }

  isElementInViewport (element: HTMLElement, scroll: number) {
    const rect = element.getBoundingClientRect();

    console.log(scroll, scroll + document.documentElement.clientWidth);
    console.log(rect.x, rect.x + rect.width);

    return (
        rect.left >= scroll &&
        rect.right <= scroll + (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  render() {
    const { side, section, selection } = this.props;

    const content = selection.lines.map((line, index) =>
        section.content.substring(line.start, line.end + 1)
    ).join('\n');

    return (
      <div
        style={{
          float: 'right',
          margin: side === 'right' ? '6px 0 0 0' : '6px 39px 0 0',
          width: `${selection.lines.length * 56}px`
        }}
        className="h-full"
      >
        <ContentEditable
          innerRef={this.contentRef}
          className="w-full h-full outline-none"
          style={{
            fontSize: '30px',
            letterSpacing: '9px',
            writingMode: 'vertical-rl',
            lineIndent: '15px',
            lineHeight: '56px',
            whiteSpace: 'break-spaces'
          }}
          disabled={false}
          html={content}
          onChange={this.changeHandle}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          onMouseUp={this.handleMouseUp}
        />
      </div>
    );
  }
}

export default connector(ManuscriptSectionElement);

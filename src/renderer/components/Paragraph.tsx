import * as React from 'react';
// tslint:disable-next-line:import-name
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { RootState } from '../reducers';

interface ParagraphProps {
  padding: string,
  content: string
}

const Paragraph: React.FunctionComponent<ParagraphProps> = ({ padding, content }) => {
  const contentEditable = React.useRef<HTMLElement>(null);

  const handleChange = (event: ContentEditableEvent) => {
    const nativeEvent = event.nativeEvent as InputEvent;

    console.log(nativeEvent);

    // if(nativeEvent.data) {
    //   const regex = new RegExp(/^[a-zA-Z0-9_.-]*$/);
    //   const value = convertToFullwidth(nativeEvent.data);
    // }
  }

  // function convertToFullwidth (text: string) {
  //   var output = "";
  //   for (let i = 0; i < text.length; i++) {
  //     if (text[i] >= '!' && text[i] <= '~') { // Check whether character is latin
  //       output += String.fromCharCode(text.charCodeAt(i) - 0x20 + 0xff00); // Convert to fullwidth
  //     } else if (text[i] === " ") { // Check if character is space
  //       output += "　"; // Convert to fullwidth space
  //     } else {
  //       output += text[i]; // Leave it be
  //     }
  //   }
  //   return output
  // }

  const moveCaret = (movement: number) => {
    const selection = window.getSelection()!;
    const anchor = selection.anchorNode!;
    const length = anchor.nodeValue?.length;

    if(length) {
      const range = selection.getRangeAt(0);
      const targetRange = Math.max(range.startOffset + movement, 0);

      const newRange = new Range();
      newRange.setStart(anchor, Math.min(targetRange, length));
      newRange.setEnd(anchor, Math.min(targetRange, length));
      newRange.collapse(true);

      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }
  }

  const moveAndSelectCaret = (movement: number) => {
    const selection = window.getSelection()!;
    const anchor = selection.anchorNode!;
    const length = anchor.nodeValue?.length;

    if(length) {
      const range = selection.getRangeAt(0);
      const beginRange = Math.max(range.startOffset, 0);
      const targetRange = Math.max(range.endOffset + movement, 0);

      const newRange = new Range();
      newRange.setStart(anchor, Math.min(beginRange, length));
      newRange.setEnd(anchor, Math.min(targetRange, length));
      newRange.collapse(true);

      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log("down");

    switch(event.keyCode) {
      case 38: 
        if (event.shiftKey) moveAndSelectCaret(-1) 
        else moveCaret(-1);
        event.preventDefault();
        break;
      case 40:
        if (event.shiftKey) moveAndSelectCaret(+1) 
        else moveCaret(+1);
        event.preventDefault();
        break;
      case 37:
        if (event.shiftKey) moveAndSelectCaret(+24) 
        else moveCaret(+24);
        event.preventDefault();
        break;
      case 39:
        if (event.shiftKey) moveAndSelectCaret(-24) 
        else moveCaret(-24);
        event.preventDefault();
        break;
    }
  }

  React.useEffect(() => {
    console.log(contentEditable);

    
  });

  return (
    <div 
      style={{ 
        paddingTop: padding, 
        paddingBottom: padding, 
        height: "100%" 
      }}
    >
      <ContentEditable
        style={{
          fontSize: "32px",
          writingMode: "vertical-rl", 
          textTransform: "full-width",
          textOrientation: "upright"
        }}
        onKeyDown={handleKeyDown}
        className="h-full focus:outline-none"
        innerRef={contentEditable}
        html={content} // innerHTML of the editable div
        disabled={false}       // use true to disable editing
        onChange={handleChange} // handle innerHTML change
      />
    </div>
  );
}

export default Paragraph;
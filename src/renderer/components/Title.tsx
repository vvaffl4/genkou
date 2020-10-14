import * as React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { useEffect } from 'react';

interface TitleProps {
  padding: string,
  content: string
}

const Title: React.FunctionComponent<TitleProps> = ({ padding, content }) => {
  const contentEditable = React.useRef<HTMLElement>(null);

  const handleChange = (event: ContentEditableEvent) => {

  }

  useEffect(() => {
    console.log(contentEditable);
  });

  return (
    <ContentEditable
      style={{ 
        writingMode: "vertical-rl", 
        textTransform: "full-width" 
      }}
      className="w-full h-full"
      innerRef={contentEditable}
      html={content} // innerHTML of the editable div
      disabled={false}       // use true to disable editing
      onChange={handleChange} // handle innerHTML change
      tagName='article' // Use a custom HTML tag (uses a div by default)
    />
  );
}

export default Title;
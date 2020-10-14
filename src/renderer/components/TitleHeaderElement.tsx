import * as React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { useEffect } from 'react';

interface SectionHeaderProps {
  paddingTop: string,
  title: string
}


const TitleHeaderElement: React.FunctionComponent<SectionHeaderProps> = () => {
  return (
    <span>
      題      
    </span>
  );
}

export default TitleHeaderElement;
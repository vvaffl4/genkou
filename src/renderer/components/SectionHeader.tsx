import * as React from 'react';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { useEffect } from 'react';

interface SectionHeaderProps {
  paddingTop: string,
  title: string
}


const SectionHeader: React.FunctionComponent<SectionHeaderProps> = ({ paddingTop, title }) => {

  return (
    <div 
      style={{
        height: paddingTop,
        writingMode: "vertical-rl",
        textAlign: "right", 
        textTransform: "full-width" 
      }}
      className={"absolute inset-x-0 pb-2 border-t border-white text-gray-400 select-none cursor-pointer hover:bg-gray-400 hover:text-white"}
    >
      { title }      
    </div>
  );
}

export default SectionHeader;
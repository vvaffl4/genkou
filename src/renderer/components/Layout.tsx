import React from "react";
import Header, { Entry } from "./Header";
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import Storage from "electron-json-storage";
import Page from "./Page";
import ManuscriptElement from "./manuscript/ManuscriptElement";

export interface Dict<T> {
  [Key: string]: T;
}

interface LayoutProps {
  display: string
}

const Layout: React.FunctionComponent<LayoutProps> = ({ display }) => {

  const handleLoad = (data: Entry[]) => {
  }

  return (
    <div className="h-full bg-gray-200 overflow-hidden">
      <Header onLoad={handleLoad}/>
      { display === 'manuscript' 
        ? <div className="flex flex-row flex-no-wrap items-center pr-8 h-full overflow-x-auto">
            <Page padding={"50px"} index={0}/>  
          </div>
        : <ManuscriptElement />
      }
    </div>
  );
}

export default Layout;
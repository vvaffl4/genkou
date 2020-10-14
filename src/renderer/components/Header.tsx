import * as React from 'react';
import { remote, OpenDialogReturnValue } from 'electron';
import { connect } from 'trilogy'

import { IoIosClose } from 'react-icons/io';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import { FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { FaRegWindowMinimize } from 'react-icons/fa';
import AddSectionButton from './AddSectionButton';

export interface Entry {
  ent_seq: string[],
  k_ele: {
    keb: string[],
    ke_inf: string[] | undefined
  }[] | undefined,
  r_ele: {
    reb: string[],
    re_pri: string[] | undefined,
    re_inf: string[] | undefined,
    re_nokanji: string[] | undefined
  }[],
  sense: {
    pos: string[] | undefined,
    field: string[] | undefined,
    xref: string[] | undefined,
    misc: string[] | undefined,
    s_inf: string[] | undefined,
    gloss: string[]
  }[]
}

interface HtmlEditorProps {
  onLoad: (data: Entry[]) => void;
}

interface HtmlEditorState {
  maximized: boolean;
}

export default class Header extends React.Component<HtmlEditorProps, HtmlEditorState> {
  constructor(props: HtmlEditorProps) {
    super(props);

    this.state = {
      maximized: remote.getCurrentWindow().isMaximized() || remote.getCurrentWindow().isKiosk()
    };

    this.handleLoad = this.handleLoad.bind(this);
    this.handleMaximize = this.handleMaximize.bind(this);
  }
  
  handleLoad() {
    remote.dialog.showOpenDialog({
      title: 'Load file',
      buttonLabel: 'Choose',
      filters: [
        {
          name: 'json',
          extensions: ['json']
        }
      ],
      properties: ['openFile']
    }).then((result: OpenDialogReturnValue) => {
      if (!result.canceled) {
      
        fetch(result.filePaths[0])
          .then(response => response.json())
          .then((data: Entry[]) => {
            this.props.onLoad(data);
          });
      }
    });
  }

  handleMinimize() {
    remote.getCurrentWindow().minimize();
  }

  handleMaximize() {
    const currentWindow = remote.getCurrentWindow();

    this.setState({ maximized: !currentWindow.isKiosk() }, () => {
      if (this.state.maximized) currentWindow.setKiosk(true);
      else currentWindow.setKiosk(false);
    });
  }

  handleClose() {
    remote.app.quit();
  }

  render() {
    return (
      <ul className="flex flex-col-reverse float-right bg-black h-full">
        <li className="flex-none">
          <button
            className="px-2 py-1 w-10 text-sm h-full text-white hover:bg-gray-500 hover:text-black"
            onClick={this.handleLoad}
            title="Open (ctrl + o)"
          >
            <AiOutlineFolderOpen className="m-auto" />
          </button>
        </li>
        <li className="flex-none">
          <AddSectionButton />
        </li>
        <li className="flex-1" style={{ WebkitAppRegion: 'drag' } as any} onDoubleClickCapture={this.handleMaximize} />
        <li className="flex-none">
          <button
            className="px-2 py-1 w-10 h-full text-xs leading-snug text-white hover:bg-yellow-500 hover:text-black"
            onClick={this.handleMinimize}
          >
            <FaRegWindowMinimize className="m-auto" />
          </button>
        </li>
        <li className="flex-none">
          <button
            className="px-2 py-1 w-10 h-full text-xs leading-relaxed text-white hover:bg-blue-500 hover:text-black"
            onClick={this.handleMaximize}
          >
            {this.state.maximized ? (
              <FiMinimize2 className="m-auto" />
            ) : (
              <FiMaximize2 className="m-auto" />
            )}
          </button>
        </li>
        <li className="flex-none">
          <button
            className="px-2 py-1 w-10 h-full text-xl text-white hover:bg-red-500 hover:text-black leading-relaxed"
            onClick={this.handleClose}
          >
            <IoIosClose className="m-auto" />
          </button>
        </li>
      </ul>
    );
  }
}

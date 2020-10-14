import * as React from 'react';
import { AiOutlineFolderOpen } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { addSectionToPage } from '../reducers/page';

const AddSectionButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const handleClick = () => {
    // dispatch(addSectionToPage(2, "paragraph", ["Content"] ));
  }

  return (
    <button
      className="px-2 py-1 w-10 text-sm h-full text-white hover:bg-gray-500 hover:text-black"
      onClick={handleClick}
      title="Open (ctrl + o)"
    >
      <AiOutlineFolderOpen className="m-auto" />
    </button>
  );
}

export default AddSectionButton;
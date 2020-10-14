import * as React from 'react';
import { useEffect } from 'react';
import SectionElement from './SectionElement';
import { RootState } from '../reducers';
import { connect } from 'react-redux';
import { ManuscriptPage } from '../reducers/page';

interface PageOwnProps {
  index: number
}

interface PageProps {
  padding: string,
  page: ManuscriptPage
}

const mapState = (state: RootState, ownProps: PageOwnProps) => ({
  page: state.manuscript.pages[ownProps.index]
})

const Page: React.FunctionComponent<PageProps> = ({ padding, page }) => {
  const contentEditable = React.useRef<HTMLElement>(null);

  useEffect(() => {
    console.log(contentEditable);
  });

  return (
    <div 
      style={{
        paddingRight: padding,
        paddingLeft: padding,
        width: "620px",
        height: "874px",
      }}
      className="flex-none content-end bg-white even:ml-20 odd:mr-20 even:border-r border-gray-400 shadow-3xl"
    >
      <div className="flex flex-row-reverse items-end h-full">
        {
          page.selections.map(selection => (
              <SectionElement
                key={selection.id}
                index={selection.id}
                padding={padding} 
              />
            )
          )
        }
        {/* <SectionElement padding={"50px"} title={"題"} content={"sttff"} />
        <SectionElement padding={"50px"} title={"項"} content={"ｓｔｔｆｆ"} /> */}
      </div>
    </div>
  );
}

export default connect(mapState)(Page);
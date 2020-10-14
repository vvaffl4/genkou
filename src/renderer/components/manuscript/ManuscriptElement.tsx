import * as React from "react";
import ManuscriptPageElement from "./ManuscriptPageElement";
import { RootState } from "../../reducers";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { scrollWorkspace } from "../../reducers/workspace";

interface ManuscriptElementProps {
  pageIndices: number[],
  onScrollWorkspace: (scroll: number) => void
}

const mapStateToProps = (state: RootState) => ({
  pageIndices: [...state.manuscript.pages.keys()].reverse()
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onScrollWorkspace: (scroll: number) => dispatch(scrollWorkspace(scroll))
});

const ManuscriptElement: React.FunctionComponent<ManuscriptElementProps> = ({ pageIndices, onScrollWorkspace }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current!;

    // container.scrollTo(container.scrollWidth, 0);

    container.addEventListener('scroll', () => {
      console.log(container.scrollLeft);

      onScrollWorkspace(container.scrollLeft);
    });
  }, [containerRef]);

  return (
    <div 
      ref={containerRef}
      className="flex flex-row flex-no-wrap items-center pr-8 h-full overflow-x-auto"
    >
      { pageIndices.map(pageIndex => (
          <ManuscriptPageElement key={pageIndex} index={pageIndex} />  
        )) }
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ManuscriptElement);
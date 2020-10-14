import React from "react";
import { RootState } from "../../reducers";
import ManuscriptColumnElement from "./ManuscriptColumnElement";
import { connect } from "react-redux";
import { ManuscriptPage } from "../../reducers/page";

interface ManuscriptPageElementOwnProps {
  index: number
}

interface ManuscriptPageElementProps {
  index: number,
  page: ManuscriptPage
}

const mapState = (state: RootState, { index }: ManuscriptPageElementOwnProps) => ({
  page: state.manuscript.pages[index]
})

const ManuscriptPageElement: React.FunctionComponent<ManuscriptPageElementProps> = ({ index, page }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState(0);

  React.useEffect(() => {
    const container = containerRef.current!;

    setContainerHeight(container.clientHeight);
  })

  return (
    <div 
      ref={containerRef}
      style={{
        width: "364mm",
        height: "257mm",
      }}
      className="flex-none content-end bg-white even:ml-20 odd:mr-20 even:border-r border-gray-400 shadow-3xl"
    >
      <div className="flex flex-row w-full h-full">
        <div 
          style={{ width: "25mm" }}
          className="h-full"
        />
        <div className="flex-grow">
          <div className="flex flex-row-reverse h-full border-r border-gray-400">
            <div className="w-1/2 h-full">
              <ManuscriptColumnElement 
                side={"right"} 
                pageIndex={index} 
                height={containerHeight}
              />
            </div>
            <div className="w-1/2 h-full">
              {/* <ManuscriptColumnElement side={"left"} pageIndex={index} height={containerHeight}/> */}
            </div>
          </div>
        </div>
        <div 
          style={{ width: "25mm" }}
          className="h-full"
        />
      </div>
    </div>
  );
}

export default connect(mapState)(ManuscriptPageElement);
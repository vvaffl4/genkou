import * as React from "react";

interface ManuscriptColumnBoxElementProps {
}

const ManuscriptColumnBoxElement: React.FunctionComponent<ManuscriptColumnBoxElementProps> = ({ children }) => {

  return (
    <div 
      style={{ width: "56px", height: "39px", writingMode: "vertical-rl" }}
      className="boxContainer"
    >
      <div style={{ width: "16px" }}>
        
      </div>
      <div 
        style={{ width: "39px", height: "39px" }}
        className="box h-full border-t border-r border-l border-gray-400"
      >
        <div 
          style={{ height: "50%" }}
          className="inline-block w-full"
        >
          <div 
            style={{ textAlign: "center" }}
            className="float-left w-1/2 h-full border-b border-gray-200"
          />
          <div 
            style={{ textAlign: "center" }} 
            className="float-left w-1/2 h-full border-r border-b border-gray-200"
          />
        </div>
        <div
          style={{ height: "50%" }} 
          className="inline-block w-full"
        >
          <div 
            style={{ textAlign: "center" }}
            className="float-left w-1/2 h-full"    
          />
          <div 
            style={{ textAlign: "center" }}
            className="float-left w-1/2 h-full border-r border-gray-200"
          />
        </div>
      </div>
    </div>
  );
}

export default ManuscriptColumnBoxElement;
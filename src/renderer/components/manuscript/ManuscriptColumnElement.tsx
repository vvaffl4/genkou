import * as React from 'react';
import ManuscriptColumnBoxElement from './ManuscriptColumnBoxElement';
import ManuscriptSectionElement from './ManuscriptSectionElement';
import { ManuscriptSectionSelection } from '../../reducers/page';
import { RootState } from '../../reducers';
import { connect } from 'react-redux';

interface ManuscriptColumnElementOwnProps {
  pageIndex: number;
}

interface ManuscriptColumnElementProps {
  pageIndex: number;
  side: string;
  height: number;
  selections: ManuscriptSectionSelection[];
}

const mapState = (state: RootState, { pageIndex }: ManuscriptColumnElementOwnProps) => ({
  pageIndex,
  selections: state.manuscript.pages[pageIndex].selections
});

class ManuscriptColumnElement extends React.Component<ManuscriptColumnElementProps> {
  constructor(props: ManuscriptColumnElementProps) {
    super(props);

    this.state = {
      text: ''
    };
  }

  render() {
    const { pageIndex, side, selections } = this.props;

    return (
      <div style={{ paddingTop: '25mm', paddingBottom: '25mm' }} className="h-full w-full">
        <div className="relative h-full w-full">
          <div className="absolute inset-0">
            <div
              className={`flex flex-wrap justify-between h-full w-full border-t border-b border-gray-400
              ${side === 'left' ? 'flex-col' : 'flex-col-reverse'}`}
            >
              {side === 'right' && <div className="w-8 h-full" />}
              {[...Array(200).keys()].map(value => (
                <ManuscriptColumnBoxElement key={value} />
              ))}
              {side === 'left' && <div className="w-8 h-full" />}
            </div>
          </div>
          <div className="absolute inset-0">
            {selections
              .map((selection, index) => (
                <ManuscriptSectionElement
                  key={selection.id}
                  pageIndex={pageIndex}
                  selectionIndex={index}
                  selection={selection}
                  side={side}
                  height={20}
                />
              ))}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapState)(ManuscriptColumnElement);

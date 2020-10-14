import * as React from 'react';
import SectionHeader from './SectionHeader';
import Paragraph from './Paragraph';
import { RootState } from '../reducers';
import { Section } from '../reducers/section';
import { connect } from 'react-redux';

interface SectionOwnProps {
  index: number
}

interface SectionProps {
  padding: string,
  section: Section
}

const mapState = (state: RootState, ownProps: SectionOwnProps) => {
  console.log(`key: ${ownProps.index}`);

  return ({
    section: state.manuscript.sections.byId[ownProps.index]
  })
}

const headerTitles = {
  'title': '題',
  'heading': '項目',
  'paragraph': '句'
};

const SectionElement: React.FunctionComponent<SectionProps> = ({ padding, section }) => {
  return (
    <div className="relative h-full hover:bg-gray-200">
      <SectionHeader paddingTop={padding} title={headerTitles[section.type]} />
      <Paragraph padding={padding} content={section.content}/>
    </div>
  );
}

export default connect(mapState)(SectionElement);
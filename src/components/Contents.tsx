import React from 'react';
import Markdown from './Markdown';
import './css/Contents.scss';

const Contents = () => {
  return (
    <div className="row">
      <div className="col-12 col-sm-5 col-md-4 left-panel">asd</div>
      <div className="col-12 col-sm-7 col-md-8">
        <Markdown />
      </div>
    </div>
  );
};

export default Contents;

import React, { useState, useEffect } from 'react';
import ReactMarkDown from 'react-markdown';
import * as markdownPath from '../docs/QueryBuilder/caching.md';
import './css/Markdown.scss';

const Markdown = () => {
  const [markdown, setMarkdown] = useState('');
  useEffect(() => {
    fetch(markdownPath)
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        setMarkdown(text);
      });
  });
  return (
    <div>
      <ReactMarkDown source={markdown}></ReactMarkDown>
    </div>
  );
};

export default Markdown;

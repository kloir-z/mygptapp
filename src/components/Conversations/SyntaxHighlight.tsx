import React, { CSSProperties } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ReactMarkdown from 'react-markdown';
import syntaxStyle from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark';
import gfm from 'remark-gfm';
import { Components } from 'react-markdown';

import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';

SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('css', css);

const commonStyle: CSSProperties = {
  whiteSpace: 'normal',
  margin: '0px'
};
const customH1: CSSProperties = {
  whiteSpace: 'normal',
  margin: '0px 0px -8px 0px'
};
const customH2: CSSProperties = {
  whiteSpace: 'normal',
  margin: '-8px 0px -8px 10px'
};
const customH3: CSSProperties = {
  whiteSpace: 'normal',
  margin: '-8px 0px -12px 20px'
};
const customulol: CSSProperties = {
  whiteSpace: 'normal',
  margin: '0px 0px 16px 0px'
};
const commonStylePrewrap: CSSProperties = {
  whiteSpace: 'pre-wrap',
  margin: '0px',
  fontFamily: "MeiryoUI,-apple-system,BlinkMacSystemFont,'Roboto',sans-serif"
};

const components: Components = {
  a: ({ node, ...props }) => <a style={commonStyle} {...props} />,
  p: ({ node, ...props }) => <p style={commonStylePrewrap} {...props} />,
  h1: ({ node, ...props }) => <h1 style={customH1} {...props} />,
  h2: ({ node, ...props }) => <h2 style={customH2} {...props} />,
  h3: ({ node, ...props }) => <h3 style={customH3} {...props} />,
  h4: ({ node, ...props }) => <h4 style={customH3} {...props} />,
  h5: ({ node, ...props }) => <h5 style={customH3} {...props} />,
  h6: ({ node, ...props }) => <h6 style={customH3} {...props} />,
  img: ({ node, ...props }) => <img style={commonStyle} {...props} />,
  em: ({ node, ...props }) => <em style={commonStyle} {...props} />,
  strong: ({ node, ...props }) => <strong style={commonStyle} {...props} />,
  pre: ({ node, ...props }) => <pre style={commonStylePrewrap} {...props} />,
  code: ({ node, ...props }) => <code style={commonStylePrewrap} {...props} />,
  ol: ({ node, ...props }) => <ol style={customulol} {...props} />,
  ul: ({ node, ...props }) => <ul style={customulol} {...props} />,
  li: ({ node, ...props }) => <li style={commonStyle} {...props} />,
  blockquote: ({ node, ...props }) => <blockquote style={commonStyle} {...props} />,
  table: ({ node, ...props }) => <table style={commonStyle} {...props} />,
  thead: ({ node, ...props }) => <thead style={commonStyle} {...props} />,
  tbody: ({ node, ...props }) => <tbody style={commonStyle} {...props} />,
  tr: ({ node, ...props }) => <tr style={commonStyle} {...props} />,
  th: ({ node, ...props }) => <th style={commonStyle} {...props} />,
  td: ({ node, ...props }) => <td style={commonStyle} {...props} />
};

const codeRegex = /```(\w+)?\n([\s\S]+?)```/g;

export const SyntaxHighlight = (content: string) => {

  const parts = [];
  let lastIndex = 0;

  let match;
  while ((match = codeRegex.exec(content)) !== null) {
    parts.push(
      <ReactMarkdown components={components} key={lastIndex} remarkPlugins={[gfm]}>
        {content.slice(lastIndex, match.index)}
      </ReactMarkdown>
    );
    const language = match[1] || 'javascript';
    parts.push(
      <SyntaxHighlighter language={language} style={syntaxStyle}>
        {match[2]}
      </SyntaxHighlighter>
    );
    lastIndex = match.index + match[0].length;
  }
  parts.push(
    <ReactMarkdown components={components} key={lastIndex + 1} remarkPlugins={[gfm]}>
      {content.slice(lastIndex)}
    </ReactMarkdown>
  );

  return parts;
};
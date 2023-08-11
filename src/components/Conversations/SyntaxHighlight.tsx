import { PrismLight as SyntaxHighlighter, Prism as SyntaxHighlighterPrism } from 'react-syntax-highlighter';
import syntaxStyle from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark';

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

export const SyntaxHighlight = (content: string) => {
    const codeRegex = /```(\w+)?\n([\s\S]+?)```/g;
    const parts = [];
    let lastIndex = 0;
  
    let match;
    while ((match = codeRegex.exec(content)) !== null) {
      parts.push(<span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>);
      const language = match[1] || 'javascript';
      parts.push(
        <SyntaxHighlighter
          language={language}
          style={syntaxStyle}
        >
          {match[2]}
        </SyntaxHighlighter>
      );
      lastIndex = match.index + match[0].length;
    }
    parts.push(<span key={lastIndex + 1}>{content.slice(lastIndex)}</span>);
  
    return parts;
  };
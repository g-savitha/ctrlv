import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../services/api';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
// Import languages and styles as needed
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import ruby from 'react-syntax-highlighter/dist/esm/languages/hljs/ruby';
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import markdown from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';

import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('swift', swift);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('html', xml);
SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('jsx', js);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('bash', bash);

function ViewPaste() {
  const { pasteId } = useParams();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        setLoading(true);
        
        // For now, we'll simulate fetching paste data
        // When we have the backend API, we'll replace this with an actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for demonstration
        setPaste({
          id: pasteId,
          title: pasteId === 'example' ? 'Example Paste' : `Paste ${pasteId}`,
          content: pasteId === 'example' 
            ? `// This is an example JavaScript code
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// Calculate factorial of 5
console.log(factorial(5)); // 120`
            : `// This is a generated paste with ID: ${pasteId}
console.log("Hello, world!");

// Some sample code
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("User"));`,
          language: 'javascript',
          createdAt: new Date().toISOString(),
          expiresAt: null,
          views: Math.floor(Math.random() * 50) + 1
        });
        
        /* 
        // This is what the actual API call would look like:
        const response = await axios.get(`YOUR_API_ENDPOINT/pastes/${pasteId}`);
        setPaste(response.data);
        */
        
      } catch (err) {
        setError('Failed to load paste. It may have expired or been removed.');
        console.error('Error fetching paste:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [pasteId]);

  const copyToClipboard = () => {
    if (paste) {
      navigator.clipboard.writeText(paste.content)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Paste not found or has expired.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">{paste.title || 'Untitled Paste'}</h1>
            <div className="text-sm text-gray-600">
              <span>Created: {formatDate(paste.createdAt)}</span>
              {paste.expiresAt && (
                <span className="ml-4">Expires: {formatDate(paste.expiresAt)}</span>
              )}
              <span className="ml-4">Views: {paste.views}</span>
            </div>
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded text-sm transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded-bl">
          {paste.language}
        </div>
        <SyntaxHighlighter
          language={paste.language || 'plaintext'}
          style={atomOneDark}
          customStyle={{
            margin: 0,
            padding: '2rem',
            borderRadius: '0 0 0.5rem 0.5rem',
            fontSize: '0.9rem',
            lineHeight: 1.5
          }}
          showLineNumbers={true}
        >
          {paste.content}
        </SyntaxHighlighter>
      </div>
      
      <div className="p-4 bg-gray-100 rounded-b-lg border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Share this paste: 
            <code className="ml-2 bg-white px-2 py-1 rounded border">
              {window.location.href}
            </code>
          </div>
          <div>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded text-sm transition-colors"
            >
              New Paste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewPaste;
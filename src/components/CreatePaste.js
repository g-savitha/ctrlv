import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';


const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'jsx', label: 'JSX/React' },
  { value: 'bash', label: 'Bash/Shell' },
  { value: 'sql', label: 'SQL' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: 'Plain Text' }
];

function CreatePaste() {
  const [pasteContent, setPasteContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [title, setTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [expiration, setExpiration] = useState('never');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pasteContent.trim()) {
      setError('Paste content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await ApiService.createPaste({
        content: pasteContent,
        language,
        title,
        customUrl,
        expiration,
        isPrivate
      });

      navigate(`/${response.pasteId}`);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('Custom URL is already taken. Please choose a different one.');
      } else {
        setError('Failed to create paste. Please try again.');
        console.error('Error creating paste:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Paste</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="pasteContent" className="block text-gray-700 font-medium mb-2">
            Paste Content
          </label>
          <textarea
            id="pasteContent"
            className="w-full h-64 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline font-mono"
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            placeholder="Paste your code or text here..."
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="language" className="block text-gray-700 font-medium mb-2">
              Syntax Highlighting
            </label>
            <select
              id="language"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Title (Optional)
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="customUrl" className="block text-gray-700 font-medium mb-2">
              Custom URL (Optional)
            </label>
            <input
              id="customUrl"
              type="text"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="custom-url-slug"
            />
          </div>
          
          <div>
            <label htmlFor="expiration" className="block text-gray-700 font-medium mb-2">
              Expiration
            </label>
            <select
              id="expiration"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
            >
              <option value="never">Never</option>
              <option value="10m">10 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="1d">1 Day</option>
              <option value="1w">1 Week</option>
              <option value="1month">1 Month</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <input
            id="isPrivate"
            type="checkbox"
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <label htmlFor="isPrivate" className="ml-2 block text-gray-700">
            Private (accessible only with the link)
          </label>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Paste'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePaste;
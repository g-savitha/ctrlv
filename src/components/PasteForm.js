import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaste } from '../api/paste';

const PasteForm = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('');
  const [title, setTitle] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [expiration, setExpiration] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form with data:', {
        content,
        language,
        title,
        customUrl,
        expiration,
        isPrivate
      });
      
      const response = await createPaste({
        content,
        language,
        title,
        customUrl,
        expiration,
        isPrivate
      });
      
      console.log('Got response:', response);
      navigate(`/paste/${response.pasteId}`);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your code here..."
        />
        <input
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Language (optional)"
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
        />
        <button type="submit">Create Paste</button>
      </form>
    </div>
  );
};

export default PasteForm; 
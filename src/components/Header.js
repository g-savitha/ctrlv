import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="text-green-400">Ctrl</span>
          <span className="text-white">V</span>
          <span className="ml-2 text-sm text-gray-400">| Paste & Share</span>
        </Link>
        <nav>
          <Link to="/" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white font-medium transition-colors">
            + New Paste
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
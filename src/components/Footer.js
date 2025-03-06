import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} - CtrlV | 
          <a 
            href="https://gsavitha.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-1 text-green-400 hover:text-green-300"
          >
            gsavitha.in
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
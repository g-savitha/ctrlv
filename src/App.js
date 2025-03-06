import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CreatePaste from './components/CreatePaste';
import ViewPaste from './components/ViewPaste';

function App() {
  // The basename will be '/ctrlv' when integrated with Hugo
  return (
    <Router basename={process.env.NODE_ENV === 'production' ? '/ctrlv' : '/'}>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<CreatePaste />} />
            <Route path="/:pasteId" element={<ViewPaste />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
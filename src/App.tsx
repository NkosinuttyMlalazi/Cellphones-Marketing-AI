import React from 'react';
import './App.css';
import ContentGenerator from './components/ContentGenerator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="main-title">Marketing Content Creator</h1>
        <p className="subtitle">Create engaging content for your marketing campaigns</p>
        <div className="content-section">
          <ContentGenerator />
        </div>
      </header>
    </div>
  );
}

export default App;

import React from 'react';
import Navbar from './components/Navbar';
import Contents from './components/Contents';

const App = () => {
  return (
    <div className="container">
      <div>
        <Navbar />
        <Contents />
      </div>
    </div>
  );
};

export default App;

import React from 'react';
import logo from './logo.svg';
import './App.css';
import ManagerPage from '../src/components/ManagerPage';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to OverClock Manager Dashboard!</p>
      </header>

      <main>
        <ManagerPage />
      </main>
    </div>
  );
}

export default App;

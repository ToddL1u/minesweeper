import React from 'react';
import logo from './logo.svg';
import Board from './components/Board'
import stateContext from './service/StateContext';
import { useState } from 'react';
function App() {
  let [isWin, setWin] = useState(false);
  let [isLose, setLose] = useState(false);
  const size = 8;
  
  let state = {
    isWin, isLose, setWin, setLose, size
  }
  return (
    <stateContext.Provider value={state}>
      <Board tileSize={60} gap={10} boardSize={size} mineAmount={10} />
    </stateContext.Provider>
  );
}

export default App;

import React from 'react';
import logo from './logo.svg';
import Board from './components/Board'
import stateContext from './service/StateContext';
import { useState } from 'react';
function App() {
  let [isWin, setWin] = useState(false);
  let [isLose, setLose] = useState(false);
  let state = {
    isWin, isLose, setWin, setLose
  }
  return (
    <stateContext.Provider value={state}>
      <Board/>
    </stateContext.Provider>
  );
}

export default App;

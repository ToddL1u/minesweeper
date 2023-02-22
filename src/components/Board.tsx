import SquareGrid from "./SquareGrid";
import { useState, useEffect } from "react";
import "./Board.css";
import SquareType from "../types";
const Board = () => {
  const [mines, setMines] = useState(new Set());
  const [boardSize, setBoardSize] = useState(8);
  const [startGame, setStartGame] = useState(false);
  const size = 8;
  const defaultSquare = new Array(size).fill(new Array(size).fill(null).map(() => {
    let data: SquareType = {
      x: 0,
      y: 0,
      amount: 0,
      isMine: false,
      flag: false,
      reveal: false
    }
    return data;
  }));
  const [squareList, setSquareList] = useState(defaultSquare);

  //inital after use click the first square
  const initalGame = (clickX: number, clickY: number) => {
    setStartGame(true);
    //random the mines location
    let m = new Set();
    while(m.size <= 8) {
      let x = Math.floor(Math.random() * size)
      let y = Math.floor(Math.random() * size)
      if(x !== clickX && y !== clickY) m.add([x,y]);
    }
    setMines(m);
    //mapping square list as mines
    let list = Array.from(m);
    let renderlist = JSON.parse(JSON.stringify(defaultSquare));
    for(let i = 0; i< list.length; i++) {
      let [x, y] =list[i] as Array<number>;
      renderlist[x][y].isMine = true;
      setMineAmount(renderlist, x,y-1);//top
      setMineAmount(renderlist, x,y+1)//bottom
      setMineAmount(renderlist, x -1,y)//left
      setMineAmount(renderlist, x +1,y)//right
      setMineAmount(renderlist, x-1,y-1)//left top
      setMineAmount(renderlist, x+1,y-1)//right top
      setMineAmount(renderlist, x-1,y+1)//left bottom
      setMineAmount(renderlist, x+1,y+1)//right bottom
    }
    renderlist[clickX][clickY].reveal = true;
    setSquareList(renderlist);
  };

  function setMineAmount(arr: Array<Array<SquareType>>, x: number, y: number) {
    //check boundary
    if(x < 0 || y < 0 || x >= size || y >= size) return;
    //caculate mine numbers
    let obj = arr[x][y] as SquareType;
    obj.amount++;
  }

  const resetGame = () => {
    setSquareList(JSON.parse(JSON.stringify(defaultSquare)));
    setStartGame(false);
  };

  const sweepMine = (x: number, y: number) => {
    if(!startGame) {
      initalGame(x, y);
      //traverse  and reveal empty square 
    } else {
      
    }
  };

  const loseGame = () => {
    alert("you lose");
  }

  function checkAjacent(x: number, y: number) {

  }

  const flagSquare = (x: number, y: number) => {
    //traverse  and reveal empty 
  };
  


  const squares = squareList.map((row, rowIndex) => {
    return (
      <div className="mine-row">
        {row.map((item: any, index: number) => {
          item.x = rowIndex;
          item.y = index;
          return <SquareGrid key={`row:${row},${index}`} data={item} loseGame={loseGame} onSweep={sweepMine} />;
        })}
      </div>
    );
  });

  useEffect(() => {
    resetGame();
  }, []);
  return (
    <div className="mineBoard">
      <button className="btn-reset" onClick={resetGame}>RESET</button>
      <div>Mines: 8</div>
      <div id="mineContainer" className={`mine-${size}`}>
        {squares}
      </div>
    </div>
  );
};

export default Board;

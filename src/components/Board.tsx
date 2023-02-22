import SquareGrid from "./SquareGrid";
import { useState, useEffect, useContext } from "react";
import stateContext from "../service/StateContext";
import "./Board.css";

import SquareType from "../types";
const Board = () => {
  const [mines, setMines] = useState(new Set());
  const [boardSize, setBoardSize] = useState(8);
  const [startGame, setStartGame] = useState(false);
  const size = 8;
  const ctx = useContext(stateContext);

  //inital defaultData
  const defaultSquare = new Array(size).fill(null).map((row_item, rowIndex) => {
    return new Array(size).fill(null).map((item, index) => {
      let data: SquareType = {
        x: rowIndex,
        y: index,
        checked: false,
        amount: 0,
        isMine: false,
        flag: false,
        reveal: false,
      };
      return data;
    });
  });

  const [squareList, setSquareList] = useState(defaultSquare);

  //inital after use click the first square
  const initalGame = (clickX: number, clickY: number) => {
    setStartGame((prev) => !prev);
    //random the mines location
    let m = new Set();
    while (m.size < 8) {
      let x = Math.floor(Math.random() * size);
      let y = Math.floor(Math.random() * size);
      if (x !== clickX && y !== clickY) m.add([x, y]);
    }

    setMines(m);
    //mapping square list as mines
    let list = Array.from(m);
    let renderlist = JSON.parse(JSON.stringify(defaultSquare));
    for (let i = 0; i < list.length; i++) {
      let [x, y] = list[i] as Array<number>;
      renderlist[x][y].isMine = true;
      traverse(x, y, (position: Array<Array<number>>) => {
        position.forEach((coor) => {
          renderlist[coor[0]][coor[1]].amount++;
        });
      });
    }
    renderlist[clickX][clickY].checked = true;
    setSquareList(renderlist);
    expandArea(clickX, clickY, renderlist);
  };

  //check boundary is all direction
  function traverse(x: number, y: number, cb?: Function) {
    let position = [
      [x, y - 1],
      [x, y + 1],
      [x - 1, y],
      [x + 1, y],
      [x - 1, y - 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y + 1],
    ];
    position = position.filter((item: Array<number>) => {
      return !(
        item[0] < 0 ||
        item[1] < 0 ||
        item[0] >= size ||
        item[1] >= size
      );
    });
    cb && cb(position);
  }

  const resetGame = () => {
    setSquareList(JSON.parse(JSON.stringify(defaultSquare)));
    setStartGame(false);
    ctx.setLose(false);
    ctx.setWin(false);
  };

  const sweepMine = (x: number, y: number) => {
    if (!startGame) {
      initalGame(x, y);
    } else {
      expandArea(x, y);
    }
  };

  const expandArea = (x: number, y: number, renderlist?: any) => {
    if (renderlist === undefined) renderlist = [...squareList];
    let target = renderlist[x][y];
    if(target.flag) return;

    target.checked = true;
    if (target.amount !== 0) {
      //2. click a sqaure with an ajance mine will clear the squares touching it
      if (target.reveal) {
        traverse(x, y, (position: any) => {
          for (let i = 0; i < position.length; i++) {
            let [x, y] = position[i];
            let tile = renderlist[x][y] as SquareType;
            if (tile.isMine && !tile.flag) {
              loseGame();
              break;
            }
            if (!tile.checked) tile.checked = true;
          }
        });
      } else {
        target.reveal = true;
      }
      setSquareList(renderlist);
    } else {
      const checkTile = (position: Array<Array<number>>, list: any) => {
        let safeSquare: any = [];
        position.forEach((coor) => {
          let tile = list[coor[0]][coor[1]] as SquareType;
          if (tile.checked) return;
          if (tile.amount === 0) {
            tile.checked = true;
            safeSquare.push(tile);
          } else if (tile.amount > 0) {
            tile.reveal = true;
          }
        });
        while (safeSquare.length > 0) {
          let obj = safeSquare.pop();
          traverse(obj.x, obj.y, (pos: any) => {
            checkTile(pos, renderlist);
          });
        }
        setSquareList(list);
      };
      traverse(x, y, (pos: any) => {
        checkTile(pos, renderlist);
      });
    }
  };

  const loseGame = () => {
    ctx.setLose(true);
  };

  const checkVictory = () => {
    
    ctx.setWin(true);
  };

  const flagSquare = (x: number, y: number) => {
    let s: any = [...squareList];
    s[x][y].flag = !s[x][y].flag;
    setSquareList(s);
  };

  const squares = squareList.map((row, rowIndex) => {
    return (
      <div className="mine-row">
        {row.map((item: SquareType) => {
          return (
            <SquareGrid
              key={`row:${item.x},${item.y}`}
              data={item}
              loseGame={loseGame}
              onSweep={sweepMine}
              onFlag={flagSquare}
            />
          );
        })}
      </div>
    );
  });

  useEffect(() => {
    resetGame();
  }, []);
  return (
    <div className={`mineBoard `}>
      <div>
        <button className="btn-reset" onClick={resetGame}>
          RESET
        </button>
        <div>Mines: 8</div>
      </div>
      <div id="mineContainer" className={`mine-${size}`}>
        {squares}
      </div>
    </div>
  );
};

export default Board;

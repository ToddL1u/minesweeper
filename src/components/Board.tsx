import SquareGrid from "./SquareGrid";
import { useState, useEffect, useContext } from "react";
import stateContext from "../service/StateContext";
import "./Board.css";

import SquareType from "../types";
const Board = () => {
  const [mines, setMines] = useState(new Set());
  const [startGame, setStartGame] = useState(false);
  const size = 8;
  const mineAmount = 10;
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

  const defaultMark = new Array(size * size).fill(false);

  const [visited, setVisited] = useState(defaultMark); //calculate how many tile has been checked of flag
  const [squareList, setSquareList] = useState(defaultSquare);

  //inital after use click the first square
  const initalGame = (clickX: number, clickY: number) => {
    setStartGame((prev) => !prev);
    //random the mines location
    let m = new Set();
    while (m.size < mineAmount) {
      let x = Math.floor(Math.random() * size);
      let y = Math.floor(Math.random() * size);
      if (x !== clickX && y !== clickY) m.add([x, y]);
    }

    setMines(m);
    //mapping square list as mines
    let list = Array.from(m);
    let renderlist = [...squareList];
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
    revealArea(clickX, clickY, renderlist);
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
    setVisited([...defaultMark]);
    setStartGame(false);
    ctx.setLose(false);
    ctx.setWin(false);
  };

  const sweepMine = (x: number, y: number) => {
    if (!startGame) {
      initalGame(x, y);
    } else {
      revealArea(x, y);
    }
  };

  const revealArea = (x: number, y: number, renderlist?: any) => {
    if (renderlist === undefined) renderlist = [...squareList];
    let target = renderlist[x][y];
    if (target.flag) return;
    let _visited = [...visited];
    _visited[x * size + y] = true;
    target.checked = true;
    if (target.amount !== 0) {
      //2. click a sqaure with an ajance mine will clear the squares touching it
      if (target.reveal) {
        //this will be double click
        traverse(x, y, (position: any) => {
          for (let i = 0; i < position.length; i++) {
            let [x, y] = position[i];
            let tile = renderlist[x][y] as SquareType;
            if ((tile.isMine && !tile.flag) || (!tile.isMine && tile.flag)) {
              loseGame();
              break;
            }
            _visited[x * size + y] = true;
            setVisited(_visited);
            if (!tile.checked) tile.checked = true;
          }
        });
      } else {
        target.reveal = true;
        setVisited(_visited);
      }
      setSquareList(renderlist);
    } else {
      //if the click square is zero
      const checkTile = (
        position: Array<Array<number>>,
        list: any,
        visitedData: any
      ) => {
        let emptySquare: any = [];
        for (let i = 0; i < position.length; i++) {
          let [x, y] = position[i];
          let tile = list[x][y] as SquareType;
          if (tile.checked || tile.flag) continue;
          visitedData[x * size + y] = true;
          if (tile.amount === 0) {
            tile.checked = true;
            emptySquare.push(tile);
          } else if (tile.amount > 0) {
            tile.reveal = true;
          }
        }
        setVisited(visitedData);
        setSquareList(list);

        //keep looking for empty square
        while (emptySquare.length > 0) {
          let obj = emptySquare.pop();
          traverse(obj.x, obj.y, (pos: any) => {
            checkTile(pos, renderlist, visitedData);
          });
        }
      };
      traverse(x, y, (pos: any) => {
        checkTile(pos, renderlist, _visited);
      });
    }
  };

  const loseGame = () => {
    ctx.setLose(true);
  };

  useEffect(() => {
    let res = visited.filter((item) => !item);
    if (res.length === 0) ctx.setWin(true);
  }, [visited]);

  const flagSquare = (x: number, y: number, isMine: boolean) => {
    let s: any = [...squareList];
    s[x][y].flag = !s[x][y].flag;
    if (isMine) {
      let _visited = [...visited];
      let index = x * size + y;
      s[x][y].flag ? (_visited[index] = "FLAG") : (_visited[index] = false);
      setVisited(_visited);
    }
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
      <nav>
        <button className="btn-reset" onClick={resetGame}>
          RESET
        </button>
        <div>Mines: {mineAmount}</div>
      </nav>
      <div id="mineContainer" className={`mine-${size}`}>
        {squares}
      </div>
    </div>
  );
};

export default Board;

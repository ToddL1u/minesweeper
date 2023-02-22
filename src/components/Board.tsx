import SquareGrid from "./SquareGrid";
import { useState, useEffect } from "react";
import "./Board.css";
import SquareType from "../types";
import { render } from "@testing-library/react";
const Board = () => {
  const [mines, setMines] = useState(new Set());
  const [boardSize, setBoardSize] = useState(8);
  const [startGame, setStartGame] = useState(false);
  const size = 8;

  //inital defaultData
  const defaultSquare = new Array(size).fill(
    new Array(size).fill(null).map(() => {
      let data: SquareType = {
        x: 0,
        y: 0,
        checked: false,
        amount: 0,
        isMine: false,
        flag: false,
        reveal: false,
      };
      return data;
    })
  );

  const [squareList, setSquareList] = useState([[]]);
  useEffect(() => {
    // setSquareList(defaultSquare);
    // initalGame();
  }, [startGame]);

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
        // console.log(position);
        position.forEach((coor) => {
          setMineAmount(renderlist, coor[0], coor[1]);
        });
      });
    }
    renderlist[clickX][clickY].checked = true;
    setSquareList(renderlist);
    // setTimeout(() => {
    //   expandArea(clickX, clickY);
    // },100)
    // sweepMine(clickX, clickY);
  };

  function traverse(x: number, y: number, cb?: Function) {
    //check boundary is all direction
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

  function setMineAmount(arr: Array<Array<SquareType>>, x: number, y: number) {
    //check boundary
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    //caculate mine numbers
    let obj = arr[x][y] as SquareType;
    obj.amount++;
  }

  const resetGame = () => {
    setSquareList(JSON.parse(JSON.stringify(defaultSquare)));
    setStartGame(false);
  };

  const sweepMine = (x: number, y: number) => {
    if (!startGame) {
      initalGame(x, y);
    } else {
      expandArea(x, y);
    }
  };

  const expandArea = (x: number, y: number) => {
    let renderlist = JSON.parse(JSON.stringify(squareList));
    let target = renderlist[x][y];
    target.checked = true;
    if (target.amount !== 0) {
      //2. click a sqaure with an ajance mine will clear the squares touching it
      target.reveal = true;
      setSquareList(renderlist);
    } else {
      const checkTile = (position: Array<Array<number>>, list:any) => {
        let safeSquare: any = [];
        position.forEach((coor) => {
          let tile = list[coor[0]][coor[1]] as SquareType;
          if(tile.checked) return;
          // console.log(tile.amount);
          if (tile.amount === 0) {
            tile.checked = true;
            safeSquare.push(tile);
          } else if (tile.amount > 0) {
            tile.reveal = true;
          }
        });
        while(safeSquare.length > 0) {
          let obj = safeSquare.pop();
          traverse(obj.x, obj.y, (pos:any) => { checkTile(pos, renderlist)});
        }
        setSquareList(list);
      };
      // setSquareList(renderlist);
      traverse(x, y, (pos:any) => { checkTile(pos, renderlist)});
    }
  };

  const loseGame = () => {
    alert("you lose");
  };

  function checkAjacent(x: number, y: number) {}

  const flagSquare = (x: number, y: number) => {
    //traverse  and reveal empty
  };

  const squares = squareList.map((row, rowIndex) => {
    return (
      <div className="mine-row">
        {row.map((item: any, index: number) => {
          item.x = rowIndex;
          item.y = index;
          return (
            <SquareGrid
              key={`row:${row},${index}`}
              data={item}
              loseGame={loseGame}
              onSweep={sweepMine}
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
    <div className="mineBoard">
      <button className="btn-reset" onClick={resetGame}>
        RESET
      </button>
      <div>Mines: 8</div>
      <div id="mineContainer" className={`mine-${size}`}>
        {squares}
      </div>
    </div>
  );
};

export default Board;

import "./SquareGrid.css";
import SquareType from "../types";
import { useState, useContext } from "react";
import stateContext from "../service/StateContext";
const SquareGrid = (props: any) => {
  const data: SquareType = props.data;
  const ctx = useContext(stateContext);

  const isMine = data.isMine? (ctx.isWin? 'is-win': (ctx.isLose? 'is-lose': '')) : ''
  const visited = data.checked ? "checked" : "";
  const releavled = data.reveal ? "revealed" : "";

  const onClickSquare = (e: any) => {
    if(data.flag) return;
    if (e.detail === 1 && !data.reveal) {
      if (data.isMine) {
        props.loseGame();
      } else {
        props.onSweep(data.x, data.y);
      }
    } else if(e.detail === 2) {
      props.onSweep(data.x, data.y);
    }
  };

  const onRightClick = (e: any) => {
    e.preventDefault();
    if(data.reveal) return;
    props.onFlag(data.x, data.y, data.isMine);
  };

  const state = ctx.isLose || ctx.isWin ? "disabled" : "";

  return (
    <div
      className={`mine-square ${releavled} ${isMine} ${visited} ${state}`}
      onClick={onClickSquare}
      onContextMenu={onRightClick}
    >
      {data.flag && <span> 🚩</span>}
      {ctx.isLose && data.isMine && <span>💣</span>}
      {data.reveal && <span>{data.amount}</span>}
    </div>
  );
};

export default SquareGrid;

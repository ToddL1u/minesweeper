import "./SquareGrid.css";
import SquareType from "../types";
import { useState, useContext } from "react";
import stateContext from "../service/StateContext";
import {getPosition} from '../service/utilities';
const SquareGrid = (props: any) => {
  const data: SquareType = props.data;
  const ctx = useContext(stateContext);

  const isMine = data.isMine ? (ctx.isWin? 'is-win': (ctx.isLose && !data.flag ? 'is-lose': '')) : ''
  const releavled = data.reveal ? "revealed" : "";
  const position = getPosition(data.index, ctx.size);
  const onClickSquare = (e: any) => {
    if(data.flag) return;
    if (e.detail === 1 && !data.reveal) {
      if (data.isMine) {
        props.loseGame();
      } else {
        props.onSweep(position[0],position[1]);
      }
    } else if(e.detail === 2) {
      props.onSweep(position[0],position[1]);
    }
  };

  const onRightClick = (e: any) => {
    e.preventDefault();
    if(data.reveal) return;
    props.onFlag(position[0],position[1], data.isMine);
  };

  const state = ctx.isLose || ctx.isWin ? "disabled" : "";

  return (
    <div
      className={`mine-square ${releavled} ${isMine} ${state}`}
      style={props.style}
      onClick={onClickSquare}
      onContextMenu={onRightClick}
    >
      {data.flag && <span> 🚩</span>}
      {ctx.isLose && data.isMine && !data.flag && <span>💣</span>}
      {data.reveal && data.amount > 0 && <span>{data.amount}</span>}
    </div>
  );
};

export default SquareGrid;

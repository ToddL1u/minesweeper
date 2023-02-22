import "./SquareGrid.css";
import SquareType from "../types";
import { useState } from "react";
const SquareGrid = (props: any) => {
  const data: SquareType = props.data;
  // const [checked, setChecked] = useState(data.checked);
  // console.log(data.x);
  //use debount to check double click
  const isMine = data.isMine ? "mine" : "";
  const visited = data.checked ? "checked" : "";
  const releavled = data.reveal ? "revealed" : "";

  const onClickSquare = () => {
    if (data.isMine) {
      props.loseGame();
    } else {
      // setChecked(true);
      props.onSweep(data.x, data.y);
    }
  };

  const onRightClick = (e: any) => {
    e.preventDefault();
    props.onFlag(data.x, data.y);
  };

  return (
    //
    <div
      className={`mine-square ${releavled} ${isMine} ${visited}`}
      onClick={onClickSquare}
      onContextMenu={onRightClick}
    >
      {data.amount}
      {data.flag && <div> 🚩</div>}
      {/* {data.reveal && <span>{data.amount}</span>} */}
    </div>
  );
};

export default SquareGrid;

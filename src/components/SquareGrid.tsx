import './SquareGrid.css';
import SquareType from '../types';
const SquareGrid = (props: any) => {
  const data: SquareType = props.data;
  // console.log(data.x);
  //use debount to check double click
  const isMine = data.isMine? 'mine': ""
  const revealed = data.reveal? 'revealed': ""
  return (
    <div className={`mine-square ${isMine} ${revealed}`} onClick={() => {props.onSweep(data.x, data.y)}}>
      <span>{data.amount}</span>
    </div>
  )
}

export default SquareGrid;
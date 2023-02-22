import './SquareGrid.css';
import SquareType from '../types';
const SquareGrid = (props: any) => {
  const data: SquareType = props.data;
  // console.log(data.x);
  //use debount to check double click
  const isMine = data.isMine? 'mine': ""
  const revealed = data.reveal? 'revealed': ""

  const onClickSquare = () => {
    if(data.isMine) {
      console.log("losing");
      props.loseGame();
    } else {
      props.onSweep(data.x, data.y)
    }
  }

  return (
    <div className={`mine-square ${isMine} ${revealed}`} onClick={onClickSquare}>
      {data.flag && <div> flaged</div>}
      {!data.flag && <span>{data.amount}</span>}
    </div>
  )
}

export default SquareGrid;
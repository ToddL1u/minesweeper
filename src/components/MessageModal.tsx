import "./MessageModal.css";
import { useContext } from "react";
import stateContext from "../service/StateContext";
const Modal = (props: any) => {
  const ctx = useContext(stateContext);
  return (
    <>
      <div className="overlay" onClick={props.onDismiss}></div>
      <div className="modal">
        {ctx.isLose && <div>SORRY YOU LOSE. 🥲</div>}
        {ctx.isWin && <div>CONGRATS YOU WIN! 🎉</div>}
        <div>
          <button className="btn btn-primary" onClick={props.onReset}>PLAY AGAIN</button>
        </div>
      </div>
    </>
  );
};

export default Modal;

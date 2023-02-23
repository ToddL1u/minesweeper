import {createContext} from 'react'

const stateContext = createContext({
  isWin: false,
  isLose: false,
  size: 0,
  setWin: Function.prototype,
  setLose: Function.prototype
})

export default stateContext;
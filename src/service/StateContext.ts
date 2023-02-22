import {createContext} from 'react'

const stateContext = createContext({
  isWin: false,
  isLose: false,
  setWin: Function.prototype,
  setLose: Function.prototype
})

export default stateContext;
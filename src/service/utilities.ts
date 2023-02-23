const getPosition = (index: number, rowWidth: number): Array<number> => {
  return [Math.floor(index/ rowWidth),index%rowWidth];
}

export {getPosition};
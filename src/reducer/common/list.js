export function getList(state, key) {
  if (state[key] === undefined) {
    throw new Error(`Entry ${key} is not available`);
  }
  return state[key];
}

export function updateList(state, key, value) {
  if (state[key] === undefined) {
    throw new Error(`Entry ${key} is not available`);
  }
  return Object.assign({}, state, {
    [key]: value
  });
}

export function addList(state, key, value) {
  if (state[key] !== undefined) {
    throw new Error(`Entry ${key} is already occupied`);
  }
  return Object.assign({}, state, {
    [key]: value
  });
}

export function removeList(state, key) {
  if (state[key] === undefined) {
    throw new Error(`Entry ${key} is not available`);
  }
  let newList = Object.assign({}, state);
  delete newList[key];
  return newList;
}

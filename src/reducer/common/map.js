export function getMap(state, key) {
  if (state[key] === undefined) {
    throw new Error(`Entry ${key} is not available`);
  }
  return state[key];
}

export function updateMap(state, key, value) {
  if (state[key] === undefined) {
    throw new Error(`Entry ${key} is not available`);
  }
  return Object.assign({}, state, {
    [key]: value
  });
}

export function addMap(state, key, value) {
  if (state[key] !== undefined) {
    throw new Error(`Entry ${key} is already occupied`);
  }
  return Object.assign({}, state, {
    [key]: value
  });
}

export function removeMap(state, key) {
  if (state[key] === undefined) {
    throw new Error(`Entry ${key} is not available`);
  }
  let newMap = Object.assign({}, state);
  delete newMap[key];
  return newMap;
}

export function updateOrRemoveMap(state, key, value) {
  if (value == null) return removeMap(state, key);
  return updateMap(state, key, value);
}

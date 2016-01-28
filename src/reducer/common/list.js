export function updateList(list, index, value) {
  return list.slice(0, index).concat([value], list.slice(index + 1));
}

export function addList(list, value) {
  return list.concat([value]);
}

export function removeListEntry(list, value) {
  return list.filter(id => id !== value);
}

export function removeList(list, index) {
  return list.slice(0, index).concat(list.slice(index + 1));
}

export function updateOrRemoveList(list, index, value) {
  if (value == null) return removeList(list, index);
  return updateList(list, index, value);
}

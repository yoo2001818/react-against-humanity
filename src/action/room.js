import { createAction } from 'redux-actions';

export const CREATE = 'room/create';
export const DESTROY = 'room/destroy';

export const UPDATE = 'room/update';
export const FETCH_LIST = 'room/fetchList';

export const JOIN = 'room/join';
export const LEAVE = 'room/leave';

// room.id must be provided by the server later.
export const create = createAction(CREATE, template => template, () => ({
  class: 'write'
}));
// Destroying room by the user is not possible unless the user is admin
export const destroy = createAction(DESTROY, () => ({}), room => ({
  class: 'write', room: room
}));

// This is only possible by a host.
export const update = createAction(UPDATE,
  (room, template) => template,
  room => ({
    class: 'write', room: room
  })
);
// Huh. Typically this will be provided by the server when the
// connection is established.
export const fetchList = createAction(FETCH_LIST);

// User joins the room.
export const join = createAction(JOIN, () => ({}), room => ({
  class: 'write', room: room
}));
export const leave = createAction(LEAVE, () => ({}), () => ({
  class: 'write'
}));

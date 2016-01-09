import { createAction } from 'redux-actions';

export const CREATE = 'room/create';
export const DESTROY = 'room/destroy';

export const UPDATE = 'room/update';
export const FETCH_LIST = 'room/fetchList';

export const JOIN = 'room/join';
export const LEAVE = 'room/leave';

// room.id must be provided by the server later.
export const create = createAction(CREATE,
  template => template,
  (template, room) => ({
    class: 'write', target: { room }
  })
);
// Destroying room by the user is not possible unless the user is admin
export const destroy = createAction(DESTROY,
  () => ({}),
  room => ({
    class: 'write', target: { room }
  })
);

// This is only possible by a host.
export const update = createAction(UPDATE,
  template => template,
  (template, room) => ({
    class: 'write', target: { room }
  })
);
// Huh. Typically this will be provided by the server when the
// connection is established.
export const fetchList = createAction(FETCH_LIST);

// User joins the room.
export const join = createAction(JOIN,
  room => ({ room }),
  room => ({
    class: 'write', target: { room }
  })
);
export const leave = createAction(LEAVE,
  () => ({}),
  room => ({
    class: 'write', target: { room }
  })
);

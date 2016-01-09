// Overrides action's connection info to connector's ID
export default function setConnection(req, res, next) {
  if (req.cause === 'poll') {
    if (!req.action) req.action = {};
    if (!req.action.meta) req.action.meta = {};
    if (!req.action.meta.target) req.action.meta.target = {};
    req.action.meta.target.connection = req.connection;
    const state = req.store.getState();
    let connection = state.connection.list[req.connection];
    if (connection) req.action.meta.target.room = connection.room;
  }
  next();
}

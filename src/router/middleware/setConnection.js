// Overrides action's connection info to connector's ID
export default function setConnection(req, res, next) {
  if (req.cause === 'poll') {
    if (!req.action) req.action = {};
    if (!req.action.meta) req.action.meta = {};
    const state = req.store.getState();
    req.action.meta.connection = state.connection.list[req.connection] || {
      id: req.connection
    };
  }
  next();
}

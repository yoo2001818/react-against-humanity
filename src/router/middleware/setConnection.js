// Overrides action's connection info to connector's ID
export default function setConnection(req, res, next) {
  if (req.cause === 'poll') {
    if (!req.action) req.action = {};
    if (!req.action.meta) req.action.meta = {};
    req.action.meta.connection = req.connection;
  }
  next();
}

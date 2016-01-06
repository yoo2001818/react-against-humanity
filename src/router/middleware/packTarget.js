export default function packTarget(req, res, next) {
  if (req.cause === 'middleware') {
    if (!req.action) return next();
    if (!req.action.meta) return next();
    if (!req.action.meta.target) return next();
    const target = req.action.meta.target;
    if (typeof target.connection === 'object') {
      target.connection = target.connection.id;
    }
  }
  return next();
}

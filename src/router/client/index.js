export default function client(req, res, next) {
  if (req.cause === 'middleware') {
    req.connector.dispatch(req.action, -1, true)
    .then(res.resolve, res.reject);
    return;
  }
  if (req.cause === 'poll') {
    res.resolve(req.store.dispatch(req.action));
    return;
  }
  next();
}

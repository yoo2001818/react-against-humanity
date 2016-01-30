export default function passThrough(req) {
  // Passthrough
  return req.store.dispatch(req.action);
  // .then(res.resolve, res.reject);
}

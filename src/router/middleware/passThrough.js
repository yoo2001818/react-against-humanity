export default function passThrough(req, res) {
  // Passthrough
  req.store.dispatch(req.action)
  .then(() => {
    res.resolve(req.action);
  }, res.reject);
  // .then(res.resolve, res.reject);
}

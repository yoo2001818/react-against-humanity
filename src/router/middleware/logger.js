// Just a logger.

export default function logger(req, res, next) {
  console.log(req.action, req.connection); // eslint-disable-line no-console
  next();
}

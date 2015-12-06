export default function spliter(middleware, poll) {
  return (req, res, next) => {
    switch (req.cause) {
    case 'middleware':
      middleware(req, res, next);
      break;
    case 'poll':
      poll(req, res, next);
      break;
    default:
      next();
    }
  };
}

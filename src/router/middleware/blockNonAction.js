import { isFSA } from 'flux-standard-action';
// Blocks non-action objects
export default function blockNonAction(req, res, next) {
  if (!isFSA(req.action)) {
    return res.reject(new Error('Only FSA-compatible action is accepted'));
  }
  next();
}

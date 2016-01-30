import { isFSA } from 'flux-standard-action';
// Blocks non-action objects
export default function blockNonAction(req, next) {
  if (!isFSA(req.action)) {
    throw new Error('Only FSA-compatible action is accepted');
  }
  return next();
}

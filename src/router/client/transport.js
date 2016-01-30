import * as Transport from '../../action/transport';
import * as Connection from '../../action/connection';
import Router from '../../utils/router';

const router = new Router();

router.middleware(Transport.CREATE, (req, next) => {
  // Reconnect request..
  req.connector.reconnect();
  return next();
});

router.middleware(Transport.CLOSE, (req, next) => {
  // Disconnect...
  req.connector.disconnect();
  return next();
});

router.poll(Transport.OPEN, (req, next) => {
  req.store.dispatch(Connection.handshake({
    // Currently share nothing while handshaking.
  }));
  return next();
});

export default router;

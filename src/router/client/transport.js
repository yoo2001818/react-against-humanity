import * as Transport from '../../action/transport';
import * as Connection from '../../action/connection';
import Router from '../../utils/router';

const router = new Router();

router.middleware(Transport.CREATE, (req, res) => {
  // Reconnect request..
  req.connector.reconnect();
  res.resolve();
});

router.middleware(Transport.CLOSE, (req, res) => {
  // Disconnect...
  req.connector.disconnect();
  res.resolve();
});

router.poll(Transport.OPEN, (req, res, next) => {
  req.store.dispatch(Connection.handshake({
    // Currently share nothing while handshaking.
  }));
  next();
});

export default router;

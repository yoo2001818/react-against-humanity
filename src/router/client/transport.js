import * as Transport from '../../action/transport';
import * as Connection from '../../action/connection';
import Router from '../../utils/router';

const router = new Router();

router.poll(Transport.OPEN, (req, res) => {
  // Dispatch open action anyway;
  req.store.dispatch(req.action);
  // Start handshake..
  /*req.store.dispatch(Connection.handshake({
    name: 'Client',
    version: '0.0.1'
  }))
  .then(res.resolve, res.reject);*/
  // .then(res.resolve, res.reject);
});

router.middleware(Transport.CREATE, (req, res) => {
  // Reconnect request..
  req.connector.reconnect();
  res.resolve();
});

export default router;

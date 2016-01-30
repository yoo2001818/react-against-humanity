import * as Transport from '../../action/transport';
import * as Connection from '../../action/connection';
import Router from '../../utils/router';

import { sessionAdapter } from '../../db/session';
import setConnection from '../middleware/setConnection';
import passThrough from '../middleware/passThrough';

const router = new Router();

router.poll(Transport.OPEN, (req, res, next) => {
  // Obtain WebSocket object
  let client = req.connector.getClient(req.connection);
  // And obtain session object.
  sessionAdapter.getSession(client.upgradeReq).then(session => {
    // Overwrite session value.
    // Connection will NEVER have the session store because it can leak
    // unnecessary data, and it violates redux's policy.
    client.session = session;
    // Now, wait for the client's connection/handshake signal.
  }, () => {
    // Disconnect the socket because session is unavailable
    req.connector.disconnect(1008, 'Cannot access session value',
      req.connection);
  });
  // Silently call next
  next();
});

router.poll(Transport.CLOSE, (req, res, next) => {
  const { connection: { list } } = req.store.getState();
  // Ignore if connection is not created yet
  if (list[req.connection] == null) return res.resolve();
  // Dispatch disconnect event
  req.action = Connection.disconnect(
    {
      code: req.action.payload.code,
      reason: req.action.payload.reason
    }, list[req.connection]
  );
  next();
}, setConnection, passThrough);

export default router;

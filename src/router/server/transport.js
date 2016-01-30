import * as Transport from '../../action/transport';
import * as Connection from '../../action/connection';
import Router from '../../utils/router';

import { sessionAdapter } from '../../db/session';

const router = new Router();

// no-op routes to prevent 'nothing handled the action' error
router.poll(Transport.CREATE, () => {});
router.poll(Transport.ERROR, () => {});

router.poll(Transport.OPEN, req => {
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
  // Drop the action; we don't need it.
  return;
});

router.poll(Transport.CLOSE, req => {
  const { connection: { list } } = req.store.getState();
  // Ignore if connection is not created yet
  if (list[req.connection] == null) return;
  // Dispatch disconnect event
  req.action = Connection.disconnect(
    {
      code: req.action.payload.code,
      reason: req.action.payload.reason
    }, list[req.connection]
  );
  // Drop the action; we don't need it.
  return;
});

export default router;

import * as Transport from '../../action/transport';
import Router from '../../utils/router';

const router = new Router();

router.middleware(Transport.CREATE, (req, res) => {
  // Reconnect request..
  req.connector.reconnect();
  res.resolve();
});

export default router;

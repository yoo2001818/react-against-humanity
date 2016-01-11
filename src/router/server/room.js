import * as Room from '../../action/room';
import Router from '../../utils/router';
import setConnection from '../middleware/setConnection';
import passThrough from '../middleware/passThrough';

const router = new Router();

router.poll(Room.CREATE, setConnection, (req, res, next) => {
  // Inject increment data to the action.
  // This looks so ugly.
  const state = req.store.getState();
  if (!req.action) req.action = {};
  if (!req.action.meta) req.action.meta = {};
  if (!req.action.meta.target) req.action.meta.target = {};
  req.action.meta.target.room = state.room.last;
  console.log('Overrided, ' + req.action.meta.target.room);
  next();
}, passThrough);
router.poll(Room.DESTROY, setConnection, passThrough);
router.poll(Room.UPDATE, setConnection, passThrough);
router.poll(Room.JOIN, setConnection, passThrough);
router.poll(Room.LEAVE, setConnection, passThrough);

export default router;
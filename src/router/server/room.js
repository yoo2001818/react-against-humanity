import * as Room from '../../action/room';
import Router from '../../utils/router';
import setConnection from '../middleware/setConnection';
import passThrough from '../middleware/passThrough';
import checkLogin from '../middleware/checkLogin';

const router = new Router();

router.poll(Room.CREATE, setConnection, checkLogin, (req, next) => {
  // Inject increment data to the action.
  // This looks so ugly.
  const state = req.store.getState();
  if (!req.action.meta) req.action.meta = {};
  if (!req.action.meta.target) req.action.meta.target = {};
  req.action.meta.target.room = state.room.last;
  return next();
}, passThrough);
router.poll(Room.DESTROY, setConnection, passThrough);
router.poll(Room.UPDATE, setConnection, passThrough);
router.poll(Room.JOIN, setConnection, checkLogin, (req, next) => {
  if (!req.action.meta) req.action.meta = {};
  if (!req.action.meta.target) req.action.meta.target = {};
  req.action.meta.target.room = req.action.payload && req.action.payload.id;
  return next();
}, passThrough);
router.poll(Room.LEAVE, setConnection, passThrough);

export default router;

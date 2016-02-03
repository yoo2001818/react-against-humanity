import * as Room from '../../action/room';
import Router from '../../utils/router';
import setConnection from '../middleware/setConnection';
import passThrough from '../middleware/passThrough';
import checkLogin from '../middleware/checkLogin';

const router = new Router();

function checkRoomHost(req, next) {
  const roomId = req.action.meta.target.room;
  const { room: { list } } = req.store.getState();
  const room = list[roomId];
  if (room == null) throw new Error('Room is missing');
  if (room.host !== req.action.meta.target.connection) {
    throw new Error('You are not the host of the room');
  }
  return next();
}

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
router.poll(Room.UPDATE, setConnection, checkRoomHost, passThrough);
router.poll(Room.JOIN, setConnection, checkLogin, (req, next) => {
  if (!req.action.meta) req.action.meta = {};
  if (!req.action.meta.target) req.action.meta.target = {};
  req.action.meta.target.room = req.action.payload && req.action.payload.id;
  return next();
}, (req, next) => {
  // Check password if required.
  const roomId = req.action.meta.target.room;
  const { room: { list } } = req.store.getState();
  const room = list[roomId];
  if (room == null) throw new Error('Room is missing');
  if (room.lockType === 'password') {
    if (req.action.payload.data == null) throw new Error('Specify credentials');
    const { password } = req.action.payload.data;
    if (password !== room.password) throw new Error('Password mismatch');
  } else if (room.lockType === 'invite') {
    throw new Error('Not implemented yet');
  }
  // Nevertheless, remove credentials information from the action.
  req.action.payload.data = null;
  return next();
}, passThrough);
router.poll(Room.LEAVE, setConnection, passThrough);
router.poll(Room.TRANSFER_HOST, setConnection, checkRoomHost, passThrough);
router.poll(Room.KICK, setConnection, checkRoomHost, passThrough);

export default router;

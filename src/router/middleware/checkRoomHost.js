export default function checkRoomHost(req, next) {
  const roomId = req.action.meta.target.room;
  const { room: { list } } = req.store.getState();
  const room = list[roomId];
  if (room == null) throw new Error('Room is missing');
  if (room.host !== req.action.meta.target.connection) {
    throw new Error('You are not the host of the room');
  }
  return next();
}

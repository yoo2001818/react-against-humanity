// Only allow logged in connections to pass through (login checkpoint)
export default function checkLogin(req, next) {
  if (req.cause === 'poll') {
    const state = req.store.getState();
    let connection = state.connection.list[req.connection];
    if (connection.level === 'anonymous') {
      throw new Error('Only logged in connections can do that');
    }
  }
  return next();
}

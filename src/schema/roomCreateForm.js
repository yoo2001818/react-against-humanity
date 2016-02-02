export const RoomCreateFormPassword = {
  id: '/Form/CreateRoom/Password',
  properties: {
    lockType: { enum: ['password'] },
    password: {
      type: 'string',
      minLength: 1,
      maxLength: 32
    }
  },
  required: ['password']
};

export const RoomCreateForm = {
  id: '/Form/CreateRoom',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 32
    },
    maxUserCount: {
      type: 'integer',
      minimum: 2,
      maximum: 100
    },
    lockType: {
      enum: ['public', 'password', 'invite']
    }
  },
  required: ['name', 'maxUserCount', 'lockType'],
  oneOf: [
    {
      id: '/Form/CreateRoom/Normal',
      properties: {
        lockType: { enum: ['public', 'invite'] }
      }
    }, RoomCreateFormPassword
  ]
};

export default RoomCreateForm;

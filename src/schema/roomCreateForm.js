export const RoomCreateForm = {
  id: '/Form/CreateRoom',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 32
    },
    password: {
      type: ['string', 'null'],
      maxLength: 32
    },
    maxUserCount: {
      type: 'integer',
      minimum: 2,
      maximum: 100
    }
  },
  required: ['name', 'maxUserCount']
};

export default RoomCreateForm;

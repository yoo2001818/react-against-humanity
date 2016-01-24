export const Room = {
  id: '/Room',
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      required: true
    }
  }
};

export const Connection = {
  id: '/Connection',
  type: 'object',
  properties: {
    id: {
      type: 'integer'
    },
    name: {
      type: 'string',
      maxLength: 32
    },
    level: {
      enum: ['anonymous', 'guest', 'user']
    },
    userId: {
      type: 'integer'
    },
    roomId: {
      type: 'integer'
    },
    // This information is for garbage-collecting.
    lastCreated: {
      type: 'integer'
    },
    lastUpdated: {
      type: 'integer'
    },
    exited: {
      type: 'boolean'
    }
  },
  required: ['id', 'level'],
  additionalProperties: false
};

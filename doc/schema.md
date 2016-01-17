# Packet
Packet used in the WebSocket communication protocol. Contains an action,
ticket request, ticket response.

- action
- ticketReq
- ticketRes

# Action
Action represents single action object. It is compatible with Flux standard
action.

- type
- payload
- meta
  - class

Additional action schema can be found in `/src/schema` folder, used for action
validation from the server.

# Connection
Connection represents single user entity connected to the server.

- ID
- Nickname
- User

# User
User represents identifiable single user entity stored in the database.

- TBD

# Room
Room represents a group of connections trying to do something, such as a
game session, editing game etc.

- ID
- Status
- Name
- Current User Count
- Max User Count
- Users

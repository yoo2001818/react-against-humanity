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

# Temporary data

Temporary data is only stored in the memory, thus deleted/created very often.

## Connection
Connection represents single user entity connected to the server.
They can 'elevate' from guest to logged user by... logging in. They should be
able to log in while connected (on the fly) and log in by cookies, which should
involve AJAX calls, etc to set the cookie value. Or we can just use
localStorage, I don't really like it though.

- id
- name
- userId

## Room
Room represents a group of connections trying to do something, such as a
game session, editing game etc.

- id
- name
- hosts
- users
- userCount
- maxUserCount
- configuration
  - decks
  - rules
- state
  - playing
  - locked
- password
- chat
- session

### PlaySession
Represents playing session, contains information about the game.

- phase
- turns
- answerDrawCards
- questionDrawCards
- czar
- selectedAnswer
- users
  - id
  - points
  - cards
- questionCards
- answerCards
  - userId
  - cards

## ChatMessage
Represents each chat message sent by a user.

- type
- user
- message

# Persistent data

Persistent data is stored in the DB, and server reducer won't have these
information since it requires database change (It is very hard to alter them
using reducers). This means the router should handle everything about it.

## User
User represents identifiable single user entity stored in the database.
A user is different from a connection, although they are 1:1 matched.

- TBD

## Deck

- id
- name
- description
- language
- author
- license
- cards

## Card

- id
- type
- description
- fields

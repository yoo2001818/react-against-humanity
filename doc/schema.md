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
Connection represents single user connection connected to the server.

They can 'elevate' from guest to logged user by logging in, or log out.
They should be able to log in while connected (on the fly) and log in by
cookies, which should involve AJAX calls, etc to set the cookie value.
Or we can use localStorage for logging in. By default the connection starts
with 'anonymous' entity, which doesn't have a name (or assigned by the client,
randomly). These connection can't chat, and doesn't show up on the chat.
So these users should log in to chat or participate in the game, etc.
However they can freely spectate the game, see the deck, etc.

Users can log in as a user using credentials, or 'anonymously' log in
using a nickname. Using nickname can't make a deck, or edit 'persistent'
information, since we don't know who edited it.

Logging in from anonymous to guest will show a 'join' message in the chat,
and logging out will show a 'leave' message.

So, there are 3 types of connection level:

- Anonymous. Not logged in at all.
- Guest. Logged in using nickname, doesn't have user information.
- User. Logged in using credentials, has a user id.

### Representation
- id
- name
- level
- userId

### Actions
- handshake
- connect
- disconnect
- login
- logout
- update

## Room
Room represents a group of connections trying to do something, such as a
game session, editing game etc.

Almost all actions will be specific to the room where the user is in,
unless scope is specified, except connection actions.

- id
- name
- hosts
- spectators
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

### Actions
- create
- delete
- join
- leave
- update
- start
- stop

## PlaySession
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

### Phases

1. User draws up to 10 answer cards. (draw)
2. Draw one question card; users submit answer cards. (submit)
3. Reveal answer cards; czar selects one answer card. (select)
4. User who sent that answer card gets one point, change the card czar.

### Actions
- phase
- draw
- showQuestion
- addPoint
- setCzar
- turn

#### User actions
- submit
- select

## Chat
Represents a chat conversation; this is used in conversation, room, lobby, 1:1
chat.

- limit
- messages

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

- id
- username
- isAdmin
- enabled
- signedUp
- email
- name
- bio
- photo

## Deck
- id
- name
- description
- language
- authors
- license
- cards
- comments

## Comment
- id
- deckId
- author
- description

## Card
- id
- deckId
- type
- description
- fields

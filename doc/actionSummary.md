# Action Summary
This documents summarizes actions required to run the project.

# Connection / Basic actions

## connection
Connection related actions come here, such as a connection event or
connection elevation, etc.

- HANDSHAKE
- CONNECT
- DISCONNECT
- LOGIN
- LOGOUT
- UPDATE

## transport
Underlying socket layer actions come here, this only should be used internally.

- CREATE
- OPEN
- CLOSE
- ERROR

## chat
Chat actions should have 'scope' property in order to set the receiver.

- CHAT
- CLEAR_HISTORY
- SET_LIMIT

## room
- CREATE
- JOIN
- LEAVE
- DELETE
- UPDATE
- START
- STOP

## game
- START
- DRAW
- NEXT

## user
- FETCH
- UPDATE
- DELETE

## deck
- FETCH
- CREATE
- UPDATE
- DELETE

## card
- FETCH
- CREATE
- UPDATE
- DELETE

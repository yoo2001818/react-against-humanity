# Communication

Server and clients communicates with actions. Everything but handshake should
be communicated with actions.

This document specifies how the action should be structured and what action
should be implemented for basic connection.

This communication model uses Redux pattern - with some 'remote connection'.
This means that Redux is required to implement this model. However, since
Redux is so 'simple', there should be no problem implementing this model on
other languages.

# Action Structure

Actions should follow FSA(Flux standard action) standard. You can do anything
with the actions as long as it follows FSA standard.

In addition to that, actions should have these properties to communicate with
the remote part (Doesn't matter if it's a client or server.)

## payload

It's perfectly fine to use `payload` for anything - this communication model
doesn't interfere with payload.

## meta

`meta` field should have these properties to communicate with the remote.

### class

Decides the 'communication class' of the action. There are three types of
communication class.

The behavior of communication class is described in [here](action.md).

- `internal`. Communication middleware should ignore this. This is default
  value if it's omitted.
- `read`. Used to fetch information from the remote.
- `write`. Used to actually run a action to the remote.

Server should send an error back if specified `class` is not supported on the
specified action type and ignore the action.

### connection

Describes who sent the action (or who belongs to the action). This should be
`null` if server sent the action. Servers should set the connection to who
actually sent the action. Clients should not override them, since server sets the
'author' of the action.

`connection` can be any object, but it is recommended to use identifier such as
Number or String, since it's easily distinguishable and processable.

# Actions

Some actions are mandatory to implement this communication model. This list
lists these required actions.

- connection/handshake
- connection/update
- connection/connect
- connection/disconnect

## connection/handshake

Handshake is specially treated by both client and server.

1. Client sends handshake action along with the connection data.
2. Server creates and dispatches connect action to its store.
3. Server sends handshake action with the initial store and connection data.
4. Server sends connect action to other users.

### Supported class

- write

### Client -> Server

```js
  {
    connection: {
      name: 'Guest'
      version: '1.0.25'
      // Any additional information can come here
    }
    // Any additional information can come here
  }
```

### Server -> Client

#### If handshake was successful

```js
  {
    connection: {
      id: 4,
      name: 'Guest',
      version: '1.0.25'
    },
    // Any initial store information can come here
  }
```

#### If handshake has failed

```js
  {
    code: 403,
    reason: 'Already connected to the socket server.'
  }
```

Server should immediately disconnect the connection after sending response.

## connection/update

Update action updates the target connection. `read` is used to fetch user data
from the server, and `write` is used to update user itself.

Server should throw error if `write` action is trying to edit disallowed data.

### Supported class

- read
- write

### Client -> Server

#### read

```js
  {
    id: 31
  }
```

#### write

```js
  {
    name: 'Anonymous'
    // Any data can come here
  }
```

### Server -> Client

#### successful

```js
  {
    id: 31,
    name: 'Anonymous'
    // Any data can come here
  }
```

#### failed

```js
  {
    code: 403,
    reason: 'Tried to edit disallowed data'
  }
```

## connection/connect

Adds the connection to the store. Client shouldn't send this action to the
server. Server should filter them out.

### Server -> Client

```js
  {
    id: 31,
    name: 'Anonymous'
    // Any data can come here
  }
```

## connection/disconnect

Removes the connection from the store. Client shouldn't send this action to the
server. Server should filter them out.

### Server -> Client

```js
  {
    id: 31,
    name: 'Anonymous'
    // Any data can come here
  }
```

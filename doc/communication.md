# Communication

Server and clients communicates with actions. Everything but handshake should
be communicated with actions.

This document specifies how the action should be structured and what action
should be implemented for basic connection.

This communication model uses Redux pattern - with some 'remote connection'.
This means that Redux is required to implement this model. However, since
Redux is so 'simple', there should be no problem implementing this model on
other languages.

# Action

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

### user

Describes who sent the action (or who belongs to the action). This should be
`null` if server sent the action. Servers should set the user to who actually
sent the action. Clients should not override them, since server sets the
'author' of the action.

`user` can be any object, but it is recommended to use identifier such as
Number or String, since it's easily distinguishable and processable.

# Pages
React Against Humanity has many pages, and it is managed using URL.
However, the whole site requires working WebSocket connection.

## /
Main page. This is actually same as room list (/ redirects to /room)

## /about
Project about page, introduction and stuff.

## /rooms
Room listing.

## /rooms/:id
Room page. By default the user connects with spectate mode unless specified.

Room joined state and page URL is not sticked; Users can freely navigate
to another page and come back.

### /rooms/:id?key=:key
Room page, with invite code provided. This format is used for secret rooms.

## /users
User listing.

## /users/:id
User page. Also includes decks that the user has contributed.

## /decks
Deck listing.

## /decks/:id
Deck view. Here, users can edit the deck if the user is one of the
authors of the deck. Or, other people may just copy the deck.

## /decks/:id/comments
Dedicated page for seeing the comments.

## /decks/:id/edit
Deck edit view. Users can edit the deck by connecting to this url, or press
edit button on the top.

One of the authors must visit this page and create the editing session in order
to allow other people to edit the deck.

Technically this is just a room, however connecting with /rooms/:id will
redirect to /decks/:id/edit.

## /friends
Dedicated page for managing friends list. Requires user login-level.

## /notifications
Notification list. Requires user login-level.

## /settings
Settings page, currently has nothing but will have language settings, profile
etc.

## /login
Login page, users can login using ID/Password, or oAuth, or anonymously by
typing nickname.

## /login/create
Create an account page, for ID/Password method.

## /login/finalize
Create an account page, for oAuth.

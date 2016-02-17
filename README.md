In development

# Messaging UI for your app

This package build on the `socialize:messaging` package
to create a user interface for conversations between users.

**Note:**
You need to either include `storyteller:accounts-server` or create index on
the `username` field in the `users` collection.

## Components

### UserConversationOverview

Shows the overview of started conversations for current user

### UserConversation

Main conversation window. Takes in `conversationId`.

### UserNewConversation

A modal to start a new conversation. Includes the `UserNewMessage` component.

### UserNewMessage

A component to create a new conversation.

## TODO

*Separate the components even more
*Add sanitization for input
*Create a better conversation window

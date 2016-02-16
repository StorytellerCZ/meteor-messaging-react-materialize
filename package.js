Package.describe({
  name: 'storyteller:messaging-react-materialize',
  version: '0.1.0',
  summary: 'Messaging between users',
  git: 'https://github.com/StorytellerCZ/meteor-messaging-react-materialize.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use(['meteor', 'ecmascript', 'react@0.14.3', 'check', 'accounts-password']);

  //other packages in use
  api.use(['socialize:messaging@0.4.4', 'djedi:sanitize-html@1.11.2', 'momentjs:moment@2.11.2']);

  api.imply(['socialize:messaging', 'djedi:sanitize-html', 'momentjs:moment'])

  api.addFiles(['components/Conversation.jsx', 'components/UserOverview.jsx', 'components/NewConversation.jsx', 'components/NewMessage.jsx'], "client");

  //temporary user search till Meteor 1.3
  api.addFiles(['server/searchForUser.js'], 'server')

  api.addFiles('searchSuggestions.css');

  api.export(['UserConversation', 'UserConversationOverview', 'UserNewConversation', 'UserNewMessage'], "client");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('storyteller:messaging-react-materialize');
  //api.addFiles('messaging-react-materialize.js');
});

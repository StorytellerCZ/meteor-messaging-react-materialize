Package.describe({
  name: 'storyteller:messaging-react-materialize',
  version: '0.3.4',
  summary: 'Messaging between users',
  git: 'https://github.com/StorytellerCZ/meteor-messaging-react-materialize.git',
  documentation: 'README.md',
  deprecated: true
});

Package.onUse(function(api) {
  api.versionsFrom(['1.3', '2.3']);
  api.use([
    'meteor',
    'ecmascript',
    'check',
    'accounts-password'
  ]);

  //other packages in use
  api.use([
    'socialize:messaging@1.2.3',
    'djedi:sanitize-html-client@1.11.3',
    'momentjs:moment@2.29.1',
    'storyteller:messaging-server@1.2.0'
  ]);

  api.imply([
    'socialize:messaging',
    'djedi:sanitize-html-client',
    'momentjs:moment'
  ])

  api.addFiles([
    'components/Conversation.jsx',
    'components/UserOverview.jsx',
    'components/NewConversation.jsx',
    'components/NewMessage.jsx',
    'components/Participants.jsx'
  ], "client");

  api.addFiles('searchSuggestions.css');

  api.export([
    'UserConversation',
    'UserConversationOverview',
    'UserNewConversation',
    'UserNewMessage'
  ], "client");
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('storyteller:messaging-react-materialize');
  //api.addFiles('messaging-react-materialize.js');
});

Package.describe({
  name: 'storyteller:messaging-react-materialize',
  version: '0.3.1',
  summary: 'Messaging between users',
  git: 'https://github.com/StorytellerCZ/meteor-messaging-react-materialize.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'meteor',
    'ecmascript',
    'react@0.14.3',
    'check',
    'accounts-password'
  ]);

  //other packages in use
  api.use([
    'socialize:messaging@0.5.0',
    'djedi:sanitize-html-client@1.11.2',
    'momentjs:moment@2.12.0',
    'storyteller:messaging-server@0.1.3'
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

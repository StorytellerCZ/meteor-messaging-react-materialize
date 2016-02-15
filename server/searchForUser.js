Meteor.publish("searchForUsers", function(query, excluded){
  check(query, String)
  check(excluded, Array)
  return Meteor.users.find({username: {$regex: query, $options: 'i'}, _id: {$nin: excluded}}, {fields: {username: 1, roles: 1},limit: 10})
});

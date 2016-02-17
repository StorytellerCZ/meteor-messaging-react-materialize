/**
 * Searches for users
 */
Meteor.publish("searchForUsers", function(query, excluded){
  check(query, String)
  check(excluded, Array)
  return Meteor.users.find({username: {$regex: query, $options: 'i'}, _id: {$nin: excluded}}, {fields: {username: 1, roles: 1},limit: 10})
})

/**
 * Gets the specified conversation
 * NOTE: Is not full conversation with all the function
 */
Meteor.publish("conversation", function(conversationId){
  check(conversationId, String)

  if(!this.userId){
    return this.ready()
  }

  return Meteor.conversations.find({_id: conversationId, deleted: {$exists:false}}, {limit: 1})
})

/**
 * Count all messages in the given conversation
 */
Meteor.methods({
  countMessages:function(conversationId){
    check(conversationId, String)

    return Meteor.messages.find({conversationId: conversationId}).count()
  }
});

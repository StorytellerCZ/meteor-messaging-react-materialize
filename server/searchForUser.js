Meteor.methods({
  searchForUser:function(query){
     check(query, String)
     return Meteor.users.find({username: {search: query}}, {limit: 10}).fetch()
  }
});

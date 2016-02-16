UserConversationOverview = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    const handle = Meteor.subscribe("conversations")

    let currentUser = Meteor.users.findOne({_id: Meteor.userId()})

    return {
      dataLoaded: handle.ready() && Meteor.userId(),
      currentUser: currentUser,
      conversations: Meteor.conversations.find().fetch()
    }
  },
  getConversations(){
    let conversations = this.data.conversations
    if(conversations.length > 0){
      return conversations.map((conversation)=>{
        let usersArray = new Array()
        conversation.participants().forEach((participant)=>{
          usersArray.push(participant.user().username)
        })

        let users = usersArray[0]
        for (let i = 1; i < usersArray.length; i++) {
          users = users + ", " + usersArray[i]
        }

        return <li className="collection-item avatar">
          <a href={FlowRouter.path("pm-conversation", {conversationId: conversation._id})} >
          <i className="material-icons circle">mail</i>
          <span className="title">{users}</span>
          <p className="flow-text truncate">{conversation.lastMessage().user().username}: {conversation.lastMessage().body}</p>
          </a>
        </li>
      })
    } else {
      return this.noData()
    }

  },
  noData(){
    return <li className="collection-item avatar">You are currently not conversing with anyone.</li>
  },
  getContent(){
    return <div>
      <section className="row valign-wrapper">
        <h1 className="col m11 l11"><a href={FlowRouter.path("/")}><i className="material-icons">arrow_back</i></a> Messages</h1>
        <div className="col m1 l1">
          <a href="#newConversation" className="valign btn-floating btn-large waves-effect waves-light red newPmTrigger"><i className="large material-icons">add</i></a>
        </div>
      </section>
      <ul className="collection">
        {this.getConversations()}
      </ul>
      <UserNewConversation />
    </div>
  },
  render(){
    if(this.data.dataLoaded){
      return this.getContent()
    }
    return <div><Loader /></div>
  }
})

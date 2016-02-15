UserConversationOverview = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    const handle = Meteor.subscribe("conversations")

    let currentUser = Meteor.users.findOne({_id: Meteor.userId()})

    return {
      dataLoaded: handle.ready() && Meteor.userId(),
      currentUser: currentUser,
      conversations: currentUser.conversations()
    }
  },
  getConversations(){
    let conversations = this.data.conversations
    if(conversations.length > 0){
      return conversations.map((conversation)=>{
        let participants = conversation.participants.forEach((participant)=>{
          participant.user().username
        })

        return <li className="collection-item avatar">
          <a href={FlowRouter.path("", {conversationId: conversation._id})} >
          <i className="material-icons circle">mail</i>
          <span className="title">{}</span>
          <p className="flow-text truncate">{conversation.lastMessage.user.username}: {conversation.lastMessage.body}</p>
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

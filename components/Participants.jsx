/**
 * @class component ConversationParticipants
 * @classdesc Lists conversation participants
 * TODO Show status ("typing", etc.) by each user
 */
ConversationParticipants = React.createClass({
  propTypes: {
    conversationId: React.PropTypes.string
  },
  mixins: [ReactMeteorData],
  getMeteorData(){
    if(this.props.conversationId){
      const handle = Meteor.subscribe("conversation", this.props.conversationId)

      let conv = Meteor.conversations.findOne({_id: this.props.conversationId})

      return {
        dataLoaded: handle.ready(),
        conversation: conv
      }
    }
  },
  getContent(){
    return this.data.conversation.participants().map((participant)=>{
      // get username and avatar
      return <li className="collection-item avatar" key={participant}>
        <a href={FlowRouter.path("profile", {username: participant.user().username})}>
          <i className="material-icons circle">person</i>
          <span className="title">{participant.user().username}</span>
        </a>
      </li>
    })
  },
  render(){
    if(this.data.dataLoaded){
      return <ul className="collection">{this.getContent()}</ul>
    }
    return <div><Loader /></div>
  }
})

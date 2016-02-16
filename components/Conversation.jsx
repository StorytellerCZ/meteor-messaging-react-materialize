UserConversation = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    if(this.props.conversationId){
      const handle = Meteor.subscribe("messagesFor", this.props.conversationId)

      let conversation = Meteor.conversations.findOne({_id: this.props.conversationId})

      //confirm that user can view the conversation
      let access = false

      conversation.participants().forEach((p) => {
        if(p.user()._id === Meteor.userId()){
          access = true
        }
      })

      if(access){
        return {
          dataLoaded: handle.ready(),
          messages: conversation
        }
      } else {
        //unsubscribe
        handle.stop()
      }
    } else {
      FlowRouter.go("/pm")
    }
  },
  componentDidMount(){
    Meteor.subscribe("viewingConversation", this.props.conversationId);
  },
  isTyping(){
    Meteor.subscribe("typing", this.props.conversationId);
  },
  isNotTyping(){

  },
  componentWillUnmount(){

  },
  getContent(){
    return <div>

    </div>
  },
  render(){
    if(this.data.dataLoaded){
      return this.getContent()
    }
    return <div><Loader /></div>
  }
})

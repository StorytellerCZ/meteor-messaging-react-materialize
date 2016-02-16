UserConversation = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    if(this.props.conversationId){
      const handleConv = Meteor.subscribe("messagesFor", this.props.conversationId, {limit: 20, skip: 0})
      const handleMsg = Meteor.subscribe("conversation", this.props.conversationId);

      if(handleConv.ready() && handleMsg.ready()){
        //let conversation = Meteor.conversations.findOne({_id: this.props.conversationId})
        let msg = Meteor.messages.find({conversationId: this.props.conversationId}).fetch()
        let conv = Meteor.conversations.findOne({_id: this.props.conversationId})

        //confirm that user can view the conversation
        let access = false

        conv._participants.forEach((p) => {
          if(p === Meteor.userId()){
            access = true
          }
        })

        if(access){
          return {
            dataLoaded: handleMsg.ready() && handleConv.ready(),
            messages: msg,
            conversation: conv
          }
        } else {
          console.log("Access denied!")
          Materialize.toast("Access denied!", 3000)
          //unsubscribe
          handleConv.stop()
          handleMsg.stop()
          //redirect back
          FlowRouter.go("/pm")
        }
      }
      return {
        dataLoaded: false
      }
    } else {
      FlowRouter.go("/pm")
    }
  },
  componentDidMount(){
    const viewing = Meteor.subscribe("viewingConversation", this.props.conversationId)
    this.setState({
      viewing: viewing
    })
  },
  isTyping(){
    const typing = Meteor.subscribe("typing", this.props.conversationId)
    if(typing.ready()){
      this.setState({
        typing: typing
      })
    }
  },
  isNotTyping(){
    this.state.typing.stop()
  },
  componentWillUnmount(){
    this.state.viewing.stop()
  },
  getMessages(){
    let messages = this.data.messages
    return messages.map((msg)=>{
      console.log(msg)
      let user = msg.user()

      return <div key={msg._id} className="row">
        <div className="col s10"><p><strong>{user.username}:</strong> {msg.body}</p></div>
        <div className="col s2">{msg.date}</div>
      </div>
    })
  },
  sendMessage(e){
    e.preventDefault()
    //get message
    let msg = $('#messageToSend').val()

    //send the message
    let send = this.data.conversation.sendMessage(msg)
    console.log(send)

    //reset the text field
    $('#messageToSend').val("")
  },
  getContent(){
    console.log(this.data.messages)
    return (<div>
      <h1>Conversation with </h1>
      {this.getMessages()}
      <form method="post" onSubmit={this.sendMessage}>
        <fieldset>
          <legend>Send message</legend>
          <div className="input-field">
            <i className="material-icons prefix">mode_edit</i>
            <textarea name="message" id="messageToSend" className="materialize-textarea" onFocus={this.isTyping} onBlur={this.isNotTyping}></textarea>
            <label htmlFor="messageToSend">Message</label>
          </div>
          <input type="submit" value="send" className="btn pull-right waves-light waves-light" />
        </fieldset>
      </form>
    </div>)
  },
  render(){
    if(this.data.dataLoaded){
      return this.getContent()
    }
    return <div><Loader /></div>
  }
})

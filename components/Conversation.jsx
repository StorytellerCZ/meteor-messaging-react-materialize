// TODO: separate into 3 components: conversationWindow, conversationReply, conversationParticipants
UserConversation = React.createClass({
  mixins: [ReactMeteorData],
  getInitialState(){
    return {
      viewing: null,
      typing: null,
      msgLimit: 10,
      msgTotal: 1
    }
  },
  getMeteorData(){
    if(this.props.conversationId){
      const handleConv = Meteor.subscribe("messagesFor", this.props.conversationId, {limit: this.state.msgLimit, skip: 0})
      const handleMsg = Meteor.subscribe("conversation", this.props.conversationId);

      if(handleConv.ready() && handleMsg.ready()){
        let msg = Meteor.messages.find({conversationId: this.props.conversationId}, {sort: {date: 1}}).fetch()
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
    this.setState({
      viewing: Meteor.subscribe("viewingConversation", this.props.conversationId)
    })

    //get the total number of documents from server
    Meteor.call("countMessages", this.props.conversationId, (error, result)=>{
      if(error){
        console.log(error)
      }
      if(result){
        this.setState({
          msgTotal: result
        })
      }
    })
  },
  isTyping(){
    this.setState({
      typing: Meteor.subscribe("typing", this.props.conversationId)
    })
  },
  isNotTyping(){
    this.state.typing.stop()
  },
  componentWillUnmount(){
    this.state.viewing.stop()
  },
  showOlder(){
    this.setState({
      msgLimit: this.state.msgLimit + 10
    })
  },
  getMessages(){
    let messages = this.data.messages
    return messages.map((msg)=>{
      let user = msg.user()

      return <div key={msg._id} className="row">
        <div className="col s10"><strong>{user.username}:</strong> {msg.body}</div>
        <div className="col s2">{moment(msg.date).fromNow()}</div>
      </div>
    })
  },
  sendMessage(e){
    e.preventDefault()
    //get message
    let msg = $('#messageToSend').val()

    //sanitize
    msg = sanitizeHtml(msg)

    //send the message
    let send = this.data.conversation.sendMessage(msg)

    //increase the limit so the current conversation stays on the screen
    this.setState({
      msgLimit: this.state.msgLimit + 1
    })

    //reset the text field
    $('#messageToSend').val("")

    //update the total message count
    //TODO: figure a better way that is not too taxing on the servers to count messages whenever any user adds a message
    //currently this is not very accurate if the user doesn't post much and the other post a lot
    Meteor.call("countMessages", this.props.conversationId, (error, result)=>{
      if(error){
        console.log(error)
      }
      if(result){
        this.setState({
          msgTotal: result
        })
      }
    })
  },
  getContent(){
    let showOlder

    if(this.state.msgTotal > this.state.msgLimit){
      showOlder = <a className="center-align" href="#!" onClick={this.showOlder}>Show older messages.</a>
    }

    return (<div>
      <div className="row">
        <div className="col s12 m10 l10">
          <div className="card-panel chatWindow">
            {showOlder}
            {this.getMessages()}
          </div>
        </div>
        <div className="chatParticipants col hide-on-small-only m2 l2">
          <div className="card-panel"></div>
        </div>
      </div>

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

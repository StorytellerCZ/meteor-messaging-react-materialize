/**
 * @class component UserNewConversation
 * @classdesc Start a new conversation
 * TODO in Meteor 1.3 integrate https://github.com/moroshko/react-autosuggest
 */
UserNewConversation = React.createClass({
  componentDidMount(){
    $('.newPmTrigger').leanModal()
    Session.set("conversationModal", "#newConversation")
  },
  componentDidUpdate(){
    /**
     * TODO make work
     * If the modal is closed reset the state for future use
     * Also works when user is going back to selection of type of conversation
     */
    if(!Session.get("conversationModal")){
      this.setState({
        type: "choosing"
      })
    }
  },
  getInitialState(){
    let users = this.props.users

    if(users === undefined){
      users = []
    }

    let type = "choosing"
    if(this.props.type){
      type = this.props.type
    }

    return {
      type: type,
      users: users
    }
  },
  selected(type){
    this.setState({
      type: type
    })
  },
  getContent(){
    if(this.state.type === "pm" || this.state.type === "room"){
      return <div>
          <UserNewMessage type={this.state.type} users={this.props.users} />
        </div>
    } else {
      return <div><h4>What type of conversation do you want to start?</h4>
        <section className="row">
          <div className="col s6 m4 l3 center-align">
            <div className="card hoverable blue darken-3 waves-effect waves-block waves-light">
              <a href="#!" onClick={this.selected.bind(null, "pm")}>
                <div className="card-image">
                  <i className="material-icons white-text">chat_bubble_outline</i>
                </div>
                <div className="card-content">
                  <p className="flow-text white-text">Private message</p>
                </div>
              </a>
            </div>
          </div>

          <div className="col s6 m4 l3 center-align">
            <div className="card hoverable blue darken-3 waves-effect waves-block waves-light">
              <a href="#!" onClick={this.selected.bind(null, "room")}>
                <div className="card-image">
                  <i className="material-icons white-text">speaker_notes</i>
                </div>
                <div className="card-content">
                  <p className="flow-text white-text">Group chat</p>
                </div>
              </a>
            </div>
          </div>
        </section>
        </div>
    }
  },
  render(){
    return <div id="newConversation" className="modal">
      <div className="modal-content">
        {this.getContent()}
      </div>
    </div>
  }
})

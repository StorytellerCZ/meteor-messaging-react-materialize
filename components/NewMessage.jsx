//TODO in Meteor 1.3 integrate https://github.com/moroshko/react-autosuggest
UserNewMessage = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData(){
    return {
      currentUser: Meteor.users.findOne({_id: Meteor.userId()})
    }
  },
  componentDidMount(){
    this.hideSuggestions()
  },
  getInitialState(){
    let users = this.props.users

    if(users === undefined){
      users = []
    }

    let type = "pm"
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
  /**
   * Searches for a user
   */
  lookupUser(event){
    let query = event.target.value
    //check(query, String)

    //first wait for at least three characters to by typed before doing anything
    if(query.length > 2){
      //exlude users that have already been added + current user
      let excluded = [Meteor.userId()]
      this.state.users.forEach((user)=>{
        excluded.push(user._id)
      })

      //search through users collection
      Meteor.subscribe("searchForUsers", query, excluded, ()=>{
        //onReady
        this.setState({
          search: Meteor.users.find({username: {$regex: query, $options: 'i'}, _id: {$nin: excluded}}, {limit: 10}).fetch()
        })
        this.showSuggestions()
      })
    }
  },
  showSuggestions(){
    $("#searchSuggestions").show()
  },
  populateSuggestions(){
    if(this.state.search){
      return this.state.search.map((user)=>{
        return <a href="#!" key={"SUG"+user._id} className="suggestion-item avatar" onClick={this.addUser.bind(null, user)}>
          <i className="material-icons circle">account_circle</i>
          <span className="title">{user.username}</span>
        </a>
      })
    } else {
      //TODO fix that this displays
      console.log("No users found.")
      return <div className="suggestion-item"><span className="title">No results.</span></div>
    }

  },
  hideSuggestions(){
    $("#searchSuggestions").hide()
  },
  /**
   * Adds a user to the list of recipients
   * @var user User Object
   */
  addUser(user){
    //clear the searchbox
    let test = $("#searchUsernames").val("")

    users = this.state.users
    users.push(user)

    this.setState({
      users: users
    })

    //hide suggestions
    this.hideSuggestions()
  },
  /**
   * Removes a user from recipients
   */
  removeUser(user){
    let users = this.state.users

    let i = users.indexOf(user)

    users.splice(i, 1)

    this.setState({
      users: users
    })
  },
  /**
   * Creates a list of users that have already been added to the conversation
   */
  usersListing(){
    //create a listing of users
    if(this.state.users.length > 0){
      return this.state.users.map((user)=>{
        //NOTE: can't add the close tag since Materialize fires the event to remove the element before the function is called
        return <a href="#!" onClick={this.removeUser.bind(null, user)} key={user._id} className="chip">
                {user.username}
              </a>
      })
    }
  },
  /**
   * Sends the initial message
   */
  sendMessage(e){
    e.preventDefault()
    let msg = e.target.msg.value
    let users = this.state.users
    check(msg, String)
    check(users, Array)

    //create conversation
    let converstation = new Conversation().save()
    console.log(converstation)

    //add participants
    users.forEach((user) => {
      converstation.addParticipant(user)
    })

    //TODO sanitize

    //send the message
    converstation.sendMessage(msg)

    Materialize.toast("Converstaion created!", 3000)

    //close modal or redirect to the conversation
    let modal = Session.get("conversationModal")
    if(modal){
      Session.set("conversationModal", false)
      $(modal).closeModal()
    } else {
      //FlowRouter.go("conversation", {conversationId: conversation._id})
    }
  },
  goBack(){
    let modal = Session.get("conversationModal")
    if(modal){
      Session.set("conversationModal", false)
    } else {
      //FlowRouter.go("conversationOverview")
    }
  },
  getContent(){
    if(this.state.type === "pm" || this.state.type === "room"){
      let targetLabel

      //the search element
      let search = <div className="input-field">
        <i className="material-icons prefix">search</i>
        <input id="searchUsernames" name="searchUsernames" type="text" className="validate" onInput={this.lookupUser} />
        <label className="active" htmlFor="searchUsernames">{targetLabel}</label>
        <div id="searchSuggestions" className="search-suggestions-box">
          {this.populateSuggestions()}
        </div>
      </div>

      if(this.state.type === "pm"){
        targetLabel = "Username"
        if(this.state.users.length > 0){
          //don't display search after a user has been added for private message
          search = null
        }
      }
      if(this.state.type === "room"){
        targetLabel = "Usernames"
      }

      return <div>
          <form method="post" onSubmit={this.sendMessage}>
            {search}
            <div className="">
              To: {this.usersListing()}
            </div>
            <div className="input-field">
              <i className="material-icons prefix">mode_edit</i>
              <textarea name="msg" className="materialize-textarea validate" />
              <label htmlFor="msg">Message</label>
            </div>
            <div className="input-field">
              <a href="#!" className="btn waves-effect waves-light" onClick={this.goBack}>Back</a>
              <input type="submit" className="btn waves-effect waves-light right" value="Send" />
            </div>
          </form>
        </div>
    } else {
      return <div>Error</div>
    }
  },
  render(){
    if(this.data.currentUser){
      return this.getContent()
    }
    return <div><Loader /></div>
  }
})

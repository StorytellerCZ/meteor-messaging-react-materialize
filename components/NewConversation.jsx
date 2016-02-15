//TODO in Meteor 1.3 integrate https://github.com/moroshko/react-autosuggest
UserNewConversation = React.createClass({/*
  mixins: [ReactMeteorData],
  getMeteorData(){
    return {

    }
  },*/
  componentDidMount(){
    $('.newPmTrigger').leanModal()
    this.hideSuggestions()
  },
  getInitialState(){
    let users = this.props.users

    if(users === undefined){
      users = new Array()
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
  /**
   * Searches for a user
   */
  lookupUser(event){
    let query = event.target.value
    //check(query, String)

    //first wait for at least three characters to by typed before doing anything
    if(query.length > 2){
      //search through users collection
      console.log(query)
      let users = Meteor.call("searchForUser", query, function(error, result){
        if(error){
          console.log(error)
          Materialize.toast(error.reason, 5000)
        }
        //return the top 10 results
        if(results){
          console.log(results)
          this.setState({
            search: results
          })


        }
      })
      //show suggestions
      this.showSuggestions()
    }
  },
  showSuggestions(){
    $("#searchSuggestions").show()
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
    console.log(test);
    console.log(user);

    //hide suggestions
    this.hideSuggestions()

    this.setState({
      users: this.state.users.push(user)
    })
  },
  removeUser(user){

  },
  sendMessage(e){
    e.preventDefault()
    let form = e.target

    let usernames = form.usernames.value
    let msg = form.msg.value
  },
  getContent(){
    if(this.state.type === "pm" || this.state.type === "room"){
      let targetLabel, usersListing

      //create a listing of users
      if(this.state.users.length > 0){
        usersListing = this.state.users.map((user)=>{
          return <div className="chip">
                  <i className="material-icons">user</i>
                  {user.username}
                  <a href="#!" onClick={this.removeUser.bind(null, user)}><i className="material-icons">close</i></a>
                </div>
        })
      }


      //the search element
      let search = <div className="input-field">
        <i className="material-icons prefix">search</i>
        <input id="searchUsernames" name="searchUsernames" type="text" className="validate" onFocus={this.showSuggestions} onBlur={this.hideSuggestions} onInput={this.lookupUser} />
        <label className="active" htmlFor="searchUsernames">{targetLabel}</label>
        <div id="searchSuggestions" className="search-suggestions-box">
          <a href="#!" className="suggestion-item avatar" onClick={this.addUser.bind("test")}>
            <i className="material-icons circle">folder</i>
            <span className="title">Username</span>
          </a>
          <a href="#!" className="suggestion-item avatar" onClick={this.addUser.bind("test")}>
            <i className="material-icons circle">folder</i>
            <span className="title">Username</span>
          </a>
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
              To: {usersListing}
            </div>
            <div className="input-field">
              <i className="material-icons prefix">mode_edit</i>
              <textarea name="msg" className="materialize-textarea validate" />
              <label htmlFor="msg">Message</label>
            </div>
            <div className="input-field">
              <input type="submit" className="btn waves-effect waves-light" value="Send" />
            </div>
          </form>
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
    //if(this.data.currentUser){
    return <div id="newConversation" className="modal">
      <div className="modal-content">
        {this.getContent()}
      </div>
    </div>

    //}
    //return <div><Loader /></div>
  }
})

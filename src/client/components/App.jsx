import React from 'react';
import Search from './Search.jsx';
import Entries from './Entries.jsx';
import $ from 'jQuery';

class App extends React.Component {
  constructor(props) {
  	super(props);

  	this.state = {
  		search: 'puppy',
  		data: [],
  		playlist: []
  	}

  	this.handleSearchInput = this.handleSearchInput.bind(this);
  	this.handleSubmit = this.handleSubmit.bind(this);
  	this.handleAdd = this.handleAdd.bind(this);
  	this.handlePlayVideo = this.handlePlayVideo.bind(this);
  }

  componentDidMount() {
  	const { playlist } = this.state;
  	const cachedHits = sessionStorage.getItem('playlist');
  	
  	if (cachedHits) {
  		this.setState({
  			playlist: JSON.parse(cachedHits)
  		})
  		console.log()
  	}
  	this.handleSubmit();
  }

  handleSearchInput(e) {
    this.setState({
    	search: e.target.value
    })
  }

  handleSubmit() {
    const { search, playlist } = this.state;

    $.ajax({
    	url: `api/video/${search}`,
    	method: 'GET',
    	success: (data) => {
    		this.setState({
    			data: data.items
    		})
    	},
    	error: (err) => console.error(err)
    })
  }

  handleAdd(entry) {
    const { playlist } = this.state;

  	if (!playlist.includes(entry)) {
  		playlist.push(entry);
	    this.setState({
	    	playlist: playlist,
	    })
	  }
	  sessionStorage.setItem('playlist', JSON.stringify(playlist));
  }

  handlePlayVideo(url) {
  	$.ajax({
    	url: `play/${url}`,
    	method: 'GET',
    	success: () => {},
    	error: (err) => console.error(err)
    })
  }

  handleCreatePlaylist() {
    const { playlist } = this.state;

    $.ajax({
    	url: 'api/playlist/',
    	method: 'POST',
    	data: { 
    		playlist: playlist, 
    	},
    	success: () => console.log('posted'),
    	error: (err) => console.error(err)
    })
  }

  render() {
    const { data } = this.state;

  	return (
  	  <div>
  	    <div className="playlist">
		  	  <h1>Make a Playlist</h1>
          <form action="/playvideos" className="createPL">
            <input type="submit" value="Watch Playlist" />
          </form>
          <form action="" className="createPL">
		  	    <input type="button" value="Create Playlist"  onClick={() => this.handleCreatePlaylist()}/>
          </form>
	  	  </div>
  	    <Search search={this.handleSearchInput} submit={this.handleSubmit} />
  	    <Entries data={data} add={this.handleAdd} play={this.handlePlayVideo}/>
  	  </div>
  	)
  }
}

export default App;
import React from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import update from 'immutability-helper';
import Constants from '../Models/constants';
import Playlist from '../Views/playlistView';

const REST_API = Constants.REST_API;
const REST_API2 = Constants.REST_API2;
const REST_API2HELPER = Constants.REST_API2HELPER;
const leastAmountOfSongsToShow = Constants.leastAmountOfSongsToShow;


const App = () => (
  <div className="app">
    <AppController />
  </div>
);

class AppController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: [],
      data: [],
      songs: [],
      allSongs: [],
      currentVideo: '',
      search: '',
      title: '',
      playlistState: 'All',
      player: null,
      opts: {
        width: '928',
        height: '600',
        playerVars: {
          autoplay: 0,
        },
      },
    };
  }
  componentWillMount() {}
  componentDidMount() {
    this.loadPlaylist();
  }
  componentWillReceiveProps() {}
  shouldComponentUpdate() {
    return true;
  }
  componentWillUpdate() {}
  componentDidUpdate() {}
  componentWillUnmount() {}

  onReady(event) {
    this.setState({
      player: event.target,
    });
  }

  changeYoutube(event) {
    const player = this.state.player;
    player.playVideo();
    this.setState({ currentVideo: event.target.getAttribute('value') });
    window.scrollTo(0, 0);
  }

  changePlaylist(event) {
    this.setState({ playlistState: event.target.value, search: '' });
  }

  SearchState(event) {
    const newState = update(
    this.state.search,
    { $set: event.target.value },
       );
    this.setState({ playlistState: 'All', search: newState });
  }

  loadSongs(firstSong = '0') {
    const playlistLength = (this.state.response.length);
    if (firstSong !== playlistLength) {
      axios.get(REST_API2
        + this.state.response[firstSong].id
        + REST_API2HELPER).then((response) => {
          const songs = [];
          const playlistTitle = (this.state.response[firstSong].snippet.channelTitle);
          response.data.items.forEach((item) => {
            if (item.snippet.title === 'Private video' || item.snippet.title === 'Deleted video') {
            } else {
              this.setState({ currentVideo: item.snippet.resourceId.videoId });
              songs.push({
                publishedAt: item.snippet.publishedAt,
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
                playlist: playlistTitle });
            }
          });
          const allSongs = update(
                  this.state.allSongs,
                  { $push: songs },
              );
          const newState = update(
                  this.state.songs,
                  { $push: [songs] },
              );
          this.setState({ songs: newState, allSongs });
          firstSong++;
          this.loadSongs(firstSong);
        });
    } else {
      this.filterCleanPlaylists();
    }
  }
  filterCleanPlaylists() {
    const zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]);
    const combinedList = zip(this.state.response, this.state.songs);
    const removeEmptyPlayLists = combinedList.filter(item =>
       item[1].length > leastAmountOfSongsToShow);

    const data = removeEmptyPlayLists;
    this.setState({
      data,
      response: null,
    });
  }

  loadPlaylist(pageToken = '') {
    axios.get(REST_API + pageToken).then((response) => {
      this.setState({ title: response.data.items[0].snippet.channelTitle });

      const next = response.data.nextPageToken;
      const newState = update(
        this.state.response,
        { $push: response.data.items },
      );
      this.setState({ response: newState });
      if (next !== undefined) {
        this.loadPlaylist(next);
      } else {
        this.loadSongs();
      }
    });
  }

  render() {
    return (
      <div className="mainContainer">
        <center>
          <div className="playlistTitle"><p>{this.state.title}</p> </div>
          <YouTube
            videoId={this.state.currentVideo}
            id={this.state.currentVideo}
            opts={this.state.opts} onReady={this.onReady.bind(this)}
          />
          <p>Search: <input
            type="text"
            value={this.state.search}
            onChange={this.SearchState.bind(this)}
          />
            <label>
              <input type="radio" value={'All'} checked={this.state.playlistState === 'All'} onChange={this.changePlaylist.bind(this)} />{' All Videos '}
            </label>
            <label>
              <input type="radio" value={'Playlists'} checked={this.state.playlistState === 'Playlists'} onChange={this.changePlaylist.bind(this)} />{' Playlists '}
            </label>
            <label>
              <input type="radio" value={'Day'} checked={this.state.playlistState === 'Day'} onChange={this.changePlaylist.bind(this)} />{' By Day '}
            </label>
          </p>
        </center>
        <Playlist.Playlists data={this.state} buttonClick={this.changeYoutube.bind(this)} />
      </div>
    );
  }
}

export default App;

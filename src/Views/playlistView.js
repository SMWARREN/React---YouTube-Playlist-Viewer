import React from 'react';
import LazyLoad from 'react-lazy-load';
import Constants from '../Models/constants';
import sort from '../Controllers/sort';
import PlaylistsController from '../Controllers/PlaylistsController';

const youtubeHelper = Constants.youtubeHelper;
const youtubeHelper2 = Constants.youtubeHelper2;

function ListPlaylistWithTitle(props) {
  return (
    <div>
      { props.data.map(function (name, index) {
        if (index === 0) {
          return <center className="playlistTitle" key={name}><p> {name.title} </p></center>;
        }
        return (
          <span className="videoContainer" key={name + index}>
            <LazyLoad throttle={50} debounce={false} height="125px">
              <img
                className="imageProps" alt={index}
                value={name.id}
                onClick={props.clickProp.buttonClick}
                src={youtubeHelper + name.id + youtubeHelper2}
                width="222px" height="125px"
              />
            </LazyLoad>
            {name.title}
          </span>);
      },
    )}
    </div>
  );
}


function PlaylistContainer(props) {
  const data = sort.sortPlaylist(props.data, props.data2, props.data2.data);
  return (
    <div className="playlistContainer">
      {
      data.map(function (name, index) {
        return <div key={name + index}>
          <ListPlaylistWithTitle
            data={name}
            clickProp={props.data2} />
        </div>;
      })}
    </div>
  );
}

function Playlists(props) {
  const listOfPlaylists = PlaylistsController.Controller(props);
  if (listOfPlaylists.length > 3) {
    return <PlaylistContainer data={listOfPlaylists} data2={props} />;
  }
  return <div><center>Loading All of The Data</center></div>;
}

export default {
  Playlists,
  PlaylistContainer,
  ListPlaylistWithTitle,
};

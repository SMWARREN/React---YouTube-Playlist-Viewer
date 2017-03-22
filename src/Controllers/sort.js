import object from '../Models/model';

function sortPlaylist(data, data2, state) {
  let songsArray = [];
  let dateHolder = '';
  const playListArray = [];

  data.forEach(function (playlists) {
    playlists.forEach( function(item) {
      const youtubeObject = object.PVSongObject(item.publishedAt,
         item.id,
         item.description,
        item.title);
      songsArray.push(youtubeObject);
    });
  });
  const songsPlaylist = songsArray.filter(item => item.publishedAt);
  songsArray = [];

  songsPlaylist.forEach(function (item) {
    const date = new Date(item.publishedAt);
    if (date.toDateString() === dateHolder) {
      const youtubeObject = object.PVSongObject(item.publishedAt,
         item.id,
         item.description,
          item.title);
          songsArray.push(youtubeObject);
        }
    else {
      if (playListArray.length === 0) {
        dateHolder = date.toDateString();
        songsArray.push({ title: dateHolder, publishedAt: date, id: 'playlist' });
      }
      playListArray.push(songsArray);
      songsArray = [];

      if (songsArray.length === 0) {
        dateHolder = date.toDateString();
        songsArray.push({ title: dateHolder, publishedAt: date, id: 'playlist' });
      }
      const youtubeObject = object.PVSongObject(item.publishedAt,
         item.id,
         item.description,
          item.title);
          songsArray.push(youtubeObject);
    }
  });

  playListArray.sort(function (a,b) {
    return new Date(b[0].publishedAt) - new Date(a[0].publishedAt);
  });
  let change = [{ title: 'All Videos' }, ...data2.data.allSongs];
  change.sort(function (a,b) {
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });
  if (state.search !== '') {
    const searchArray = []
    change = [...data2.data.allSongs];

    change.forEach(function (item) {
      if (item.title.includes(state.search)) {
        const youtubeObject = object.PVSongObject(item.publishedAt,
            item.id,
            item.description,
            item.title);
            searchArray.push(youtubeObject);
          }
    });
    change = [{ title: 'All Videos' }, ...searchArray];
  }
  if (state.playlistState === 'All') {
    return [change];
  }
  if (state.playlistState === 'Playlists') {
    return data;
  }
  if (state.playlistState === 'Day') {
    return playListArray;
  }
}

export default { sortPlaylist };

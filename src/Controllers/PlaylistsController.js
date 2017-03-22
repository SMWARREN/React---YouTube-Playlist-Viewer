import object from '../Models/model';

function Controller(data) {
  let playLists = [];
  const listOfPlaylists = [];
  const propsData = data.data;
  let currentName = '';
  propsData.data.forEach(function(item) {
    const tmp = currentName;
    currentName = item[0].snippet.title;

    if (tmp === currentName) {
      const child = item[1];
      child.forEach(function(item) {
        const youtubeObject = object.PVSongObject(item.publishedAt,
           item.id,
           item.description,
           item.title);
        playLists.push(youtubeObject);
      });
    }
    else {
      if (playLists.length > 0) {
        listOfPlaylists.push(playLists);
        playLists = [];
      }
      currentName = item[0].snippet.title;
      const sub = item[1];
      playLists.push({ title: currentName + ' - Playlist', id: item[1][0].id, publishedAt: item[0].snippet.publishedAt });
      sub.forEach(function(subItem) {
        const youtubeObject = object.PVSongObject(subItem.publishedAt,
           subItem.id,
           subItem.description,
            subItem.title);
        playLists.push(youtubeObject);
      });
    }
  });
  return listOfPlaylists;
}

export default { Controller };

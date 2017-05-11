import object from '../Models/model';

function Controller(data) {
  let playLists = [];
  const listOfPlaylists = [];
  const propsData = data.data;
  let currentName = '';
  propsData.data.forEach((item) => {
    const tmp = currentName;
    currentName = item[0].snippet.title;

    if (tmp === currentName) {
      const child = item[1];
      child.forEach((item) => {
        const youtubeObject = object.PVSongObject(item.publishedAt,
           item.id,
           item.description,
           item.title);
        playLists.push(youtubeObject);
      });
    } else {
      if (playLists.length > 0) {
        listOfPlaylists.push(playLists);
        playLists = [];
      }
      currentName = item[0].snippet.title;
      const sub = item[1];
      sub.forEach((subItem) => {
        const youtubeObject = object.PVSongObject(subItem.publishedAt,
           subItem.id,
           subItem.description,
            subItem.title,
          currentName,
        );
        playLists.push(youtubeObject);
      });
    }
  });
  return listOfPlaylists;
}

export default { Controller };


function findMatches(wordToMatch, videos) {
  return videos.filter((item) => {
    const regex = new RegExp(wordToMatch, 'gi');
    return item.title.match(regex) || item.playlist.match(regex);
  });
}


function sortPlaylist(data, data2, state) {
  const suggestions = document.querySelector('.suggestions');
  suggestions.innerHTML = '';
  const sortedAll = data2.data.allSongs.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  let duplicate = '';
  let array = [];
  sortedAll.forEach((item) => {
    if (item.title === duplicate) {
    } else {
      array.push(item);
    }
    duplicate = item.title;
  });
  if (state.playlistState === 'All') {
    if (state.search !== '') {
      const search = [...array];
      array = findMatches(state.search, search);
      const len = `There are ${array.length} results.<p>`;

      const html = array.map((item, index) => {
        if (index < 4) {
          const regex = new RegExp(state.search, 'gi');
          const itemTitle = item.title.replace(regex, `<span class="hl">${state.search}</span>`);
          return `<li><span class="name">${itemTitle}</span></li>`;
        }
        return '';
      }).join('');
      suggestions.innerHTML = len + html;
    } else {
      suggestions.innerHTML = '';
    }

    return [array];
  }
  if (state.playlistState === 'Playlists') {
    return data;
  }
  if (state.playlistState === 'Day') {
    let dayArray = [];
    let date = '';
    const dayPlaylist = [];
    array.forEach((item, index) => {
      const current = new Date(item.publishedAt).toDateString();
      if (date !== current && index === 0) {
        const mItem = item;
        mItem.playlist = current;
        dayArray.push(mItem);
      }
      if (date === current) {
        const mItem = item;
        mItem.playlist = date;
        dayArray.push(mItem);
      }
      if (date !== current && index !== 0) {
        dayPlaylist.push(dayArray);
        dayArray = [];
      }
      date = new Date(item.publishedAt).toDateString();
    });
    return dayPlaylist;
  }
  return data;
}

export default { sortPlaylist };

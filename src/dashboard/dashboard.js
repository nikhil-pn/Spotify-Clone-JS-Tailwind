import { fetchRequest } from "../api";
import { ENDPOINT, logout, SECTIONTYPE } from "../common";
const displayName = document.querySelector("#display-name");

const defaultName = document.querySelector("#display-name");
const defaultImage = document.querySelector("#default-image");
const defaultButton = document.querySelector("#user-profile-button");
const defaultLogOutButton = document.querySelector("#default-logout-button");

const loadUserProfile = async () => {
  const { display_name: displayName, images } = await fetchRequest(
    ENDPOINT.userInfo
  );

  defaultName.textContent = displayName;

  if (images?.length) {
    defaultImage.classList.add("hidden");
  } else {
    defaultImage.classList.remove("hidden");
  }
};

const onPlaylistItemClicked = (event, id) => {
  const section = { type: SECTIONTYPE.PLAYLIST, playlist: id };
  history.pushState(section, "", `playlist/${id}`);
  loadSections(section);
};

const loadPlayList = async (endpoint, elementID) => {
  const playlists = await fetchRequest(endpoint);
  const playListItemsSection = document.querySelector(`#${elementID}`);
  let playlistItems = ``;
  for (let { name, description, images, id } of playlists.playlists.items) {
    const playListItem = document.createElement("section");

    playListItem.className =
      "bg-black-secondary rounded p-4 hover:cursor-pointer hover:bg-light-black";
    playListItem.id = id;
    playListItem.setAttribute("data-type", "playlist");
    playListItem.addEventListener("click", (e) => onPlaylistItemClicked(e, id));
    const [{ url: imageUrl }] = images;

    playListItem.innerHTML = `
      <img class="rounded mb-2 object-contain shadow" src='${imageUrl}'alt="${name}" />
      <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
      <h3 class="text-xs">${description}</h3>`;
    playListItemsSection.appendChild(playListItem);
  }
};

const loadPlayLists = () => {
  loadPlayList(ENDPOINT.featuredPlayList, "featured-playlist-items");
  loadPlayList(ENDPOINT.toplists, "top-playlist-items");
};

const fillContentForDashboard = () => {
  const pageContent = document.querySelector("#page-content");

  const playListMap = new Map([
    ["featured", "featured-playlist-items"],
    ["Top Playlist", "top-playlist-items"],
  ]);

  let innerHTML = "";
  for (let [type, id] of playListMap) {
    innerHTML += `
    <section class="p-4">
          <h1 class="text-2xl mb-4 font-bold capitalize ">${type}</h1>
          <section
            class="featured-songs grid grid-cols-auto-fill-cards gap-4"
            id="${id}"
          ></section>
        </section>
    `;
  }
  pageContent.innerHTML = innerHTML;
};

const formatTime = (duration) => {
  const min = Math.floor(duration / 60_000);
  const sec = ((duration % 60_00) / 1000).toFixed(0);
  const formattedTime =
    sec === 60 ? min + 1 + ":00" : min + ":" + (sec < 10 ? "0" : "") + sec;
  return formattedTime;
};

const loadPlaylistTracks = ({ tracks }) => {
  const trackSections = document.querySelector("#tracks");

  let trackNumber = 0;
  for (let trackItem of tracks.items) {
    let { id, artists, name, album, duration_ms: duration } = trackItem.track;
    let image = album.images[2];
    console.log(image, "image");
    let track = document.createElement("section");
    trackItem.id = id;
    track.className =
      "track items-center justify-items-start rounded-md hover:bg-light-black grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-gray-50";
    track.innerHTML = `
    <p class="justify-self-center" >${(trackNumber += 1)}</p>
              <section  class="grid grid-cols-[auto_1fr] place-items-center  gap-2">
                <img  class="h-10 w-10" src="${image.url}" alt="${name}">
                <article class="flex flex-col gap-2 justify-center">
                  <h2 class="text-primary text-base">${name}</h2>
                  <p class="text-xs text-secondary">${Array.from(
                    artists,
                    (artist) => artist.name
                  ).join(", ")}</p>
                </article>
              </section>
              <p class="text-sm">${album.name}</p>
              <p class="text-sm">${formatTime(duration)}</p>`;
    trackSections.appendChild(track);
  }
};

const fillContentForPlaylist = async (playlistID) => {
  const pageContent = document.querySelector("#page-content");
  pageContent.innerHTML = "playlists to be loaded";
  const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistID}`);
  pageContent.innerHTML = `
  <header class="mx-8 py-4 border-secondary border-b-[0.5px]" id="playlist-header">
  <nav class="py-2">
    <ul class=" grid grid-cols-[50px_1fr_1fr_50px] gap-4  text-secondary py-4">
      <li class="justify-self-center">#</li>
      <li>Title</li>
      <li>Album</li>
      <li>🕑</li>
    </ul>
  </nav>
  </header>
  <section id="tracks" class="px-8 text-secondary mt-4" >

  </section>`;

  document.createElement("section");
  loadPlaylistTracks(playlist);
};

const onContentScroll = (e) => {
  const { scrollTop } = e.target;
  const header = document.querySelector("#top-header");
  const coverElement = document.querySelector("#cover-content");
  const totalHeight = coverElement.offsetHeight;
  const fiftyPercentHeight = totalHeight / 2;
  const coverOpacity =
    100 - (scrollTop >= totalHeight ? 100 : (scrollTop / totalHeight) * 100);
  coverElement.style.opacity = `${coverOpacity}%`;

  let headerOpacity = 0;
  // once 50% of cover element is crossed, start increasing the opacity
  if (scrollTop >= fiftyPercentHeight && scrollTop <= totalHeight) {
    let totatDistance = totalHeight - fiftyPercentHeight;
    let coveredDistance = scrollTop - fiftyPercentHeight;
    headerOpacity = (coveredDistance / totatDistance) * 100;
  } else if (scrollTop > totalHeight) {
    headerOpacity = 100;
  } else if (scrollTop < fiftyPercentHeight) {
    headerOpacity = 0;
  }
  header.style.background = `rgba(0 0 0 / ${headerOpacity}%)`;

  if (history.state.type === SECTIONTYPE.PLAYLIST) {
    const playlistHeader = document.querySelector("#playlist-header");
    if (headerOpacity >= 60) {
      playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8");
      playlistHeader.classList.remove("mx-8");
      playlistHeader.style.top = `${header.offsetHeight}px`;
    } else {
      playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8");
      playlistHeader.classList.add("mx-8");
      playlistHeader.style.top = `revert`;
    }
  }
};

const loadSections = (section) => {
  if (section.type === SECTIONTYPE.DASHBOARD) {
    fillContentForDashboard();
    loadPlayLists();
  } else if (section.type === SECTIONTYPE.PLAYLIST) {
    //load the elements for the playlist
    fillContentForPlaylist(section.playlist);
  }
  document
    .querySelector("#content")
    .removeEventListener("scroll", onContentScroll);
  document
    .querySelector("#content")
    .addEventListener("scroll", onContentScroll);
};

document.addEventListener("DOMContentLoaded", async () => {
  defaultButton.addEventListener("click", () => {
    if (defaultLogOutButton.classList.contains("hidden")) {
      defaultLogOutButton.classList.remove("hidden");
    } else {
      defaultLogOutButton.classList.add("hidden");
    }
  });
  defaultLogOutButton.addEventListener("click", () => {
    logout();
  });

  // const section = { type: SECTIONTYPE.DASHBOARD };
  const section = {
    type: SECTIONTYPE.PLAYLIST,
    playlist: "37i9dQZF1DXaotNUt9NoYd",
  };
  // history.pushState(section, "", "");
  history.pushState(section, "", `/dashboard/playlist/${section.playlist}`);
  loadSections(section);

  window.addEventListener("popstate", (e) => {
    loadSections(e.state);
  });
});

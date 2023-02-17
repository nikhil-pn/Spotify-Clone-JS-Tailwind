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
      "track items-center justify-items-start rounded-md hover:bg-light-black grid grid-cols-[50px_2fr_1fr_50px] gap-4 text-gray-50";
    track.innerHTML = `
    <p class="justify-self-center" >${(trackNumber += 1)}</p>
              <section  class="grid grid-cols-[auto_1fr] place-items-center  gap-2">
                <img  class="h-8 w-8" src="${image.url}" alt="${name}">
                <article class="flex flex-col ">
                  <h2 class="text-primary text-xl">${name}</h2>
                  <p class="text-sm text-secondary">${Array.from(
                    artists,
                    (artist) => artist.name
                  ).join(", ")}</p>
                </article>
              </section>
              <p>${album.name}</p>
              <p>${formatTime(duration)}</p>`;
    trackSections.appendChild(track);
  }
};

const fillContentForPlaylist = async (playlistID) => {
  const pageContent = document.querySelector("#page-content");
  pageContent.innerHTML = "playlists to be loaded";
  const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistID}`);
  pageContent.innerHTML = `<header class="px-8">
  <nav>
    <ul class=" grid grid-cols-[50px_2fr_1fr_50px] gap-4 text-gray-50">
      <li class="justify-self-center">#</li>
      <li>Title</li>
      <li>Album</li>
      <li>🕑</li>
    </ul>
  </nav>
  </header>
  <section id="tracks" class="px-8" >

  </section>`;

  document.createElement("section");
  loadPlaylistTracks(playlist);
};

const loadSections = (section) => {
  if (section.type === SECTIONTYPE.DASHBOARD) {
    fillContentForDashboard();
    loadPlayLists();
  } else if (section.type === SECTIONTYPE.PLAYLIST) {
    //load the elements for the playlist
    fillContentForPlaylist(section.playlist);
  }
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

  const section = { type: SECTIONTYPE.DASHBOARD };
  history.pushState(section, "", "");
  loadSections(section);

  document.querySelector("#content").addEventListener("scroll", (e) => {
    const { scrollTop } = e.target;

    const header = document.querySelector("#top-header");

    if (scrollTop >= header.offsetHeight) {
      header.classList.add("sticky", "top-0", "bg-black-secondary");
      header.classList.remove("bg-transparent");
    } else {
      header.classList.remove("sticky", "top-0", "bg-black-secondary");
      header.classList.add("bg-transparent");
    }
  });
  window.addEventListener("popstate", (e) => {
    loadSections(e.state);
  });
});

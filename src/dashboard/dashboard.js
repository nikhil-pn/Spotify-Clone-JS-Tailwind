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

const onPlaylistItemClicked = (event) => {
  const section = {type: SECTIONTYPE.PLAYLIST}
  console.log(event.target);
  history.pushState(section, "", "playlist");
  loadSections(section);
};

const loadPlayList = async (endpoint, elementID) => {
  const playlists = await fetchRequest(endpoint);
  console.log(playlists, "items");
  const playListItemsSection = document.querySelector(`#${elementID}`);
  let playlistItems = ``;
  for (let { name, description, images, id } of playlists.playlists.items) {
    const playListItem = document.createElement("section");

    playListItem.className =
      "bg-black-secondary rounded p-4 hover:cursor-pointer hover:bg-light-black";
    playListItem.id = id;
    playListItem.setAttribute("data-type", "playlist");
    playListItem.addEventListener("click", onPlaylistItemClicked);
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

const loadSections = (section) => {
  if (section.type === SECTIONTYPE.DASHBOARD) {
    fillContentForDashboard();
    loadPlayLists();
  } else {
    //load the elements for the playlist
    const pageContent = document.querySelector("#page-content")
    pageContent.innerHTML = "playlists to be loaded"
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

  // loadUserProfile();
  // fillContentForDashboard();
  // loadPlayLists();

  document.querySelector("#content").addEventListener("scroll", (e) => {
    const { scrollTop } = e.target;

    const header = document.querySelector("header");

    if (scrollTop >= header.offsetHeight) {
      header.classList.add("sticky", "top-0", "bg-black-secondary");
      header.classList.remove("bg-transparent");
    } else {
      header.classList.remove("sticky", "top-0", "bg-black-secondary");
      header.classList.add("bg-transparent");
    }
  });
  window.addEventListener("popstate", (e) => {
    loadSections(e.state)
  })
});

import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common";
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
  console.log(event.target);
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
  const pageContent = document.querySelector("#page-content")

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

  loadUserProfile();
  fillContentForDashboard()
  loadPlayLists();
});

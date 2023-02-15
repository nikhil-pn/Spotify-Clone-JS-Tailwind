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

const loadFeaturedPlayList = async (e, id) => {
  const playlists = await fetchRequest(ENDPOINT.featuredPlayList);
  console.log(playlists, "items");
  const playListItemsSection = document.querySelector(
    "#featured-playlist-items"
  );
  let playlistItems = ``;
  for (let { name, description, images, id } of playlists.playlists.items) {
    const playListItem = document.createElement("section");

    playListItem.className = "rounded border-2 border-solid p-4 hover:cursor-pointer";
    playListItem.id = id;
    playListItem.setAttribute("data-type", "playlist");
    playListItem.addEventListener("click", onPlaylistItemClicked);
    const [{ url: imageUrl }] = images;

    playListItem.innerHTML = `
      <img class="rounded mb-2 object-contain shadow" src='${imageUrl}'alt="${name}" />
      <h2 class="text-sm">${name}</h2>
      <h3 class="text-xs">${description}</h3>`;
    playListItemsSection.appendChild(playListItem);
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

  loadUserProfile();
  loadFeaturedPlayList();
});

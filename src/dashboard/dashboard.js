import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common";
const displayName = document.querySelector("#display-name");

const onProfileClick = (event) => {};

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

  defaultButton.addEventListener("click", onProfileClick);
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
});

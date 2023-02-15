import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common";
const displayName = document.querySelector("#display-name");

const loadUserProfile = async () => {
  const displayName = document.querySelector("#display-name");
  const defaultImage = document.querySelector("#default-image");
  const defaultButton = document.querySelector("#user-profile-button");

  const userInfo = await fetchRequest(ENDPOINT.userInfo);

  return userInfo;
};

document.addEventListener("DOMContentLoaded", async () => {
  displayName.addEventListener("click", () => {
    console.log("clicked");
    logout();
  });

  const userInfo = await  loadUserProfile();
  console.log(userInfo);
  displayName.textContent = userInfo.display_name;
});

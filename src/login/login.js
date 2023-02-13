const CLIENT_ID = "32b90bda20164c3fb12257029561b5f4";

const scopes =
  "user-top-read user-follow-read playlist-read-private user-library-read";
const REDIRECT_URI = "http://localhost:3000/login/login.html";
const authorizeUser = () => {
  const url = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${scopes}&show_dialog=true`;
  window.open(url, "login", "width=800, height=600");
};

const loginButton = document.querySelector("#login-to-spotify");

document.addEventListener("DOMContentLoaded", () => {
  loginButton.addEventListener("click", authorizeUser);
});

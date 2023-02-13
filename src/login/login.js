const CLIENT_ID = "32b90bda20164c3fb12257029561b5f4";
const accessTokenKey = "accessToken";
const APP_URL = "http://localhost:3000";
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

window.setItemsInLocalStorage = ({ accessToken, tokenType, expiresIn }) => {
  localStorage.setItem(accessTokenKey, accessToken);
  localStorage.setItem("tokenType", tokenType);
  localStorage.setItem("expiresIn", expiresIn);
  window.location.href = APP_URL;
};

window.addEventListener("load", () => {
  const accessToken = localStorage.getItem(accessTokenKey);

  if (accessToken) {
    window.location.href = `${APP_URL}/dashboard/dashboard.html`;
  }

  if (window.opener !== null && !window.opener.closed) {
    window.focus();
    if (window.location.href.includes("error")) {
      window.close();
    }
    console.log(window.location.hash);
    const { hash } = window.location;
    const searchParams = new URLSearchParams(hash);
    const accessToken = searchParams.get("#access_token");
    const tokenType = searchParams.get("#token_type");
    const expiresIn = searchParams.get("#expires_in");

    if (accessToken) {
      window.close();
      window.opener.setItemsInLocalStorage({
        accessToken,
        tokenType,
        expiresIn,
      });
    }
  }
});

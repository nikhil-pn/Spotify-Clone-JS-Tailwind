// when dom is loaded, The local storage is checked if access token is available it wiil redirect to dashboard page.
//  IF not it will redirect to to login page

const APP_URL = import.meta.env.VITE_APP_URL
console.log(APP_URL, "appurl");


document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("accessToken")) {
    window.location.href = `${APP_URL}/dashboard/dashboard.html`;
  }else{
    window.location.href = `${APP_URL}/login/login.html`;
  }
});

// when dom is loaded, The local storage is checked if access token is available it wiil redirect to dashboard page.
//  IF not it will redirect to to login page
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("accessToken")) {
    window.location.href = "dashboard/dashboard.html";
  }else{
    window.location.href = "login/login.html";
  }
});

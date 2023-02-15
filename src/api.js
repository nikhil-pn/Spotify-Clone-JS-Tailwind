import { ACCESS_TOKEN, EXPIRES_IN, logout, TOKEN_TYPE } from "./common";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL;

//getting access token to call the API

const getAccessToken = () => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const expiresIn = localStorage.getItem(EXPIRES_IN);
  const tokenType = localStorage.getItem(TOKEN_TYPE);



  if (Date.now() > expiresIn) {
    return { accessToken, tokenType };
  } else {
    //logout the user
    logout();
  }
};

const createApiConfig = ({ accessToken, tokenType }, method = "GET") => {
  return {
    headers: {
      Authorization: `${tokenType} ${accessToken}`,
    },
    method
  };
};

//Helper functions

export const fetchRequest = async (endpoint) => {
  const url = `${BASE_API_URL}/${endpoint}`;
  const result = await fetch(url, createApiConfig(getAccessToken()));
  return result.json();
};

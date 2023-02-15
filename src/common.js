export const ACCESS_TOKEN = "accessToken"
export const TOKEN_TYPE = "tokenType"
export const EXPIRES_IN = "expiresIn"

const APP_URL = import.meta.env.VITE_APP_URL
export const ENDPOINT = {
    userInfo :"me"

}

//logout 
export const logout = ()=>{
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(EXPIRES_IN)
    localStorage.removeItem(TOKEN_TYPE)
    window.location.href = APP_URL
}
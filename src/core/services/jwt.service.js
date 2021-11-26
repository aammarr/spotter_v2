const ID_TOKEN_KEY = "id_token";
const ID_TOKEN_EXPIRE_TIME = "token_expire_time";
const ID_USER_ACTIVE_TIME = "user_active_time";

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY);
};

export const saveToken = (token, time) => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
  let expireTime = new Date().getTime() + time * 1000;
  window.localStorage.setItem(ID_TOKEN_EXPIRE_TIME, new Date(expireTime));
};

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
  window.localStorage.removeItem(ID_TOKEN_EXPIRE_TIME);
  window.localStorage.removeItem(ID_USER_ACTIVE_TIME);
};

export const getUserActiveTime = () => {
  return window.localStorage.getItem(ID_USER_ACTIVE_TIME);
};
export const saveUserActiveTime = () => {
  window.localStorage.setItem(ID_USER_ACTIVE_TIME, Date());
};

export const getTokenTimeDiff = () => {
  let expireTime = new Date(window.localStorage.getItem(ID_TOKEN_EXPIRE_TIME));
  let userTime = new Date(window.localStorage.getItem(ID_USER_ACTIVE_TIME));
  let diff = (expireTime - userTime) / 1000;
  return diff;
};
export default {
  getToken,
  saveToken,
  destroyToken,
  getTokenTimeDiff,
  getUserActiveTime,
  saveUserActiveTime
};

import { IUserReqModel } from "../models";

const apiUrl = import.meta.env.VITE_API_URL;

const getUrl = (path: string) => {
  if(apiUrl){
    return `${apiUrl}${path}`;
  }
  return path;
};

// route to get logged in user's info (needs the token)
export const getMe = (token: string) => {
  return fetch(getUrl('/api/users/me'), {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
};

export const createUser = (input: IUserReqModel) => {
  return fetch(getUrl('/api/users'), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
};

export const loginUser = (input: IUserReqModel) => {
  return fetch(getUrl("/api/users/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
};

// save book data for a logged in user
export const saveWorkOrders = (data: any, userName: string, _token: string) => {
  return fetch(getUrl(`/api/workorders/${userName}`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

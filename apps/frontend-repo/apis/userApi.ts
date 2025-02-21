import { getMethod, postMethod, putMethod } from './api';

const USER_API_BASE_URL = '/user';

export const signupUser = async (userData: { email: string; password: string; displayName: string }) => {
  return await postMethod(`${USER_API_BASE_URL}/signup`, userData);
};

export const fetchUserData = async (uid: string) => {
  return await getMethod(`${USER_API_BASE_URL}/fetch-user-data/${uid}`);
};

export const updateUserData = async (uid: string, updatedData: object) => {
  console.log(updatedData,'updatedData')
  return await putMethod(`${USER_API_BASE_URL}/update-user-data/${uid}`, updatedData);
};

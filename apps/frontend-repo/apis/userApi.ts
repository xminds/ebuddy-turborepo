import { getMethod, postMethod, putMethod } from './api';
import { User } from "@ebuddy/shared/types/user";

const USER_API_BASE_URL = '/user';

export const signupUser = async (userData: { email: string; password: string; displayName: string }): Promise<User> => {
  return await postMethod(`${USER_API_BASE_URL}/signup`, userData);
};


export const fetchUserData = async (uid: string): Promise<User> => {
  return await getMethod(`${USER_API_BASE_URL}/fetch-user-data/${uid}`);
};


export const updateUserData = async (uid: string, updatedData: Partial<User>): Promise<User> => {
  return await putMethod(`${USER_API_BASE_URL}/update-user-data/${uid}`, updatedData);
};
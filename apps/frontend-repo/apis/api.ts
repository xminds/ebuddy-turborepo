import axiosInstance from "./axiosInstance";

const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem("accessToken");
};

type ApiResponse<T> = Promise<T>;

// Generic GET request
export const getMethod = async <T>(url: string): ApiResponse<T> => {
  const token = getTokenFromLocalStorage();
  try {
    const response: any = await axiosInstance.get<T>(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error in GET request");
  }
};

// Generic POST request
export const postMethod = async <T>(
  url: string,
  payload: any
): ApiResponse<T> => {
  try {
    const response: any = await axiosInstance.post<T>(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error in POST request");
  }
};

// Generic PUT request
export const putMethod = async <T>(
  url: string,
  payload: any
): ApiResponse<T> => {
  try {
    const token = getTokenFromLocalStorage();
    const response: any = await axiosInstance.put<T>(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error in PUT request");
  }
};

// Enable or disable credentials in axios
export const setAxiosWithCredentials = (withCredentials: boolean): void => {
  axiosInstance.defaults.withCredentials = withCredentials;
};

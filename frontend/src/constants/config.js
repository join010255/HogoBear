import Constants from 'expo-constants';


const getBackendHost = () => {
  // 1. Explicit env variable for backend host if provided
  if (process.env.EXPO_PUBLIC_BACKEND_HOST) {
    return process.env.EXPO_PUBLIC_BACKEND_HOST;
  }

  // 3. Extract dynamically from Expo Metro server connection (host:port)
  const hostUri = Constants?.expoConfig?.hostUri || Constants?.manifest2?.extra?.expoClient?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }

  // 4. Fallback to current local machine IP
  return '192.168.1.240';
};

const host = getBackendHost();

export const API_URL = process.env.EXPO_PUBLIC_API_URL || `http://${host}:3000/api`;
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || `http://${host}:3000`;

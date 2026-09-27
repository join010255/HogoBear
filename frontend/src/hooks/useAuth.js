import { useAuthStore, setAuthSession, clearAuthSession } from "../store/authStore";
import * as authApi from "../api/auth.api";

export function useAuth() {
  const session = useAuthStore();
  return {
    ...session,
    login: async (credentials) => {
      const result = await authApi.login(credentials);
      setAuthSession({ token: result.token, user: result.user });
      return result;
    },
    register: authApi.register,
    recover: authApi.recover,
    logout: clearAuthSession,
  };
}
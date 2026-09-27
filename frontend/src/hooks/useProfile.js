import { useState } from "react";
import { request } from "../api/client";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const loadProfile = async () => {
    const result = await request("/users/profile");
    setProfile(result);
    return result;
  };
  return { profile, loadProfile };
}
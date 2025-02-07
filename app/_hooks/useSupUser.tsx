import { useState, useEffect } from "react";
import { sup } from "@/_sdk/supabase";
import { User } from "@supabase/supabase-js";

export const useSupabaseUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const refetch = async () => {
    const { data, error } = await sup.auth.getUser();

    if (error) {
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
      return;
    }

    setUser(data.user);
    setIsLoggedIn(true);
    setIsLoading(false);
  };

  const logout = async () => {
    await sup.auth.signOut();
    await refetch();
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    isLoading,
    isLoggedIn,
    user,
    refetch,
    logout,
  };
};

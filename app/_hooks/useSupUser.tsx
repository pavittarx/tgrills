import { useState, useEffect } from "react";
import { sup } from "@/_sdk/supabase";
import { User } from "@supabase/supabase-js";

export const useSupUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const checkUserRole = async (userId: string) => {
    const { data: roles, error: roleError } = await sup
      .from("roles")
      .select("id, role")
      .eq("id", userId);

    if (roleError) {
      console.error("Error fetching role:", roleError);
      return false;
    }

    const role = roles?.[0];
    return role?.role === "admin";
  };

  const refetch = async () => {
    try {
      const { data: { session } } = await sup.auth.getSession();
      
      if (session?.user) {
        const isUserAdmin = await checkUserRole(session.user.id);
        setIsAdmin(isUserAdmin);
        setIsLoggedIn(true);
        setUser(session.user);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await sup.auth.signOut();
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };

  useEffect(() => {
    refetch();

    const { data: { subscription } } = sup.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUserRole(session.user.id).then(isUserAdmin => {
          setIsAdmin(isUserAdmin);
          setIsLoggedIn(true);
          setUser(session.user);
        });
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    isLoading,
    isLoggedIn,
    isAdmin,
    user,
    refetch,
    logout,
  };
};

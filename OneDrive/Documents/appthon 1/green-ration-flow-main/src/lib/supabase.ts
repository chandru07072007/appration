import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

export const checkUserRole = async (userId: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error checking user role:", error);
    return null;
  }

  return data?.role || null;
};

export const getSession = async (): Promise<{ session: Session | null; user: User | null }> => {
  const { data: { session } } = await supabase.auth.getSession();
  return { session, user: session?.user || null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, fullName: string) => {
  const redirectUrl = `${window.location.origin}/`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

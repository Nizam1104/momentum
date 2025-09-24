import { getSupabaseClient } from "@/lib/supabase";
import { User } from "./types";

const toUser = (user: any): User => {
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
    emailVerified: user.emailVerified
      ? new Date(user.emailVerified)
      : undefined,
  };
};

export const fetchUser = async function () {
  const supabase = await getSupabaseClient();
  const { data, error } = await supabase.from("User").select("*");

  if (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data: data ? data.map(toUser) : [] };
};

export { fetchUser as _fetchUser };

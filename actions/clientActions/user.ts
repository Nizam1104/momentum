import { getSupabaseClient } from "@/lib/supabase";

export const fetchUser = async function() {
  console.log('fetch user called')
  const supabase = await getSupabaseClient()
  console.log('a')
  const { data, error } = await supabase.from("User").select('*')
  console.log(data)
}

export {
  fetchUser as _fetchUser
}

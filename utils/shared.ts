import { getSessionUser } from "@/actions/serverActions/shared";
import { useUserStore } from "@/stores/user";

export const getUserId = async function () {
  const storeUser = useUserStore.getState().user;

  if (storeUser?.id !== null && storeUser?.id !== undefined) {
    return storeUser?.id;
  }

  const sessionUser = await getSessionUser();
  return sessionUser?.id;
};

export const getUser = async function () {
  const storeUser = useUserStore.getState().user;

  if (storeUser?.id !== null && storeUser?.id !== undefined) {
    return storeUser;
  }

  const sessionUser = await getSessionUser();
  return sessionUser;
};

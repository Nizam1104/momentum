import { useUserStore } from "@/stores/user"

const fetchUser = async function(userId: string) {
    const userState = useUserStore.getState()
    userState.setLoading(true)
    try {
        const res = await fetch(`api/user/profile?user_id=${userId}`)
        if(!res.ok) {
            const error = await res.json()
            throw error
        }
        userState.setUser(await res.json())
    } catch (error: any) {
        // TODO: Replace with shadcn dialog or other error handling
        console.error('Error fetching user:', error.error || error);
    } finally {
        userState.setLoading(false)
    }
}

export {
    fetchUser
}

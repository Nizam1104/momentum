import { useUserStore } from "@/stores/user"
import { useAlert } from "@/components/providers/AlertProvider"

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
        // console.log(error.error)
        useAlert().showAlert({
            type: 'error',
            title: 'Error',
            text: error.error || ''
        })
    } finally {
        userState.setLoading(false)
    }
}

export {
    fetchUser
}

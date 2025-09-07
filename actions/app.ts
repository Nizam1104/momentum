import { fetchUser } from "@/actions/user"
import { useAppStore } from "@/stores/app"

import { _fetchUser } from "./clientActions/user"

interface SplashProps {
    userId: string | null
}

const splash = async function(props: SplashProps) {

    const appState = useAppStore.getState()
    if(!props.userId || appState.splashed) {
        return
    }

    try {
        const promises: Promise<void>[] = []

        promises.push(fetchUser(props.userId))

        await _fetchUser()

        const allPromiseRes = await Promise.all(promises)

        appState.setSplashed(true)
    } catch (error) {
    }
}

export {
    splash
}

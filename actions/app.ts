import { fetchUser } from "@/actions/user"
import { useAppStore } from "@/stores/app"

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

        const allPromiseRes = await Promise.all(promises)

        appState.setSplashed(true)
    } catch (error) {
        console.log('a', error)
    }
}

export {
    splash
}

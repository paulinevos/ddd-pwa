import HomeScreen from "@/components/HomeScreen";
import {useCookies} from "react-cookie";
import GameView from "@/components/GameView";
// These imports are unused and can be removed
// import AvatarSelectionScreen from "@/components/AvatarSelectionScreen";
// import WaitingRoom from "@/components/WaitingRoom";


function Index() {
    const [ cookies ] = useCookies(['mercureAuthorization'])

    // The GameView component already includes the GameStateMachineProvider
    // but we can also wrap the entire app for consistent state management
    
    if (cookies.mercureAuthorization) {
        // GameView has its own GameStateMachineProvider internally
        return <GameView />
    }

    return (
        // We can also wrap HomeScreen in the GameStateMachineProvider
        // for consistent state management throughout the app
        <HomeScreen />
    )
}

export default Index

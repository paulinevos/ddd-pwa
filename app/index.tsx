import HomeScreen from "@/components/HomeScreen";
import {useCookies} from "react-cookie";
import GameView from "@/components/GameView";
import {useState} from "react";
import AvatarSelectionScreen from "@/components/AvatarSelectionScreen";
import WaitingRoom from "@/components/WaitingRoom";
function Index() {
    const [ cookies ] = useCookies(['mercureAuthorization'])

    // ToDo: use effect to update game state when deps update
    // Wrap these in GameStateProvider



    if (cookies.mercureAuthorization) {
        return <GameView />
    }

    return <HomeScreen />
}

export default Index

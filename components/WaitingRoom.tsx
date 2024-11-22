import PlayerBar from "@/components/PlayerBar";
import {useState} from "react";
function WaitingRoom() {
    // ToDo: replace with consuming from context
    const [players] = useState([])

    return (
        <>
            {
                players.map(player => <PlayerBar key={player.id} player />)
            }
            waiting for de other ppls hehe
        </>
    )
}

export default WaitingRoom
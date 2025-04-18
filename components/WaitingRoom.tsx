import PlayerBar from "@/components/PlayerBar";
import {useContext, useState} from "react";
import {GameContext} from "@/utils/game_data";
import {ScrollView} from "react-native";
function WaitingRoom() {
    const { gameState, setGameState } = useContext(GameContext)
    const { players } = gameState

    const styles = {
        scrollView: {
            flexGrow: 0,
            width: '120%',
            padding: 5,
            top: '-37%',
        }
    }

    return (
        <ScrollView style={styles.scrollView}>
            {
                players.map(player => <PlayerBar key={player.id} player={player} />)
            }
        </ScrollView>
    )
}

export default WaitingRoom
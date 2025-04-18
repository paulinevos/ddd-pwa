import React, {useContext, useEffect, useState} from "react";
import GameMenu from "@/components/ui/GameMenu";
import {SafeAreaView} from "react-native";
import {EventSource} from "eventsource/src";
import {activeSubscriptions, connect, onMessageHandled, parseToken} from "@/utils/message_handling";
import {MessageType} from "@/utils/messages";
import {addPlayer, commitState, GameContext, GameState, Player, useGameContext} from "@/utils/game_data";
import {useCookies} from "react-cookie";
import WaitingRoom from "@/components/WaitingRoom";
import AvatarSelectionScreen from "@/components/AvatarSelectionScreen";
import {state} from "sucrase/dist/types/parser/traverser/base";

function GameView() {
  const [ cookies ] = useCookies(['mercureAuthorization'])
  const { gameState, setGameState } = useGameContext()
  const [ players, setPlayers ] = useState(gameState?.players || [])

  useEffect(() => {
    const newState = {...gameState, players};
    setGameState(newState)
    commitState(newState)
  }, [players]);

  useEffect(() => {
    console.debug('Connecting to event source')
    const token = cookies.mercureAuthorization

    const parsed = parseToken(token)
    if (parsed.isHost()) {
        // Listen to active subscriptions
        const subscriptions = activeSubscriptions(token)
        subscriptions.addEventListener('message', (e) => {
            console.debug('Subscription update:', e)
        })
    }

    const events: EventSource = connect(token)
    events.addEventListener('message', (e) => {
      const data = JSON.parse(e.data)
      const { type, payload } = data

      switch (type) {
        case MessageType.PlayerJoined:
          setPlayers([...players, payload as Player])
      }
    })

  }, [cookies.mercureAuthorization])

  return (
    <GameContext.Provider value={{gameState, setGameState}}>
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#EBFFFE",
                paddingHorizontal: "10%",
            }}
        >
            <GameMenu />
            {
                gameState && players.length > 0
                    ? <WaitingRoom />
                    : <AvatarSelectionScreen />
            }
        </SafeAreaView>
    </GameContext.Provider>
  )
}

export default GameView
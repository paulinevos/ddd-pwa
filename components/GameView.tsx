import React, {useEffect, useState} from "react";
import GameMenu from "@/components/ui/GameMenu";
import {SafeAreaView} from "react-native";
import {EventSource} from "eventsource/src";
import {connect, onMessageHandled} from "@/utils/message_handling";
import {MessageType} from "@/utils/messages";
import {Player} from "@/utils/game_data";
import {useCookies} from "react-cookie";
function GameView({renderContent, players, setPlayers}) {
    const [ cookies ] = useCookies(['mercureAuthorization'])

    useEffect(() => {
        console.debug('Connecting to event source')
        const events: EventSource = connect(cookies.mercureAuthorization)

        events.addEventListener('message', (e) => {
            const data = JSON.parse(e.data)
            const { type, payload } = data

            switch (type) {
                case MessageType.PlayerJoined:
                    const { id, displayName, avatar } = payload
                    setPlayers([
                        ...players,
                        new Player(id, displayName, avatar)
                    ])
            }

            onMessageHandled(e)
        })

    }, [])

    return (
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
            { renderContent() }
        </SafeAreaView>
    )
}

export default GameView
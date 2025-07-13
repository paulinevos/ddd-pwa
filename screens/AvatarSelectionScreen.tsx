import React, {Fragment, useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {AvatarButton} from "@/components/AvatarButton";
import {parseToken, send} from "@/services/MercureService";
import {useCookies} from "react-cookie";
import {Message, MessageType} from "@/utils/messages";
import { useGameStateMachine } from "@/contexts/GameStateMachineContext";
import { useGameContext } from "@/contexts/GameContext";
import { selectAvatar } from "@/utils/GameStateMachine";

const avatars = [
    require(`../assets/images/avatars/cocky.png`),
    require(`../assets/images/avatars/dranky.png`),
    require(`../assets/images/avatars/winey.png`),
    require(`../assets/images/avatars/guinney.png`),
    require(`../assets/images/avatars/pinty.png`),
    require(`../assets/images/avatars/martiny.png`),
    require(`../assets/images/avatars/the_d.png`),
    require(`../assets/images/avatars/coconutty.png`),
]

const AvatarSelectionScreen = () => {
    const [ cookies ] = useCookies(['mercureAuthorization']);
    const stateMachine = useGameStateMachine();
    const { setGameState } = useGameContext();

    const [displayName, setDisplayName] = useState("")
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false)
    const token = cookies.mercureAuthorization

    const buttonEnabled = displayName.length > 2 && selected !== null

    useEffect(() => {
        async function handleSubmit() {
            const parsed = parseToken(token)
            console.log('[AvatarSelection] Submitting avatar with:', {
                userId: parsed.userId,
                displayName,
                avatar: avatars[selected as number],
                isHost: parsed.isHost()
            });

            // Log state before submission
            console.log('[AvatarSelection] State before submit:', {
                stateMachineState: stateMachine.flowState,
                stateMachinePlayers: stateMachine.players,
                stateMachineHostId: stateMachine.hostId,
            });

            try {
                // Send message to backend
                await send(token, new Message(MessageType.PlayerJoined, {
                    id: parsed.userId,
                    displayName,
                    avatar: selected
                }));
                console.log('[AvatarSelection] Player joined message sent');
                
                // Update state machine to transition to waiting room
                                // Update the in-memory state machine
                selectAvatar(stateMachine, parsed.userId, displayName, String(avatars[selected as number]));

                // Now, trigger the state update in the context, which will persist it
                setGameState({
                  players: stateMachine.players,
                  hostId: stateMachine.hostId,
                });
                
                // Log state after successful submission
                console.log('[AvatarSelection] State after submit:', {
                    stateMachineState: stateMachine.flowState,
                    stateMachinePlayers: stateMachine.players,
                    stateMachineHostId: stateMachine.hostId,
                    playerInStateMachine: stateMachine.players.some(p => p.id === parsed.userId)
                });
            } catch (error) {
                console.error('[AvatarSelection] Error during avatar submission:', error);
            }
        }

        if (submitted) {
            console.log('[AvatarSelection] Avatar submission triggered');
            handleSubmit()
                .then(() => {
                    console.log('[AvatarSelection] Submit complete, transitioned to:', stateMachine.flowState);
                })
                .catch((error) => {
                    console.error('[AvatarSelection] Error submitting avatar:', error);
                });
        }
    }, [submitted, stateMachine, displayName, selected, token, setGameState])

    const styles = StyleSheet.create({
        inputStyle: {
            height: 40,
            margin: 10,
            marginBottom: 40,
            padding: 40,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
            width: "150%",
            borderTopColor: "#000000",
            borderBottomColor: "#000000",
            color: displayName ? "#000000" : "#999999",
            borderWidth: 1,
            backgroundColor: "#FFDCF7"
        },
        scrollView: {
            padding: 5,
            width: "130%",
            flexGrow: 0,
            borderTopColor: "#000000",
            marginBottom: 40,
            borderBottomColor: "#000000",
            borderWidth: 1,
            backgroundColor: "#FAFFEF"
        }
    });

    return (
        <>
            <Text
                style={{
                    marginBottom: 10,
                    textTransform: "uppercase"
                }}
            >
                Select avatar
            </Text>

            <ScrollView
                horizontal={true}
                style={styles.scrollView}
            >
                {
                    avatars.map((avatar, index) => {
                        return (
                          <div key={index}>
                            <AvatarButton
                              image={avatar}
                              selected={index === selected}
                              handlePress={() => setSelected(index)}
                            />
                          </div>
                        )
                    })
                }
            </ScrollView>

            <Text
                style={{
                    textTransform: "uppercase"
                }}
            >
                Type your name
            </Text>

            <TextInput
                style={ styles.inputStyle }
                placeholder={ "who even are you?!" }
                maxLength={ 30 }
                textAlign={ "center" }
                value={ displayName }
                onChangeText={ setDisplayName }
            >
            </TextInput>

            <TouchableOpacity
                onPress={ () => {
                    console.log('[AvatarSelection] Submit button pressed');
                    setSubmitted(true);
                }}
                disabled={!buttonEnabled}
                style={{
                    width: "70%",
                    backgroundColor: buttonEnabled ? '#FFFFFF': '#EEEEEE',
                    padding: 15,
                    margin: 20,
                    borderWidth: 1,
                    borderColor: "#000000",
                    borderRadius: 8,
                    shadowOffset: {
                        width: 0,
                        height: 6,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                }}
            ><Text
                style={{
                    textTransform: "uppercase",
                    color: buttonEnabled ? '#000000': '#BBBBBB',
                    textAlign: "center"
                }}
            >Submit</Text></TouchableOpacity>
        </>
    )
}

export default AvatarSelectionScreen
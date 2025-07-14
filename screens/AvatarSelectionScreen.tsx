import React, {Fragment, useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {AvatarButton} from "@/components/AvatarButton";
import {parseToken} from "@/services/MercureService";
import { handlePlayerJoin } from '@/services/GameActions';
import {useCookies} from "react-cookie";
import { useGameStateMachine } from "@/contexts/GameStateMachineContext";
import { useGameContext } from '@/contexts/GameContext';

const avatarImages = {
    'cocky.png': require(`../assets/images/avatars/cocky.png`),
    'dranky.png': require(`../assets/images/avatars/dranky.png`),
    'winey.png': require(`../assets/images/avatars/winey.png`),
    'guinney.png': require(`../assets/images/avatars/guinney.png`),
    'pinty.png': require(`../assets/images/avatars/pinty.png`),
    'martiny.png': require(`../assets/images/avatars/martiny.png`),
    'the_d.png': require(`../assets/images/avatars/the_d.png`),
    'coconutty.png': require(`../assets/images/avatars/coconutty.png`),
};
const avatars = Object.keys(avatarImages);

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
                await handlePlayerJoin(
                    token,
                    {
                        id: parsed.userId,
                        displayName,
                        avatar: avatars[selected as number],
                        isHost: parsed.isHost(),
                    },
                    stateMachine,
                    setGameState
                );
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
                    avatars.map((avatarName, index) => {
                        return (
                          <div key={index}>
                            <AvatarButton
                              image={avatarImages[avatarName as keyof typeof avatarImages]}
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
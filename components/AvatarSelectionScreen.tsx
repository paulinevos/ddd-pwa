import React, {Fragment, useEffect, useState} from "react";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";
import {AvatarButton} from "@/components/ui/AvatarButton";
import {parseToken, send} from "@/utils/message_handling";
import {useCookies} from "react-cookie";
import {Message, MessageType} from "@/utils/messages";

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

    const [displayName, setDisplayName] = useState("")
    const [selected, setSelected] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const token = cookies.mercureAuthorization

    const buttonEnabled = displayName.length > 2 && selected

    useEffect(() => {
        async function handleSubmit() {
            const parsed = parseToken(token)

            await send(token, new Message(MessageType.PlayerJoined, {
                id: parsed.userId,
                displayName,
                avatar: selected
            }))
        }

        if (submitted) {
            handleSubmit()
                .then(() => { /* do nothing lol */} )
          // If there's an error, show error.
        }
    }, [submitted])

    const styles = StyleSheet.create({
        input: {
            height: 40,
            margin: 10,
            marginBottom: 40,
            padding: 40,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.1em",
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
                    avatars.map((avatar: object, index) => {
                        return (
                          <div key={index}>
                            <AvatarButton
                              image={avatar}
                              selected={avatar === selected}
                              handlePress={ setSelected }
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
                style={ styles.input }
                placeholder={ "who even are you?!" }
                maxLength={ 30 }
                textAlign={ "center" }
                value={ displayName }
                onChangeText={ setDisplayName }
            >
            </TextInput>

            <TouchableOpacity
                onPress={ () => setSubmitted(true) }
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
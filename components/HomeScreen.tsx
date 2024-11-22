import CodeInput from "@/components/CodeInput";
import {Image, SafeAreaView, Text} from "react-native";
import {useState} from "react";
import { Button, ButtonColor, ButtonProps } from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import {useCookies} from "react-cookie";
import {hostGame, joinGame} from "@/utils/token_server";

function HomeScreen() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [code, setCode] = useState('')
    const [ _, setCookie ] = useCookies();
    const getHostToken = async (setCookie: Function) => {
        const { token, error } = await hostGame()

        if (!error) {
            return setCookie('mercureAuthorization', token)
        }

        setError(error.message)
    }

    const getPlayerToken = async (setCookie: Function) => {
        const { token, error } = await joinGame(code)

        if (!error) {
            return setCookie('mercureAuthorization', token)
        }

        setError(error.message)
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                paddingHorizontal: "10%",
            }}
        >
            { loading && <Loading/> }
            <Image
                source={require('../assets/images/ddd_logo_cards.png')}
                style={{
                    marginTop: -200,
                }}
                onLoad={() => {
                    setLoading(false)
                }}
            />
            {
                !loading &&
                <>
                    <Button
                        color={ButtonColor.Pink}
                        handlePress={() => getHostToken(setCookie)}
                        text="host game"
                    />
                    <Text>or input room code</Text>
                    <CodeInput value={code} setValue={setCode} />
                    { error &&
                        <Text style={{
                            color: "red",
                            fontSize: 16,
                        }}>{ error }</Text>
                    }
                    <Button
                        color={ButtonColor.Blue}
                        handlePress={() => getPlayerToken(setCookie)}
                        text="join game"
                    />
                </>
            }
        </SafeAreaView>
    )
}

export default HomeScreen
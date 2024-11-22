import {Text} from "react-native";

export default function Loading() {
    return (
        <Text
            style={
                {
                    fontSize: 32,
                    position: "absolute"
                }
            }
        >
            Loading...
        </Text>
    )
}

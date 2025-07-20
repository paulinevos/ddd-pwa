import HomeScreen from "@/screens/HomeScreen";
import { useCookies } from "react-cookie";
import GameView from "@/screens/GameView";
import AppLayout from "@/components/AppLayout";

function Index() {
    const [cookies] = useCookies(['mercureAuthorization']);
    const isLoggedIn = !!cookies.mercureAuthorization;

    // For logged-in users, show GameView with GameMenu
    if (isLoggedIn) {
        return (
            <AppLayout showGameMenu={true}>
                <GameView />
            </AppLayout>
        );
    }

    // For non-logged-in users, show HomeScreen without GameMenu
    return (
        <AppLayout showGameMenu={false}>
            <HomeScreen />
        </AppLayout>
    );
}

export default Index;

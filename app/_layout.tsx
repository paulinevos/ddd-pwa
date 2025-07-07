import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { Jua_400Regular } from '@expo-google-fonts/jua';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { useEffect } from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();



export default function RootLayout() {
	const [fontsLoaded, fontError] = useFonts({
		Jua: Jua_400Regular,
		VT323: VT323_400Regular,
		EGB: require('../assets/fonts/egb.ttf'),
		b40: require('../assets/fonts/04B_30.ttf'),
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			// Hide the splash screen after the fonts have loaded (or an error was returned)
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	// Prevent rendering until the font has loaded or an error was returned
	if (!fontsLoaded && !fontError) {
		return null;
	}

	// Render the layout
	return <Stack />;
}

import CodeInput from '@/components/CodeInput';
import { Image, SafeAreaView, Text, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { Button, ButtonColor } from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import { useCookies } from 'react-cookie';
import { hostGame, joinGame } from '@/utils/token_server';
import logo from '@/assets/images/ddd_logo_cards.png';
import drankyLg from '@/assets/images/avatars/dranky-lg.png';
import theme from '@/theme';
import { destroyState } from '@/context/GameContext';

function HomeScreen() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [code, setCode] = useState('');
	const [cookies, setCookie] = useCookies(['mercureAuthorization']);

	// Clear stale game state if no auth cookie is present
	useEffect(() => {
		if (!cookies.mercureAuthorization) {
			console.log('No auth cookie found - clearing any stale game state');
			destroyState();
		}
	}, [cookies.mercureAuthorization]);

	const getHostToken = async (setCookie: Function) => {
		const { token, error } = await hostGame();

		if (!error) {
			return setCookie('mercureAuthorization', token);
		}

		setError(error.message);
	};

	const getPlayerToken = async (setCookie: Function) => {
		const { token, error } = await joinGame(code);

		if (!error) {
			return setCookie('mercureAuthorization', token);
		}

		setError(error.message);
	};

	const styles = StyleSheet.create({
		textStyle: {
			fontFamily: theme.typography.fontFamilyMonospace,
			fontSize: 40,
			color: theme.colors.textDark,
			paddingBottom: 5,
		},
		buttonStyle: {
			paddingTop: 15,
		},
	});

	return (
		<SafeAreaView
			style={{
				height: '100%',
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'white',
				paddingHorizontal: '10%',
			}}
		>
			{loading && <Loading />}
			<Image
				source={logo}
				style={{
					marginTop: -100,
				}}
				onLoad={() => {
					setLoading(false);
				}}
			/>
			<Text style={styles.textStyle}>ALPHA</Text>
			{!loading && (
				<>
					<Image
						source={drankyLg}
						style={{
							width: 112,
							marginBottom: -30,
							marginTop: 5,
						}}
						onLoad={() => {
							setLoading(false);
						}}
					></Image>
					<Button
						color={ButtonColor.Pink}
						fontFamily={theme.typography.fontFamilyPrimary}
						height={50}
						width="73%"
						handlePress={() => getHostToken(setCookie)}
						text="host game"
					/>
					<Text
						style={{
							fontFamily: theme.typography.fontFamilyPrimary,
							fontSize: 17,
							paddingTop: 15,
						}}
					>
						or input room code
					</Text>
					<CodeInput value={code} setValue={setCode} />
					{error && (
						<Text
							style={{
								color: 'red',
								fontSize: 16,
							}}
						>
							{error}
						</Text>
					)}
					<Button
						color={ButtonColor.Blue}
						height={50}
						width="73%"
						fontFamily={theme.typography.fontFamilyPrimary}
						disabled={code.length !== 4}
						handlePress={() => getPlayerToken(setCookie)}
						text="join game"
					/>
				</>
			)}
		</SafeAreaView>
	);
}

export default HomeScreen;

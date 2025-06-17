import { TextInput, StyleSheet } from 'react-native';
import React from 'react';
import theme from '@/theme';

const CodeInput = ({ value, setValue }) => {
	const styles = StyleSheet.create({
		input: {
			height: 40,
			margin: 10,
			padding: 10,
			width: 'max-content',
			paddingVertical: 15,
			textAlign: 'center',
			fontWeight: 'bold',
			color: value ? '#000000' : '#999999',
			textTransform: 'uppercase',
			backgroundColor: 'rgba(217, 217, 217, 0.5)',
			borderColor: '#000000',
			borderWidth: 1,
			borderStyle: 'dashed',
			...theme.shadows.medium,
		},
	});

	return (
		<TextInput
			style={styles.input}
			placeholder={'#ROOM'}
			maxLength={4}
			textAlign={'center'}
			autoCapitalize={'characters'}
			value={value}
			onChangeText={setValue}
		></TextInput>
	);
};

export default CodeInput;

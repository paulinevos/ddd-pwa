import { Text, TouchableOpacity, type DimensionValue } from 'react-native';
import React from 'react';
import theme from '@/theme';

enum ButtonColor {
	Blue = '#DAFFFE',
	Pink = '#FFDCF7',
	Cyan = '#69F2FE',
}

type ButtonProps = {
	title: string;
	color: ButtonColor;
	variant?: 'normal' | 'borderless';
	fontFamily?: string;
	fontSize?: number;
	height?: DimensionValue;
	width?: DimensionValue;
	padding?: DimensionValue;
};
const Button = ({
	color,
	handlePress,
	text,
	disabled,
	variant = 'normal',
	fontFamily,
	fontSize = theme.typography.fontSizeLg,
	height,
	width,
	padding,
}: {
	color: ButtonColor;
	handlePress: () => void;
	text: string;
	disabled?: boolean;
	variant?: 'normal' | 'borderless';
	fontFamily?: string;
	fontSize?: number;
	height?: DimensionValue;
	width?: DimensionValue;
	padding?: DimensionValue;
}) => {
	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={disabled || false}
			style={{
				width: width,
				height: height,
				backgroundColor: color,
				opacity: disabled ? 0.4 : 1,
				borderWidth: variant === 'borderless' ? 0 : 1,
				borderColor: variant === 'borderless' ? 'transparent' : '#000000',
				borderRadius: 8,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				padding: padding,

				...theme.shadows.medium,
			}}
		>
			<Text
				style={{
					textTransform: 'uppercase',
					textAlign: 'center',
					textAlignVertical: 'center',
					fontFamily: fontFamily,
					fontSize: fontSize,
				}}
			>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export { Button, ButtonColor, ButtonProps };

// /theme/index.ts

// --- Colors ---
// Based on your Figma: Pinks, Light Blues, Yellows, Greens, Dark Text
const colors = {
	primaryPink: '#FFC0CB', // Example: Standard Pink, adjust to your specific pink
	primaryLightPink: '#FFE0F8', // A lighter shade of pink often seen
	secondaryBlue: '#ADD8E6', // Example: Light Blue
	secondaryLightBlue: '#D6F0FA', // A lighter shade for backgrounds etc.

	accentYellow: '#FFFACD', // LemonChiffon, a common light yellow
	accentGreen: '#E5FFE5', // PaleGreen

	textDark: '#3C3C3C', // A common dark grey for text
	textMedium: '#555555',
	textLight: '#FFFFFF',
	textOnPrimary: '#FFFFFF', // Text that goes on primaryPink backgrounds
	textOnSecondary: '#3C3C3C', // Text that goes on secondaryBlue backgrounds

	backgroundMain: '#F0F8FF', // AliceBlue, a very light, almost white blue
	backgroundCard: '#FFFFFF',
	backgroundInput: '#FFFFFF',

	borderLight: '#D3D3D3', // LightGray
	borderMedium: '#A9A9A9', // DarkGray

	success: '#4CAF50',
	warning: '#FFC107',
	error: '#F44336',
};

// --- Typography ---
const typography = {
	// Font families now map to the keys used in useFonts in app/_layout.tsx
	fontFamilyPrimary: 'Jua', // A friendly, rounded font for body text and UI
	fontFamilySecondary: 'EGB', // A more stylistic font for headings or special text (formerly Cardenio)
	fontFamilyPixel: '04b_30', // A retro pixel font for scores, timers, etc.

	fontSizeXs: 12,
	fontSizeSm: 14,
	fontSizeMd: 16,
	fontSizeLg: 20,
	fontSizeXl: 24,
	fontSizeXxl: 28, // For large titles

	// Note: Custom fonts might not support all weights.
	// Jua is regular (400) only. Cardenio and 04b_30 likely have one weight.
	fontWeightLight: '300',
	fontWeightRegular: '400',
	fontWeightMedium: '500',
	fontWeightBold: '700',

	lineHeightXs: 16,
	lineHeightSm: 20,
	lineHeightMd: 24,
	lineHeightLg: 28,
};

// --- Spacing ---
// Based on an 8px grid is common, but adjust to your design's rhythm
const spacing = {
	xxs: 2, // 0.25 * base (8px)
	xs: 4, // 0.5 * base
	sm: 8, // 1 * base
	md: 12, // 1.5 * base
	lg: 16, // 2 * base
	xl: 24, // 3 * base
	xxl: 32, // 4 * base
	xxxl: 48, // 6 * base
};

// --- Borders ---
const borders = {
	radiusXs: 4,
	radiusSm: 8,
	radiusMd: 12, // Common for cards
	radiusLg: 16,
	radiusFull: 999, // For circular elements

	widthNone: 0,
	widthSm: 1,
	widthMd: 2,
};

// --- Shadows ---
// React Native shadow props are different for iOS (shadow*) and Android (elevation)
const shadows = {
	// A subtle shadow for cards or interactive elements
	subtle: {
		shadowColor: colors.textDark, // iOS
		shadowOffset: { width: 0, height: 1 }, // iOS
		shadowOpacity: 0.05, // iOS
		shadowRadius: 2, // iOS
		elevation: 1, // Android
	},

	// A more pronounced shadow, e.g., for modal dialogs or elevated cards
	medium: {
		shadowColor: colors.textDark,
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5, // Adjust for desired Android look
	},
	// A stronger shadow for elements that need to stand out significantly
	strong: {
		shadowColor: colors.textDark, // iOS
		shadowOffset: { width: 0, height: 6 }, // iOS
		shadowOpacity: 0.15, // iOS
		shadowRadius: 8, // iOS
		elevation: 8, // Android
	},
};

// --- Opacity ---
const opacities = {
	disabled: 0.5,
	hover: 0.8, // For touch feedback, though :hover is web-only
	pressed: 0.7, // For touch feedback
};

// --- Z-Index (less common in RN, but can be useful for absolute positioning) ---
const zIndices = {
	base: 0,
	dropdown: 1000,
	modal: 2000,
	overlay: 3000,
	toast: 4000,
};

// --- Combine all tokens into a single theme object ---
export const theme = {
	colors,
	typography,
	spacing,
	borders,
	shadows,
	opacities,
	zIndices,
};

export default theme;

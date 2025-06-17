# DDD PWA - Frontend Developer Guide

Welcome to the DDD (Dirty Drinking Game) PWA project! This guide is designed to help frontend developers get up to speed with the project structure and development workflow.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com/) or npm (comes with Node.js)

## Project Overview

This is a Progressive Web App (PWA) built with:

- React Native (using Expo)
- TypeScript
- Expo Router for navigation
- Mercure for real-time messaging

## Getting Started

### 1. Clone the repository

```bash
git clone [repository-url]
cd ddd-pwa
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. Start the development environment

```bash
docker compose up -d
```

### 4. Accept the SSL certificate

1. Open https://localhost/.well-known/mercure/ui/ in your browser
2. Accept the self-signed certificate (click "Advanced" and then "Accept the Risk and Continue")

### 5. Run the app

```bash
yarn web
# or
npm run web
```

The app should open in your default browser at `http://localhost:8081`.

## Project Structure

```text
/
├── app/                    # Main application code
│   ├── _layout.tsx         # Root layout component
│   └── index.tsx           # Entry point
├── assets/                 # Static assets
│   ├── fonts/              # Custom fonts
│   └── images/             # Image assets
├── components/             # Reusable components
│   ├── ui/                 # UI components
│   ├── AvatarSelectionScreen.tsx
│   ├── GameView.tsx
│   └── ...
├── theme/                  # Design tokens (colors, typography, spacing, etc.)
│   └── index.ts            # Main theme file exporting all tokens
├── utils/                  # Utility functions
│   ├── game_data.ts
│   ├── message_handling.ts
│   └── ...
├── babel.config.js         # Babel configuration (for path aliases etc.)
├── package.json            # Project dependencies and scripts
└── tsconfig.json           # TypeScript configuration (with path aliases)
```

## Key Components

### 1. Game Flow

- `HomeScreen.tsx` - Main entry point where users can join or create a game
- `WaitingRoom.tsx` - Lobby where players wait before the game starts
- `GameView.tsx` - Main game interface

### 2. UI Components

- `Button.tsx` - Reusable button component
- `AvatarButton.tsx` - Avatar selection component
- `PlayerBar.tsx` - Displays player information
- `GameMenu.tsx` - In-game menu

## Development Workflow

### Running the App

- `yarn web` - Run in web browser
- `yarn ios` - Run on iOS simulator (requires macOS)
- `yarn android` - Run on Android emulator

### Linting and Formatting

```bash
yarn lint
```

### Testing

```bash
yarn test
```

## Key Dependencies

- **Expo** - Framework for building cross-platform apps
- **React Navigation** - Routing and navigation
- **React Native Reanimated** - Smooth animations
- **Expo Fonts** - Custom font loading
- **Expo Blur** - Blur effects
- **Mercure** - Real-time updates

## Common Tasks

### Adding a New Screen

1. Create a new file in the `app` directory (e.g., `app/new-screen.tsx`)
2. Export a default React component
3. The route will be available at `/new-screen`

### Styling

This project uses React Native's `StyleSheet` for styling, complemented by a global design token system for consistency.

#### Design Token System

We have a centralized design token system located in `theme/index.ts`. This file exports an object containing predefined values for colors, typography (font sizes, weights, families), spacing, border radii, shadows, and more.

**Benefits:**
- **Consistency:** Ensures uniform styling across the application.
- **Maintainability:** Update a style value in one place, and it reflects everywhere.
- **Readability:** Makes style definitions cleaner and more semantic.

**How to Use:**
1.  **Import the theme or specific tokens:**
    ```typescript
    import theme from '@/theme';
    // OR for specific parts:
    import { colors, spacing, typography } from '@/theme';
    ```
    The `@/theme` path alias is configured in `tsconfig.json` and `babel.config.js`.

2.  **Apply tokens in your `StyleSheet`:**
    ```typescript
    const styles = StyleSheet.create({
      container: {
        backgroundColor: theme.colors.primaryPink, // Using a color token
        padding: theme.spacing.md,             // Using a spacing token
        borderRadius: theme.borders.radiusSm,  // Using a border token
      },
      titleText: {
        fontFamily: theme.typography.fontFamilyPrimary,
        fontSize: theme.typography.fontSizeLg,
        color: theme.colors.textDark,
        fontWeight: theme.typography.fontWeightBold,
      }
    });
    ```

Always prefer using a token over hardcoding style values to maintain consistency.

#### Basic StyleSheet Example:

```typescript
import { StyleSheet, View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, World!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
```

### State Management

This project uses React's built-in state management. For shared state between components, consider using:

- React Context
- Component props
- Local component state

## Debugging

- Use the React Developer Tools extension for Chrome/Firefox
- For mobile debugging, use the Expo Go app and the Expo DevTools
- Check the browser's console for logs and errors

## Deployment

For production deployment, you'll need to:

1. Configure environment variables
2. Build the production bundle
3. Deploy to a web server or app stores

## Getting Help

- Check the [Expo documentation](https://docs.expo.dev/)
- Refer to React Native's [official documentation](https://reactnative.dev/)
- Check the project's README for additional information

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Commit and push your changes
4. Open a pull request

## Troubleshooting

### Mercure Connection Issues
If you see SSL errors, make sure you've accepted the certificate as described in the setup steps.

### Dependency Issues
If you encounter dependency issues, try:
```bash
yarn install --check-files
# or
rm -rf node_modules && yarn install
```

### App Not Updating
Try clearing your browser cache or running:
```bash
expo start -c
```

## Next Steps

- Explore the existing components in `/components`
- Check out the game logic in `/utils`
- Join a game to see how everything works together

Happy coding! 🚀

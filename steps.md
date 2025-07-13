# Game Flow Implementation Plan

This document outlines the steps to implement the desired game flow for both Host and Player roles. We will tackle these steps one by one to ensure a stable and predictable implementation.

## 1. Core Decisions & Principles

- **State Management:** We will use **React Context** for managing our global `GameState`.
- **UI Transitions:** We will implement the **"wipe up" screen transitions** from the start using a library like `React Native Reanimated`. This will be a core part of the user experience.
- **Logging:** We will maintain **comprehensive console logging** in development mode. This includes state changes, cookie information, and any backend message events to make debugging transparent.
- **Development Helpers:**
    - To facilitate testing, **one fake player will automatically be added** to the game when a host creates a new game in development mode.

## 2. State Management Foundation

Before building the UI, we need a robust way to manage the application's state. The state will determine what the user sees and can do at any given moment.

**Proposed State Object (`GameState`):**
```typescript
interface GameState {
  // Current phase of the game for this user
  flowState: 'HOME' | 'SELECTING_PACK' | 'SELECTING_AVATAR' | 'WAITING_ROOM' | 'IN_GAME' | 'GAME_OVER';
  
  // User's role
  userRole: 'HOST' | 'PLAYER' | null;
  
  // Game details
  gameCode: string | null;
  cardPack: string | null;
  
  // Player details
  players: Player[];
  currentPlayerTurn: string; // userId of the player whose turn it is
  
  // Host-specific
  hostId: string | null;
  
  // UI state
  showAreYouSurePrompt: boolean;
}

interface Player {
    id: string;
    name: string;
    avatar: string;
    isHost: boolean;
}
```

---

## 3. Host Flow Implementation

### Step 3.1: Home Screen
- **Task:** Create UI for "Host Game" and "Join Game".
- **File:** `HomeScreen.tsx` (or similar).
- **Action:** Clicking "Host Game" should update the state: `userRole: 'HOST'` and `flowState: 'SELECTING_PACK'`.

### Step 3.2: Card Pack Selection
- **Task:** Display available card packs for the host to choose from.
- **Note:** For now, if this element doesn't exist, we will add a placeholder `<span>` or similar element and log a `console.log('Select card packs to add')` to the console. The list of packs will be a static list in the code for now.
- **Action:** On selection, update state: `cardPack: 'selected_pack_id'` and transition `flowState: 'SELECTING_AVATAR'`.

### Step 3.3: Avatar & Name Selection
- **Task:** Implement the UI for selecting an avatar and entering a display name. This is handled by `AvatarSelectionScreen.tsx`.
- **Action:** On submission, create the host `Player` object, add them to the `players` array, and transition `flowState: 'WAITING_ROOM'`.

### Step 3.4: Waiting Room (Host View)
- **Task:** Build the host's view of the `WaitingRoom.tsx` component.
- **UI Elements:**
    - "Host tip" pop-up.
    - Display the `gameCode`.
    - Display the `RuleSection` component.
    - Display the "Play Now!" button.
    - List of players.
- **Functionality:**
    - **Player Re-ordering:** Implement drag-and-drop for the host to re-arrange the `players` array. The current player's turn should be highlighted.
    - **"Play Now!" Button:** Clicking this should set `showAreYouSurePrompt: true`.

### Step 3.5: "Are You Sure?" Prompt
- **Task:** Create the confirmation prompt.
- **Action:** On confirmation, transition `flowState: 'IN_GAME'`.

### Step 3.6: In-Game View (Host)
- **Task:** Adapt the UI for the in-game state.
- **UI Changes:**
    - Hide the "Play Now!" button and room code.
    - Show the "Drink" button.
    - Add a rule card to the `RuleSection`.

---

## 4. Player Flow Implementation

### Step 4.1: Home Screen
- **Task:** The "Join Game" button on the `HomeScreen.tsx` should prompt the user for a `gameCode`.
- **Action:** On submit, set `userRole: 'PLAYER'`, store the `gameCode`, and transition `flowState: 'SELECTING_AVATAR'`.

### Step 4.2: Avatar & Name Selection
- **Task:** This should reuse the same `AvatarSelectionScreen.tsx` as the host.
- **Action:** On submission, the player joins the game session and transitions to the `WAITING_ROOM`.

### Step 4.3: Waiting Room (Player View)
- **Task:** Display the player's view of the waiting room.
- **UI Differences:**
    - The "Play Now!" button is not visible.
    - Player re-ordering is disabled.

---

Please review this updated plan. We can adjust, add, or clarify any points before we begin coding.

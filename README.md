# DDD PWA

### Development
To run:

1. `docker compose up -d` This spins up the three containers (explained under [Architecture](#architecture))
2. Navigate to https://localhost/.well-known/mercure/ui/ and **accept the certificate** in your browser. Usually you'll
be presented with a warning screen and have to click "Advanced" and then "accept risk and continue" (depending on
your browser). This will accept the self-signed certificate the Mercure hub needs for SSL.
3. The app will be running at `http://localhost:8081`. You'll want to view it in mobile view.

### Troubleshooting
#### 1. Can't connect to Mercure hub (SSL error in Network tab)
This probably means you haven't accepted the certificate in your browser. Refer to point #2 under
[Development](#development.


### Architecture
The app runs three services:
1. Expo (client-side) which is React native.
2. The token server (Rust), which manages and grants JWTs to players, so they can authenticate.
3. The Mercure hub (authenticated by JWT) for real-time messaging between clients.

Every player subscribes to three topics:
1. The game topic (/{gameCode}), for game-wide updates (such as `PlayerJoined` or `GameStarted`),
2. The user's private topic (/{gameCode}/{userId}) for user-specific updates, such as a card draw,
3. [Active subscriptions](https://mercure.rocks/spec#active-subscriptions) for the game topic, to show any disconnected
and reconnected users.

The host's client manages the card deck and publishes to the game topic and users' topics.
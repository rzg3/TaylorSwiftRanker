/**
 * Da Lao Er Socket.IO Handler
 * Manages real-time game state and player connections
 */

const GameLogic = require('./GameLogic');

// In-memory game state (single lobby for simplicity)
let gameState = {
    status: 'waiting', // 'waiting', 'playing', 'finished'
    players: [],       // { odinsessionid, username, hand, hasPassed, position }
    currentTurn: 0,
    currentPlay: null,  // { cards, playerId }
    passCount: 0,
    winner: null,
    winnerFinalPlay: null,
    scores: []
};

// Map socket IDs to session IDs
const socketToSession = new Map();

/**
 * Reset game to waiting state
 */
function resetGame() {
    gameState = {
        status: 'waiting',
        players: gameState.players.map(p => ({
            ...p,
            hand: [],
            hasPassed: false
        })),
        currentTurn: 0,
        currentPlay: null,
        passCount: 0,
        winner: null,
        winnerFinalPlay: null,
        scores: []
    };
}

/**
 * Get sanitized game state for a specific player
 * (hides other players' cards)
 */
function getGameStateForPlayer(sessionId) {
    const playerIndex = gameState.players.findIndex(p => p.sessionId === sessionId);

    return {
        status: gameState.status,
        players: gameState.players.map((p, idx) => ({
            username: p.username,
            position: p.position,
            cardCount: p.hand ? p.hand.length : 0,
            hasPassed: p.hasPassed,
            isMe: p.sessionId === sessionId
        })),
        myHand: playerIndex >= 0 && gameState.players[playerIndex].hand
            ? gameState.players[playerIndex].hand
            : [],
        currentTurn: gameState.currentTurn,
        currentPlay: gameState.currentPlay,
        isMyTurn: playerIndex === gameState.currentTurn,
        winner: gameState.winner,
        scores: gameState.scores
    };
}

/**
 * Broadcast game state to all players
 */
function broadcastGameState(io) {
    gameState.players.forEach(player => {
        const socket = [...io.sockets.sockets.values()]
            .find(s => socketToSession.get(s.id) === player.sessionId);
        if (socket) {
            socket.emit('game-state', getGameStateForPlayer(player.sessionId));
        }
    });
}

/**
 * Advance to next player's turn (skip passed players)
 */
function nextTurn() {
    const activePlayers = gameState.players.filter(p => !p.hasPassed && p.hand.length > 0);

    if (activePlayers.length <= 1) {
        // Round over, reset passes
        gameState.players.forEach(p => p.hasPassed = false);
        gameState.currentPlay = null;
        gameState.passCount = 0;

        // Next player is the one who won the round
        if (activePlayers.length === 1) {
            gameState.currentTurn = activePlayers[0].position;
        }
        return;
    }

    // Find next active player
    let next = (gameState.currentTurn + 1) % gameState.players.length;
    while (gameState.players[next].hasPassed || gameState.players[next].hand.length === 0) {
        next = (next + 1) % gameState.players.length;
    }
    gameState.currentTurn = next;
}

/**
 * Initialize Socket.IO handlers
 */
function initSocketHandler(io) {
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        // Join game lobby
        socket.on('join-game', ({ sessionId, username }) => {
            // Check if already in game
            const existing = gameState.players.find(p => p.sessionId === sessionId);
            if (existing) {
                socketToSession.set(socket.id, sessionId);
                socket.emit('game-state', getGameStateForPlayer(sessionId));
                return;
            }

            // Can only join if game is waiting and less than 4 players
            if (gameState.status !== 'waiting') {
                socket.emit('error', { message: 'Game already in progress' });
                return;
            }

            if (gameState.players.length >= 4) {
                socket.emit('error', { message: 'Lobby is full (max 4 players)' });
                return;
            }

            // Add player
            socketToSession.set(socket.id, sessionId);
            gameState.players.push({
                sessionId,
                username,
                hand: [],
                hasPassed: false,
                position: gameState.players.length
            });

            console.log(`${username} joined the lobby`);
            broadcastGameState(io);
        });

        // Leave game
        socket.on('leave-game', () => {
            const sessionId = socketToSession.get(socket.id);
            if (!sessionId) return;

            const playerIndex = gameState.players.findIndex(p => p.sessionId === sessionId);
            if (playerIndex >= 0) {
                const player = gameState.players[playerIndex];
                gameState.players.splice(playerIndex, 1);

                // Reindex positions
                gameState.players.forEach((p, idx) => p.position = idx);

                // If game was in progress, end it
                if (gameState.status === 'playing') {
                    gameState.status = 'waiting';
                    gameState.players.forEach(p => p.hand = []);
                }

                console.log(`${player.username} left the lobby`);
                broadcastGameState(io);
            }

            socketToSession.delete(socket.id);
        });

        // Start game
        socket.on('start-game', () => {
            if (gameState.status !== 'waiting') {
                socket.emit('error', { message: 'Game already started' });
                return;
            }

            if (gameState.players.length < 2) {
                socket.emit('error', { message: 'Need at least 2 players' });
                return;
            }

            // Deal cards
            const hands = GameLogic.dealCards(gameState.players.length);
            gameState.players.forEach((player, idx) => {
                player.hand = hands[idx];
                player.hasPassed = false;
            });

            // Find who has 3 of clubs
            gameState.currentTurn = GameLogic.findFirstPlayer(hands);
            gameState.status = 'playing';
            gameState.currentPlay = null;
            gameState.passCount = 0;

            console.log('Game started!');
            broadcastGameState(io);
        });

        // Play cards
        socket.on('play-cards', ({ cardIds }) => {
            const sessionId = socketToSession.get(socket.id);
            const playerIndex = gameState.players.findIndex(p => p.sessionId === sessionId);

            if (playerIndex < 0 || playerIndex !== gameState.currentTurn) {
                socket.emit('error', { message: 'Not your turn' });
                return;
            }

            const player = gameState.players[playerIndex];

            // Find the cards in player's hand
            const playedCards = cardIds.map(id => player.hand.find(c => c.id === id)).filter(Boolean);

            if (playedCards.length !== cardIds.length) {
                socket.emit('error', { message: 'Invalid cards' });
                return;
            }

            // First play of game must include 3 of clubs
            if (!gameState.currentPlay && gameState.passCount === 0) {
                const isFirstEver = gameState.players.every(p => p.hand.length ===
                    Math.floor(52 / gameState.players.length) +
                    (p.position < 52 % gameState.players.length ? 1 : 0));

                if (isFirstEver && !GameLogic.containsThreeOfClubs(playedCards)) {
                    socket.emit('error', { message: 'First play must include 3 of Clubs' });
                    return;
                }
            }

            // Validate the play beats current
            const currentCards = gameState.currentPlay ? gameState.currentPlay.cards : null;
            if (!GameLogic.canBeat(playedCards, currentCards)) {
                socket.emit('error', { message: 'Your play does not beat the current cards' });
                return;
            }

            // Remove cards from hand
            player.hand = player.hand.filter(c => !cardIds.includes(c.id));

            // Update current play
            gameState.currentPlay = { cards: playedCards, playerId: sessionId };
            gameState.passCount = 0;

            // Check for win
            if (player.hand.length === 0) {
                gameState.status = 'finished';
                gameState.winner = player.username;
                gameState.winnerFinalPlay = playedCards;

                // Calculate scores
                gameState.scores = gameState.players.map(p => {
                    if (p.sessionId === sessionId) {
                        return { username: p.username, score: 0, isWinner: true };
                    }
                    const penalty = GameLogic.calculatePenalty(p.hand, playedCards);
                    return {
                        username: p.username,
                        score: penalty.finalScore,
                        cardsLeft: p.hand.length,
                        hasMultiplier: penalty.hasMultiplier,
                        reasons: penalty.multiplierReasons,
                        isWinner: false
                    };
                });

                console.log(`${player.username} wins!`);
                broadcastGameState(io);
                return;
            }

            // Next turn
            nextTurn();
            broadcastGameState(io);
        });

        // Pass turn
        socket.on('pass-turn', () => {
            const sessionId = socketToSession.get(socket.id);
            const playerIndex = gameState.players.findIndex(p => p.sessionId === sessionId);

            if (playerIndex < 0 || playerIndex !== gameState.currentTurn) {
                socket.emit('error', { message: 'Not your turn' });
                return;
            }

            // Can't pass if no current play (you must play something)
            if (!gameState.currentPlay) {
                socket.emit('error', { message: 'You must play cards to start the round' });
                return;
            }

            const player = gameState.players[playerIndex];
            player.hasPassed = true;
            gameState.passCount++;

            console.log(`${player.username} passed`);
            nextTurn();
            broadcastGameState(io);
        });

        // New game (after finished)
        socket.on('new-game', () => {
            if (gameState.status !== 'finished') {
                socket.emit('error', { message: 'Game is not finished' });
                return;
            }

            resetGame();
            broadcastGameState(io);
        });

        // Disconnect
        socket.on('disconnect', () => {
            const sessionId = socketToSession.get(socket.id);
            if (sessionId) {
                // Don't remove player on disconnect, they might reconnect
                // Just clear the socket mapping
                socketToSession.delete(socket.id);
            }
            console.log('Socket disconnected:', socket.id);
        });

        // Get current state
        socket.on('get-state', () => {
            const sessionId = socketToSession.get(socket.id);
            if (sessionId) {
                socket.emit('game-state', getGameStateForPlayer(sessionId));
            }
        });
    });
}

module.exports = { initSocketHandler };

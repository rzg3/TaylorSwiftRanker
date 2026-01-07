/**
 * Da Lao Er Game Store
 * MobX store for managing game state on the client
 */

import { extendObservable, action, makeObservable } from 'mobx';
import { io } from 'socket.io-client';

class GameStore {
    constructor() {
        this.socket = null;

        extendObservable(this, {
            // Connection state
            connected: false,
            error: null,

            // Game state
            status: 'none', // 'none', 'lobby', 'playing', 'finished'
            players: [],
            myHand: [],
            currentTurn: 0,
            currentPlay: null,
            isMyTurn: false,
            winner: null,
            scores: [],

            // UI state
            selectedCards: []
        });

        makeObservable(this, {
            connect: action,
            disconnect: action,
            joinGame: action,
            leaveGame: action,
            startGame: action,
            playCards: action,
            passTurn: action,
            newGame: action,
            selectCard: action,
            deselectCard: action,
            clearSelection: action,
            handleGameState: action,
            handleError: action
        });
    }

    /**
     * Connect to Socket.IO server
     */
    connect(sessionId, username) {
        if (this.socket) {
            this.socket.disconnect();
        }

        this.socket = io();
        this.sessionId = sessionId;
        this.username = username;

        this.socket.on('connect', () => {
            this.connected = true;
            this.error = null;
            // Auto-join game on connect
            this.joinGame();
        });

        this.socket.on('disconnect', () => {
            this.connected = false;
        });

        this.socket.on('game-state', (state) => {
            this.handleGameState(state);
        });

        this.socket.on('error', (err) => {
            this.handleError(err);
        });
    }

    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.connected = false;
        this.status = 'none';
        this.players = [];
        this.myHand = [];
        this.selectedCards = [];
    }

    /**
     * Handle incoming game state
     */
    handleGameState(state) {
        this.status = state.status === 'waiting' ? 'lobby' : state.status;
        this.players = state.players || [];
        this.myHand = state.myHand || [];
        this.currentTurn = state.currentTurn;
        this.currentPlay = state.currentPlay;
        this.isMyTurn = state.isMyTurn;
        this.winner = state.winner;
        this.scores = state.scores || [];

        // Clear selection if cards were played
        this.selectedCards = this.selectedCards.filter(
            id => this.myHand.some(c => c.id === id)
        );
    }

    /**
     * Handle error from server
     */
    handleError(err) {
        this.error = err.message;
        // Clear error after 3 seconds
        setTimeout(() => {
            this.error = null;
        }, 3000);
    }

    /**
     * Join the game lobby
     */
    joinGame() {
        if (!this.socket) return;
        this.socket.emit('join-game', {
            sessionId: this.sessionId,
            username: this.username
        });
    }

    /**
     * Leave the game
     */
    leaveGame() {
        if (!this.socket) return;
        this.socket.emit('leave-game');
        this.status = 'none';
    }

    /**
     * Start the game
     */
    startGame() {
        if (!this.socket) return;
        this.socket.emit('start-game');
    }

    /**
     * Play selected cards
     */
    playCards() {
        if (!this.socket || this.selectedCards.length === 0) return;
        this.socket.emit('play-cards', { cardIds: this.selectedCards });
        this.selectedCards = [];
    }

    /**
     * Pass turn
     */
    passTurn() {
        if (!this.socket) return;
        this.socket.emit('pass-turn');
    }

    /**
     * Start a new game after finished
     */
    newGame() {
        if (!this.socket) return;
        this.socket.emit('new-game');
    }

    /**
     * Select a card to play
     */
    selectCard(cardId) {
        if (!this.selectedCards.includes(cardId)) {
            this.selectedCards.push(cardId);
        }
    }

    /**
     * Deselect a card
     */
    deselectCard(cardId) {
        this.selectedCards = this.selectedCards.filter(id => id !== cardId);
    }

    /**
     * Toggle card selection
     */
    toggleCard(cardId) {
        if (this.selectedCards.includes(cardId)) {
            this.deselectCard(cardId);
        } else {
            this.selectCard(cardId);
        }
    }

    /**
     * Clear all selected cards
     */
    clearSelection() {
        this.selectedCards = [];
    }
}

export default new GameStore();

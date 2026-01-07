/**
 * Da Lao Er Main Component
 * Container for the card game
 */

import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import GameStore from '../stores/GameStore';
import UserStore from '../stores/UserStore';
import Lobby from './Lobby';
import GameBoard from './GameBoard';
import ScoreBoard from './ScoreBoard';
import './DaLaoEr.css';

function DaLaoEr() {
    const { status, connected } = GameStore;
    const { isLoggedIn, username } = UserStore;

    useEffect(() => {
        // Connect when component mounts (if logged in)
        if (isLoggedIn && username) {
            // Use a simple session ID based on username + timestamp
            const sessionId = `${username}_${Date.now()}`;
            GameStore.connect(sessionId, username);
        }

        // Cleanup on unmount
        return () => {
            GameStore.disconnect();
        };
    }, [isLoggedIn, username]);

    if (!isLoggedIn) {
        return (
            <div className="dalaoer-container">
                <div className="dalaoer-login-prompt">
                    <h2>🎴 Da Lao Er</h2>
                    <p>Please log in to play!</p>
                </div>
            </div>
        );
    }

    if (!connected) {
        return (
            <div className="dalaoer-container">
                <div className="dalaoer-connecting">
                    <h2>🎴 Da Lao Er</h2>
                    <p>Connecting to game server...</p>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="dalaoer-container">
            {status === 'lobby' && <Lobby />}
            {status === 'playing' && <GameBoard />}
            {status === 'finished' && <ScoreBoard />}
            {status === 'none' && (
                <div className="dalaoer-welcome">
                    <h2>🎴 Da Lao Er</h2>
                    <p className="welcome-subtitle">大老二 • Big Two</p>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => GameStore.joinGame()}
                    >
                        Join Game Lobby
                    </button>
                </div>
            )}
        </div>
    );
}

export default observer(DaLaoEr);

/**
 * Lobby Component
 * Shows players in lobby and start button
 */

import React from 'react';
import { observer } from 'mobx-react';
import GameStore from '../stores/GameStore';
import './DaLaoEr.css';

function Lobby() {
    const { players, connected, error } = GameStore;

    const canStart = players.length >= 2;

    return (
        <div className="lobby">
            <h2>🎴 Da Lao Er Lobby</h2>
            <p className="lobby-subtitle">大老二 • Big Two</p>

            {error && <div className="error-message">{error}</div>}

            <div className="lobby-players">
                <h3>Players ({players.length}/4)</h3>
                {players.length === 0 ? (
                    <p className="lobby-empty">Waiting for players...</p>
                ) : (
                    <ul className="player-list">
                        {players.map((player, idx) => (
                            <li key={idx} className={`player-item ${player.isMe ? 'player-me' : ''}`}>
                                <span className="player-icon">👤</span>
                                <span className="player-name">{player.username}</span>
                                {player.isMe && <span className="player-tag">(You)</span>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="lobby-actions">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => GameStore.startGame()}
                    disabled={!canStart}
                >
                    {canStart ? '🚀 Start Game' : `Need ${2 - players.length} more player(s)`}
                </button>

                <button
                    className="btn btn-secondary"
                    onClick={() => GameStore.leaveGame()}
                >
                    Leave Lobby
                </button>
            </div>

            <div className="lobby-rules">
                <h4>Quick Rules</h4>
                <ul>
                    <li>Play singles, pairs, straights, or full house</li>
                    <li>2s are highest, suits: ♠ → ♥ → ♦ → ♣</li>
                    <li>3♣ goes first</li>
                    <li>Pass means you're out for the round</li>
                    <li>First to empty hand wins!</li>
                </ul>
            </div>
        </div>
    );
}

export default observer(Lobby);

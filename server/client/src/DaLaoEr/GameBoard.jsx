/**
 * GameBoard Component
 * Main game view during play
 */

import React from 'react';
import { observer } from 'mobx-react';
import GameStore from '../stores/GameStore';
import PlayerHand from './PlayerHand';
import OpponentHand from './OpponentHand';
import PlayArea from './PlayArea';
import './DaLaoEr.css';

function GameBoard() {
    const { players, currentTurn, isMyTurn, selectedCards, error } = GameStore;

    // Get opponents (not me)
    const opponents = players.filter(p => !p.isMe);
    const me = players.find(p => p.isMe);

    return (
        <div className="game-board">
            {error && <div className="error-message">{error}</div>}

            {/* Opponents at top */}
            <div className="opponents-area">
                {opponents.map((player, idx) => (
                    <OpponentHand
                        key={idx}
                        player={player}
                        isCurrent={player.position === currentTurn}
                    />
                ))}
            </div>

            {/* Play area in center */}
            <PlayArea />

            {/* Action buttons */}
            <div className="action-bar">
                {isMyTurn ? (
                    <>
                        <span className="turn-indicator">🎯 Your Turn!</span>
                        <button
                            className="btn btn-primary"
                            onClick={() => GameStore.playCards()}
                            disabled={selectedCards.length === 0}
                        >
                            Play Cards ({selectedCards.length})
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => GameStore.passTurn()}
                        >
                            Pass
                        </button>
                        <button
                            className="btn btn-outline"
                            onClick={() => GameStore.clearSelection()}
                            disabled={selectedCards.length === 0}
                        >
                            Clear
                        </button>
                    </>
                ) : (
                    <span className="turn-indicator waiting">
                        Waiting for {players[currentTurn]?.username || 'opponent'}...
                    </span>
                )}
            </div>

            {/* My hand at bottom */}
            <PlayerHand />
        </div>
    );
}

export default observer(GameBoard);

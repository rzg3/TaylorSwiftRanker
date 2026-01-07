/**
 * Opponent Hand Component
 * Shows other players' cards face down with count
 */

import React from 'react';
import { observer } from 'mobx-react';
import './DaLaoEr.css';

function OpponentHand({ player, isCurrent }) {
    // Show a few face-down cards to represent their hand
    const displayCount = Math.min(player.cardCount, 5);

    return (
        <div className={`opponent-hand ${isCurrent ? 'opponent-current' : ''} ${player.hasPassed ? 'opponent-passed' : ''}`}>
            <div className="opponent-info">
                <span className="opponent-name">{player.username}</span>
                <span className="opponent-count">{player.cardCount} cards</span>
                {player.hasPassed && <span className="opponent-status">Passed</span>}
                {isCurrent && !player.hasPassed && <span className="opponent-turn">Their Turn</span>}
            </div>
            <div className="opponent-cards">
                {Array.from({ length: displayCount }).map((_, idx) => (
                    <div key={idx} className="card card-back card-small card-stacked" style={{ left: idx * 15 }}>
                        <div className="card-pattern">🎴</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default observer(OpponentHand);

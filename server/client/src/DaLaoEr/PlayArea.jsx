/**
 * Play Area Component
 * Shows the current cards in play
 */

import React from 'react';
import { observer } from 'mobx-react';
import Card from './Card';
import GameStore from '../stores/GameStore';
import './DaLaoEr.css';

function PlayArea() {
    const { currentPlay, players } = GameStore;

    if (!currentPlay) {
        return (
            <div className="play-area">
                <div className="play-area-empty">
                    <p>No cards in play</p>
                    <p className="play-hint">Start a new round!</p>
                </div>
            </div>
        );
    }

    const player = players.find(p => p.isMe && currentPlay.playerId === p.sessionId)
        || players.find(p => currentPlay.playerId);

    return (
        <div className="play-area">
            <div className="play-area-cards">
                {currentPlay.cards.map((card) => (
                    <Card key={card.id} card={card} small />
                ))}
            </div>
            <p className="play-area-info">Last played</p>
        </div>
    );
}

export default observer(PlayArea);

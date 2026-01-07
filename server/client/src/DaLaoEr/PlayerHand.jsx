/**
 * Player Hand Component
 * Displays the current player's cards with selection
 */

import React from 'react';
import { observer } from 'mobx-react';
import Card from './Card';
import GameStore from '../stores/GameStore';
import './DaLaoEr.css';

function PlayerHand() {
    const { myHand, selectedCards, isMyTurn } = GameStore;

    const handleCardClick = (cardId) => {
        if (isMyTurn) {
            GameStore.toggleCard(cardId);
        }
    };

    return (
        <div className="player-hand">
            <h3>Your Cards ({myHand.length})</h3>
            <div className="hand-cards">
                {myHand.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        selected={selectedCards.includes(card.id)}
                        onClick={() => handleCardClick(card.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default observer(PlayerHand);

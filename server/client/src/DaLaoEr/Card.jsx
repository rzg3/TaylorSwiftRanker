/**
 * Card Component
 * Displays a single playing card with selection state
 */

import React from 'react';
import { observer } from 'mobx-react';
import './DaLaoEr.css';

const SUIT_SYMBOLS = {
    'C': '♣',
    'D': '♦',
    'H': '♥',
    'S': '♠'
};

const SUIT_COLORS = {
    'C': 'black',
    'D': 'red',
    'H': 'red',
    'S': 'black'
};

function Card({ card, selected, onClick, faceDown, small }) {
    if (faceDown) {
        return (
            <div className={`card card-back ${small ? 'card-small' : ''}`}>
                <div className="card-pattern">🎴</div>
            </div>
        );
    }

    const suitSymbol = SUIT_SYMBOLS[card.suit];
    const suitColor = SUIT_COLORS[card.suit];

    return (
        <div
            className={`card ${selected ? 'card-selected' : ''} ${small ? 'card-small' : ''}`}
            onClick={onClick}
            style={{ color: suitColor }}
        >
            <div className="card-corner card-corner-top">
                <span className="card-rank">{card.rank}</span>
                <span className="card-suit">{suitSymbol}</span>
            </div>
            <div className="card-center">
                <span className="card-suit-large">{suitSymbol}</span>
            </div>
            <div className="card-corner card-corner-bottom">
                <span className="card-rank">{card.rank}</span>
                <span className="card-suit">{suitSymbol}</span>
            </div>
        </div>
    );
}

export default observer(Card);

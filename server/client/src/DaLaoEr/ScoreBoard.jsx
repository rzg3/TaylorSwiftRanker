/**
 * ScoreBoard Component
 * Shows final scores when game ends
 */

import React from 'react';
import { observer } from 'mobx-react';
import GameStore from '../stores/GameStore';
import './DaLaoEr.css';

function ScoreBoard() {
    const { winner, scores } = GameStore;

    return (
        <div className="score-board">
            <h2>🏆 Game Over!</h2>
            <p className="winner-announcement">{winner} wins!</p>

            <div className="scores-table">
                <h3>Final Scores</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Cards Left</th>
                            <th>Penalty</th>
                            <th>Multiplier</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, idx) => (
                            <tr key={idx} className={score.isWinner ? 'winner-row' : 'loser-row'}>
                                <td>
                                    {score.username}
                                    {score.isWinner && ' 🥇'}
                                </td>
                                <td>{score.isWinner ? '-' : score.cardsLeft}</td>
                                <td className={score.score > 0 ? 'penalty-score' : ''}>
                                    {score.isWinner ? '0' : score.score}
                                </td>
                                <td>
                                    {score.hasMultiplier && (
                                        <span className="multiplier-badge">
                                            2x
                                            {score.reasons?.loserHasTwo && ' (had 2)'}
                                            {score.reasons?.winnerPlayedTwo && ' (won with 2)'}
                                            {score.reasons?.hasTenOrMore && ' (10+ cards)'}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="score-actions">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => GameStore.newGame()}
                >
                    🔄 Play Again
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => GameStore.leaveGame()}
                >
                    Leave Game
                </button>
            </div>
        </div>
    );
}

export default observer(ScoreBoard);

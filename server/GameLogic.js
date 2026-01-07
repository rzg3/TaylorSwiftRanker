/**
 * Da Lao Er (Big Two) Game Logic
 * Pure functions for card ranking, hand validation, and scoring
 */

// Card suits ranked: Club < Diamond < Heart < Spade
const SUITS = { 'C': 1, 'D': 2, 'H': 3, 'S': 4 };
const SUIT_NAMES = { 'C': '♣', 'D': '♦', 'H': '♥', 'S': '♠' };

// Card ranks: 3 is lowest, 2 is highest
const RANKS = {
  '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14, '2': 15
};

// Hand types in order of precedence
const HAND_TYPES = {
  INVALID: 0,
  SINGLE: 1,
  PAIR: 2,
  STRAIGHT: 3,
  FULL_HOUSE: 4,
  BOMB_FOUR: 5,      // 4 of a kind + 1
  BOMB_STRAIGHT_FLUSH: 6
};

/**
 * Create a standard 52-card deck (no jokers)
 */
function createDeck() {
  const deck = [];
  const ranks = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
  const suits = ['C', 'D', 'H', 'S'];
  
  for (const rank of ranks) {
    for (const suit of suits) {
      deck.push({ rank, suit, id: `${rank}${suit}` });
    }
  }
  return deck;
}

/**
 * Shuffle deck using Fisher-Yates algorithm
 */
function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deal cards to players
 * @param {number} playerCount - Number of players (2-4)
 * @returns {Array} Array of hands for each player
 */
function dealCards(playerCount) {
  const deck = shuffleDeck(createDeck());
  const hands = Array.from({ length: playerCount }, () => []);
  
  // Deal cards round-robin
  for (let i = 0; i < deck.length; i++) {
    hands[i % playerCount].push(deck[i]);
  }
  
  // Sort each hand
  hands.forEach(hand => sortHand(hand));
  
  return hands;
}

/**
 * Sort a hand by rank then suit
 */
function sortHand(hand) {
  hand.sort((a, b) => {
    const rankDiff = RANKS[a.rank] - RANKS[b.rank];
    if (rankDiff !== 0) return rankDiff;
    return SUITS[a.suit] - SUITS[b.suit];
  });
  return hand;
}

/**
 * Get the card value for comparison (rank * 10 + suit)
 */
function getCardValue(card) {
  return RANKS[card.rank] * 10 + SUITS[card.suit];
}

/**
 * Find which player has 3 of Clubs (goes first)
 */
function findFirstPlayer(hands) {
  for (let i = 0; i < hands.length; i++) {
    if (hands[i].some(card => card.rank === '3' && card.suit === 'C')) {
      return i;
    }
  }
  return 0;
}

/**
 * Check if cards form a valid straight (5+ consecutive)
 * Special case: 2-3-4-5-6 is valid (2 acts as tiebreaker)
 */
function isStraight(cards) {
  if (cards.length < 5) return false;
  
  const sorted = [...cards].sort((a, b) => RANKS[a.rank] - RANKS[b.rank]);
  const ranks = sorted.map(c => RANKS[c.rank]);
  
  // Check for special 2-3-4-5-6 straight
  const has2 = ranks.includes(15);
  if (has2 && ranks.length === 5) {
    const lowRanks = ranks.filter(r => r !== 15);
    if (lowRanks.join(',') === '3,4,5,6') {
      return true;
    }
  }
  
  // Normal straight check (no 2s allowed except in special case above)
  if (has2 && !ranks.filter(r => r !== 15).every(r => r <= 6)) {
    return false;
  }
  
  // Check consecutive
  for (let i = 1; i < sorted.length; i++) {
    if (RANKS[sorted[i].rank] - RANKS[sorted[i-1].rank] !== 1) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if cards are all same suit
 */
function isFlush(cards) {
  if (cards.length === 0) return false;
  return cards.every(c => c.suit === cards[0].suit);
}

/**
 * Identify the hand type
 */
function identifyHandType(cards) {
  if (!cards || cards.length === 0) {
    return { type: HAND_TYPES.INVALID, highCard: null };
  }
  
  const len = cards.length;
  const rankCounts = {};
  
  cards.forEach(c => {
    rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
  });
  
  const counts = Object.values(rankCounts).sort((a, b) => b - a);
  const sorted = [...cards].sort((a, b) => getCardValue(b) - getCardValue(a));
  
  // Single
  if (len === 1) {
    return { type: HAND_TYPES.SINGLE, highCard: cards[0] };
  }
  
  // Pair
  if (len === 2 && counts[0] === 2) {
    return { type: HAND_TYPES.PAIR, highCard: sorted[0] };
  }
  
  // Straight flush (bomb) - 5+ cards
  if (len >= 5 && isStraight(cards) && isFlush(cards)) {
    return { type: HAND_TYPES.BOMB_STRAIGHT_FLUSH, highCard: sorted[0] };
  }
  
  // Four of a kind + 1 (bomb)
  if (len === 5 && counts[0] === 4) {
    // High card is the highest of the four
    const fourRank = Object.keys(rankCounts).find(r => rankCounts[r] === 4);
    const fourCards = cards.filter(c => c.rank === fourRank);
    const highFour = fourCards.sort((a, b) => SUITS[b.suit] - SUITS[a.suit])[0];
    return { type: HAND_TYPES.BOMB_FOUR, highCard: highFour };
  }
  
  // Straight - 5+ cards
  if (len >= 5 && isStraight(cards)) {
    return { type: HAND_TYPES.STRAIGHT, highCard: sorted[0] };
  }
  
  // Full house - 3 of a kind + pair
  if (len === 5 && counts[0] === 3 && counts[1] === 2) {
    // High card is determined by the triple
    const tripleRank = Object.keys(rankCounts).find(r => rankCounts[r] === 3);
    const tripleCards = cards.filter(c => c.rank === tripleRank);
    const highTriple = tripleCards.sort((a, b) => SUITS[b.suit] - SUITS[a.suit])[0];
    return { type: HAND_TYPES.FULL_HOUSE, highCard: highTriple };
  }
  
  return { type: HAND_TYPES.INVALID, highCard: null };
}

/**
 * Compare two hands - returns true if playedHand beats currentHand
 */
function canBeat(playedHand, currentHand) {
  const played = identifyHandType(playedHand);
  const current = identifyHandType(currentHand);
  
  if (played.type === HAND_TYPES.INVALID) {
    return false;
  }
  
  // If no current hand (new round), any valid hand can be played
  if (!currentHand || currentHand.length === 0) {
    return played.type !== HAND_TYPES.INVALID;
  }
  
  // Bombs can beat anything (except higher bombs)
  if (played.type >= HAND_TYPES.BOMB_FOUR && current.type < HAND_TYPES.BOMB_FOUR) {
    return true;
  }
  
  // Straight flush beats four of a kind
  if (played.type === HAND_TYPES.BOMB_STRAIGHT_FLUSH && current.type === HAND_TYPES.BOMB_FOUR) {
    return true;
  }
  
  // Same type comparison
  if (played.type === current.type) {
    // Must be same length for straights
    if (played.type === HAND_TYPES.STRAIGHT || played.type === HAND_TYPES.BOMB_STRAIGHT_FLUSH) {
      if (playedHand.length !== currentHand.length) {
        return false;
      }
    }
    return getCardValue(played.highCard) > getCardValue(current.highCard);
  }
  
  return false;
}

/**
 * Check if first play contains 3 of Clubs
 */
function containsThreeOfClubs(cards) {
  return cards.some(c => c.rank === '3' && c.suit === 'C');
}

/**
 * Calculate penalty score for loser
 * @param {Array} hand - Remaining cards in loser's hand
 * @param {Array} winnerFinalPlay - Winner's final play
 * @returns {Object} { baseScore, hasMultiplier, finalScore }
 */
function calculatePenalty(hand, winnerFinalPlay) {
  const baseScore = hand.length;
  
  // Check for 2x multiplier conditions (max 2x, doesn't stack)
  const loserHasTwo = hand.some(c => c.rank === '2');
  const winnerPlayedTwo = winnerFinalPlay && winnerFinalPlay.some(c => c.rank === '2');
  const hasTenOrMore = hand.length >= 10;
  
  const hasMultiplier = loserHasTwo || winnerPlayedTwo || hasTenOrMore;
  const finalScore = hasMultiplier ? baseScore * 2 : baseScore;
  
  return {
    baseScore,
    hasMultiplier,
    multiplierReasons: {
      loserHasTwo,
      winnerPlayedTwo,
      hasTenOrMore
    },
    finalScore
  };
}

/**
 * Get display string for a card
 */
function cardToString(card) {
  return `${card.rank}${SUIT_NAMES[card.suit]}`;
}

/**
 * Get display string for a hand
 */
function handToString(cards) {
  return cards.map(cardToString).join(' ');
}

module.exports = {
  SUITS,
  SUIT_NAMES,
  RANKS,
  HAND_TYPES,
  createDeck,
  shuffleDeck,
  dealCards,
  sortHand,
  getCardValue,
  findFirstPlayer,
  isStraight,
  isFlush,
  identifyHandType,
  canBeat,
  containsThreeOfClubs,
  calculatePenalty,
  cardToString,
  handToString
};

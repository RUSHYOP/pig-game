'use strict';

// DOM elements
const players = document.querySelectorAll('.player');
const dice = document.querySelector('.dice');
const hold = document.querySelector('.btn--hold');
const rolldice = document.querySelector('.btn--roll');
const newgame = document.querySelector('.btn--new');
const instructions = document.querySelector('.btn--instructions');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closemodalbutton = document.querySelector('.close-modal');
const gameOverModal = document.querySelector('.game-over');
const winnerText = document.querySelector('.winner-text');
const closeGameOverBtn = document.querySelector('.close-gameover');
const endgame = document.querySelectorAll('.btn--end');
const setChancesBtn = document.querySelector('.btn--setchances');
const chanceInput = document.getElementById('chance-input');

// Default chances
let customChances = 3;
let dicePool = [];
let rollLocked = false;

// Player class
class Player {
  constructor(active) {
    this.currentscore = 0;
    this.lefttolose = customChances;
    this.totalscore = 0;
    this.active = active;
  }
}

// Initialize players
let player0 = new Player(true);
let player1 = new Player(false);

// Utility functions
const updateChances = (which, value) => {
  document.getElementById(
    `chances--${which}`
  ).textContent = `Chances Left: ${value}`;
};

const updateScore = (which, type, value) => {
  document.querySelector(`#${type}--${which}`).textContent = value;
  console.log(`Player ${which} ${type}: ${value}`);
};

const updateActive = () => {
  player0.active = !player0.active;
  player1.active = !player1.active;
  players[0].classList.toggle('player--active', player0.active);
  players[1].classList.toggle('player--active', player1.active);
};

const changeDice = rolled => (dice.src = `dices/dice-${rolled}.png`);

const shuffleDice = () => {
  dicePool = [1, 2, 3, 4, 5, 6];
  for (let i = dicePool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dicePool[i], dicePool[j]] = [dicePool[j], dicePool[i]];
  }
};

const randomNumber = () => {
  if (dicePool.length === 0) shuffleDice();
  return dicePool.pop();
};

const toggleModal = show => {
  modal.classList.toggle('hidden', !show);
  overlay.classList.toggle('hidden', !show);
};

const toggleGameOver = (show, winner = '') => {
  gameOverModal.classList.toggle('hidden', !show);
  overlay.classList.toggle('hidden', !show);
  winnerText.textContent = `${winner} Wins!`;
};

const gameReset = () => {
  player0 = new Player(true);
  player1 = new Player(false);
  player0.lefttolose = customChances;
  player1.lefttolose = customChances;
  updateScore(0, 'current', player0.currentscore);
  updateScore(0, 'score', player0.totalscore);
  updateScore(1, 'score', player1.totalscore);
  updateScore(1, 'current', player1.currentscore);
  updateChances(0, customChances);
  updateChances(1, customChances);
};

const handleRolledOne = () => {
  const currentPlayer = player0.active ? player0 : player1;
  const index = player0.active ? 0 : 1;
  currentPlayer.currentscore = 0;
  currentPlayer.lefttolose--;

  updateScore(index, 'current', 0);
  updateChances(index, currentPlayer.lefttolose);

  if (currentPlayer.lefttolose === 0) {
    toggleGameOver(true, player0.active ? 'Player 2' : 'Player 1');
    return;
  }

  updateActive();
};

const decideWinner = () => {
  let winner;
  if (player0.totalscore > player1.totalscore) winner = 'Player 1';
  else if (player1.totalscore > player0.totalscore) winner = 'Player 2';
  else winner = "No one. It's a tie!";

  toggleGameOver(true, winner);
};

// Event listeners
rolldice.addEventListener('click', () => {
  if (rollLocked) return;

  rollLocked = true;
  rolldice.disabled = true;

  const rolled = randomNumber();
  const currentPlayer = player0.active ? player0 : player1;
  const index = player0.active ? 0 : 1;

  // Animate dice
  dice.classList.add('roll');
  changeDice(rolled);

  setTimeout(() => {
    dice.classList.remove('roll');
    if (rolled !== 1) {
      currentPlayer.currentscore += rolled;
      updateScore(index, 'current', currentPlayer.currentscore);
    } else {
      changeDice(1);
      handleRolledOne();
    }

    rollLocked = false;
    rolldice.disabled = false;
  }, 350);
});

hold.addEventListener('click', () => {
  const currentPlayer = player0.active ? player0 : player1;
  const index = player0.active ? 0 : 1;

  currentPlayer.totalscore += currentPlayer.currentscore;
  currentPlayer.currentscore = 0;

  updateScore(index, 'score', currentPlayer.totalscore);
  updateScore(index, 'current', 0);
  updateActive();
});

newgame.addEventListener('click', gameReset);
endgame.forEach(btn => btn.addEventListener('click', decideWinner));

closeGameOverBtn.addEventListener('click', () => {
  toggleGameOver(false);
  gameReset();
});

instructions.addEventListener('click', () => toggleModal(true));
closemodalbutton.addEventListener('click', () => toggleModal(false));

setChancesBtn.addEventListener('click', () => {
  const value = parseInt(chanceInput.value);

  if (!isNaN(value) && value > 0 && value <= 10) {
    customChances = value;
    gameReset();
    alert(`Chances to lose set to ${customChances}`);
    updateChances(0, customChances);
    updateChances(1, customChances);
  } else {
    alert('Enter a number between 1 and 10');
  }
});

'use strict';

//objects
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

let customChances = 3; // Default if user doesn’t set

//update chances
const updatechances = (which, custom) => {
  document.getElementById(
    `chances--${which}`
  ).textContent = `Chances Left: ${custom}`;
};
//player class
class Player {
  constructor(active) {
    this.currentscore = 0;
    this.lefttolose = customChances;
    this.totalscore = 0;
    this.active = active;
  }
}

// show/hide game over
const toggleGameOver = (show, winner = '') => {
  gameOverModal.classList.toggle('hidden', !show);
  overlay.classList.toggle('hidden', !show);
  winnerText.textContent = `${winner} Wins!`;
};

//local active status
const updateactive = () => {
  player0.active = !player0.active;
  player1.active = !player1.active;
  players[0].classList.toggle('player--active', player0.active);
  players[1].classList.toggle('player--active', player1.active);
};

//instructions toggle
const toggle = show => {
  modal.classList.toggle('hidden', !show);
  overlay.classList.toggle('hidden', !show);
};

//dice image changer
const changedice = rolled => (dice.src = `dices/dice-${rolled}.png`);

//new game
const gamereset = () => {
  player0 = new Player(true);
  player1 = new Player(false);
  player0.lefttolose = customChances;
  player1.lefttolose = customChances;
  updatescore(0, 'current', player0.currentscore);
  updatescore(0, 'score', player0.totalscore);
  updatescore(1, 'score', player1.totalscore);
  updatescore(1, 'current', player1.currentscore);
  updatechances(0, customChances);
  updatechances(1, customChances);
};

//score updater
const updatescore = (which, type, score) => {
  document.querySelector(`#${type}--${which}`).textContent = score;
  console.log(`Player ${which} ${type}: ${score}`);
};

//when player rolls 1
const rolled1 = () => {
  if (player0.active) {
    player0.currentscore = 0;
    player0.lefttolose--;
    updatescore(0, 'current', player0.currentscore);
    updatechances(0, player0.lefttolose);
    if (player0.lefttolose === 0) {
      toggleGameOver(true, 'Player 2');
      return;
    }
    updateactive();
  } else {
    player1.currentscore = 0;
    player1.lefttolose--;
    updatescore(1, 'current', player1.currentscore);
    updatechances(1, player1.lefttolose);
    if (player1.lefttolose === 0) {
      toggleGameOver(true, 'Player 1');
      return;
    }
    updateactive();
  }
};

//winner
const winnr = () => {
  let winner;
  if (player0.totalscore > player1.totalscore) winner = 'Player 1';
  else if (player1.totalscore > player0.totalscore) winner = 'Player 2';
  else winner = "No one. It's a tie!";
  toggleGameOver(true, winner);
};
//dice logic
const randomNumber = () => Math.floor(Math.random() * 6 + 1);

//player objects
let player0 = new Player(true);
let player1 = new Player(false);

//rolling dice
rolldice.addEventListener('click', () => {
  const rolled = randomNumber();
  // Animate dice
  dice.classList.add('roll');
  setTimeout(() => dice.classList.remove('roll'), 300);

  if (player0.active) {
    if (rolled !== 1) {
      player0.currentscore += rolled;
      changedice(rolled);
      updatescore(0, 'current', player0.currentscore);
    } else {
      changedice(1);
      rolled1();
    }
  } else {
    if (rolled !== 1) {
      player1.currentscore += rolled;
      changedice(rolled);
      updatescore(1, 'current', player1.currentscore);
    } else {
      changedice(1);
      rolled1();
    }
  }
});

//holding score
hold.addEventListener('click', () => {
  if (player0.active) {
    player0.totalscore += player0.currentscore;
    player0.currentscore = 0;
    updatescore(0, 'score', player0.totalscore);
    updatescore(0, 'current', 0);
    updateactive();
  } else {
    player1.totalscore += player1.currentscore;
    player1.currentscore = 0;
    updatescore(1, 'score', player1.totalscore);
    updatescore(1, 'current', 0);
    updateactive();
  }
});

//new game
newgame.addEventListener('click', gamereset);

//end game
endgame.forEach(btn => btn.addEventListener('click', winnr));

//close game button
closeGameOverBtn.addEventListener('click', () => {
  toggleGameOver(false);
  gamereset();
});

//instructions button
instructions.addEventListener('click', () => toggle(true));
closemodalbutton.addEventListener('click', () => toggle(false));

//custom chances
setChancesBtn.addEventListener('click', () => {
  const value = parseInt(chanceInput.value);
  if (!isNaN(value) && value > 0 && value <= 10) {
    customChances = value;
    gamereset(); // Restart game with new chance count
    alert(`Chances to lose set to ${customChances}`);
    updatechances(0, customChances);
    updatechances(1, customChances);
  } else {
    alert('Enter a number between 1 and 10');
  }
});

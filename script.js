'use strict';

//local active status
const updateactive = () => {
  player1.active = !player1.active;
  player2.active = !player2.active;
};

//dice image changer
const changedice = rolled => (dice.src = `dices/dice-${rolled}.png`);

//score updater
const updatescore = (which, type, score) => {
  document.querySelector(`#${type}--${which}`).textContent = score;
};

//when player rolls 1
const rolled1 = () => {
  if (player1.active) {
    console.log(`player 1 rolled: 0`);
    player1.currentscore = 0;
    updatescore(0, 'current', player1.currentscore);
    player2.makeactive();
  } else {
    console.log(`player 2 rolled: 0`);
    player2.currentscore = 0;
    updatescore(1, 'current', player2.currentscore);
    player1.makeactive();
  }
};

//dice logic
const randomNumber = () => Math.floor(Math.random() * 6 + 1);

//objects
const players = document.querySelectorAll('.player');
const dice = document.querySelector('.dice');
const currentscore = document.querySelectorAll('.score');
const hold = document.querySelector('.btn--hold');
const rolldice = document.querySelector('.btn--roll');
const newgame = document.querySelector('.btn--new');

//player 1 object
let player1 = {
  currentscore: 0,
  totalscore: 0,
  active: false,
  makeactive: () => {
    players[0].classList.toggle('player--active', true);
    players[1].classList.toggle('player--active', false);
    updateactive();
  },
};

//player 2 object
let player2 = {
  currentscore: 0,
  totalscore: 0,
  active: true,
  makeactive: () => {
    players[1].classList.toggle('player--active', true);
    players[0].classList.toggle('player--active', false);
    updateactive();
  },
};

//making player 1 the first active player
player1.makeactive();

//rolling dice
rolldice.addEventListener('click', () => {
  const rolled = randomNumber();
  if (player1.active) {
    if (rolled !== 1) {
      player1.currentscore += rolled;
      console.log(`player 1 rolled: ${rolled}`);
      changedice(rolled);
      updatescore(0, 'current', player1.currentscore);
    } else {
      changedice(1);
      rolled1();
    }
  } else {
    if (rolled !== 1) {
      player2.currentscore += rolled;
      console.log(`player 2 rolled: ${rolled}`);
      changedice(rolled);
      updatescore(1, 'current', player2.currentscore);
    } else {
      changedice(1);
      rolled1();
    }
  }
});

//holding score
hold.addEventListener('click', () => {
  if (player1.active) {
    player1.totalscore += player1.currentscore;
    player1.currentscore = 0;
    updatescore(0, 'score', player1.totalscore);
    console.log('player 1 total: ', player1.totalscore);
    player2.makeactive();
  } else {
    player2.totalscore += player2.currentscore;
    player2.currentscore = 0;
    updatescore(1, 'score', player2.totalscore);
    console.log('player 2 total: ', player2.totalscore);
    player1.makeactive();
  }
});

//new game
newgame.addEventListener('click', () => {
  player1.makeactive();
  player1.totalscore = 0;
  player1.currentscore = 0;
  updatescore(0, 'current', player1.currentscore);
  updatescore(0, 'score', player1.totalscore);

  player2.totalscore = 0;
  player2.currentscore = 0;
  updatescore(1, 'score', player2.totalscore);
  updatescore(1, 'current', player2.currentscore);
});

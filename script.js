'use strict';

const updateactive = () => {
  player1.active = !player1.active;
  player2.active = !player2.active;
};

const changedice = rolled => (dice.src = `dice-${rolled}.png`);

const updatescore = (which, type, score) => {
  document.querySelector(`#${type}--${which}`).textContent = score;
};

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

const randomNumber = () => Math.floor(Math.random() * 6 + 1);

const players = document.querySelectorAll('.player');
const dice = document.querySelector('.dice');
const currentscore = document.querySelectorAll('.score');
const hold = document.querySelector('.btn--hold');
const rolldice = document.querySelector('.btn--roll');
const newgame = document.querySelector('.btn--new');

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

player1.makeactive();

rolldice.addEventListener('click', () => {
  const rolled = randomNumber();
  if (player1.active) {
    if (rolled !== 1) {
      player1.currentscore += rolled;
      console.log(`player 1 rolled: ${rolled}`);
      changedice(rolled);
      updatescore(0, 'current', player1.currentscore);
    } else rolled1();
  } else {
    if (rolled !== 1) {
      player2.currentscore += rolled;
      console.log(`player 2 rolled: ${rolled}`);
      changedice(rolled);
      updatescore(1, 'current', player2.currentscore);
    } else rolled1();
  }
});

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

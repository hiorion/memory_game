// Seleciona todas as cartas e elementos do DOM
const cards = document.querySelectorAll('.card');
const movesText = document.getElementById("moves"); // texto com contador de movimentos

// Sons
const flipSound = new Audio("flip.mp3");   // som ao virar carta
const matchSound = new Audio("match.mp3"); // som ao acertar par

// Variáveis de controle
let hasFlippedCard = false;  // controla se a primeira carta foi virada
let lockBoard = false;       // impede ações durante animações
let firstCard, secondCard;   // armazena as duas cartas clicadas
let moves = 0;               // contador de jogadas

// Função chamada ao clicar em uma carta
function flipCard() {
  if (lockBoard || this === firstCard) return; // não permite virar mais de 2 ou a mesma carta

  flipSound.play(); // toca som de clique
  this.classList.add('flipped'); // vira a carta visualmente

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

// Verifica se as cartas são iguais
function checkForMatch() {
  moves++;
  movesText.textContent = "Movimentos: " + moves;

  const isMatch = firstCard.dataset.card === secondCard.dataset.card;
  isMatch ? disableCards() : unflipCards();
}

// Desativa cartas que deram par
function disableCards() {
  matchSound.play();
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
}

// Desvira cartas diferentes
function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

// Reseta variáveis de controle
function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

// Embaralha as cartas no início
(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

// Adiciona eventos de clique
cards.forEach(card => card.addEventListener('click', flipCard));

// Reinicia o jogo
function restartGame() {
  cards.forEach(card => {
    card.classList.remove('flipped');
    card.addEventListener('click', flipCard);
  });
  moves = 0;
  movesText.textContent = "Movimentos: 0";
  resetBoard();
  setTimeout(() => {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    });
  }, 300);
}

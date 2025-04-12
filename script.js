// === CONFIGURAÇÕES DO SUPABASE ===
const SUPABASE_URL = "https://apxdzmbhnwvybptilekq.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweGR6bWJobnd2eWJwdGlsZWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjM1MjksImV4cCI6MjA1OTk5OTUyOX0.s_ejRYlKNt2Tx4cO155kyABvKDT37-lM8OdckJ4_ETM";

// === SEU CÓDIGO ORIGINAL + MODIFICADO ===

const cards = document.querySelectorAll('.card');
const movesText = document.getElementById("moves");

const flipSound = new Audio("flip.mp3");
const matchSound = new Audio("match.mp3");

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;

function flipCard() {
  if (lockBoard || this === firstCard) return;

  flipSound.play();
  this.classList.add('flipped');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  moves++;
  movesText.textContent = "Movimentos: " + moves;

  const isMatch = firstCard.dataset.card === secondCard.dataset.card;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  matchSound.play();
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();

  if (document.querySelectorAll('.flipped').length === cards.length) {
    showSaveScore();
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math

import { SUPABASE_URL, SUPABASE_API_KEY } from './supabaseClient.js';

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
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

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

function showSaveScore() {
  document.getElementById('saveScore').style.display = 'block';
}

async function saveScore() {
  const nome = document.getElementById("playerName").value || "Anônimo";
  await fetch(`${SUPABASE_URL}/rest/v1/ranking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_API_KEY,
      "Authorization": `Bearer ${SUPABASE_API_KEY}`
    },
    body: JSON.stringify({ nome, movimentos: moves })
  });
  loadLeaderboard();
  document.getElementById('saveScore').style.display = 'none';
}

async function loadLeaderboard() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/ranking?select=nome,movimentos&order=movimentos.asc&limit=10`, {
    headers: {
      "apikey": SUPABASE_API_KEY,
      "Authorization": `Bearer ${SUPABASE_API_KEY}`
    }
  });
  const data = await res.json();
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";
  data.forEach((entry, index) => {
    list.innerHTML += `<li>${index + 1}. 🏅 ${entry.nome} — ${entry.movimentos} movimentos</li>`;
  });
}

loadLeaderboard();

// ✅ Event listeners para os botões
document.getElementById('btnSaveScore')?.addEventListener('click', saveScore);
document.getElementById('btnRestart')?.addEventListener('click', restartGame);

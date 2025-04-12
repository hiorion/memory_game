// === CONFIGURAÇÕES DO SUPABASE ===
const SUPABASE_URL = "https://apxdzmbhnwvybptilekq.supabase.co"; // Substitua pelo seu URL
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFweGR6bWJobnd2eWJwdGlsZWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MjM1MjksImV4cCI6MjA1OTk5OTUyOX0.s_ejRYlKNt2Tx4cO155kyABvKDT37-lM8OdckJ4_ETM"; // Substitua pela sua chave anônima

// === Lógica do Jogo ===
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

// === Mostrar o formulário para salvar score ===
function showSaveScore() {
  document.getElementById('saveScore').style.display = 'block';
}

// === Salvar score no SUPABASE ===
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

// === Carregar ranking do SUPABASE ===
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

// Carrega ranking assim que o jogo abre
loadLeaderboard();

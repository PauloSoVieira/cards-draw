// Constants
const CARDS_PER_PLAYER = 26;
const FACE_DOWN_CARDS = 3;

// DOM Elements
const getElement = (id) => {
  const element = document.getElementById(id);
  return element;
};

const player1CardContainer = getElement("player1-card");
const player2CardContainer = getElement("player2-card");
const drawButton = getElement("drawButton");
const player1ScoreValue = getElement("player1-score-value");
const player2ScoreValue = getElement("player2-score-value");
const restartButton = getElement("restartButton");
const forceTieButton = getElement("forceTieButton");

// Game variables
let player1Deck = [];
let player2Deck = [];
let tableCards = [];
let isDrawing = false;
let isTie = false;
let cardElements = {};
let player1Name = "Player 1";
let player2Name = "Player 2";

// Clears the container
const clearContainer = (container) => {
  container.innerHTML = "";
};

// Updates the score display
const updateCardsLeftDisplay = () => {
  const player1Score = document.getElementById("player1-score");
  const player2Score = document.getElementById("player2-score");

  player1Score.innerHTML = `${player1Name} cards left: <span id="player1-score-value">${player1Deck.length}</span>`;
  player2Score.innerHTML = `${player2Name} cards left: <span id="player2-score-value">${player2Deck.length}</span>`;
};

// Creates the card overlay ( for the tie card )
const createCardOverlay = (cardElement) => {
  const overlay = document.createElement("div");
  overlay.classList.add("card-overlay");
  const innerDiv = document.createElement("div");
  innerDiv.classList.add("card-overlay-middle");
  const topdiv = document.createElement("div");
  topdiv.classList.add("card-overlay-top");

  innerDiv.appendChild(topdiv);
  overlay.appendChild(innerDiv);
  cardElement.appendChild(overlay);
};

// Removes the card overlays
const removeCardOverlays = () => {
  const overlays = document.querySelectorAll(".card-overlay");
  overlays.forEach((overlay) => overlay.remove());
};

// Creates a shuffled deck
const createShuffledDeck = () => {
  const deck = [];
  const suits = ["spades", "hearts", "diamonds", "clubs"];
  const values = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
  ];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value: parseInt(value) });
    }
  }

  // shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

// Initializes the card elements
const initializeCardElements = () => {
  document.querySelectorAll(".card").forEach((card) => {
    const suit = card.dataset.suit;
    const value = card.dataset.value;
    cardElements[`${suit}-${value}`] = card;
  });
};

// Draws a card from the deck
const drawCard = (playerDeck, playerCardContainer, isNewTieCard) => {
  if (playerDeck.length === 0) {
    return null;
  }
  /* debugger; */

  const card = playerDeck.shift();
  const selectedCard = cardElements[`${card.suit}-${card.value}`];
  if (selectedCard) {
    const cardClone = selectedCard.cloneNode(true);
    cardClone.classList.add("displayed-card");
    if (isNewTieCard) {
      cardClone.classList.add("tie-card");
    }
    playerCardContainer.appendChild(cardClone);
  }
  updateCardsLeftDisplay();
  return card;
};

// Handles a win for the winning player and the losing player
const handleWin = (winningPlayer) => {
  winningPlayer.push(...tableCards);
  tableCards = [];
  isTie = false;
  setTimeout(() => {
    clearContainer(player1CardContainer);
    clearContainer(player2CardContainer);
    removeCardOverlays();
    isDrawing = false;
    drawButton.disabled = false;
  }, 1000);
};

/*
const forceTie = () => {
  if (
    player1Deck.length < FACE_DOWN_CARDS + 2 ||
    player2Deck.length < FACE_DOWN_CARDS + 2
  ) {
    alert("Not enough cards to force a tie!");
    return;
  }

  clearContainer(player1CardContainer);
  clearContainer(player2CardContainer);
  removeCardOverlays();

  // Draw initial cards
  const card1 = drawCard(player1Deck, player1CardContainer, false);
  const card2 = drawCard(player2Deck, player2CardContainer, false);

  // Ensure the cards have the same value
  card2.value = card1.value;

  tableCards.push(card1, card2);

  // Add face-down cards
  for (let i = 0; i < FACE_DOWN_CARDS; i++) {
    tableCards.push(player1Deck.shift(), player2Deck.shift());
  }

  isTie = true;
  isDrawing = false;

  setTimeout(() => {
    player1CardContainer
      .querySelectorAll(".displayed-card")
      .forEach(createCardOverlay);
    player2CardContainer
      .querySelectorAll(".displayed-card")
      .forEach(createCardOverlay);
  }, 1000);

  updateCardsLeftDisplay();
  console.log("Tie forced! Table cards:", tableCards);
};
forceTieButton.addEventListener("click", forceTie); */

function customPrompt(message, defaultValue, callback) {
  const promptElement = document.getElementById("customPrompt");
  const messageElement = document.getElementById("promptMessage");
  const inputElement = document.getElementById("promptInput");
  const submitButton = document.getElementById("promptSubmit");

  messageElement.textContent = message;
  inputElement.value = defaultValue;
  promptElement.style.display = "flex";

  submitButton.onclick = function () {
    promptElement.style.display = "none";
    const result = inputElement.value || defaultValue;
    callback(result);
  };
}

// getPlayerNames function
function getPlayerNames(callback) {
  customPrompt("Enter name for Player 1:", "Player 1", function (name1) {
    player1Name = name1;
    customPrompt("Enter name for Player 2:", "Player 2", function (name2) {
      player2Name = name2;
      updatePlayerNames();

      callback();
    });
  });
}

// Function to update player names in screen
function updatePlayerNames() {
  const player1Score = document.getElementById("player1-score");
  const player2Score = document.getElementById("player2-score");
  player1Score.textContent = `${player1Name} cards left: `;
  player2Score.textContent = `${player2Name} cards left: `;
}

// initializeGame function
function initializeGame() {
  getPlayerNames(function () {
    drawButton.style.display = "block";
    drawButton.disabled = false;
    restartButton.style.display = "none";
    isDrawing = false;

    const deck = createShuffledDeck();

    player1Deck = deck.slice(0, CARDS_PER_PLAYER);
    player2Deck = deck.slice(CARDS_PER_PLAYER);

    clearContainer(player1CardContainer);
    clearContainer(player2CardContainer);
    initializeCardElements();
    updateCardsLeftDisplay();
  });
}

// Event Listeners
drawButton.addEventListener("click", function () {
  if (isDrawing) return;
  isDrawing = true;
  drawButton.disabled = true;

  if (!isTie) {
    clearContainer(player1CardContainer);
    clearContainer(player2CardContainer);
    removeCardOverlays();
  }

  const card1 = drawCard(player1Deck, player1CardContainer, isTie || false);
  const card2 = drawCard(player2Deck, player2CardContainer, isTie || false);

  if (card1 && card2) {
    tableCards.push(card1, card2);
    console.log(tableCards);
    if (card1.value > card2.value) {
      handleWin(player1Deck, player2Deck);
    } else if (card1.value < card2.value) {
      handleWin(player2Deck, player1Deck);
    } else {
      if (!isTie) {
        isTie = true;
        /**  Tie check if they have enough cards   */
        if (
          player1Deck.length < FACE_DOWN_CARDS + 1 ||
          player2Deck.length < FACE_DOWN_CARDS + 1
        ) {
          if (player1Deck.length < player2Deck.length) {
            alert("Player 1 doesn't have enough cards. Player 2 wins!");
          } else if (player2Deck.length < player1Deck.length) {
            alert("Player 2 doesn't have enough cards. Player 1 wins!");
          } else {
            alert("Both players don't have enough cards. It's a draw!");
          }
          drawButton.disabled = true;
          drawButton.style.display = "none";
          restartButton.style.display = "block";
          isDrawing = false;
          return;
        }
        /**  War both have enough cards   */
        for (let i = 0; i < FACE_DOWN_CARDS; i++) {
          tableCards.push(player1Deck.shift(), player2Deck.shift());
        }
        console.log(tableCards);
        setTimeout(() => {
          player1CardContainer
            .querySelectorAll(".displayed-card")
            .forEach(createCardOverlay);
          player2CardContainer
            .querySelectorAll(".displayed-card")
            .forEach(createCardOverlay);
          isDrawing = false;
          drawButton.disabled = false;
        }, 2000);
      } else {
        isDrawing = false;
        drawButton.disabled = false;
      }
    }
    updateCardsLeftDisplay();
  }

  if (player1Deck.length === 0 || player2Deck.length === 0) {
    drawButton.disabled = true;
    drawButton.style.display = "none";
    restartButton.style.display = "block";
    alert(player1Deck.length === 0 ? "Player 2 wins!" : "Player 1 wins!");
    isDrawing = false;
  }
});

restartButton.addEventListener("click", function () {
  initializeGame();
  tableCards = [];
  removeCardOverlays();
  isTie = false;
  isDrawing = true;
  drawButton.disabled = false;
});

// Initialize the game

getPlayerNames();
initializeGame();

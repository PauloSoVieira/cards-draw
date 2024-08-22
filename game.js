document.addEventListener("DOMContentLoaded", function () {
  const player1CardContainer = document.getElementById("player1-card");
  const player2CardContainer = document.getElementById("player2-card");
  const drawButton = document.getElementById("drawButton");
  const player1ScoreValue = document.getElementById("player1-score-value");
  const player2ScoreValue = document.getElementById("player2-score-value");
  const restartButton = document.getElementById("restartButton");
  let player1Deck = [];
  let player2Deck = [];
  let clearTimeoutId;
  let isDrawing = false;

  function clearContainer(container) {
    container.innerHTML = "";
  }

  function initializeGame() {
    drawButton.style.display = "block";
    drawButton.disabled = false;
    restartButton.style.display = "none";
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

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    player1Deck = deck.slice(0, 26);
    player2Deck = deck.slice(26);

    clearContainer(player1CardContainer);
    clearContainer(player2CardContainer);
    updateCardsLeftDisplay();
  }

  function updateCardsLeftDisplay() {
    player1ScoreValue.textContent = player1Deck.length;
    player2ScoreValue.textContent = player2Deck.length;
  }

  function drawCard(playerDeck, playerCardContainer, isDrawCard = false) {
    if (playerDeck.length === 0) {
      return null;
    }
    const card = playerDeck.pop();
    const selectedCard = document.querySelector(
      `.card[data-suit="${card.suit}"][data-value="${card.value}"]`
    );
    if (selectedCard) {
      const cardClone = selectedCard.cloneNode(true);
      cardClone.classList.add("displayed-card");
      playerCardContainer.appendChild(cardClone);
    }
    updateCardsLeftDisplay();
    return card;
  }

  drawButton.addEventListener("click", function () {
    if (isDrawing) return;
    isDrawing = true;

    if (clearTimeoutId) {
      clearTimeout(clearTimeoutId);
    }

    clearContainer(player1CardContainer);
    clearContainer(player2CardContainer);

    const card1 = drawCard(player1Deck, player1CardContainer);
    const card2 = drawCard(player2Deck, player2CardContainer);

    if (card1 && card2) {
      if (card1.value > card2.value) {
        player1Deck.unshift(card1, card2);
        clearTimeoutId = setTimeout(() => {
          clearContainer(player1CardContainer);
          clearContainer(player2CardContainer);
          isDrawing = false;
        }, 1000);
      } else if (card1.value < card2.value) {
        player2Deck.unshift(card1, card2);
        clearTimeoutId = setTimeout(() => {
          clearContainer(player1CardContainer);
          clearContainer(player2CardContainer);
          isDrawing = false;
        }, 1000);
      } else {
        alert(
          "War! Both players drew cards of equal value. Click 'Draw Cards' to continue."
        );
        player1Deck.unshift(card1);
        player2Deck.unshift(card2);
        isDrawing = false;
      }
      updateCardsLeftDisplay();
    }

    if (player1Deck.length === 0 || player2Deck.length === 0) {
      drawButton.disabled = true;
      drawButton.style.display = "none";
      restartButton.style.display = "block";
      alert(player1Deck.length === 0 ? "Player 2 wins!" : "Player 1 wins!");
    } else if (!clearTimeoutId) {
      isDrawing = false;
    }
  });

  restartButton.addEventListener("click", function () {
    initializeGame();
  });

  initializeGame();
});

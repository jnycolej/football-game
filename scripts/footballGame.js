const totalPointsElement = document.getElementById("totalPoints");
let totalPoints = 0;
const randomCards = [];

//Fetch the card data from the server and initialize the deck
let deck = [];

function fetchDeck() {
  return fetch('/api/cards')
    .then(response => response.json())
    .then(data => {
      if (!data || !data.cards) {
        console.error("Invalid data format:", data);
        return [];
      }
      return data.cards;
    })
    .catch(error => {
      console.error('Error fetching cards:', error);
      return [];
    });
}
export async function generateHand() {
  const hand = document.getElementById("hand");
  hand.innerHTML = "";
  totalPoints = 0;
  randomCards.length = 0; //Clear the randomCards array


  //Fetch the deck if not already fetched
  if (deck.length === 0) {
    deck = await fetchDeck();
  }


  for (let i = 0; i < 5; i++) {                            //Generates the hand
    const card = generateCard();
    randomCards.push(card);
    displayCard(hand, card, i);
  }

  totalPointsElement.textContent = totalPoints;
  // Display the selected cards
}

function displayCard(hand, card, index) {                                      //Displays the individual card
  const cardElement = document.createElement('div');
  cardElement.className = 'card';
  cardElement.innerHTML = `
    <button type="button" class="btn btn-success" onclick="playCard(${index})">
      <div class="card-body">
        <h6 class="card-title">${card.description}</h6>
        <p class="card-text">${card.penalty}</p>
        <p class="card-text">Points: ${card.points}</p>
      </div>
    </button>
  `;
  hand.appendChild(cardElement);
}

//Function to play a card
window.playCard = function(cardIndex) {
  const card = randomCards[cardIndex];
  if (card) {
    totalPoints += card.points;
    totalPointsElement.textContent = totalPoints;

    //Replace the played card with a new one
    const newCard = generateCard();
    randomCards[cardIndex] = newCard;
    updateCardDisplay(cardIndex, newCard);
  }
};

//Generates a new card
function generateCard() {
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck[randomIndex];
}

//Function to update the card display
function updateCardDisplay(cardIndex, card) {
  const hand = document.getElementById("hand");
  const cardElement = hand.children[cardIndex];
  cardElement.innerHTML = `
  <button type="button" class="btn btn-success" onclick="playCard(${randomCards.indexOf(card)})">
  <div class="card-body">
    <h5 class="card-title">${card.description}</h5>
    <p class="card-text">${card.penalty}</p>
    <p class="card-text">Points: ${card.points}</p>
  </div>
</button>
  `;
}
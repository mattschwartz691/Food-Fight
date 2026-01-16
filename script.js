// Food database with images from Unsplash
const foods = [
    { name: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop" },
    { name: "Burger", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop" },
    { name: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop" },
    { name: "Tacos", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop" },
    { name: "Ice Cream", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop" },
    { name: "Pasta", image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=400&fit=crop" },
    { name: "Fried Chicken", image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=400&fit=crop" },
    { name: "Ramen", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop" },
    { name: "Steak", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop" },
    { name: "Donuts", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=400&fit=crop" },
    { name: "French Fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop" },
    { name: "Hot Dog", image: "https://images.unsplash.com/photo-1612392062399-9a2c8eb89b7b?w=400&h=400&fit=crop" },
    { name: "Nachos", image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=400&fit=crop" },
    { name: "Pancakes", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop" },
    { name: "Waffles", image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&h=400&fit=crop" },
    { name: "Mac & Cheese", image: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=400&h=400&fit=crop" },
    { name: "Cheesecake", image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=400&fit=crop" },
    { name: "Chocolate Cake", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop" },
    { name: "BBQ Ribs", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop" },
    { name: "Pad Thai", image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=400&fit=crop" }
];

// Game state
let currentLeft = null;
let currentRight = null;
let usedFoods = [];
let champions = {};
let isAnimating = false;

// DOM elements
const foodLeft = document.getElementById('food-left');
const foodRight = document.getElementById('food-right');
const imgLeft = document.getElementById('img-left');
const imgRight = document.getElementById('img-right');
const nameLeft = document.getElementById('name-left');
const nameRight = document.getElementById('name-right');
const knockoutOverlay = document.getElementById('knockout-overlay');
const knockoutText = document.getElementById('knockout-text');
const championsDiv = document.getElementById('champions');

// Make cards keyboard-accessible and attach handlers
function makeCardAccessible(card) {
    if (!card) return;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => selectFood(card.dataset.side));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectFood(card.dataset.side);
        }
    });
}

makeCardAccessible(foodLeft);
makeCardAccessible(foodRight);

// Get random food that hasn't been used recently
function getRandomFood(exclude = []) {
    const available = foods.filter(f =>
        !exclude.includes(f.name) && !usedFoods.includes(f.name)
    );

    // Reset used foods if we're running low
    if (available.length < 2) {
        usedFoods = [];
        return getRandomFood(exclude);
    }

    const food = available[Math.floor(Math.random() * available.length)];
    usedFoods.push(food.name);

    // Keep usedFoods from getting too big
    if (usedFoods.length > foods.length - 4) {
        usedFoods = usedFoods.slice(-4);
    }

    return food;
}

// Initialize the game
function initGame() {
    currentLeft = getRandomFood();
    currentRight = getRandomFood([currentLeft.name]);

    updateFoodDisplay('left', currentLeft);
    updateFoodDisplay('right', currentRight);
}

// Update food card display
function updateFoodDisplay(side, food) {
    const img = side === 'left' ? imgLeft : imgRight;
    const name = side === 'left' ? nameLeft : nameRight;
    const card = side === 'left' ? foodLeft : foodRight;

    img.src = food.image;
    img.alt = food.name;
    name.textContent = food.name;
    card.setAttribute('aria-label', `${food.name} — select to fight`);

    // Add entering animation
    card.classList.add('entering');
    setTimeout(() => card.classList.remove('entering'), 500);
}

// Handle food selection
function selectFood(side) {
    if (isAnimating) return;
    isAnimating = true;

    const winner = side === 'left' ? currentLeft : currentRight;
    const loser = side === 'left' ? currentRight : currentLeft;
    const winnerCard = side === 'left' ? foodLeft : foodRight;
    const loserCard = side === 'left' ? foodRight : foodLeft;
    const loserSide = side === 'left' ? 'right' : 'left';

    // Update champions
    if (champions[winner.name]) {
        champions[winner.name]++;
    } else {
        champions[winner.name] = 1;
    }
    updateChampions();

    // Punching animation
    winnerCard.classList.add('punching');
    if (side === 'right') {
        winnerCard.classList.add('right');
    }

    setTimeout(() => {
        winnerCard.classList.remove('punching', 'right');

        // Winner celebration
        winnerCard.classList.add('winner');

        // Loser knockout
        loserCard.classList.add('loser');

        // Create stars explosion
        createStarsExplosion(loserCard);

        // Show knockout overlay
        showKnockout(winner.name);

        // After animations, bring in new food
        setTimeout(() => {
            winnerCard.classList.remove('winner');
            loserCard.classList.remove('loser');
            knockoutOverlay.classList.remove('active');

            // New challenger enters
            const newFood = getRandomFood([winner.name]);

            if (loserSide === 'left') {
                currentLeft = newFood;
                updateFoodDisplay('left', newFood);
            } else {
                currentRight = newFood;
                updateFoodDisplay('right', newFood);
            }

            isAnimating = false;
        }, 1500);

    }, 300);
}

// Show knockout overlay
function showKnockout(winnerName) {
    knockoutText.textContent = `${winnerName} WINS!`;
    knockoutOverlay.classList.add('active');
}

// Create stars explosion effect
function createStarsExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const container = document.createElement('div');
    container.className = 'stars-container';
    document.body.appendChild(container);

    const emojis = ['⭐', '💥', '✨', '🌟', '💫', '🔥'];

    for (let i = 0; i < 12; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        star.style.left = centerX + 'px';
        star.style.top = centerY + 'px';

        // Random direction
        const angle = (Math.PI * 2 * i) / 12;
        const distance = 100 + Math.random() * 100;
        star.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        star.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

        container.appendChild(star);
    }

    // Clean up
    setTimeout(() => container.remove(), 1000);
}

// Update champions display
function updateChampions() {
    // Sort by wins
    const sorted = Object.entries(champions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5

    championsDiv.innerHTML = sorted.map(([name, wins]) => `
        <div class="champion-badge">
            🏆 ${name} <span class="wins">${wins} win${wins > 1 ? 's' : ''}</span>
        </div>
    `).join('');
}

// Start the game
initGame();

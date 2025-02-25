// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Player spaceship properties
const ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    angle: 0, // Rotation angle in radians
    speed: 0,
    rotationSpeed: 0.05, // How fast the ship turns
    velocityX: 0,
    velocityY: 0,
    thrust: 0.1 // Acceleration when moving forward
};

// Track key states
const keys = {
    left: false,
    right: false,
    up: false
};

// Event listeners for key press and release
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") keys.left = true;
    if (event.code === "ArrowRight") keys.right = true;
    if (event.code === "ArrowUp") keys.up = true;
    if (event.code === "Space") fireLaser(); // Call fireLaser when Space is pressed
});

document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") keys.left = false;
    if (event.code === "ArrowRight") keys.right = false;
    if (event.code === "ArrowUp") keys.up = false;
});

// Maximum speed for the ship
const maxSpeed = 5;

// Update spaceship movement
function updateShip() {
    // Rotate ship
    if (keys.left) ship.angle -= ship.rotationSpeed;
    if (keys.right) ship.angle += ship.rotationSpeed;

    // Apply thrust
    if (keys.up) {
        ship.velocityX += Math.cos(ship.angle) * ship.thrust;
        ship.velocityY += Math.sin(ship.angle) * ship.thrust;
    }

    // Limit speed to maxSpeed
    const speed = Math.sqrt(ship.velocityX ** 2 + ship.velocityY ** 2);
    if (speed > maxSpeed) {
        ship.velocityX *= maxSpeed / speed;
        ship.velocityY *= maxSpeed / speed;
    }

    // Update position
    ship.x += ship.velocityX;
    ship.y += ship.velocityY;

    // Screen wrap (edges of screen)
    if (ship.x < 0) ship.x = canvas.width;
    if (ship.x > canvas.width) ship.x = 0;
    if (ship.y < 0) ship.y = canvas.height;
    if (ship.y > canvas.height) ship.y = 0;
}

// Function to draw the spaceship
function drawShip() {
    ctx.save(); // Save current drawing state
    ctx.translate(ship.x, ship.y); // Move to ship's position
    ctx.rotate(ship.angle); // Rotate to ship's direction

    // Draw a simple triangle as the ship
    ctx.beginPath();
    ctx.moveTo(15, 0); // Tip of the triangle (forward)
    ctx.lineTo(-10, -10); // Bottom right
    ctx.lineTo(-10, 10); // Bottom left
    ctx.closePath();
    
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore(); // Restore original drawing state
}

// Array for tracking fired lasers
const lasers = [];
const laserSpeed = 7;

// Function to fire lasers
function fireLaser() {
    const laser = {
        x: ship.x,
        y: ship.y,
        velocityX: Math.cos(ship.angle) * laserSpeed,
        velocityY: Math.sin(ship.angle) * laserSpeed
    };
    lasers.push(laser);
}

// Update game loop to move lasers
function updateLasers() {
    for (let i = lasers.length - 1; i >= 0; i--) {
        lasers[i].x += lasers[i].velocityX;
        lasers[i].y += lasers[i].velocityY;

        // Remove lasers if they go off-screen
        if (
            lasers[i].x < 0 || lasers[i].x > canvas.width ||
            lasers[i].y < 0 || lasers[i].y > canvas.height
        ) {
            lasers.splice(i, 1);
        }
    }
}

// Draw fired lasers on the canvas
function drawLasers() {
    ctx.fillStyle = "white";
    for (const laser of lasers) {
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

const asteroids = []; // Array to track asteroids
const numAsteroids = 5; // Initial number of asteroids
const safeDistance = 100; // Minimum asteroid spawn distance from player
const maxAsteroids = 10; // Cap on active asteroids

// Generate initial asteroids
function createAsteroids() {
    
    for (let i = 0; i < numAsteroids; i++) {
        let x, y, distance;
        
        // Select a potential location to spawn an asteroid
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
            let dx = x - ship.x;
            let dy = y - ship.y;
            distance = Math.sqrt(dx * dx + dy * dy);
        } while (distance < safeDistance); // Check if location isn't too close to the player
        
        asteroids.push({
            x: x,
            y: y,
            velocityX: (Math.random() - 0.5) * 2, // Random speed between -1 and 1
            velocityY: (Math.random() - 0.5) * 2,
            size: Math.random() * 30 + 15 // Random size between 15 and 45
        });
    }
}

// Continually spawn new asteroids
function spawnAsteroid()  {
    if (asteroids.length >= maxAsteroids) return; // Don't spawn if at cap

    let x, y, distance;
    let edge = Math.floor(Math.random() * 4); // 0 = top, 1 = bottom, 2 = left, 3 = right

    do {
        if (edge === 0) {x = Math.random() * canvas.width; y = 0;}
        else if (edge === 1) { x = Math.random() * canvas.width; y = canvas.height; }
        else if (edge === 2) { x = 0; y = Math.random() * canvas.height; }
        else { x = canvas.width; y = Math.random() * canvas.height; }
        
        let dx = x - ship.x;
        let dy = y - ship.y;
        distance = Math.sqrt(dx * dx + dy * dy);
    } while (distance < safeDistance); // Don't spawn if too close to player

    asteroids.push({
        x: x,
        y: y,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: (Math.random() - 0.5) * 2,
        size: Math.random() * 30 + 15
    });
}

// Update asteroid positions in the game loop
function updateAsteroids() {
    for (let asteroid of asteroids) {
        asteroid.x += asteroid.velocityX;
        asteroid.y += asteroid.velocityY;

        // Screen wrapping
        if (asteroid.x < 0) asteroid.x = canvas.width;
        if (asteroid.x > canvas.width) asteroid.x = 0;
        if (asteroid.y < 0) asteroid.y = canvas.height;
        if (asteroid.y > canvas.height) asteroid.y = 0;
    }
}

// Draw asteroids
function drawAsteroids() {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    for (const asteroid of asteroids) {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
        ctx.stroke();
        //ctx.fill();
    }
}

function checkCollisions() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];

        for (let j = lasers.length - 1; j >= 0; j--) {
            let laser = lasers[j];

            let dx = laser.x - asteroid.x;
            let dy = laser.y - asteroid.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < asteroid.size) {
                lasers.splice(j, 1); // Remove laser
                
                if (asteroid.size > 20) {
                    // Split big asteroid into two smaller asteroids
                    for (let k = 0; k < 2; k++) {
                        asteroids.push({
                            x: asteroid.x,
                            y: asteroid.y,
                            velocityX: (Math.random() - 0.5) * 2,
                            velocityY: (Math.random() - 0.5) * 2,
                            size: asteroid.size / 2
                        });
                    }
                }

                asteroids.splice(i, 1); // Remove original asteroid
                break;
            }
        }
    }
}

// Update game loop to move the ship, lasers, asteroids, etc.
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setInterval(spawnAsteroid, 5000); // Every 5 seconds check if new asteroids should spawn
    
    updateShip();
    updateLasers();
    updateAsteroids();
    checkCollisions();

    drawShip();
    drawLasers();
    drawAsteroids();

    requestAnimationFrame(gameLoop);
}

// Begin game
createAsteroids();
gameLoop();

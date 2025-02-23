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

// Update game loop to move the ship
function gameLoop() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateShip(); // Update position
    drawShip(); // Draw the player spaceship

    requestAnimationFrame(gameLoop);
}

gameLoop();

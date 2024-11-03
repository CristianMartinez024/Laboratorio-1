const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Crear la paleta
const paddleWidth = 10;
const paddleHeight = 100;
const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "white",
    score: 0
};

const computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "white",
    score: 0
};

// Crear la pelota
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    velocityX: 4,
    velocityY: 4,
    color: "white"
};

// Dibuja un rectángulo
function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// Dibuja un círculo
function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

// Dibuja el texto
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "35px Arial";
    context.fillText(text, x, y);
}

// Controlar el movimiento de la paleta del jugador
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(event) {
    const rect = canvas.getBoundingClientRect();
    player.y = event.clientY - rect.top - player.height / 2;
}

// Actualiza la posición de la pelota y verifica colisiones
function update() {
    // Mover la pelota
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Colisiones con el techo y el suelo
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    // Colisiones con las paletas
    const paddle = ball.x < canvas.width / 2 ? player : computer;
    if (collision(ball, paddle)) {
        ball.velocityX = -ball.velocityX;
    }

    // Verificar si la pelota sale del canvas
    if (ball.x - ball.radius < 0) {
        computer.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player.score++;
        resetBall();
    }

    // Mover la paleta del computador
    computer.y = ball.y - computer.height / 2;
}

// Verificar colisiones
function collision(ball, paddle) {
    return (
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.x + ball.radius > paddle.x &&
        ball.y - ball.radius < paddle.y + paddle.height &&
        ball.y + ball.radius > paddle.y
    );
}

// Reiniciar la pelota
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
}

// Dibuja el juego
function draw() {
    // Limpiar el canvas
    drawRect(0, 0, canvas.width, canvas.height, "black");
    drawText(player.score, canvas.width / 4, canvas.height / 5, "white");
    drawText(computer.score, (3 * canvas.width) / 4, canvas.height / 5, "white");
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Bucle del juego
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

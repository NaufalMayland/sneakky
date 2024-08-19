const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const gridsize = 20;
        const canvasSize = canvas.width / gridsize;
        let snake = [{x: 10, y: 10}];
        let direction = '';
        let food = getRandomFood();
        let score = 0;
        let highscore = 0;
        let speed = 100;
        let initialspeed = speed;
        let gameStarted = false;

        function drawsnake() {
            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? '#ff8b8b' : '#ffd4d4';
                ctx.shadowBlur = index === 0 ? 10 : 0;
                ctx.shadowColor = '#ff8b8b';
                ctx.fillRect(segment.x * gridsize, segment.y * gridsize, gridsize, gridsize);
                ctx.shadowBlur = 0;
            });
        }

        function drawfood() {
            ctx.fillStyle = '#fff';
            ctx.fillRect(food.x * gridsize, food.y * gridsize, gridsize, gridsize);
        }

        function getRandomFood() {
            return {
                x: Math.floor(Math.random() * canvasSize),
                y: Math.floor(Math.random() * canvasSize),
            };
        }

        function move() {
            if (!gameStarted) return;

            const head = {...snake[0]};

            switch (direction) {
                case 'up':
                    head.y -= 1;
                    break;
                case 'down':
                    head.y += 1;
                    break;
                case 'left':
                    head.x -= 1;
                    break;
                case 'right':
                    head.x += 1;
                    break;
            }

            if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize || checkcollision()) {
                resetGame();
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                food = getRandomFood();
                score++;
                updateScore();
                increaseSpeed();
            } else {
                snake.pop();
            }
        }

        function checkcollision() {
            const head = snake[0];
            return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        }

        function increaseSpeed() {
            speed = Math.max(50, initialspeed - Math.floor(score / 5) * 5);
        }

        function updateScore() {
            const scoreElement = document.querySelector('#score span');
            scoreElement.innerText = score;

            if (score > highscore) {
                highscore = score;
                const highscoreElement = document.querySelector('#high-score span');
                highscoreElement.innerText = highscore;
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawsnake();
            drawfood();
        }

        function resetGame() {
            alert(`Game Over! Score Anda: ${score}`);
            snake = [{ x: 10, y: 10 }];
            direction = '';
            gameStarted = false;
            food = getRandomFood();
            score = 0;
            speed = initialspeed;
            updateScore();
        }

        function gameLoop() {
            move();
            draw();
            setTimeout(gameLoop, speed);
        }

        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (direction !== 'down') direction = 'up';
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (direction !== 'up') direction = 'down';
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (direction !== 'right') direction = 'left';
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (direction !== 'left') direction = 'right';
                    break;
            }
            if (!gameStarted && direction) {
                gameStarted = true;
            }
        });

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (event) => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });

        document.addEventListener('touchend', (event) => {
            touchEndX = event.changedTouches[0].clientX;
            touchEndY = event.changedTouches[0].clientY;
            handleGesture();
        });

        function handleGesture() {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0 && direction !== 'left') {
                    direction = 'right';
                } else if (deltaX < 0 && direction !== 'right') {
                    direction = 'left';
                }
            } else {
                if (deltaY > 0 && direction !== 'up') {
                    direction = 'down';
                } else if (deltaY < 0 && direction !== 'down') {
                    direction = 'up';
                }
            }
            if (!gameStarted && direction) {
                gameStarted = true;
            }
        }

        gameLoop();
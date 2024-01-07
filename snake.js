(function () {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  // canvas size
  const canvasSize = 680;
  const w = (canvas.width = canvasSize);
  const h = (canvas.height = canvasSize);
  const canvasFillColor = "#000d36";
  const canvasStrokeColor = "rgba(211, 211, 211, 0.19)";
  const scoreEl = document.getElementById("score");
  const resetEl = document.getElementById("reset");
  const showGridEl = document.getElementById("show-grid");
  const highScoreEl = document.getElementById("high-score");
  const pauseEl = document.getElementById("pause");
  const playEl = document.getElementById("play");
  let score = 0;
  var speed = 7;
  var level_2_speed = 0;
  var stone = 0;
  var stone_1 = 0;


  let musicSound = new Audio('music.mp3');
let foodMusic = new Audio('food.mp3');
let gameoverMusic = new Audio('gameover.mp3');
let moveMusic = new Audio('move.mp3');



  level_1.onclick = () => {

    level_1.style.background = "black";
    level_2.style.background = "white";
    level_3.style.background = "white";
    level_1.style.color = "white";
    level_2.style.color = "blue";
    level_3.style.color = "blue";

    level_2_speed = 0;
    speed = 7;
  }

  level_2.onclick = () => {

    level_1.style.background = "white";
    level_2.style.background = "black";
    level_3.style.background = "white";
    level_1.style.color = "blue";
    level_2.style.color = "white";
    level_3.style.color = "blue";

    level_2_speed = 1;
  }

  level_3.onclick = () => {

    level_1.style.background = "white";
    level_2.style.background = "white";
    level_3.style.background = "black";
    level_1.style.color = "blue";
    level_2.style.color = "blue";
    level_3.style.color = "white";

    level_2_speed = 1;
    stone = 1;
  }


  const setScore = () => {
    scoreEl.innerHTML = `Score : ${score}`;
    if (score >= localStorage.getItem("highScore"))
      localStorage.setItem("highScore", score);
    highScoreEl.innerHTML = `High SCORE : ${localStorage.getItem("highScore")}`;
  };
  // frame rate
  const frameRate = 9.5;
  // grid padding
  const pGrid = 4;
  // grid width
  const grid_line_len = canvasSize - 2 * pGrid;
  //  cell count
  const cellCount = 34;
  // cell size
  const cellSize = grid_line_len / cellCount;
  let gameActive;
  // this will generate random color for head
  const randomColor = () => {
    let color;
    let colorArr = ["#426ff5", "#42f5e3"];
    color = colorArr[Math.floor(Math.random() * 2)];
    return color;
  };

  const head = {
    x: 2,
    y: 1,
    color: randomColor(),
    vX: 0,
    vY: 0,
    draw: () => {
      musicSound.play();
      ctx.fillStyle = head.color;
      ctx.shadowColor = head.color;
      ctx.shadowBlur = 2.5;
      ctx.fillRect(
        head.x * cellSize + pGrid,
        head.y * cellSize + pGrid,
        cellSize,
        cellSize
      );
    },
  };
  let tailLength = 4;
  let snakeParts = [];
  class Tail {
    color = "#42f57e";
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 2.5;
      ctx.fillRect(
        this.x * cellSize + pGrid,
        this.y * cellSize + pGrid,
        cellSize,
        cellSize
      );
      moveMusic.play();
      }
    }
    const food = {
      x: 5,
      y: 5,
      color: "#FF3131",
      draw: () => {
        ctx.fillStyle = food.color;
        ctx.shadowColor = food.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(
          food.x * cellSize + pGrid,
          food.y * cellSize + pGrid,
          cellSize,
          cellSize
        );
      },
    };
    // this will set canvas style
    const setCanvas = () => {
      // canvas fill
      ctx.fillStyle = canvasFillColor;
      ctx.fillRect(0, 0, w, h);
      // canvas stroke
      ctx.strokeStyle = canvasStrokeColor;
      ctx.strokeRect(0, 0, w, h);
    };
    //   this will draw the grid
    const drawGrid = () => {
      ctx.beginPath();
      for (let i = 0; i <= grid_line_len; i += cellSize) {
        ctx.moveTo(i + pGrid, pGrid);
        ctx.lineTo(i + pGrid, grid_line_len + pGrid);
      }
      for (let i = 0; i <= grid_line_len; i += cellSize) {
        ctx.moveTo(pGrid, i + pGrid);
        ctx.lineTo(grid_line_len + pGrid, i + pGrid);
      }
      ctx.closePath();
      ctx.strokeStyle = canvasStrokeColor;
      ctx.stroke();
    };
    const drawSnake = () => {
      //loop through our snakeparts array
      snakeParts.forEach((part) => {
        part.draw();
      });
      snakeParts.push(new Tail(head.x, head.y));
      if (snakeParts.length > tailLength) {
        snakeParts.shift(); //remove furthest item from  snake part if we have more than our tail size
      }
      head.color = randomColor();
      head.draw();
    };
    const updateSnakePosition = () => {
      head.x += head.vX;
      head.y += head.vY;
    };
    const changeDir = (e) => {
      let key = e.keyCode;
      if (key == 68 || key == 39) {
        if (head.vX === -1) return;
        head.vX = 1;
        head.vY = 0;
        gameActive = true;
        return;
      }
      if (key == 65 || key == 37) {
        if (head.vX === 1) return;
        head.vX = -1;
        head.vY = 0;
        gameActive = true;
        return;
      }
      if (key == 87 || key == 38) {
        if (head.vY === 1) return;
        head.vX = 0;
        head.vY = -1;
        gameActive = true;
        return;
      }
      if (key == 83 || key == 40) {
        if (head.vY === -1) return;
        head.vX = 0;
        head.vY = 1;
        gameActive = true;
        return;
      }
    };
    const foodCollision = () => {
      let foodCollision = false;
      snakeParts.forEach((part) => {
        if (part.x == food.x && part.y == food.y) {
          foodCollision = true;
          foodMusic.play();
        }
      });
      if (foodCollision) {
        food.x = Math.floor(Math.random() * cellCount);
        food.y = Math.floor(Math.random() * cellCount);


        // if((food.x <=7 || food.x >= 13) && (food.y <=7 || food.x >= 10))
        // {
        //   do{
        //     food.x = Math.floor(Math.random() * cellCount);
        //     food.y = Math.floor(Math.random() * cellCount);
        //   }while((food.x <=7 || food.x >= 13) && (food.y <=7 || food.x >= 10));
        // }

        if (level_2_speed == 1) {
          speed += 1;
        }

        if (stone == 1) {
          stone_1++;

        }

        score++;
        tailLength++;
      }
    };
    const isGameOver = () => {
      let gameOver = false;
      snakeParts.forEach((part) => {
        if (part.x == head.x && part.y == head.y) {
          gameOver = true;
        }
      });
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x > cellCount - 1 ||
        head.y > cellCount - 1
      ) {
        gameOver = true;
      }

      let a = 7, b = 7;
      for (let i = 0; i < stone_1; i += 2) {

        ctx.fillStyle = 'white';
        ctx.fillRect(cellSize * a, cellSize * b, cellSize, cellSize);

        if(head.x == a && head.y == b)
        {
      
          gameOver = true;
        }

          if (i <= 12) {
            a++;
          }
          if(i == 12 || i == 24 || i == 36)
          {
            b++;
          }
          if (i >= 13 && i <= 36) {
            a--;
          }
          if (i >= 36) {
            a++;
          }
          
      
      }
      return gameOver;
    };
    const showGameOver = () => {
      const text = document.createElement("div");
      text.setAttribute("id", "game_over");
      text.innerHTML = "game over !";
      gameoverMusic.play();
      musicSound.pause();
      const body = document.querySelector("body");
      body.appendChild(text);
    };
    addEventListener("keydown", changeDir);
    const PlayButton = (show) => {
      if (!show) {
        playEl.style.display = "none";
      } else {
        playEl.style.display = "block";
      }
    };

    const pauseGame = () => {
      gameActive = false;
      if (!gameActive) {
        pauseEl.removeAttribute('class');
        pauseEl.setAttribute('class', 'pause-not-active')
      }
      if (!isGameOver()) PlayButton(true);
    };

  pauseEl.addEventListener("click", pauseGame);
  let showGrid = false;
  // this will initiate all
  const animate = () => {
   
    setCanvas();
    if (showGrid) drawGrid();
    drawSnake();
    food.draw();
    if (gameActive) {
      PlayButton(false);
      pauseEl.removeAttribute('class');
      pauseEl.setAttribute('class', 'pause-active');
      updateSnakePosition();
      if (isGameOver()) {
        showGameOver();
        PlayButton(false);
        return;
      }
    }
    setScore();
    foodCollision();
    setTimeout(animate, 1000 / speed);
  };
  const resetGame = () => {
    location.reload();
  };
  resetEl.addEventListener("click", resetGame);
  const toggleGrid = () => {
    if (!showGrid) {
      showGrid = true;
      showGridEl.innerHTML = `Hide Grid`
      return;
    }
    showGrid = false;
    showGridEl.innerHTML = `Show Grid`
  };

  showGridEl.addEventListener("click", toggleGrid);
  animate();
})();
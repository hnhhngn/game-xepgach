/*** CONSTANT ***/
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLOR_MAPPING = [
    'red',
    'orange',
    'green',
    'purple',
    'blue',
    'cyan',
    'yellow',
    'white'
];
const WHITE_COLOR_ID = 7;

const BRICK_LAYOUT = [
    // !L
    [
        [
            [1, 7, 7],
            [1, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 1, 1],
            [7, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [7, 7, 1],
        ],
        [
            [7, 1, 7],
            [7, 1, 7],
            [1, 1, 7],
        ],
    ],
    // L
    [
        [
            [7, 1, 7],
            [7, 1, 7],
            [7, 1, 1],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [1, 7, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 7, 1],
            [1, 1, 1],
            [7, 7, 7],
        ],
    ],
    // !4
    [
        [
            [1, 7, 7],
            [1, 1, 7],
            [7, 1, 7],
        ],
        [
            [7, 1, 1],
            [1, 1, 7],
            [7, 7, 7],
        ],
        [
            [7, 1, 7],
            [7, 1, 1],
            [7, 7, 1],
        ],
        [
            [7, 7, 7],
            [7, 1, 1],
            [1, 1, 7],
        ],
    ],
    // 4
    [
        [
            [7, 1, 7],
            [1, 1, 7],
            [1, 7, 7],
        ],
        [
            [1, 1, 7],
            [7, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 7, 1],
            [7, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 7],
            [7, 1, 1],
        ],
    ],
    // |
    [
        [
            [7, 7, 7, 7],
            [1, 1, 1, 1],
            [7, 7, 7, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 1, 7],
            [7, 7, 1, 7],
            [7, 7, 1, 7],
            [7, 7, 1, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 7, 7, 7],
            [1, 1, 1, 1],
            [7, 7, 7, 7],
        ],
        [
            [7, 1, 7, 7],
            [7, 1, 7, 7],
            [7, 1, 7, 7],
            [7, 1, 7, 7],
        ],
    ],
    // Vuông
    [
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
        [
            [7, 7, 7, 7],
            [7, 1, 1, 7],
            [7, 1, 1, 7],
            [7, 7, 7, 7],
        ],
    ],
    // T
    [
        [
            [7, 1, 7],
            [1, 1, 1],
            [7, 7, 7],
        ],
        [
            [7, 1, 7],
            [7, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 7, 7],
            [1, 1, 1],
            [7, 1, 7],
        ],
        [
            [7, 1, 7],
            [1, 1, 7],
            [7, 1, 7],
        ],
    ],
];

const KEY_CODES = {
    'LEFT': 'ArrowLeft',
    'RIGHT': 'ArrowRight',
    'DOWN': 'ArrowDown',
    'SPACE': 'Space'
}

// Canvas
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

/**
 * Bảng
 */
class Board {
    constructor(ctx) {
        this.score = 0;
        this.ctx = ctx;
        this.grid = this.generateWhiteBoard();
        this.gameOver = false;
        this.isPlaying = false;
        this.clearAudio = new Audio('../sounds/clear.wav');
    }

    reset() {
        this.score = 0;
        this.grid = this.generateWhiteBoard();
        this.gameOver = false;
        this.drawBoard();
    }

    // Gen 10 x 20
    generateWhiteBoard() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(WHITE_COLOR_ID));
    }

    drawCell(xAxis, yAxis, colorId) {
        /* Cell */
        this.ctx.fillStyle = COLOR_MAPPING[colorId] || COLOR_MAPPING[WHITE_COLOR_ID];
        this.ctx.fillRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        /* Vien */
        this.ctx.fillStyle = 'black';
        this.ctx.strokeRect(xAxis * BLOCK_SIZE, yAxis * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }

    drawBoard() {
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[0].length; col++) {
                this.drawCell(col, row, this.grid[row][col]);
            }
        }
    }

    handleComplateRows() {
        const lastestGrid = board.grid.filter((row) => {
            return row.some(col => col === WHITE_COLOR_ID);
        });

        const newScore = ROWS - lastestGrid.length;
        const newRows = Array.from({ length: newScore }, () => Array(COLS).fill(WHITE_COLOR_ID));

        if (newScore) {
            board.grid = [...newRows, ...lastestGrid]; // tao hang moi
            this.handleScore(newScore); // cong diem
            this.clearAudio.play();
        }
    }

    handleScore(newScore) {
        this.score += newScore;
        document.getElementById('score').innerHTML = this.score;
    }

    handleGameOver() {
        this.gameOver = true;
        this.isPlaying = false;
        alert('Gà!!!!');
    }
}

/**
 * Gạch
 */
class Brick {
    constructor(id) {
        this.id = id;
        this.layout = BRICK_LAYOUT[id]; //kiểu viên gạch
        this.activeIndex = 0; // hướng viên gạch
        // Vị trí viên gạch
        this.colPos = 3;
        this.rowPos = -2;
    }

    draw() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, this.id);
                }
            }
        }
    }

    clear() {
        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.drawCell(col + this.colPos, row + this.rowPos, WHITE_COLOR_ID);
                }
            }
        }
    }

    moveleft() {
        if (!this.checkCollision(this.rowPos, this.colPos - 1, this.layout[this.activeIndex])) {
            this.clear();
            this.colPos--;
            this.draw();
        }

    }

    moveRight() {
        if (!this.checkCollision(this.rowPos, this.colPos + 1, this.layout[this.activeIndex])) {
            this.clear();
            this.colPos++;
            this.draw();
        }
    }

    moveDown() {
        if (!this.checkCollision(this.rowPos + 1, this.colPos, this.layout[this.activeIndex])) {
            this.clear();
            this.rowPos++;
            this.draw();

            return;
        }

        this.handleLanded();
        generateNewBrick();
    }

    route() {
        if (!this.checkCollision(this.rowPos, this.colPos, this.layout[(this.activeIndex + 1) % 4])) {
            this.clear();
            this.activeIndex = (this.activeIndex + 1) % 4;
            this.draw();
        }
    }

    // Check biên
    checkCollision(nextRow, nextCol, nextLayout) {
        for (let row = 0; row < nextLayout.length; row++) {
            for (let col = 0; col < nextLayout[0].length; col++) {
                if (nextLayout[row][col] !== WHITE_COLOR_ID && nextRow >= 0) {
                    if (col + nextCol < 0 ||
                        col + nextCol >= COLS ||
                        row + nextRow >= ROWS ||
                        board.grid[row + nextRow][col + nextCol] !== WHITE_COLOR_ID) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // Xử lí khi viên gạch chạm mép dưới
    handleLanded() {
        if (this.rowPos <= 0) {
            board.handleGameOver();
            return;
        }

        for (let row = 0; row < this.layout[this.activeIndex].length; row++) {
            for (let col = 0; col < this.layout[this.activeIndex][0].length; col++) {
                if (this.layout[this.activeIndex][row][col] !== WHITE_COLOR_ID) {
                    board.grid[row + this.rowPos][col + this.colPos] = this.id;
                }
            }
        }
        board.handleComplateRows();
        board.drawBoard();
    }


}

function generateNewBrick() {
    brick = new Brick(Math.floor(Math.random() * 10) % BRICK_LAYOUT.length);
}

board = new Board(ctx);
board.drawBoard();
generateNewBrick();

document.getElementById('play').addEventListener('click', () => {
    board.reset();

    board.isPlaying = true;

    const refresh = setInterval(() => {
        if (!board.gameOver) {
            brick.moveDown();
        } else {
            clearInterval(refresh);
        }

    }, 1000);
});

/*** EVENT ***/
document.addEventListener('keydown', (e) => {
    if (!board.gameOver && board.isPlaying) {
        switch (e.code) {
            case KEY_CODES.LEFT:
                brick.moveleft();
                break;
            case KEY_CODES.RIGHT:
                brick.moveRight();
                break;
            case KEY_CODES.DOWN:
                brick.moveDown();
                break;
            case KEY_CODES.SPACE:
                brick.route();
                break;
            default:
                break;
        }
    }
})
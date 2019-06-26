import { Universe, Cell } from 'wasm-game-of-life';
import { memory } from 'wasm-dilly1/wasm_dilly1_bg';
import './style.css';

let canvas, ctx, universe;
let width, height;

const CELL_SIZE = 4;

window.onload = () => {

    /* Set up the fake canvas and universe for the game */
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    
    // width = universe.width();
    // height = universe.height();

    width = Math.floor(innerWidth / CELL_SIZE);
    height = Math.floor(innerHeight / CELL_SIZE);

    width -= width % CELL_SIZE;
    height -= height % CELL_SIZE;

    // width += innerWidth % 6;
    // height += innerHeight % 6;

    canvas.width = CELL_SIZE * width;
    canvas.height = CELL_SIZE * height;

    universe = Universe.new(width, height);

    /* Call the game loop. */
    setInterval(loop, 50);
}

const loop = () => {
    // requestAnimationFrame(loop);

    universe.tick();
    // drawGrid();
    drawCells();

}

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    for (let row = 0; row < height; row ++) {
        for (let col = 0; col < width; col ++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = cells[idx] === Cell.Dead
                ? 'black'
                : 'white'
            
            ctx.fillRect(
                col * CELL_SIZE,
                row * CELL_SIZE,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }
}

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = 'gray';

    for (let i = 0; i <= width; i ++) {
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CELL_SIZE * height);
    }

    for (let i = 0; i <= height; i ++) {
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CELL_SIZE * width, i * CELL_SIZE);
    }

    ctx.stroke();
}

const getIndex = (row, col) => {
    return row * width + col;
}

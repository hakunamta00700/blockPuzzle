import { fabric } from 'fabric';



let blocks = [
    { color: 'Aqua', cells: [[0, 0], [1, 0], [1, 1], [2, 2], [1, 2]] },
    { color: 'Beige', cells: [[0, 0], [0, 1], [1, 1], [2, 1], [1, 2]] },
    { color: 'Coral', cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },
    { color: 'DodgerBlue', cells: [[0, 0], [0, 1], [0, 2], [1, 2], [1, 3]] },
    { color: 'ForestGreen', cells: [[1, 0], [1, 1], [0, 2], [1, 2], [2, 2]] },
    { color: 'Gold', cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
    { color: 'HotPink', cells: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]] },
    { color: 'Ivory', cells: [[0, 0], [1, 0], [1, 1], [0, 2], [1, 2]] },
    { color: 'Khaki', cells: [[1, 0], [2, 0], [1, 1], [0, 1], [0, 2]] },
    { color: 'Lavender', cells: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]] },
    { color: 'Moccasin', cells: [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1]] },
    { color: 'Navy', cells: [[3, 0], [0, 1], [1, 1], [2, 1], [3, 1]] },
    { color: 'Olive', cells: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]] }
];

// let canvas = new fabric.Canvas('puzzleCanvas', {
//     selection: false // 그룹 선택 방지
// });

// let gridSize = 8;
// let RECT_WIDTH = 30;
// let BORDER_WIDTH = 1;
// let cellSize = RECT_WIDTH + BORDER_WIDTH; // 30px + 1px border
class Grid {
    constructor(canvas, gridSize, cellSize) {
        this.canvas = canvas;
        this.gridSize = gridSize;
        this.cellSize = cellSize;

        this.draw();
    }

    draw() {
        for (let i = 0; i <= this.gridSize; i++) {
            this.canvas.add(new fabric.Line([i * this.cellSize, 0, i * this.cellSize, this.gridSize * this.cellSize], { stroke: '#000', selectable: false }));
            this.canvas.add(new fabric.Line([0, i * this.cellSize, this.gridSize * this.cellSize, i * this.cellSize], { stroke: '#000', selectable: false }));
        }
    }
}

class Block extends fabric.Group {
    constructor(data, cellSize) {
        // this.canvas = canvas;
        super();
        this.data = data;
        this.cellSize = cellSize;
        const group = this.init();
        this.initialize(group, {}, false);
    }
    init() {
        let group = [];
        this.data.cells.forEach(cell => {
            let rect = new fabric.Rect({
                left: cell[0] * this.cellSize,
                top: cell[1] * this.cellSize,
                fill: this.data.color,
                width: this.cellSize,
                height: this.cellSize,
                stroke: '#000',
                strokeWidth: 1,
                selectable: false
            });
            group.push(rect);
        });
        return group;
    }
    color() {
        return this.data.color[0];
    }

}
let canvas = new fabric.Canvas('puzzleCanvas', {
    selection: false // 그룹 선택 방지
});

let gridSize = 8;
let cellSize = 31; // RECT_WIDTH + BORDER_WIDTH (30 + 1)

const grid = new Grid(canvas, gridSize, cellSize);
// const blockList = [];
blocks.forEach(blockData => {
    const block = new Block(blockData, cellSize);
    canvas.add(block);
    // blockList.push(block);
});

// canvas.on('object:rotating', (e) => {

//     const delta = e.target.angle % 90;
//     if(e.target.angle<=90){
//         e.target.angle = 90;
//     }else{

//     }
//     console.log("Current Angle:", e.target.angle, "delta:", delta); // 현재 회전 각도 출력
//     // if (delta > 45) {
//     //     e.target.angle = e.target.angle + (90 - delta);
//     // } else {
//     //     e.target.angle = e.target.angle - delta;
//     // }
//     // e.target.setCoords();  // 각도를 적용하여 객체의 위치를 갱신합니다.

// });
let lastClickTime = 0;
canvas.on('mouse:down', (e) => {
    let currentTime = new Date().getTime();

    if (e.target && currentTime - lastClickTime < 300) { // 두 번의 클릭 사이의 시간이 300ms 미만인 경우 더블 클릭으로 간주
        handleBlockDoubleClick(e.target);
    }

    lastClickTime = currentTime;
});

function handleBlockDoubleClick(target) {
    // 더블 클릭 이벤트 핸들러
    console.log('Block double-clicked!', target);
    target.angle = target.angle + 90;
    if (target.angle == 360) {
        target.angle = 0;
    }
}
canvas.on('object:moving', (e) => {
    let block = e.target;
    block.set({
        left: Math.round(block.left / cellSize) * cellSize,
        top: Math.round(block.top / cellSize) * cellSize
    });
    console.log("pos:", e.target.left, e.target.top);
});
function locationBlockOnGrid(blockColor, pos) {
    console.log("blockList:", blockList);
    const selectedBlock = blockList.filter(item => {
        if (item.data.color[0] == blockColor) {
            return true;
        }
    })[0];
    console.log("selectedBlock:", selectedBlock);
    selectedBlock.left = pos[0] * 31;
    selectedBlock.top = pos[0] * 31;
}

document.getElementById('blockPatternForm').addEventListener('submit', function (e) {
    e.preventDefault();
    // const pattern = document.getElementById('blockPatternInput').value;
    const color = document.getElementById("blockColorInput").value;
    let pos = document.getElementById("blockPos").value;
    pos = pos.split(",").map(item => parseInt(item));
    console.log("color:", color, "pos:", pos);
    locationBlockOnGrid(color, pos);
});

function applyBlockPattern(pattern) {
    // Remove existing blocks from canvas
    // canvas.getObjects().forEach(obj => {
    //     if (obj.type === 'group') {
    //         canvas.remove(obj);
    //     }
    // });

    // Split pattern into rows
    const rows = pattern.split('\n').filter(row => row.trim() !== '');

    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            const blockChar = rows[y][x];
            const blockIndex = blocks.findIndex(b => b.color[0] === blockChar);

            if (blockIndex !== -1) {
                canvas.item(blockIndex + gridSize * 2 + 2).clone((clonedGroup) => {
                    clonedGroup.set({
                        left: x * cellSize,
                        top: y * cellSize
                    });
                    canvas.add(clonedGroup);
                });
            }
        }
    }
}

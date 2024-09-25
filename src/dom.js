export default function SetupDom() {
    const helperCheckCells = function checkCellsBeforeDroppingShip(shipCoords) {
        const currentShip = shipCoords;
        let isEmpty = true;

        currentShip.forEach((coord) => {
            const currentCell = document.querySelector(`.cell[data-y="${coord[0]}"][data-x="${coord[1]}"]`);
            if (currentCell.classList.contains("occupied")) {
                isEmpty = false;
            }
        });

        return isEmpty;
    }

    const helperGetShipCoords = function getShipsCoordsFromDom({headCoord, direction, size}) {
        const shipArray = [headCoord];

        if (direction === "h") {
            let currentX = headCoord[1];
            for (let i = size-1; i > 0; i--) {
                shipArray.push([headCoord[0], currentX + 1]);
                currentX += 1;
            }
        } else if (direction === "v") {
            let currentY = headCoord[0];
            for (let i = size-1; i > 0; i--) {
                shipArray.push([currentY - 1, headCoord[1]]);
                currentY -= 1;
            }
        }

        return shipArray;
    }

    const helperAddGrid = function addGridToContainer(container) {
        for (let i = 9; i > -1; i--) {
            for (let j = 0; j < 10; j++) {
              const temp = document.createElement("div");
              temp.classList.toggle("cell");
              temp.dataset.y = i;
              temp.dataset.x = j;
              container.appendChild(temp);
            }
          }
        
    }

    const getSquareHit = function getCoordsFromSquareThatWasHit(square) {
        return [Number(square.dataset.y), Number(square.dataset.x)];

    }

    const setupPlayerBoard = function setupPlayerBoardOnDom() {

    }

    const setupOpponentBoard = function setupOpponentBoardOnDom() {

    }

    const allowDrag = function allowShipsToBeDragged(e) {
        e.preventDefault();
        let currentX = e.clientX;
        let currentY = e.clientY;
        let nextX = 0;
        let nextY = 0;
        
        
        const dragElement = function dragElementAround(e) {
            e.preventDefault();
            nextX = currentX - e.clientX;
            nextY = currentY - e.clientY;
            currentX = e.clientX;
            currentY = e.clientY;
            const currentLocation = e.target.getBoundingClientRect();
            e.target.style.left = (currentLocation["x"] - nextX) + "px";
            e.target.style.top = (currentLocation["y"] - nextY) + "px";
        }
        
        const removeEvents = function removeAllEvents(e) {
            const currentX = e.clientX;
            const currentY = e.clientY;
            const [currentDiv, divBellow] = document.elementsFromPoint(currentX, currentY)[1];
            const size = currentDiv.dataset.size;
            const direction = currentDiv.dataset.direction;
            if (helperCheckCells(helperGetShipCoords({
                headCoord:[divBellow.dataset.y, divBellow.dataset.x],
                direction: direction,
                size: size,
             }))) {
                currentDiv.style.left = "0px";
                currentDiv.style.top = "0px";
                divBellow.appendChild(currentDiv);
             } else {
                currentDiv.style.left = "0px";
                currentDiv.style.top = "0px";

            }

            const parentY = currentDiv.parentNode.dataset.y;
            const parentX = currentDiv.parentNode.dataset.x;

            helperGetShipCoords({
                headCoord: [parentY, parentX],
                direction: direction,
                size: size,
            }).forEach((coord) => {
                const currentCell = document.querySelector(`.cell[data-y="${coord[0]}"][data-x="${coord[1]}"]`);
                currentCell.classList.toggle("occupied");
                currentCell.classList.toggle("empty");
            })
            e.target.removeEventListener("mousemove", dragElement);
            e.target.removeEventListener("mouseup", removeEvents);
        }
        
        e.target.addEventListener("mousemove", dragElement);
        e.target.addEventListener("mouseup", removeEvents);
    }

    const getShip = function getCoordsOfShipDiv(shipHead) {
        const parentDiv = shipHead.parentNode;
        const currentShip = shipHead;
        const coordsArray = helperGetShipCoords({
            headCoord: [parentDiv.dataset.y, parentDiv.dataset.x],
            direction: currentShip.dataset.direction,
            size: currentShip.dataset.size,
        })

        return coordsArray;
    }

    const mainContainer = document.querySelector(".mainContainer");

    const header = document.createElement("div");
    header.textContent = "Battleship";
    header.classList.toggle("header");
    mainContainer.appendChild(header);

    const playZone = document.createElement("div");
    playZone.classList.toggle("playZone");
    const playerSide = document.createElement("div");
    playerSide.classList.toggle("playerSide");
    const opponentSide = document.createElement("div");
    opponentSide.classList.toggle("opponentSide");

    const playerField = document.createElement("div");
    const opponentField = document.createElement("div");
    playerField.classList.toggle("fieldGrid");
    helperAddGrid(playerField);
    ///opponentField.classList.toggle("fieldGrid");
    playerSide.appendChild(playerField);
    opponentSide.appendChild(opponentField);
    playZone.appendChild(playerSide);
    playZone.appendChild(opponentSide);
    mainContainer.appendChild(playZone);

    const startDiv = document.createElement("div");
    startDiv.classList.toggle("startDiv");
    const startButton = document.createElement("button");
    startButton.textContent = "Start";
    startButton.classList.toggle("startButton");
    startDiv.appendChild(startButton);
    mainContainer.appendChild(startDiv);
    

    return {
        getShip,
        getSquareHit,
        setupOpponentBoard,
        setupPlayerBoard,
        allowDrag,
    }

}
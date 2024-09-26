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

    const helperGetShipCoords = function getShipsCoordsFromDom(headCoord, direction, size) {
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
              temp.classList.toggle("empty");
              temp.dataset.y = i;
              temp.dataset.x = j;
              container.appendChild(temp);
            }
          }
        
    }

    const getSquareHit = function getCoordsFromSquareThatWasHit(square) {
        return [Number(square.dataset.y), Number(square.dataset.x)];

    }

    const setupPlayerBoard = function setupPlayerBoardOnDom(missedHits, shipHits, shipCoords) {
        const playerField = document.querySelector(".playerField");
        if (playerField.firstChild) {
            playerField.removeChild(playerField.firstChild);
        }

        helperAddGrid(playerField);

        missedHits.forEach((hit) => {
            const currentCell = document.querySelector(`.cell[data-y="${hit[0]}"][data-x="${hit[1]}"]`);
            currentCell.classList.toggle("miss");
            currentCell.classList.toggle("empty");
        });

        shipHits.forEach((hit) => {
            const currentCell = document.querySelector(`.cell[data-y="${hit[0]}"][data-x="${hit[1]}"]`);
            currentCell.classList.toggle("hit");
        });

        shipCoords.forEach((ship) => {
            const firstCoord = ship[0][0][0];
            const secondCoord = ship[0][0][1];
            let direction;
            if (firstCoord[0] === secondCoord[0]) {
                direction = "h";
            } else if (firstCoord[1] === secondCoord[1]) {
                direction = "v";
            }
            const shipHead = document.querySelector(`.cell[data-y="${firstCoord[0]}"][data-x="${firstCoord[1]}"]`);
            const shipLength = ship[0][0].length;
            const sunked = ship[0][1];

            const shipDiv = document.createElement("div");
            shipDiv.classList.toggle("ship");
            shipDiv.dataset.size = shipLength;
            shipDiv.dataset.direction = direction;
            if (sunked) {
                shipDiv.classList.toggle("sunk");
            }

            if (direction === "h") {
                shipDiv.style.height = "100%";
                shipDiv.style.width = (100 * shipLength) + "%";

            } else if (direction === "v") {
                shipDiv.style.width = "100%";
                shipDiv.style.height = (100 * shipLength) + "%";

            }

            ship[0][0].forEach((coord) => {
                const currentCell = document.querySelector(`.cell[data-y="${coord[0]}"][data-x="${coord[1]}"]`);
                currentCell.classList.toggle("empty");
                currentCell.classList.toggle("full");
            });

            shipHead.appendChild(shipDiv);
        });

    }

    const setupOpponentBoard = function setupOpponentBoardOnDom(missedHits, shipHits, shipCoords) {
        const opponentField = document.querySelector(".opponentField");
        opponentField.classList.toggle("fieldGrid");
        if (opponentField.firstChild) {
            opponentField.removeChild(opponentField.firstChild);
        }

        helperAddGrid(playerField);

        missedHits.forEach((hit) => {
            const currentCell = document.querySelector(`.cell[data-y="${hit[0]}"][data-x="${hit[1]}"]`);
            currentCell.classList.toggle("miss");
            currentCell.classList.toggle("empty");
        });

        shipHits.forEach((hit) => {
            const currentCell = document.querySelector(`.cell[data-y="${hit[0]}"][data-x="${hit[1]}"]`);
            currentCell.classList.toggle("hit");
            currentCell.classList.toggle("empty");
        });


    }

    const allowDrag = function allowShipsToBeDragged(e) {
        e.preventDefault();
        let currentX = e.clientX;
        let currentY = e.clientY;
        let nextX = 0;
        let nextY = 0;
        helperGetShipCoords(
            [e.target.dataset.y, e.target.dataset.x],
            e.target.dataset.direction,
            e.target.dataset.size,
        ).forEach((coord) => {
            const currentCell = document.querySelector(`.cell[data-y="${coord[0]}"][data-x="${coord[1]}"]`);
            currentCell.classList.toggle("empty");
        });
        
        
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
            if (helperCheckCells(helperGetShipCoords(
                [divBellow.dataset.y, divBellow.dataset.x],
                direction,
                size,
             ))) {
                currentDiv.style.left = "0px";
                currentDiv.style.top = "0px";
                divBellow.appendChild(currentDiv);
             } else {
                currentDiv.style.left = "0px";
                currentDiv.style.top = "0px";

            }

            const parentY = currentDiv.parentNode.dataset.y;
            const parentX = currentDiv.parentNode.dataset.x;

            helperGetShipCoords(
                [parentY, parentX],
                direction,
                size,
            ).forEach((coord) => {
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
        const coordsArray = helperGetShipCoords(
            [parentDiv.dataset.y, parentDiv.dataset.x],
            currentShip.dataset.direction,
            currentShip.dataset.size,
        )

        return coordsArray;
    }

    const flipShip = function changeShipFromOneDirectionToAnother(shipDiv) {
        const shipLength = shipDiv.dataset.size;
        
        if (shipDiv.dataset.direction === "h") {
            shipDiv.dataset.direction = "v";
            shipDiv.style.height = (shipLength * 100) + "%";
            shipDiv.style.width = "100%";
        } else if (shipDiv.dataset.direction === "v") {
            shipDiv.dataset.direction =  "h";
            shipDiv.style.height = "100%";
            shipDiv.style.width = (shipLength * 100) + "%";
        }
    }

    const restartGame = function restartGameToShipPositioning() {
        const playerField = document.querySelector(".playerField");
        const opponentField = document.querySelector(".opponentField");
        const playButton = document.querySelector(".playButton");

        while (playerField.firstChild) {
            playerField.removeChild(playerField.firstChild);
        }

        while (opponentField.firstChild) {
            opponentField.removeChild(opponentField.firstChild);
        }
        opponentField.classList.toggle("fieldGrid");
        playButton.classList.toggle("startButton");
        playButton.classList.toggle("restartButton");
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
    playerField.classList.toggle("playerField");
    opponentField.classList.toggle("opponentField");
    helperAddGrid(playerField);
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
    startButton.classList.toggle("playButton");
    startDiv.appendChild(startButton);
    mainContainer.appendChild(startDiv);
    

    return {
        getShip,
        getSquareHit,
        setupOpponentBoard,
        setupPlayerBoard,
        allowDrag,
        flipShip,
        restartGame,
    }

}
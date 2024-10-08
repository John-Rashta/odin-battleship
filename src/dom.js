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

    const helperAddSides = function addNumbersAndLettersToAGrid(grid) {
        for (let i = 0; i < 10 ; i++) {
            const tempDiv = grid.querySelector(`.cell[data-y="${i}"][data-x="0"]`);
            const newDiv = document.createElement("div");
            newDiv.textContent = i + 1;
            newDiv.classList.toggle("sideNumber");
            tempDiv.appendChild(newDiv);
        }

        for (let i = 0; i < 10; i++) {
            const tempDiv = grid.querySelector(`.cell[data-y="0"][data-x="${i}"]`);
            const newDiv = document.createElement("div");
            newDiv.textContent = String.fromCharCode(65 + i);
            newDiv.classList.toggle("bottomLetter");
            tempDiv.appendChild(newDiv);
        }

    }

    const helperFlipShip = function changeShipFromOneDirectionToAnother(shipDiv) {
        const shipLength = shipDiv.dataset.size;
        
        if (shipDiv.dataset.direction === "h") {
            shipDiv.dataset.direction = "v";
            shipDiv.style.height = (100 * shipLength) + ((5 * shipLength) -5)  + "%";
            shipDiv.style.width = "100%";
        } else if (shipDiv.dataset.direction === "v") {
            shipDiv.dataset.direction =  "h";
            shipDiv.style.height = "100%";
            shipDiv.style.width = (100 * shipLength) + ((5 * shipLength) -5)  + "%";
        }
    }

    const helperGetShipCoords = function getShipsCoordsFromDom(headCoord, direction, size) {
        const shipArray = [[Number(headCoord[0]), Number(headCoord[1])]];

        if (direction === "h") {
            let currentX = Number(headCoord[1]);
            for (let i = size-1; i > 0; i--) {
                shipArray.push([Number(headCoord[0]), currentX + 1]);
                currentX += 1;
            }
        } else if (direction === "v") {
            let currentY = Number(headCoord[0]);
            for (let i = size-1; i > 0; i--) {
                shipArray.push([currentY - 1, Number(headCoord[1])]);
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

    const helperMissedHits = function toggleMissedHitsCells(missedHits, currentField) {
        missedHits.forEach((hit) => {
            const currentCell = currentField.querySelector(`.cell[data-y="${hit[0]}"][data-x="${hit[1]}"]`);
            currentCell.classList.toggle("miss");
            currentCell.classList.toggle("empty");
        });
    }

    const helperShipHits = function toggleShipHitsCells(shipHits, currentField) {
        shipHits.forEach((hit) => {
            const currentCell = currentField.querySelector(`.cell[data-y="${hit[0]}"][data-x="${hit[1]}"]`);
            const innerCell = document.createElement("div");
            currentCell.appendChild(innerCell);
            innerCell.classList.toggle("hitContent");
            currentCell.classList.toggle("hit");
            currentCell.classList.toggle("empty");
        });
    }

    const helperShips = function toggleShipsCells(ship, currentField) {
        let direction;
            const firstCoord = ship[0][0];
            if (ship[0].length === 1) {
                direction = "h";
            } else {
                const secondCoord = ship[0][1];
                if (firstCoord[0] === secondCoord[0]) {
                    direction = "h";
                } else if (firstCoord[1] === secondCoord[1]) {
                    direction = "v";
                }
            }

            const shipHead = currentField.querySelector(`.cell[data-y="${firstCoord[0]}"][data-x="${firstCoord[1]}"]`);
            const shipLength = ship[0].length;
            const sunked = ship[1];

            const shipDiv = document.createElement("div");
            shipDiv.classList.toggle("ship");
            shipDiv.dataset.size = shipLength;
            shipDiv.dataset.direction = direction;
            if (sunked) {
                shipDiv.classList.toggle("sunk");
            }

            if (direction === "h") {
                shipDiv.style.height = "100%";
                shipDiv.style.width = (100 * shipLength) + ((5 * shipLength) -5) + "%";

            } else if (direction === "v") {
                shipDiv.style.width = "100%";
                shipDiv.style.height = (100 * shipLength) + ((5 * shipLength) -5) + "%";

            }

            ship[0].forEach((coord) => {
                const currentCell = currentField.querySelector(`.cell[data-y="${coord[0]}"][data-x="${coord[1]}"]`);
                currentCell.classList.toggle("occupied");
            });

            shipHead.appendChild(shipDiv);
    }

    const helperToggle = function toggleEmptyAndOccupiedForStartScreen(coords) {
        coords.forEach((coord) => {
            const currentCell = document.querySelector(`.cell[data-y="${coord[0]}"][data-x="${coord[1]}"]`);
            currentCell.classList.toggle("empty");
            currentCell.classList.toggle("occupied");
        });

    }

    const getSquareHit = function getCoordsFromSquareThatWasHit(square) {
        return [Number(square.dataset.y), Number(square.dataset.x)];

    }

    const setupPlayerBoard = function setupPlayerBoardOnDom(missedHits, shipHits, shipCoords) {
        const playerField = document.querySelector(".playerSide");
        while (playerField.firstChild) {
            playerField.removeChild(playerField.firstChild);
        }
        
        const newField = document.createElement("div");
        newField.classList.toggle("fieldGrid");
        newField.classList.toggle("playerField");
        playerField.appendChild(newField);
        helperAddGrid(newField);
        helperAddSides(newField);

        helperMissedHits(missedHits, playerField);

        helperShipHits(shipHits, playerField);

        shipCoords.forEach((ship) => {
            helperShips(ship, playerField);
        });

    }

    const setupOpponentBoard = function setupOpponentBoardOnDom(missedHits, shipHits, shipCoords) {
        const opponentField = document.querySelector(".opponentSide");
        while (opponentField.firstChild) {
            opponentField.removeChild(opponentField.firstChild);
        }

        const newField = document.createElement("div");
        newField.classList.toggle("fieldGrid");
        newField.classList.toggle("opponentField");
        opponentField.appendChild(newField);
        helperAddGrid(newField);
        helperAddSides(newField);

        helperMissedHits(missedHits, opponentField);

        helperShipHits(shipHits, opponentField);

        shipCoords.forEach((ship) => {
            const sunked = ship[1];
            if (sunked) {
                helperShips(ship, opponentField);
            }
        })


    }

    const allowDrag = function allowShipsToBeDragged(e) {
        e.preventDefault();
        const bodyDiv = document.querySelector("body");
        e.target.style.zIndex = "10";
        const shipDiv = e.target;
        const originalX = e.clientX;
        const originalY = e.clientY;
        let currentX = e.clientX;
        let currentY = e.clientY;
        let nextX = 0;
        let nextY = 0;

        const startDrag = function startDraggingElement() {
            helperToggle(helperGetShipCoords(
                [shipDiv.parentNode.dataset.y, shipDiv.parentNode.dataset.x],
                shipDiv.dataset.direction,
                shipDiv.dataset.size,
            ));
        }
        
        
        const dragElement = function dragElementAround(e) {
            e.preventDefault();
            nextX = currentX - e.clientX;
            nextY = currentY - e.clientY;
            currentX = e.clientX;
            currentY = e.clientY;
            shipDiv.style.left = (shipDiv.offsetLeft - nextX) + "px";
            shipDiv.style.top = (shipDiv.offsetTop - nextY) + "px";
        }
        
        const removeEvents = function removeAllEvents(e) {
            if (originalX === e.clientX && originalY === e.clientY && Number(shipDiv.dataset.size) != 1) {
                const parentDiv = shipDiv.parentNode;
                const oppositeDirection = "h" === shipDiv.dataset.direction ? "v" : "h";
                const currentCoords = helperGetShipCoords(
                    [parentDiv.dataset.y, parentDiv.dataset.x],
                    shipDiv.dataset.direction,
                    shipDiv.dataset.size,
                 );
                const possibleCoords = helperGetShipCoords(
                    [parentDiv.dataset.y, parentDiv.dataset.x],
                    oppositeDirection,
                    shipDiv.dataset.size,
                );
                if (oppositeDirection === "h" && (Number(parentDiv.dataset.x) + (Number(shipDiv.dataset.size)-1)) > 9 || 
                    oppositeDirection === "v" && (Number(parentDiv.dataset.y) - (Number(shipDiv.dataset.size)-1)) < 0) {
                        shipDiv.style.zIndex = "2";
                        bodyDiv.removeEventListener("mousemove", dragElement);
                        bodyDiv.removeEventListener("mouseup", removeEvents);
                        bodyDiv.removeEventListener("mousemove", startDrag);
                    return;
                }else if (helperCheckCells(possibleCoords.toSpliced(0, 1))) {
                    helperFlipShip(shipDiv);
                    helperToggle(currentCoords.concat(possibleCoords));
                }

                shipDiv.style.zIndex = "2";
                bodyDiv.removeEventListener("mousemove", startDrag);
                bodyDiv.removeEventListener("mousemove", dragElement);
                bodyDiv.removeEventListener("mouseup", removeEvents);
                return;
            }
            const currentX = e.clientX;
            const currentY = e.clientY;
            const [currentDiv, divBellow] = document.elementsFromPoint(currentX, currentY);
            const size = currentDiv.dataset.size;
            const direction = currentDiv.dataset.direction;
            if (divBellow.classList.contains("cell")) {
                if (shipDiv.dataset.direction === "h" && (Number(divBellow.dataset.x) + (Number(shipDiv.dataset.size)-1)) > 9 || 
                    shipDiv.dataset.direction === "v" && (Number(divBellow.dataset.y) - (Number(shipDiv.dataset.size)-1)) < 0) {
                    currentDiv.style.left = "0px";
                    currentDiv.style.top = "0px";
                }else if (helperCheckCells(helperGetShipCoords(
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
            } else {
                currentDiv.style.left = "0px";
                currentDiv.style.top = "0px";

            }

            const parentY = currentDiv.parentNode.dataset.y;
            const parentX = currentDiv.parentNode.dataset.x;

            helperToggle(helperGetShipCoords(
                [parentY, parentX],
                direction,
                size,
            ));
            shipDiv.style.zIndex = "2";
            bodyDiv.removeEventListener("mousemove", dragElement);
            bodyDiv.removeEventListener("mouseup", removeEvents);
        }
        
        bodyDiv.addEventListener("mousemove", startDrag, {once: true});
        bodyDiv.addEventListener("mousemove", dragElement);
        bodyDiv.addEventListener("mouseup", removeEvents);
    }

    const getShips = function getCoordsOfShips() {
        const totalShips = [];
        const allShipDivs = document.querySelectorAll(".ship");
        allShipDivs.forEach((div) => {
            const parentDiv = div.parentNode;
            const currentShip = div;
            const coordsArray = helperGetShipCoords(
                [parentDiv.dataset.y, parentDiv.dataset.x],
                currentShip.dataset.direction,
                currentShip.dataset.size,
            );
            totalShips.push(coordsArray);
        })

        return totalShips;
    }

    const changeButton = function changeStartButtonToRestart() {
        const startButton = document.querySelector(".playButton");
        startButton.textContent = startButton.classList.contains("startButton") ? "Restart" : "Start";
        startButton.classList.toggle("startButton");
        startButton.classList.toggle("restartButton");
    }

    const createStartScreen = function createGridToPlaceShips() {
        const opponentContainer = document.querySelector(".opponentPlayerContainer");
        const playerContainer = document.querySelector(".mainPlayerContainer");
        while (opponentContainer.firstChild) {
            opponentContainer.removeChild(opponentContainer.firstChild);
        }

        while (playerContainer.firstChild) {
            playerContainer.removeChild(playerContainer.firstChild);
        }

        const playerSide = document.createElement("div");
        playerSide.classList.toggle("playerSide");
        const opponentSide = document.createElement("div");
        opponentSide.classList.toggle("opponentSide");
        const playerField = document.createElement("div");
        const opponentField = document.createElement("div");
        playerField.classList.toggle("fieldGrid");
        playerField.classList.toggle("playerField");
        opponentField.classList.toggle("opponentField");
        playerSide.appendChild(playerField);
        opponentSide.appendChild(opponentField);
        playerContainer.appendChild(playerSide);
        opponentContainer.appendChild(opponentSide);
        helperAddGrid(playerField);
        helperAddSides(playerField);

        const defaultShips = [
            [
                [3, 0],
                [2, 0],
                [1, 0],
                [0, 0],
            ],
            [
                [5, 0],
                [5, 1],
                [5, 2],
            ],
            [
                [2, 8],
                [1, 8],
                [0, 8],
            ],
            [
                [7, 5],
                [6, 5],
            ],
            [
                [6, 9],
                [5, 9],
            ],
            [
                [9, 8],
                [9, 9],
            ],
            [
                [3, 3],
            ],
            [
                [8, 2],
            ],
            [
                [7, 3],
            ],
            [
                [1, 5],
            ],
        ];
        
        defaultShips.forEach((ship) => {
            let firstCoord;
            let secondCoord;
            let direction;
            if (ship.length === 1) {
                firstCoord = ship[0];
                direction = "h";
            } else {
                firstCoord = ship[0];
                secondCoord = ship[1];
                direction;
                if (firstCoord[0] === secondCoord[0]) {
                direction = "h";
                } else if (firstCoord[1] === secondCoord[1]) {
                direction = "v";
                }
            }
            const shipHead = document.querySelector(`.cell[data-y="${firstCoord[0]}"][data-x="${firstCoord[1]}"]`);
            const shipLength = ship.length;
    
            const shipDiv = document.createElement("div");
            shipDiv.classList.toggle("ship");
            shipDiv.classList.toggle("draggable");
            shipDiv.dataset.size = shipLength;
            shipDiv.dataset.direction = direction;
    
            if (direction === "h") {
                shipDiv.style.height = "100%";
                shipDiv.style.width = (100 * shipLength) + ((5 * shipLength) -5)  + "%";
    
            } else if (direction === "v") {
                shipDiv.style.width = "100%";
                shipDiv.style.height = (100 * shipLength) + ((5 * shipLength) -5) + "%";
    
            }
            
            helperToggle(ship);
    
            shipHead.appendChild(shipDiv);
        });


    }

    

    const mainContainer = document.querySelector(".mainContainer");

    const header = document.createElement("div");
    header.textContent = "Battleship";
    header.classList.toggle("header");
    mainContainer.appendChild(header);

    const playZone = document.createElement("div");
    playZone.classList.toggle("playZone");
    const mainPlayerContainer = document.createElement("div");
    mainPlayerContainer.classList.toggle("mainPlayerContainer");
    const opponentPlayerContainer = document.createElement("div");
    opponentPlayerContainer.classList.toggle("opponentPlayerContainer");
    playZone.appendChild(mainPlayerContainer);
    playZone.appendChild(opponentPlayerContainer);
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
        getShips,
        getSquareHit,
        setupOpponentBoard,
        setupPlayerBoard,
        allowDrag,
        changeButton,
        createStartScreen,
    }

}
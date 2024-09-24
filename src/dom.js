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

    

    return {
        getShip,
        getSquareHit,
        setupOpponentBoard,
        setupPlayerBoard,
        allowDrag,
    }

}
import Ship from "./ship";

export default function Gameboard() {
    const board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const missedHits = [];
    const shipHits = [];
    const shipsCoords = [];

    const getMissedHits = function getMissedHitsFromGameboard() {
        return missedHits;
    }

    const getShipHits = function getShipHitsFromGameboard() {
        return shipHits;
    }

    const getShips = function getShipsFromGameboard() {
        if (shipsCoords.length === 0) {
            return;
        }

        const flattenShips = shipsCoords.reduce((next, current) => {
            next.push(current.coordinates);
            return next;
        }, []);

        return flattenShips;
    };

    const setup = function setupShipsOnBoard(coordsArr) {
        coordsArr.forEach((shipArr) => {
            const tempShip = {
                ship: Ship(shipArr.length),
                coordinates: shipArr,
            };

            shipsCoords.push(tempShip);

            shipArr.forEach((coords) => {
                board[coords[0]][coords[1]] = tempShip.ship;
            })
        })
    };

    const receiveAttack = function checkIfAttackHit(coords) {
        if (board[coords[0]][coords[1]] === 0) {
            board[coords[0]][coords[1]] = 1;
            missedHits.push(coords);
            return false;
        }

        if (board[coords[0]][coords[1]] === 1) {
            return false;
        }

        if (typeof board[coords[0]][coords[1]] === "object")  {
            if (!shipHits.every((current) => current[0] != coords[0] || current[1] != coords[1])) {
                return;
            }

            board[coords[0]][coords[1]].hit();
            shipHits.push(coords);
            return true;
        }
    }

    const allSunk = function checkIfAllShipsSunk() {
        if (shipsCoords.length === 0) {
            return;
        }

        const tempCheck = shipsCoords.every((current) => current.ship.isSunk());

        return tempCheck;
    };

    return {
        getMissedHits,
        getShipHits,
        getShips,
        setup,
        receiveAttack,
        allSunk,
    }
};
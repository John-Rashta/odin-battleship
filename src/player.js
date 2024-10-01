import Gameboard from "./gameboard";

export default function setupPlayer() {
    const getRandomCoord = function getRandomCoordToHit(occupiedCoords) {
        const occupied = occupiedCoords;
        let currentCoord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]; 
        
        while (true) {
          const check = occupied.some((coord) => {
            return coord[0] === currentCoord[0] && coord[1] === currentCoord[1];
          });
          if (check) {
            currentCoord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
            continue;
          } else {
            break;
          }
        }
        
        return currentCoord;
    }

    const getRandomShip = function getARandomShipFromCoordWithSpecifiedLength(head, length, direction) {
        const shipArray = [head];
      
              if (direction === 0) {
                  let currentX = head[1];
                  for (let i = length-1; i > 0; i--) {
                      shipArray.push([head[0], currentX + 1]);
                      currentX += 1;
                  }
              } else if (direction === 1) {
                  let currentY = head[0];
                  for (let i = length-1; i > 0; i--) {
                      shipArray.push([currentY - 1, head[1]]);
                      currentY -= 1;
                  }
              }
      
        return shipArray;
    }

    const getNewShip = function getShipThatFits(occupiedCoords, length) {
        const coordsToCheck = occupiedCoords;
        
        if (Math.random * 2) {
            while (true) {
                const randomCoord = getRandomCoord(coordsToCheck);
                if (randomCoord[0] < length-1) {
                    randomCoord[0] += length-1;
                }
                const newShip = getRandomShip(randomCoord, length, 1);
            
                const isItOccupied = newShip.some((shipCoord) => {
                    return coordsToCheck.some((coord) => {
                    return coord[0] === shipCoord[0] && coord[1] === shipCoord[1];
                    })
                });
          
                if (isItOccupied) {
                    continue;
                } else {
                    return newShip;
                }
            }
        } else {
            while (true) {
                const randomCoord = getRandomCoord(coordsToCheck);
                if (randomCoord[1] > (9 - (length-1))) {
                    randomCoord[1] -= length-1;
                }
                const newShip = getRandomShip(randomCoord, length, 0);
                const isItOccupied = newShip.some((shipCoord) => {
                    return coordsToCheck.some((coord) => {
                    return coord[0] === shipCoord[0] && coord[1] === shipCoord[1];
                    })
                })
                if (isItOccupied) {
                    continue;
                } else {
                    return newShip;
                }
            }
        }    
    };
    const getRandomShipCoords = function getShipCoordsAtRandom() {
        const occupiedCoords = [];
        const shipCoords = [];
        const shipsToGet = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
        
        shipsToGet.forEach((shipLength) => {
            const newShip = getNewShip(occupiedCoords, shipLength);
            newShip.forEach((coord) => {
                occupiedCoords.push(coord);
                })
            shipCoords.push(newShip);
            });
        return shipCoords;
    }

    const getCloseCoord = function getAdjacentCoord(avoidCoords, lastCoord) {
        const occupiedCoords = avoidCoords;
        const firstCoord = lastCoord;
        const finalCoord = [];
        
        
        const yArray = [1, -1, 0, 0, -1, -1, 1, 1];
        const xArray = [0, 0, -1, 1, -1, 1, -1, 1];
        
        for (let i = 0; i < 8; i++) {
            if (yArray[i] + firstCoord[0] > 9 || yArray[i] + firstCoord[0] < 0 || xArray[i] + firstCoord[1] > 9 || xArray[i] + firstCoord[1] < 0) {
                continue;
            }
          
            const currentY = firstCoord[0] + yArray[i];
            const currentX = firstCoord[1] + xArray[i];
            const check = occupiedCoords.some((coord) => {
                return coord[0] === currentY && coord[1] === currentX;
            });                        
            if (check) {
                continue;
            } else {
                finalCoord.push(currentY);
                finalCoord.push(currentX);
                break;
            }
        }
        return finalCoord;
    };
    const gameboard = Gameboard();

    return {
        gameboard,
        getRandomShipCoords,
        getCloseCoord,
        getRandomCoord,
    }


}
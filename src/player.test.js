import Player from "./player";

test("check random coord with some occupied coords", () => {
    const newPlayer = Player();
    const occupiedCoords = [[1,1], [3, 2], [5,5]];
    const newCoord = newPlayer.getRandomCoord(occupiedCoords);
    const checkCoord = occupiedCoords.every((coord) => {
        return coord[0] != newCoord[0] || coord[1] != newCoord[1];
    });
    const checkNumbers = (newCoord[0] > -1 && newCoord[0] < 10 && newCoord[1] > -1 && newCoord[1] < 10);
    expect(checkCoord && checkNumbers).toBe(true);
})

test("check if enough ships are created with correct lengths", () => {
    const newPlayer = Player();
    const newShips = newPlayer.getRandomShipCoords();
    const checkLength = (newShips.length === 10);
    let shipCheck = 0;
    const shipsLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    const checkShipsLength = newShips.every((ship) => {
        const checked = (ship.length === shipsLengths[shipCheck]);
        shipCheck += 1;
        return checked;
    })
    expect(checkLength && checkShipsLength).toBe(true);
});

test("check if closeCoord gives the only possible outcome if all others are occupied", () => {
    const newPlayer = Player();
    const newCloseCoord = newPlayer.getCloseCoord([[0, 0], [0, 1], [0, 2], [1, 0], [2, 0], [2, 1], [1, 2]], [1, 1]);
    expect(newCloseCoord).toEqual([2, 2]);
});
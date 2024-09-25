import Gameboard from "./gameboard";

test("ship gets added, sunk and board reports that everything has been sunk", () => {
    const newBoard = Gameboard();
    newBoard.setup([[[2, 3],[2, 4],[2, 5]]]);
    newBoard.receiveAttack([2, 3]);
    newBoard.receiveAttack([2, 4]);
    newBoard.receiveAttack([2, 5]);
    expect(newBoard.allSunk()).toBe(true);
});

test("ships gets added, doesnt have enough hits and reports that", () => {
    const newBoard = Gameboard();
    newBoard.setup([[[2, 3],[2, 4],[2, 5]]]);
    newBoard.receiveAttack([2, 3]);
    newBoard.receiveAttack([2, 4]);
    expect(newBoard.allSunk()).toBe(false);
})

test("get missed hits properly", () => {
    const newBoard = Gameboard();
    newBoard.setup([[[2, 3],[2, 4],[2, 5]]]);
    newBoard.receiveAttack([1, 1]);
    newBoard.receiveAttack([0, 1]);
    expect(newBoard.getMissedHits()).toEqual([[1, 1],[0, 1]]);
})

test("get ship hits properly", () => {
    const newBoard = Gameboard();
    newBoard.setup([[[2, 3],[2, 4],[2, 5]]]);
    newBoard.receiveAttack([2, 3]);
    newBoard.receiveAttack([2, 4]);
    expect(newBoard.getShipHits()).toEqual([[2, 3],[2, 4]]);
})

test("get ship coords properly", () => {
    const newBoard = Gameboard();
    newBoard.setup([[[2, 3],[2, 4],[2, 5]]]);
    expect(newBoard.getShips()).toEqual([[[[2, 3],[2, 4],[2, 5]], false]]);
})

test("adds 2 ships and sinks them properly", () => {
    const newBoard = Gameboard();
    newBoard.setup([[[2, 3],[2, 4],[2, 5]], [[1, 1], [1, 0]]]);
    newBoard.receiveAttack([2, 3]);
    newBoard.receiveAttack([2, 4]);
    newBoard.receiveAttack([2, 5]);
    newBoard.receiveAttack([1, 1]);
    newBoard.receiveAttack([1, 0]);
    expect(newBoard.allSunk()).toBe(true);
})
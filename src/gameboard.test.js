import Gameboard from "./gameboard";

test("ship gets added, sunk and board reports that everything has been sunk", () => {
    const newBoard = Gameboard();
    newBoard.setup([[2, 3],[2, 4],[2, 5]]);
    newBoard.receiveAttack([2, 3]);
    newBoard.receiveAttack([2, 4]);
    newBoard.receiveAttack([2, 5]);
    expect(newBoard.allSunk()).toBe(true);
});
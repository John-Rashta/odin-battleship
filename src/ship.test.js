import Ship from "./ship";

test("ship is initialized with length 4 and sunk after enough hits", () => {
    const newShip = Ship(4);
    newShip.hit();
    newShip.hit();
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBe(true);
});

test("ship isnt sunk even if he took some hits", () => {
    const newShip = Ship(3);
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBe(false);
});

test("ship remains sunked even when it gets extra hits", () => {
    const newShip = Ship(2);
    newShip.hit();
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toBe(true);
})
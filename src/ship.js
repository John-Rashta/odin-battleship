export default function Ship(length) {

    const shipLength = length;
    let timesHit = 0;
    let sunked = false;

    const hit = function addHitToShip() {
        if (timesHit != shipLength) {
            timesHit += 1;
        }
    };

    const isSunk = function checkIfShipIsSunk() {
        if (sunked) {
            return sunked;
        }

        if (timesHit === shipLength) {
            sunked = true;
            return sunked;
        }

        return false;
    };

    return {
        hit,
        isSunk,
    }
};


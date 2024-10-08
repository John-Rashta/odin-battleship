import "../assets/styles/styles.css";
import setupDom from "./dom";
import setupPlayer from "./player";


const pageLoad = function pageSetupAndManagement() {
    const mainContainer = document.querySelector(".mainContainer");
    const domManager = setupDom();
    domManager.createStartScreen();
    const playerBoard = function loadPlayerBoardIntoPage(player) {
        domManager.setupPlayerBoard(player.gameboard.getMissedHits(), player.gameboard.getShipHits(), player.gameboard.getShips());

    }
    const opponentBoard = function loadOpponentBoardIntoPage(player) {
        domManager.setupOpponentBoard(player.gameboard.getMissedHits(), player.gameboard.getShipHits(), player.gameboard.getShips());

    }
    mainContainer.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("ship") && e.target.classList.contains("draggable")) {
            domManager.allowDrag(e);
        }
    });
    mainContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("startButton")) {
            e.preventDefault();
            const realPlayer = setupPlayer();
            const computerPlayer = setupPlayer();
            let gameOver = false;
            let currentPlayer = realPlayer;
            const opponentGrid = document.querySelector(".opponentSide");
            realPlayer.gameboard.setup(domManager.getShips());
            playerBoard(realPlayer);
            computerPlayer.gameboard.setup(computerPlayer.getRandomShipCoords());
            opponentBoard(computerPlayer);
            domManager.changeButton();

            opponentGrid.addEventListener("click", (e) => {
                if (gameOver) {
                    return;
                } else if (e.target.classList.contains("cell") && e.target.classList.contains("empty")) {
                    if (currentPlayer === realPlayer) {
                        currentPlayer = null;
                        const hitCoords = domManager.getSquareHit(e.target);
                        const hitRecord = computerPlayer.gameboard.receiveAttack(hitCoords);
                        opponentBoard(computerPlayer);
                        gameOver = computerPlayer.gameboard.allSunk();
                        if (hitRecord === "hit" || hitRecord === "sunk") {
                            currentPlayer = realPlayer;
                        } else {
                            currentPlayer = computerPlayer;
                        }
                    }
                    
                    if (currentPlayer === computerPlayer) {
                        currentPlayer = null;
                        let hitRecord;
                        let lastCoord;
                        do {
                            if (hitRecord === "hit") {
                                const newCoord = computerPlayer.getCloseCoord(realPlayer.gameboard.getAllHits(), lastCoord);
                                const newRecord = realPlayer.gameboard.receiveAttack(newCoord);
                                playerBoard(realPlayer);
                                lastCoord = newCoord;
                                hitRecord = newRecord;
                                gameOver = realPlayer.gameboard.allSunk();
                            } else {
                                const newCoord = computerPlayer.getRandomCoord(realPlayer.gameboard.getAllHits());
                                const newRecord = realPlayer.gameboard.receiveAttack(newCoord);
                                playerBoard(realPlayer);
                                lastCoord = newCoord;
                                hitRecord = newRecord;
                                gameOver = realPlayer.gameboard.allSunk();
                            }

                        }
                        while (hitRecord === "hit" && !gameOver || hitRecord === "sunk" && !gameOver);
                        currentPlayer = realPlayer;
                    }
                }
            })
        }

        else if (e.target.classList.contains("restartButton"))  {
            e.preventDefault();
            domManager.createStartScreen();
            domManager.changeButton();

        }
    })
}

pageLoad();
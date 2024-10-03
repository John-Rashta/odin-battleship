import "../assets/styles/styles.css";
import setupDom from "./dom";
import setupPlayer from "./player";


const pageLoad = function pageSetupAndManagement() {
    const mainContainer = document.querySelector(".mainContainer");
    const domManager = setupDom();
    const testPlayer = setupPlayer();
    const anotherPlayer = setupPlayer();
    domManager.createStartScreen();
    mainContainer.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("ship") && e.target.classList.contains("draggable")) {
            domManager.allowDrag(e);
        }
    });
    mainContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("startButton")) {
            e.preventDefault();
            testPlayer.gameboard.setup(domManager.getShips());
            domManager.setupPlayerBoard(testPlayer.gameboard.getMissedHits(), testPlayer.gameboard.getShipHits(), testPlayer.gameboard.getShips());
            anotherPlayer.gameboard.setup(anotherPlayer.getRandomShipCoords());
            domManager.setupOpponentBoard(anotherPlayer.gameboard.getMissedHits(), anotherPlayer.gameboard.getShipHits(), anotherPlayer.gameboard.getShips());
            domManager.changeButton();
        }

        else if (e.target.classList.contains("restartButton"))  {
            e.preventDefault();
            domManager.createStartScreen();
            domManager.changeButton();

        }
    })
}

pageLoad();
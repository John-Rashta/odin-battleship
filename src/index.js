import "../assets/styles/styles.css";
import setupDom from "./dom";
import setupPlayer from "./player";


const pageLoad = function pageSetupAndManagement() {
    const mainContainer = document.querySelector(".mainContainer");
    const domManager = setupDom();
    const testPlayer = setupPlayer();
    const anotherPlayer = setupPlayer();
    mainContainer.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("ship") && e.target.classList.contains("draggable")) {
            domManager.allowDrag(e);
        }
    });
    mainContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("startButton")) {
            testPlayer.gameboard.setup(domManager.getShips());
            domManager.setupPlayerBoard(testPlayer.gameboard.getMissedHits(), testPlayer.gameboard.getShipHits(), testPlayer.gameboard.getShips());
            anotherPlayer.gameboard.setup(anotherPlayer.getRandomShipCoords());
            domManager.setupOpponentBoard(anotherPlayer.gameboard.getMissedHits(), anotherPlayer.gameboard.getShipHits(), anotherPlayer.gameboard.getShips());
            

        }
    })
}

pageLoad();
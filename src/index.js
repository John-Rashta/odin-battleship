import "../assets/styles/styles.css";
import setupDom from "./dom";
import setupPlayer from "./player";


const pageLoad = function pageSetupAndManagement() {
    const mainContainer = document.querySelector(".mainContainer");
    const domManager = setupDom();
    mainContainer.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("ship")) {
            domManager.allowDrag(e);
        }
    })
}

pageLoad();
import * as gameDifficulty from "./gamedifficulty.js";
import * as gameMode from "./gamemode.js";

const easyButton = document.getElementById('easyBtn')
const mediumButton = document.getElementById("mediumBtn")
const hardButton = document.getElementById("hardBtn")
const timeAttackBtn = document.getElementById('time-attack')
const classicBtn = document.getElementById('classic')
const startButton = document.getElementById('start-game')
const selectedSettings = document.getElementById('selected-settings')
const homeButton = document.getElementById('home-button')

homeButton.addEventListener('click',()=>window.location.href="gamesettings.html")

const modeButtons = {
    "time-attack": timeAttackBtn,
    classic: classicBtn
}

const difficultyButtons = {
    easy: easyButton,
    medium: mediumButton,
    hard: hardButton
}

if (!localStorage.getItem("gameMode")){
    localStorage.setItem("gameMode", "classic")
}

if (!localStorage.getItem("gameDifficulty")){
    localStorage.setItem("gameDifficulty", "easy")
}

function capitalize(word){
    return word.charAt(0).toUpperCase() + word.slice(1)
}

function showSelectedSettings(){
    const selectedMode = localStorage.getItem("gameMode")
    const selectedDifficulty = localStorage.getItem("gameDifficulty")

    Object.entries(modeButtons).forEach(([mode, button]) => {
        button.classList.toggle("selected", mode === selectedMode)
    })

    Object.entries(difficultyButtons).forEach(([difficulty, button]) => {
        button.classList.toggle("selected", difficulty === selectedDifficulty)
    })

    selectedSettings.textContent = `${capitalize(selectedMode.replace("-", " "))} mode | ${capitalize(selectedDifficulty)} difficulty`
}

easyButton.addEventListener("click", () =>{
    gameDifficulty.easyMode()
    showSelectedSettings()
})

mediumButton.addEventListener("click", () => {
    gameDifficulty.mediumMode()
    showSelectedSettings()
})

hardButton.addEventListener("click", () => {
    gameDifficulty.hardMode()
    showSelectedSettings()
})

timeAttackBtn.addEventListener('click', () =>{
    gameMode.timeAttackMode()
    showSelectedSettings()
})

classicBtn.addEventListener('click',() => {
    gameMode.classicMode()
    showSelectedSettings()
})

startButton.addEventListener('click', () => {
    window.location.href = "game.html"
})

showSelectedSettings()

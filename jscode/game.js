//array that keeps track of the win,tie and lose conditions of the game
const conditions = {
    lose:['scissors-paper','rock-scissors','paper-rock'],
    tie:['scissors-scissors','rock-rock','paper-paper'],
    win:['paper-scissors','scissors-rock','rock-paper']
};

//array of numbers to be selected at random throughout the game
const colorLst = ['red','pink','purple','orange','green','brown','blue','yellow','lavender','lavender-blush',
    'aqua','bisque','firebrick','slateblue','crimson','azure','cadetblue','burlywood','marroon','magenta','snow',
    'darkviolet','lime','rebeccapurple','sienna','palegreen','navy','deeppink','ghostwhite','teal','springgreen','tomato'
];

//choices for the player and the computer to chose from
const choices = ['scissors','paper','rock'];
const countdownChoices = ['rock','paper','scissors'];
const moveThatBeats = {
    rock: 'paper',
    paper: 'scissors',
    scissors: 'rock'
};

const PLAYER_HISTORY_KEY = "rps-player-history";
const ACHIEVEMENTS_KEY = "rps-achievements";
const GAME_STATS_KEY = "rps-game-stats";
const TIME_ATTACK_SECONDS = 30;
const CLASSIC_ROUND_LIMITS = {
    easy: 10,
    medium: 20,
    hard: 30
};
const ACHIEVEMENT_DISPLAY_TIME = 2000;
const ACHIEVEMENT_FADE_TIME = 300;

const defaultAchievements = {
    firstWin: false, //win one time
    firstLoss: false, //lose one time
    tenWinsInARow:false, //win 10 times in a row
    tenLossesInARow:false, //lose 10 times in a row
    timeAttackWinner: false, //win a time attack game
    timeAttackVeteran: false, //play 10 time attack games
    easyChampion: false, // win 10 easy classic games
    mediumChampion: false, //win 10 medium classic games
    hardChampion: false, //win 10 hard classic games
    firstTie: false, // tie one game
    jackOfAllTrades: false, //win atleast one game on each diffiulty and mode
    unbeatable: false, // win 20 games in a row
    rockPaperScissors: false, // play 1 of each option in one game
    betterLuckNextTime: false, // lose 10 times
    dedicatedPlayer: false //play over 50 games
};

const defaultGameStats = {
    wins: 0,
    losses:0,
    ties:0,
    winStreak:0,
    lossStreak:0,
    gamesPlayed:0,
    timeAttackWins:0,
    timeAttackGames:0,
    classicMatchWins:{
        easy:0,
        medium:0,
        hard:0
    },
    playerOptions:{
        "rock":0,
        "paper":0,
        "scissors":0
    },
};

let achievements = loadSavedGameData(ACHIEVEMENTS_KEY, defaultAchievements);
let gameStats = loadSavedGameData(GAME_STATS_KEY, defaultGameStats);

const achievementDefinitions = {
    firstWin:{
        name: "🏆 First Win",
        check: () => gameStats.wins === 1
    },
    firstLoss:{
        name: "💀 First Loss",
        check: () => gameStats.losses === 1
    },
    tenWinsInARow:{
        name: "🔥 10 Wins in a Row",
        check: () => gameStats.winStreak >= 10
    },
    tenLossesInARow:{
        name: "😭 10 Losses in a Row",
        check: () => gameStats.lossStreak >= 10
    },
    timeAttackWinner:{
        name: "⏰ Time Attack Winner",
        check: () => gameStats.timeAttackWins == 1
    },
    timeAttackVeteran:{
        name: "⚡ Time Attack Veteran",
        check: () => gameStats.timeAttackGames >= 10
    },
    easyChampion:{
        name: "🥉 Easy Champion",
        check: () => gameStats.classicMatchWins.easy >= 10
    },
    mediumChampion:{
        name: "🥈 Medium Champion",
        check: () => gameStats.classicMatchWins.medium >= 10
    },
    hardChampion:{
        name: "🥇 Hard Champion",
        check: () => gameStats.classicMatchWins.hard >= 10
    },
    firstTie:{
        name: "🤝 First Tie",
        check: () => gameStats.ties >= 1
    },
    jackOfAllTrades:{
        name: "🎭 Jack of All Trades",
        check: () => gameStats.classicMatchWins.easy >= 1 && gameStats.classicMatchWins.medium >= 1 && gameStats.classicMatchWins.hard >=1 && gameStats.timeAttackWins >= 1
    },
    unbeatable:{
        name: "👑 Unbeatable",
        check: () => gameStats.winStreak > 19
    },
    rockPaperScissors: {
        name: "🪨📄✂️ Rock Paper Scissors",
        check: () => sessionPlayerOptions["rock"] >= 1 && sessionPlayerOptions["paper"] >= 1 && sessionPlayerOptions["scissors"] >= 1
    },
    betterLuckNextTime:{
        name: "🍀 Better Luck Next Time",
        check: () => gameStats.losses >= 10
    },
    dedicatedPlayer:{
        name:"🎮 Dedicated Player",
        check: () => gameStats.gamesPlayed >= 50
    }
}

let counter = 0;
const COUNTDOWN_DISPLAY_TIME = 500;
const ITEM_DISPLAY_TIME = 2000;
const FADE_OUT_CLASS = "fade-out";
const FADE_IN_CLASS = "fade-in";
const PAGE_FADE_TIME = 300;
const SCORE_FADE_TIME = 300;
const btnIds = ["rock-button","scissors-button","paper-button"]
const btns = [];
const resetButton = document.getElementById("reset-button")
const homeButton = document.getElementById("home-button")
let animationTimeouts = [];
let playerHistory = loadPlayerHistory();
let isRoundActive = false;
let isGameOver = false;
let timeLeft = TIME_ATTACK_SECONDS;
let timerInterval = null;
let classicRoundsPlayed = 0;
let classicSessionWins = 0;
let classicSessionLosses = 0;
let classicSessionTies = 0;
let classicResultSaved = false;
let timeAttackSessionWins = 0;
let timeAttackSessionLosses = 0;
let timeAttackSessionTies = 0;
let timeAttackResultSaved = false;
let achievementQueue = [];
let isAchievementShowing = false;
let sessionPlayerOptions = {
    rock: 0,
    paper: 0,
    scissors: 0
};

for (const buttonId of btnIds){
    const button = document.getElementById(buttonId)
    btns.push(button)
}

//returns a random choice whatever list is inserted
function randomChoice(lst){
    const random = Math.round(Math.random()*(lst.length - 1))
    return lst[random];
}

function getSavedGameSetting(key, fallback, allowedValues){
    const savedValue = localStorage.getItem(key);

    if (allowedValues.includes(savedValue)){
        return savedValue;
    }

    return fallback;
}

function copyGameData(defaultData){
    return JSON.parse(JSON.stringify(defaultData));
}

function loadSavedGameData(key, defaultData){
    const savedData = localStorage.getItem(key);
    const fallbackData = copyGameData(defaultData);

    if (!savedData){
        return fallbackData;
    }

    try {
        const parsedData = JSON.parse(savedData);
        const mergedData = {
            ...fallbackData,
            ...parsedData
        };

        if (fallbackData.playerOptions){
            mergedData.playerOptions = {
                ...fallbackData.playerOptions,
                ...(parsedData.playerOptions || {})
            };
        }

        if (fallbackData.classicMatchWins){
            mergedData.classicMatchWins = {
                ...fallbackData.classicMatchWins,
                ...(parsedData.classicMatchWins || {})
            };
        }

        return mergedData;
    } catch {
        return fallbackData;
    }
}

function saveGameData(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}

const gameSettings = {
    mode: getSavedGameSetting("gameMode", "classic", ["classic", "time-attack"]),
    difficulty: getSavedGameSetting("gameDifficulty", "easy", ["easy", "medium", "hard"])
};

function loadPlayerHistory(){
    const savedHistory = localStorage.getItem(PLAYER_HISTORY_KEY);

    if (!savedHistory){
        return [];
    }

    try {
        const parsedHistory = JSON.parse(savedHistory);
        return parsedHistory.filter(choice => choices.includes(choice));
    } catch {
        return [];
    }
}

function savePlayerMove(playerChoice){
    playerHistory.push(playerChoice);
    playerHistory = playerHistory.slice(-50);
    localStorage.setItem(PLAYER_HISTORY_KEY, JSON.stringify(playerHistory));
}

function getMostCommonMove(moveList){
    const moveCounts = {
        rock: 0,
        paper: 0,
        scissors: 0
    };

    moveList.forEach(move => {
        moveCounts[move]++;
    });

    return choices.reduce((bestMove, move) => {
        if (moveCounts[move] > moveCounts[bestMove]){
            return move;
        }

        return bestMove;
    }, choices[0]);
}

function predictNextPlayerMove(){
    if (playerHistory.length === 0){
        return randomChoice(choices);
    }

    const lastPlayerMove = playerHistory[playerHistory.length - 1];
    const followUpMoves = [];

    for (let i = 0; i < playerHistory.length - 1; i++){
        if (playerHistory[i] === lastPlayerMove){
            followUpMoves.push(playerHistory[i + 1]);
        }
    }

    if (followUpMoves.length > 0){
        return getMostCommonMove(followUpMoves);
    }

    return getMostCommonMove(playerHistory);
}

function getComputerChoice(){
    if (gameSettings.difficulty === "easy"){
        return randomChoice(choices);
    }

    const predictedPlayerMove = predictNextPlayerMove();
    const counterMove = moveThatBeats[predictedPlayerMove];
    const predictionChance = gameSettings.difficulty === "hard" ? 0.9 : 0.6;

    if (Math.random() < predictionChance){
        return counterMove;
    }

    return randomChoice(choices);
}

function getOutcome(computerChoice, playerChoice){
    const gameOutcome = `${computerChoice}-${playerChoice}`;

    if (conditions.win.includes(gameOutcome)){
        return 'You win';
    }

    if (conditions.tie.includes(gameOutcome)) {
        return 'Its a tie';
    }

    return 'You lose';
}

function updateGameStatus(){
    const modeLabel = document.getElementById("mode-label");
    const difficultyLabel = document.getElementById("difficulty-label");
    const timerLabel = document.getElementById("timer-label");
    const timeLeftLabel = document.getElementById("time-left");
    const roundLimitLabel = document.getElementById("round-limit-label");
    const roundsPlayedLabel = document.getElementById("rounds-played");
    const roundLimitTotalLabel = document.getElementById("round-limit-total");

    modeLabel.innerHTML = gameSettings.mode === "time-attack" ? "Time Attack" : "Classic";
    difficultyLabel.innerHTML = capitalize(gameSettings.difficulty);
    timeLeftLabel.innerHTML = timeLeft;
    timerLabel.classList.toggle("hidden", gameSettings.mode !== "time-attack");
    roundLimitLabel.classList.toggle("hidden", gameSettings.mode !== "classic");
    roundsPlayedLabel.innerHTML = classicRoundsPlayed;
    roundLimitTotalLabel.innerHTML = CLASSIC_ROUND_LIMITS[gameSettings.difficulty];
}

function setGameButtonsDisabled(disabled){
    btns.forEach(button => {
        button.disabled = disabled;
    });
}

function startTimeAttackMode(){
    if (gameSettings.mode !== "time-attack"){
        return;
    }

    timerInterval = setInterval(() => {
        timeLeft--;
        updateGameStatus();

        if (timeLeft <= 0){
            endTimeAttackMode();
        }
    }, 1000);
}

function endTimeAttackMode(){
    isGameOver = true;
    clearInterval(timerInterval);
    timeLeft = 0;
    updateGameStatus();
    setGameButtonsDisabled(true);

    if (!isRoundActive){
        finishTimeAttackGame();
    }
}

function endClassicMode(){
    if (gameSettings.mode !== "classic" || classicResultSaved){
        return;
    }

    isGameOver = true;
    classicResultSaved = true;
    setGameButtonsDisabled(true);

    if (classicSessionWins > classicSessionLosses){
        gameStats.classicMatchWins[gameSettings.difficulty]++;
    }

    const achievementsUnlocked = checkAchievements();

    saveGameData(GAME_STATS_KEY, gameStats);
    saveGameData(ACHIEVEMENTS_KEY, achievements);
    queueAchievementNotifications(achievementsUnlocked);
    showOverallResult("", classicSessionWins, classicSessionLosses, classicSessionTies);
}

function finishTimeAttackGame(){
    processTimeAttackGame();
    showOverallResult("Time's up!", timeAttackSessionWins, timeAttackSessionLosses, timeAttackSessionTies);
}

function showOverallResult(prefix, wins, losses, ties){
    let resultText = "The match ended in a tie!";

    if (wins > losses){
        resultText = "You won the match!";
    } else if (losses > wins){
        resultText = "You lost the match!";
    }

    document.getElementById('winner').innerHTML = `${prefix} ${resultText}`.trim();
    document.getElementById('p2').innerHTML = `Wins:<span id="wins">${wins}</span>|Losses:<span id="losses">${losses}</span>|Ties:<span id="ties">${ties}</span>`;
}

function getResultType(outcome){
    if (outcome === "You win"){
        return "win";
    }

    if (outcome === "You lose"){
        return "lose";
    }

    return "tie";
}

function updateStats(result, playerChoice){
    gameStats.gamesPlayed++;
    gameStats.playerOptions[playerChoice]++;
    sessionPlayerOptions[playerChoice]++;

    if (gameSettings.mode === "classic"){
        classicRoundsPlayed++;
    }

    switch(result){
        case "win":
            gameStats.wins++;
            gameStats.winStreak++;
            gameStats.lossStreak = 0;

            if (gameSettings.mode === "time-attack"){
                timeAttackSessionWins++;
            } else {
                classicSessionWins++;
            }
            break;
        case "lose":
            gameStats.losses++;
            gameStats.lossStreak++;
            gameStats.winStreak = 0;

            if (gameSettings.mode === "time-attack"){
                timeAttackSessionLosses++;
            } else {
                classicSessionLosses++;
            }
            break;
        case "tie":
            gameStats.ties++;
            gameStats.winStreak = 0;
            gameStats.lossStreak = 0;

            if (gameSettings.mode === "time-attack"){
                timeAttackSessionTies++;
            } else {
                classicSessionTies++;
            }
            break;
    }
}

function checkAchievements(){
    const achievementsUnlocked = [];

    Object.entries(achievementDefinitions).forEach(([achievementId, achievement]) => {
        if (!achievements[achievementId] && achievement.check()){
            achievements[achievementId] = true;
            achievementsUnlocked.push(achievementId);
        }
    });

    return achievementsUnlocked;
}

function processGame(playerChoice,outcome){
    const result = getResultType(outcome);

    updateStats(result, playerChoice);
    const achievementsUnlocked = checkAchievements();

    saveGameData(GAME_STATS_KEY, gameStats);
    saveGameData(ACHIEVEMENTS_KEY, achievements);
    updateGameStatus();
    queueAchievementNotifications(achievementsUnlocked);
}

function processTimeAttackGame(){
    if (gameSettings.mode !== "time-attack" || timeAttackResultSaved){
        return;
    }

    timeAttackResultSaved = true;
    gameStats.timeAttackGames++;

    if (timeAttackSessionWins > timeAttackSessionLosses){
        gameStats.timeAttackWins++;
    }

    const achievementsUnlocked = checkAchievements();

    saveGameData(GAME_STATS_KEY, gameStats);
    saveGameData(ACHIEVEMENTS_KEY, achievements);
    queueAchievementNotifications(achievementsUnlocked);
}

function queueAchievementNotifications(achievementIds){
    const unlockedAchievements = achievementIds
        .map(achievementId => achievementDefinitions[achievementId])
        .filter(Boolean);

    achievementQueue.push(...unlockedAchievements);

    if (!isAchievementShowing){
        showNextAchievementNotification();
    }
}

function showNextAchievementNotification(){
    const achievementBanner = document.getElementById("achievement-banner");

    if (!achievementBanner || achievementQueue.length === 0){
        isAchievementShowing = false;
        return;
    }

    isAchievementShowing = true;
    const achievement = achievementQueue.shift();
    achievementBanner.textContent = `Achievement unlocked: ${achievement.name}`;
    achievementBanner.classList.remove("hidden", "achievement-show", "achievement-hide");
    void achievementBanner.offsetWidth;
    achievementBanner.classList.add("achievement-show");

    setTimeout(() => {
        achievementBanner.classList.remove("achievement-show");
        achievementBanner.classList.add("achievement-hide");
    }, ACHIEVEMENT_DISPLAY_TIME);

    setTimeout(() => {
        achievementBanner.classList.add("hidden");
        achievementBanner.classList.remove("achievement-hide");
        showNextAchievementNotification();
    }, ACHIEVEMENT_DISPLAY_TIME + ACHIEVEMENT_FADE_TIME);
}

//logic to change the colors of the items on the page
function changeColors(){
    const div1 = document.getElementById('computer-div');
    const div2 = document.getElementById('player-div');
    const greyP = document.querySelectorAll('.greyed');
    const winnerDiv = document.getElementById('win-statistics');
    const p1 = document.getElementById('winner');
    const p2 = document.getElementById('p2');
    const buttons = document.querySelectorAll('button');
    
    const color1 = randomChoice(colorLst);
    let color2 = randomChoice(colorLst)
    //makes sure that both these colors arent the same for more style of course
    while(color1 === color2){color2 = randomChoice(colorLst)};

    div1.style.backgroundColor = color1;
    p2.style.color = color1;
    div2.style.backgroundColor = color2;
    p1.style.color = color2;
    //changes the colors of the words to a specific color easy for the user to see
    winnerDiv.style.backgroundColor = 'rgb(222, 222, 222)';

    greyP.forEach(p=> p.style.color = 'rgb(222, 222, 222)');

    buttons.forEach(button=>{
        button.classList.add("active-background")
        //changes the hover effect of the buttons
        button.classList.remove('hover-effect1');
        button.classList.add('hover-effect2');
    })

};

function animations(playerChoice,computerChoice,showResult,onComplete){
    const compCountdownObject = {
        "rock":document.getElementById('comp-handrock'),
        "paper":document.getElementById('comp-handpaper'),
        "scissors":document.getElementById('comp-handscissors')
    }

    const playerCountdownObject = {
        "rock":document.getElementById('player-handrock'),
        "paper":document.getElementById('player-handpaper'),
        "scissors":document.getElementById('player-handscissors')
    }

    const compChoiceObject = {
        "rock":document.getElementById('comp-rock'),
        "paper":document.getElementById('comp-paper'),
        "scissors":document.getElementById('comp-scissors')
    }

    const playerChoiceObject = {
        "rock":document.getElementById('player-rock'),
        "paper":document.getElementById('player-paper'),
        "scissors":document.getElementById('player-scissors')
    }

    const playerSelection = playerChoiceObject[playerChoice];
    const computerSelection = compChoiceObject[computerChoice];

    clearAnimations();
    hideChoices(compChoiceObject, playerChoiceObject, compCountdownObject, playerCountdownObject);
    controlElements("hide");

    countdownChoices.forEach((choice,index)=>{
        const countdownTimeout = setTimeout(()=>{
            hideChoices(compChoiceObject, playerChoiceObject, compCountdownObject, playerCountdownObject);
            showCountdownChoice(compCountdownObject[choice], playerCountdownObject[choice]);
            document.getElementById('winner').innerHTML = capitalize(choice);
        },COUNTDOWN_DISPLAY_TIME * index)

        animationTimeouts.push(countdownTimeout);
    })

    const resultTimeout = setTimeout(()=>{
        hideChoices(compCountdownObject, playerCountdownObject);
        computerSelection.classList.remove("hidden");
        playerSelection.classList.remove("hidden");
        showResult(); 
    },COUNTDOWN_DISPLAY_TIME * countdownChoices.length)

    animationTimeouts.push(resultTimeout);

    const fadeResultTimeout = setTimeout(()=>{
        fadeOutResult(computerSelection, playerSelection);
        const winner = document.getElementById('winner');
        winner.style.animationDuration = `${PAGE_FADE_TIME}ms`;
        winner.classList.add(FADE_OUT_CLASS);
    },COUNTDOWN_DISPLAY_TIME * countdownChoices.length + ITEM_DISPLAY_TIME)

    animationTimeouts.push(fadeResultTimeout);

    const resetTimeout = setTimeout(()=>{
        hideChoices(compChoiceObject, playerChoiceObject, compCountdownObject, playerCountdownObject)
        const winner = document.getElementById('winner');
        winner.innerHTML = isGameOver ? "Time's up!" : "";
        winner.classList.remove(FADE_OUT_CLASS);
        document.getElementById('computer-choice').innerHTML = "Computer";
        document.getElementById('selected-option').innerHTML = "Player";
        controlElements("show")
        if (onComplete){
            onComplete();
        }
    },COUNTDOWN_DISPLAY_TIME * countdownChoices.length + ITEM_DISPLAY_TIME + PAGE_FADE_TIME)

    animationTimeouts.push(resetTimeout);
}

function clearAnimations(){
    animationTimeouts.forEach(timeout => clearTimeout(timeout));
    animationTimeouts = [];
}

function hideChoices(...choiceObjects){
    choiceObjects.forEach(choiceObject=>{
        Object.values(choiceObject).forEach(choice => {
            choice.classList.remove(FADE_OUT_CLASS);
            choice.classList.add("hidden");
        });
    })
}

function showCountdownChoice(...choices){
    choices.forEach(choice=>{
        choice.style.animationDuration = `${COUNTDOWN_DISPLAY_TIME}ms`;
        choice.classList.remove("hidden");
        choice.classList.remove(FADE_OUT_CLASS);
        void choice.offsetWidth;
        choice.classList.add(FADE_OUT_CLASS);
    })
}

function fadeOutResult(...choices){
    choices.forEach(choice=>{
        choice.style.animationDuration = `${PAGE_FADE_TIME}ms`;
        choice.classList.remove(FADE_OUT_CLASS);
        void choice.offsetWidth;
        choice.classList.add(FADE_OUT_CLASS);
    })
}

function capitalize(word){
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function updateScore(scoreElement){
    scoreElement.classList.remove("score-fade-in");
    scoreElement.classList.add("score-fade-out");

    const scoreTimeout = setTimeout(()=>{
        scoreElement.innerHTML++;
        scoreElement.classList.remove("score-fade-out");
        scoreElement.classList.add("score-fade-in");
    },SCORE_FADE_TIME)

    animationTimeouts.push(scoreTimeout);
}

function controlElements(control){
    const compSelection = document.getElementById('computer-choice')
    const playerSelection = document.getElementById('selected-option')
    const playerContainer = document.getElementById('player-choice')
    const resetContainer = document.getElementById('reset-button-container')

    if (control === "hide"){
        [compSelection,playerSelection,playerContainer,resetContainer].forEach(element=> {
            element.classList.remove(FADE_IN_CLASS);
            element.classList.add("hidden");
        })
    }else{
        [compSelection,playerSelection,playerContainer,resetContainer].forEach(element=> {
            element.style.animationDuration = `${PAGE_FADE_TIME}ms`;
            element.classList.remove("hidden");
            element.classList.remove(FADE_IN_CLASS);
            void element.offsetWidth;
            element.classList.add(FADE_IN_CLASS);
        })
    }
}

//game logic
btns.forEach(btn=>{
    btn.addEventListener('click',function (){
        if (isRoundActive || isGameOver){
            return;
        }

        isRoundActive = true;
        setGameButtonsDisabled(true);

        const computerChoice = getComputerChoice();//saves a computer choice based on the chosen difficulty
        const playerChoice = this.name//saves the name of the button as the players choice on click
        const displayOutcome = document.getElementById('winner');
        const wins = document.getElementById('wins')
        const losses = document.getElementById('losses')
        const ties = document.getElementById('ties')
        const outcome = getOutcome(computerChoice, playerChoice);

        animations(playerChoice,computerChoice,()=>{
            if (outcome === 'You win'){
                updateScore(wins);
            } else if (outcome === 'You lose') {
                updateScore(losses);
            } else {
                updateScore(ties);
            }

            document.getElementById('computer-choice').innerHTML =`Computer:${computerChoice}`;
            document.getElementById('selected-option').innerHTML = `Player:${playerChoice}`;//displays the player choice
            displayOutcome.innerHTML = outcome;
            changeColors();
            savePlayerMove(playerChoice);
        }, () => {
            processGame(playerChoice, outcome);
            if (gameSettings.mode === "classic" && classicRoundsPlayed >= CLASSIC_ROUND_LIMITS[gameSettings.difficulty]){
                endClassicMode();
            }
            if (gameSettings.mode === "time-attack" && isGameOver){
                finishTimeAttackGame();
            }
            isRoundActive = false;
            setGameButtonsDisabled(isGameOver);
        })
    });
})

resetButton.addEventListener("click",()=>{
    localStorage.removeItem(PLAYER_HISTORY_KEY);
    location.reload();
})

homeButton.addEventListener("click", () => {
    window.location.href = "gamesettings.html";
})

updateGameStatus();
startTimeAttackMode();

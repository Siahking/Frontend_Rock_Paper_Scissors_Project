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
let animationTimeouts = [];

for (const buttonId of btnIds){
    const button = document.getElementById(buttonId)
    btns.push(button)
}

//returns a random choice whatever list is inserted
function randomChoice(lst){
    const random = Math.round(Math.random()*(lst.length - 1))
    return lst[random];
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

// function hardMode(playerChoice){
//     let choices = {
//         "scissors":0,
//         "paper":0,
//         "rock":0
//     }

//     if (localStorage.getItem("Choices")){
//         choices = JSON.parse(localStorage.getItem("Choices"))
//     }else{
//         choices[playerChoice]++;
//     }
// }

function animations(playerChoice,computerChoice,showResult){
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
        document.getElementById('winner').innerHTML = "";
        document.getElementById('winner').classList.remove(FADE_OUT_CLASS);
        document.getElementById('computer-choice').innerHTML = "Computer";
        document.getElementById('selected-option').innerHTML = "Player";
        controlElements("show")
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
        const computerChoice = randomChoice(choices);//saves a random choice form the choice array for the user
        const playerChoice = this.name//saves the name of the button as the players choice on click
        const gameOutcome = `${computerChoice}-${playerChoice}`;//saves the outcome of the game to compare to the win conditons
        const displayOutcome = document.getElementById('winner');
        const wins = document.getElementById('wins')
        const losses = document.getElementById('losses')
        let outcome = '';
        
        if (conditions.win.includes(gameOutcome)){//compares the game outcome with the conditions
            outcome = 'You win';
        }else if (conditions.tie.includes(gameOutcome)) {
            outcome = 'Its a tie';
        }else{
            outcome = 'You lose';
        }

        animations(playerChoice,computerChoice,()=>{
            if (outcome === 'You win'){
                updateScore(wins);
            } else if (outcome === 'You lose') {
                updateScore(losses);
            }

            document.getElementById('computer-choice').innerHTML =`Computer:${computerChoice}`;
            document.getElementById('selected-option').innerHTML = `Player:${playerChoice}`;//displays the player choice
            displayOutcome.innerHTML = outcome;
            changeColors();
        })
    });
})

resetButton.addEventListener("click",()=>location.reload())

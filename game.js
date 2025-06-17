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
let counter = 0;
const btnIds = ["rock-button","scissors-button","paper-button"]
const btns = [];
const resetButton = document.getElementById("reset-button")

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

//game logic
btns.forEach(btn=>{
    btn.addEventListener('click',function (){
        const computerChoice = randomChoice(choices);//saves a random choice form the choice array for the user
        const playerChoice = this.name//saves the name of the button as the players choice on click
        const gameOutcome = `${computerChoice}-${playerChoice}`;//saves the outcome of the game to compare to the win conditons
        const displayOutcome = document.getElementById('winner');
        const wins = document.getElementById('wins')
        let outcome = '';
        document.getElementById('computer-choice').innerHTML =`Computer:${computerChoice}`;
        
        if (conditions.win.includes(gameOutcome)){//compares the game outcome with the conditions
            wins.innerHTML++;
            outcome = 'You win';
        }else if (conditions.tie.includes(gameOutcome)) {
            outcome = 'Its a tie';
        }else{
            outcome = 'You lose';
        }

        changeColors();

        document.getElementById('selected-option').innerHTML = `Player:${playerChoice}`;//displays the player choice
        displayOutcome.innerHTML = outcome;
    });
})

resetButton.addEventListener("click",()=>location.reload())
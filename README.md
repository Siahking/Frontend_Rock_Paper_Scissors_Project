# Rock Paper Scissors Game

A simple interactive **Rock, Paper, Scissors** browser game built using **HTML, CSS, and JavaScript**.
The player selects an option and the computer randomly generates a choice. The game then determines whether the player **wins, loses, or ties**.

The UI dynamically changes colors afte each round making the game visually engaging.

---

## Features

 - Player vs Computer gameplay
 - Random computer choice generation
 - Game outcome detection (Win / Lose / Tie)
 - Dynamic color changes after each round
 - Win computer that tracks player victories
 - Reset button to restart the game
 - Responsive design for different screen sizes

---

## Technologies Used
 - **HTML** - Page structure
 - **CSS**  - Styling and responsive layout
 - **Javascript(Vanilla JS)** - Game login and DOM manipulation

---

## How the Game Works

1. The player clicks **Rock**, **Paper**, or **Scissors**.
2. The computer randomly selects one of the three options.
3. The game compares both choices against predefined win/lose/tie conditions.
4. The result is displayed on the screen.
5. The background colors change dynamically for visual feedback.
6. Player wins are counted and displayed.

---

##Game Logic

The game determines outcomes useing predefined conditions:

```javascript
const conditions = {
    lose: ['scissors-paper','rock-scissors','paper-rock'],
    tie: ['scissors-scissors','rock-rock','paper-paper'],
    win: ['paper-scissors','scissors-rock','rock-paper']
}
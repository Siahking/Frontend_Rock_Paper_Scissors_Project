const achievementDefinitions = {
    firstWin:{
        name: "First Win",
        check: () => gameStats.wins === 1
    },
    firstLoss:{
        name: "First Loss",
        check: () => gameStats.losses === 1
    },
    tenWinsInARow:{
        name: "10 Wins in a Row",
        check: () => gameStats.winStreak >= 10
    },
    tenLossesInARow:{
        name: "10 Losses in a Row",
        check: () => gameStats.lossStreak >= 10
    },
    timeAttackWinner:{
        name: "Time Attack Winner",
        check: () => gameStats.timeAttackWins == 1
    },
    timeAttackVeteran:{
        name: "Time Attack Veteran",
        check: () => gameStats.timeAttackGames >= 10
    },
    easyChampion:{
        name: "Easy Champion",
        check: () => gameStats.easyWins >= 10
    },
    mediumChampion:{
        name: "Medium Champion",
        check: () => gameStats.mediumWins >= 10
    },
    hardChampion:{
        name: "Hard Champion",
        check: () => gameStats.hardWins >= 10
    },
    firstTie:{
        name: "First Tie",
        check: () => gameStats.ties >= 1
    },
    jackOfAllTrades:{
        name: "Jack of All Trades",
        check: () => gameStats.easyWins >= 1 && gameStats.mediumWins >= 1 && gameStats.hardWins >=1 && gameStats.timeAttackWins >= 1
    },
    unbeatable:{
        name: "Unbeatable",
        check: () => gameStats.winStreak > 19
    },
    rockPaperScissors: {
        name: "Rock Paper Scissors",
        check: () => playerOptions["rock"] >= 1 && playerOptions["paper"] >= 1 && paperOptions["scissors"] >= 1
    },
    betterLuckNextTime:{
        name: "Better Luck Next Time",
        check: () => gameStats.losses >= 10
    },
    dedicatedPlayer:{
        name:" Dedicated Player",
        check: () => gameStats.gamesPlayed >= 50
    }
}

for (const [key,achievement] of Object.entries(achievementDefinitions)){
    console.log(`key is ${key}`)
    console.log(`achievement is ${achievement}`)
}
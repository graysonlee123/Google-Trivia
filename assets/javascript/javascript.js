// Variables
const questionTime = 20;
const answerPageTime = 4;
let remainingTime = questionTime;
let answerPageTimeRemains = answerPageTime;
let mainIntervalID;

let losses = 0;
let wins = 0;

const googleImg = $("#google-image");
const display = $("#display");

let userGuess;
let userGuessString;

let currentQuestion = 0;

// Game functions
$.getJSON('/assets/json/questions.json')
    .then(data => {
        game.initialize();
    }).catch(err => {
        console.log(err);
        display.empty().append(`<div>Sorry! Something went wrong. Please <a href="https://www.github.com/graysonlee123/google-trivia/issues" target="_blank">submit an issue</a>.</div>`);
    });

const game = {
    runGame: function () {
        console.log("Running game");

        game.loadQuestion(currentQuestion);

        googleImg.attr("src", "././assets/images/question.png");

    },
    startClock: function () {
        mainIntervalID = setInterval(function () {
            if (remainingTime == 0) {
                //Run Exit Round
                // console.log("Display Results");
                // clearInterval(mainIntervalID);
                // game.displayAnswerTimer();
                // remainingTime = questionTime;
                game.exitRound(false);
            } else {
                remainingTime--;
                $("#timer-display").text(remainingTime);
            }
        }, 1000);
    },
    exitRound: function (guessed) {
        clearInterval(mainIntervalID);
        game.displayAnswerTimer();
        remainingTime = questionTime;
        if (guessed == false) {
            game.loadAnswer();
            losses ++;
        }
        game.updateScore();
    },
    loadQuestion: function (index) {
        console.log(currentQuestion);
        game.cleanDisplay();
        game.startClock();
        game.swapImage("question");
        const loadedQuestion = questions[index];
        $("#time-remaining").html(`<div>Time remaining <strong><span id="timer-display">${questionTime}</span></strong>s</div>`);
        display.append(`<div id="search-bar">${loadedQuestion.question}</div>`);
        display.append(`<button class="btn-game btn-style" value="a">${loadedQuestion.a}</button>`);
        display.append(`<button class="btn-game btn-style" value="b">${loadedQuestion.b}</button>`);
        display.append(`<button class="btn-game btn-style" value="c">${loadedQuestion.c}</button>`);
        display.append(`<button class="btn-game btn-style" value="d">${loadedQuestion.d}</button>`);
    },
    displayAnswerTimer: function () {
        let answerPageTimeRemains = answerPageTime;
        answerIntervalID = setInterval(function () {
            if (answerPageTimeRemains == 0) { //If the timer has reached zero, clear the answer timer, and add to current question.
                clearInterval(answerIntervalID);

                currentQuestion++;

                if (currentQuestion == questions.length) { // If current question is the last
                    game.endGame();
                } else {
                    game.loadQuestion(currentQuestion);
                }
            } else {
                answerPageTimeRemains--;
            }
        }, 1000);
    },
    loadAnswer: function (winStatus) {
        game.cleanDisplay();
        game.swapImage("answer");
        if (winStatus == true) {
            display.append(`<h2>Correct!</h2>`);
        } else if (winStatus == false) {
            display.append(`<h2>Incorrect!</h2>`);
        } else {
            display.append(`<h2>Time ran out!<h2>`);
        }
        display.append(`<p><strong>A: </strong>${questions[currentQuestion].answerExplanation}</p>`);
    },
    checkGuess: function () {
        console.log("User guess: " + userGuess + "; Answer: " + questions[currentQuestion].answer);
        if (userGuess == questions[currentQuestion].answer) {
            wins++;
            game.loadAnswer(true);
        } else {
            losses++;
            game.loadAnswer(false);
        }
        game.exitRound(true);

    },
    updateScore: function () {
        $("#correctGuessesDisplay").text(wins);
        $("#incorrectGuessesDisplay").text(losses);
    },
    cleanDisplay: function () {
        display.empty();
    },
    swapImage: function(x) {
        $("#google-image").attr("src", `././assets/images/${x}.png`);
    },
    endGame: function () {
        clearInterval(mainIntervalID);
        game.cleanDisplay();
        game.swapImage("google-trivia");
        display.append(`<h2>Your final score:<h2>`, `<p><strong>${wins}</strong> Wins &ensp; | &ensp; <strong>${losses}</strong> Losses</p>`, `<button id="btn-restart" class="btn-style">Play Again?</button>`);
    },
    initialize: function () {
        game.cleanDisplay();
        game.swapImage("google-trivia");
        currentQuestion = 0;
        wins = 0;
        losses = 0;
        remainingTime = questionTime;
        answerPageTimeRemains = answerPageTime;
        display.append(`<p id="starting-para">You will be asked trivia questions about Google. You will have <strong>${questionTime}</strong> seconds to answer the question, or the round will count as a loss. Good luck!</p>`);
        display.append(`<button onclick="game.runGame()" class="btn-style">Begin</button>`);
    }
}

// Handle button presses

display.on("click", ".btn-game", function (e) {
    const btnVal = $(this).attr("value");
    userGuess = btnVal
    userGuessString = $(this).attr("text");
    console.log(btnVal);
    game.checkGuess();
});

display.on("click", "#btn-restart", function () {
    console.log("Restart!");
    game.initialize();
});

// Variables
// This will be pulled in from JSON
let questions; 
let losses = 0;
let wins = 0;

const questionTime = 20;
const answerPageTime = 4;

let remainingTime = questionTime;
let answerPageTimeRemains = answerPageTime;
let mainIntervalID;

const googleImg = $('#google-image');
const display = $('#display');
const progressBar = $('#progress-bar');

let userGuess;
let userGuessString;

let currentQuestion = 0;

// On page load
$.getJSON('/assets/json/questions.json')
.then(data => {
    questions = data;
    game.initialize();
}).catch(err => {
    console.log(err);
    display.empty().append(`<div>Sorry! Something went wrong. Please <a href='https://www.github.com/graysonlee123/google-trivia/issues' target='_blank'>submit an issue</a>.</div>`);
});

// Handle button presses
display.on('click', '.btn-game', function (e) {
    const btnVal = $(this).attr('value');
    userGuess = btnVal;
    userGuessString = $(this).attr('text');
    game.checkGuess();
});

display.on('click', '#btn-restart', () => game.initialize());

// Game functions
const game = {
    runGame() {
        game.loadQuestion(currentQuestion);
        googleImg.attr('src', '././assets/images/question.png');
    },

    startClock() {
        mainIntervalID = setInterval(function () {
            
            if (remainingTime == 0) {
                game.exitRound(false);
            } else {
                remainingTime--;
                game.progressBar(remainingTime / questionTime);
                $('#timer-display').text(remainingTime);
            }

        }, 1000);
    },

    exitRound(guessed) {
        remainingTime = questionTime;
        
        clearInterval(mainIntervalID);
        game.displayAnswerTimer();

        if (guessed == false) {
            game.loadAnswer();
            losses ++;
        }

        game.updateScore();
    },

    loadQuestion(index) {
        const currentQuestionData = questions[index];
        
        game.cleanDisplay();
        game.startClock();
        game.swapImage('question');

        $('#time-remaining').html(`<div>Time remaining <strong><span id='timer-display'>${questionTime}</span></strong>s</div>`);

        display.append(`<div id='search-bar'>${currentQuestionData.question}</div>`);
        display.append(`<button class='btn-game btn-style' value='answer1'>${currentQuestionData.answer1}</button>`);
        display.append(`<button class='btn-game btn-style' value='answer2'>${currentQuestionData.answer2}</button>`);
        display.append(`<button class='btn-game btn-style' value='answer3'>${currentQuestionData.answer3}</button>`);
        display.append(`<button class='btn-game btn-style' value='answer4'>${currentQuestionData.answer4}</button>`);
    },

    displayAnswerTimer() {
        let answerPageTimeRemains = answerPageTime;

        answerIntervalID = setInterval(function () {
            if (answerPageTimeRemains == 0) { 
                // If the timer has reached zero, clear the answer timer, and add to current question.
                clearInterval(answerIntervalID);

                currentQuestion++;

                if (currentQuestion == questions.length) {
                    // and if current question is the last
                    game.endGame();
                } else {
                    game.loadQuestion(currentQuestion);
                }

            } else {
                answerPageTimeRemains--;
            }
        }, 1000);
    },

    loadAnswer(winStatus) {
        game.cleanDisplay();
        game.swapImage('answer');

        if (winStatus == true) {
            display.append(`<h2>Correct!</h2>`);
        } else if (winStatus == false) {
            display.append(`<h2>Incorrect!</h2>`);
        } else {
            display.append(`<h2>Time ran out!<h2>`);
        }

        display.append(`<p><strong>A: </strong>${questions[currentQuestion].details}</p>`);
    },
    
    checkGuess() {
        if (userGuess == questions[currentQuestion].correctAnswer) {
            wins++;
            game.loadAnswer(true);
        } else {
            losses++;
            game.loadAnswer(false);
        }
        game.exitRound(true);
    },

    updateScore() {
        $('#correctGuessesDisplay').text(wins);
        $('#incorrectGuessesDisplay').text(losses);
    },

    cleanDisplay() {
        display.empty();
    },

    swapImage(x) {
        $('#google-image').attr('src', `././assets/images/${x}.png`);
    },

    endGame() {
        clearInterval(mainIntervalID);
        game.cleanDisplay();
        game.swapImage('google-trivia');

        display.append(`<h2>Your final score:<h2>`, `<p><strong>${wins}</strong> Wins &ensp; | &ensp; <strong>${losses}</strong> Losses</p>`, `<button id='btn-restart' class='btn-style'>Play Again?</button>`);
    },

    progressBar(percent) {
        const parsePercent = `${percent * 100}%`;
        console.log(parsePercent);
        progressBar.width(parsePercent);
    },

    initialize() {
        game.cleanDisplay();
        game.swapImage('google-trivia');

        currentQuestion = 0;
        wins = 0;
        losses = 0;
        remainingTime = questionTime;
        answerPageTimeRemains = answerPageTime;

        display.append(`<p id='starting-para'>You will be asked trivia questions about Google. You will have <strong>${questionTime}</strong> seconds to answer the question, or the round will count as a loss. Good luck!</p>`);
        display.append(`<button onclick='game.runGame()' class='btn-style'>Begin</button>`);
    }
};

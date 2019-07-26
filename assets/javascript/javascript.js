// Variables

const questions = [
    { question: "Google was founded by Larry Page and who else?", a: "Steve Jobs", b: "Sergey Brin", c: "Bill Gates", d: "Terry Winograd", answer: "b", answerExplanation: "Google was founded by Larry Page and Sergey Brin!" },
    { question: "The name \"Google\" originated from a misspelling of:", a: "Googol", b: "Goosearch", c: "Googad", d: "Goolink", answer: "a", answerExplanation: "The name \"Google\" originated from a misspelling of Googol."},
    { question: "In January of 1996, shortly before the launch of Google, a new search engine was brought into existence. What was this search engine called?", a: "BackLinks", b: "BackRub", c: "BreakUp", d: "BackUp", answer: "b", answerExplanation: "The search engine competition was named BackRub." },
    { question: "The domain name www.google.com was registered on:", a: "January 12, 1998", b: "September 15, 1997", c: "August 7, 1997", d: "September 7, 1996", answer: "b", answerExplanation: "www.google.com was registerd on September 15, 1997." },
    { question: "In 1998, when Google.com was still in beta, they were answering up to how many search queries a day?", a: "30,000", b: "450,000", c: "100,000", d: "10,000", answer: "d", answerExplanation: "They were already answering 10,000 searches a day (in 1998!)" },
    { question: "In the year 2000, Google began selling what?", a: "Smaller versions of Google known as Googlers", b: "Image-based advertisements", c: "Text-based advertisements", d: "A ranking mechanism", answer: "c", answerExplanation: "In 2000, Google started selling text-based advertisements based on keywords users searched." },
    { question: "The basis of Google's search tech is nicknamed PageRank, which is named after who or what?", a: "Total number of search results", b: "The original homepage", c: "A founder's girlfriend, Page", d: "Co-founder Larry Page", answer: "d", answerExplanation: "PageRank is named after Google's co-founder Larry Page." },
    { question: "Google's informal corporate motto is:", a: "Turning the Page.", b: "Always First.", c: "Don't Be Evil.", d: "Experience the Difference.", answer: "c", answerExplanation: "Google's informal corporate motto is \"Don't be Evil.\"" },
    { question: "Google received its first funding from Andy Mechtolscheim. It was how much money?", a: "$200,000", b: "$150,000", c: "$100,000", d: "$400,000", answer: "c", answerExplanation: "Google's first funding received was worth $100,000." },
    { question: "To build Google Maps, Google bought an existing startup maps company, which was named:", a: "FindIT Tech", b: "Where 2 Technologies", c: "MapIT Technologies", d: "Get Lost Technologies", answer: "b", answerExplanation: "The company was named Where 2 Technologies. It was bought in 2005." }
];

const questionTime = 20;
const answerPageTime = 2;
let remainingTime = questionTime;
let answerPageTimeRemains = answerPageTime;
let mainIntervalID;

let losses = 0;
let wins = 0;

const googleImg = $("#google-image");
const display = $("#display");

let userGuess;

let currentQuestion = 0;

// Game functions

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
            display.append(`<h2>Incorrect!</h2>`, `<p>${questions[currentQuestion].answerExplanation}</p>`);
        } else {
            display.append(`<h2>Time ran out!<h2>`, `<p>${questions[currentQuestion].answerExplanation}</p>`);
        }
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
        display.append(`<h2>Your final score:<h2>`, `<p>Wins: ${wins}</p>`, `<p>Losses: ${losses}</p>`, `<button id="btn-restart" class="btn-style">Play Again?</button>`);
    },
    initialize: function () {
        game.cleanDisplay();
        game.swapImage("google-trivia");
        currentQuestion = 0;
        wins = 0;
        losses = 0;
        remainingTime = questionTime;
        answerPageTimeRemains = answerPageTime;
        display.append(`You will be asked trivia question about Google. You will have ${questionTime} seconds to answer the question, or the round will count as a loss. Good luck!</p>`);
        display.append(`<button onclick="game.runGame()" class="btn-style">Begin</button>`);
    }
}

// On webpage load

$(document).ready(function () {
    game.initialize();
});

// ON button presses

display.on("click", ".btn-game", function (e) {
    const btnVal = $(this).attr("value");
    userGuess = btnVal
    console.log(btnVal);
    game.checkGuess();
});

display.on("click", "#btn-restart", function () {
    console.log("Restart!");
    game.initialize();
});

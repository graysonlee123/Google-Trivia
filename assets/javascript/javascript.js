// Variables

const questions = [
    { question: "Google was founded by Larry Page and who else?", a: "Steve Jobs", b: "Sergey Brin", c: "Bill Gates", d: "Terry Winograd", answer: "Sergey Brin" },
    { question: "The name \"Google\" originated from a misspelling of:", a: "Googol", b: "Goosearch", c: "Googad", d: "Goolink", answer: "Googol" },
    { question: "In January of 1996, shortly before the launch of Google, a new search engine was brought into existence. What was this search engine called?", a: "BackLinks", b: "BackRub", c: "BreakUp", d: "BackUp", answer: "BackRub" },
    { question: "The domain name www.google.com was registered on:", a: "January 12, 1998", b: "September 15, 1997", c: "August 7, 1997", d: "September 7, 1996", answer: "September 15, 1997" },
    { question: "In 1998, when Google.com was still in beta, they were answering up to how many search queries a day?", a: "30,000", b: "450,000", c: "100,000", d: "10,000", answer: "10,000" }
];

const questionTime = 4;
const answerPageTime = 5;
let remainingTime = questionTime;
let answerPageTimeRemains = answerPageTime;
let mainIntervalID;

const googleImg = $("#google-image");
const display = $("#display");

let currentQuestion = 1;

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
                console.log("Display Results");
                clearInterval(mainIntervalID);
                game.displayAnswerTimer();
                remainingTime = questionTime;
            } else {
                remainingTime--;
                $("#timer-display").text(remainingTime);
                console.log(remainingTime);
            }
        }, 1000);
    },
    loadQuestion: function (index) {
        game.cleanDisplay();
        game.startClock();
        const loadedQuestion = questions[index];
        display.append(`<div>Time remaining: <span id="timer-display">${questionTime}</span></div>`);
        display.append(`<h2>Question ${index}: ${loadedQuestion.question} </h2>`);
        display.append(`<button>${loadedQuestion.a}</button>`);
        display.append(`<button>${loadedQuestion.b}</button>`);
        display.append(`<button>${loadedQuestion.c}</button>`);
        display.append(`<button>${loadedQuestion.d}</button>`);
    },
    displayAnswerTimer: function () {
        let answerPageTimeRemains = answerPageTime;
        
        game.loadAnswer();

        answerIntervalID = setInterval(function () {
            if (answerPageTimeRemains == 0) {
                //Run Exit Round
                console.log("Next Round after answer");

                currentQuestion++;

                game.loadQuestion(currentQuestion);

                answerPageTimeRemains = answerPageTime;

                clearInterval(answerIntervalID);
            } else {
                answerPageTimeRemains--;
                console.log(answerPageTimeRemains);
            }
        }, 1000);
    },
    loadAnswer: function() {
        console.log("Load Answer run");
        game.cleanDisplay();
        display.append(`${questions[currentQuestion].answer}`);
    },
    cleanDisplay: function () {
        display.empty(); 
    },
    initialize: function () {
        display.append(`You will be asked trivia question about Google. You will have ${questionTime} seconds to answer the question, or the round will count as a loss. Good luck!</p>`);
        display.append(`<button id="begin-button" class="btn btn-primary">Begin</button>`);
    }
}

// On webpage load

$(document).ready(function () {
    game.initialize();

    $("#begin-button").on("click", function () {
        game.runGame();
    });
});

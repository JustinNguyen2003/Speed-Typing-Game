const RANDOM_QUOTE_API_URL = 'https://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const formElement = document.getElementById('myForm')
let userInput = 0;


quoteInputElement.addEventListener('input', () => {
    /* Checks to see if every individual letter the user types matches the 
    quote or not. It turns the letter red if it is incorrect, and green if it is correct. 
    It also will only move onto the next quote if the user typed the whole quote correctly*/

    const arrayQuote = quoteDisplayElement.querySelectorAll('span')
    const arrayValue = quoteInputElement.value.split('')
    let correct = true

    arrayQuote.forEach((characterSpan,index) => {
        const character = arrayValue[index]
        if(character ==  null){
            characterSpan.classList.remove('correct')
            characterSpan.classList.remove('incorrect')
            correct = false
        }
        else if(character == characterSpan.innerText){
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        }
        else{
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
            correct = false
        }
    })

    if (correct==true){
        renderNewQuote()
    }
})

function getRandomQuote(){
    /* Gets a random quote from https://api.quotable.io/random every time it is called.*/

    return fetch(RANDOM_QUOTE_API_URL)
        .then(response => response.json())
        .then(data => data.content)
}

async function renderNewQuote(){
    /* Calls getRandomQuote() to get a new quote for the user. This function also splits the quote
    into individual letters so that they can be individually checked for correctness.
    */

    let characterCount = 0;
    const quote = await getRandomQuote()
    quoteDisplayElement.innerHTML = ''
    quote.split('').forEach(character => {
        characterCount++;
        const characterSpan = document.createElement('span')
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
    })
    quoteInputElement.value = null
    //startTimer()
    startTimer(characterCount, userInput);
}

/*let startTime;
function startTimer(){
    timerElement.innerText = 0;
    startTime = new Date();
    setInterval(() => {
        timerElement.innerText = getTimerTime()
    },1000)
}


function getTimerTime(){
    return Math.floor((new Date() - startTime) / 1000)
}*/


let timer;
let timeleft = 30;

function startTimer(characterCount, userInput){
    /* This function takes the number of characters in the quote and also the target WPM that 
    the user inputed. It then sets the countdown timer based on the target WPM and the
    characterCount.
    */

    let multiplier = userInput*5 / characterCount;
    timeleft = Math.floor(60 / multiplier);
    clearInterval(timer);

    timer = setInterval(function() {
        if (timeleft <= 0){
            clearInterval(timer);
            timerElement.innerText = "Time's Up"
        }
        else{
            timerElement.innerText = timeleft;
            timeleft--;
        }

    }, 1000)
}


formElement.addEventListener('submit', function(event){
    event.preventDefault();

    const inputField = document.getElementById('WPMInputText');
    userInput = inputField.value;

    inputField.value = "";
})


renderNewQuote()
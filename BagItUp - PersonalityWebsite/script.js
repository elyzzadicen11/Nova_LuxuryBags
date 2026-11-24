const API_URL = "https://bags-api-elec2.vercel.app/api/v1";
const API_KEY = "personality";

let allBags = [];

function getFetchOptions() {
    return {
        headers: {
            "x-api-key": API_KEY
        }
    };
}

// GET ALL BAGS
async function loadBags() {
    try {
        const response = await fetch(`${API_URL}/bags`, getFetchOptions());

        if (!response.ok) {
            throw new Error("API request failed.");
        }

        const data = await response.json();
        allBags = data.bags;

    }
    catch (error) {
        console.error("Unable to load bags:", error);
    }
}


let currentCounter = 0;
const totalCounter = 12;
let bagScores = {
    "Handbag": 0,
    "Shoulder Bag": 0,
    "Tote Bag": 0,
    "Crossbody": 0,
    "Backpack": 0,
    "Satchel": 0,
    "Mini Bag": 0,
};
let answeredQuestions = [];



// Variables
const counterQuestion = document.getElementById("counter");
const next= document.getElementById("next");
const prev= document.getElementById("prev");
const start =  document.getElementById("Start");
const backStart = document.getElementById("backStart");
const startScreen = document.querySelector(".start-screen");
const questionsScreen = document.querySelector(".questions-screen");
const questionText = document.querySelector(".question-text");
const answerButtons = document.querySelectorAll(".answer-button");
const resultScreen = document.getElementById("result-screen");
const bagType = document.querySelector("#bag-type h1");
const resetQuiz = document.getElementById("reset-quiz");
const backMain = document.getElementById("backMain");
const mainPage = document.getElementById("mainPage");


// for question counter, dynamic
function updateCounter (){
   counterQuestion.textContent = `Question ${currentCounter + 1} out of ${totalCounter}`;
}


// BUTTONS with alert
next.addEventListener("click", function() {

    if (!answeredQuestions[currentCounter]) {
        alert("Please answer all the questions first!");
        return;
    }

    if (currentCounter < totalCounter - 1) {
        currentCounter++; // add one to counter, show new question
        displayQuestion();
    }

    else {
        bagResult();
    }

});


prev.addEventListener("click", function(){if (currentCounter > 0) {
        currentCounter--; // minus wan
        displayQuestion();
    }});


start.addEventListener("click", async function(){

    await loadBags();

    startScreen.style.display = "none";
    questionsScreen.style.display = "block";

    displayQuestion();
});


backStart.addEventListener("click", function(){
    startScreen.style.display = "flex";
    questionsScreen.style.display = "none";
    currentCounter = 0;
    answeredQuestions = [];
    for (const type in bagScores) {
        bagScores[type] = 0;
    }
    updateCounter();
}); 



resetQuiz.addEventListener("click", function(){
    resultScreen.style.display = "none";
    questionsScreen.style.display = "block";
    currentCounter = 0;
    
    for (const type in bagScores){
        bagScores[type] = 0;
    }
    answeredQuestions = [];
    displayQuestion();
}); 


// BACK TO MAIN PAGE
backMain.addEventListener("click", function() {
    window.location.href = "/index.html";
});

mainPage.addEventListener("click", function() {
    window.location.href = "/index.html";
});



function displayQuestion(){
    const currentQuestion = questions[currentCounter];
    questionText.textContent = currentQuestion.question;
    answerButtons.forEach((button, index) => {
        button.textContent = currentQuestion.answers[index].text;
    });
    updateCounter();
}




answerButtons.forEach((button, index) => {
    button.addEventListener("click", function(){
        const currentQuestion = questions[currentCounter]; // question
        const selectedAnswer = currentQuestion.answers[index]; // gets the answer when clicked


        //removing old answer if user decides to change their answer
        if (answeredQuestions[currentCounter]) {
            const previousAnswer = answeredQuestions[currentCounter];
            bagScores[previousAnswer]--;
        }

        // add the point to the new answer
        bagScores[selectedAnswer.type]++;

        // remembering the answer
        answeredQuestions[currentCounter] = selectedAnswer.type;

        if (currentCounter < totalCounter - 1) {
            currentCounter++;
            displayQuestion();
        } else {
        bagResult();
    }
        

    });
});


// for displaying related bags, reused from first website ahhahaha
function displayRelatedBags(winner) {

    const relatedBags = allBags
        .filter(bag => bag.type === winner)
        .sort((a, b) => a.name.localeCompare(b.name));

    const relatedBagsContainer = document.getElementById("related-bags");
    relatedBagsContainer.innerHTML = "";

    if (relatedBags.length === 0) {
        relatedBagsContainer.textContent = "No related bags found.";
        return;
    }

    relatedBags.forEach(bag => {

        const card = document.createElement("div");
        card.className = "bag-card";

        card.innerHTML = `
            <img src="images/${bag.id}.png" alt="${bag.name}">

            <p class="bag-collection">${bag.collection}</p>

            <h3>${bag.name}</h3>

            <span class="bag-type">${bag.type}</span>

            <div class="bag-card-p">
                <p><span>Brand:</span> ${bag.brand}</p>
                <p><span>Price:</span> $${bag.price}</p>
                <p><span>Rating:</span> ${bag.rating}</p>
            </div>

            <button onclick="window.location.href='/bagdetails.html?id=${bag.id}'">
                View Details
            </button>
        `;

        relatedBagsContainer.appendChild(card);
    });
}

// for adding up the results based on quiz answers
function bagResult(){
    let winner = "";
    let highestScore = 0;

    for (const type in bagScores){
        if (bagScores[type] > highestScore){
            highestScore = bagScores[type];
            winner = type;
        }
    }

    questionsScreen.style.display = "none";
    resultScreen.style.display = "block";

    bagType.textContent = winner;
    const result = resultDescriptions[winner];
    document.getElementById("result-label").textContent = result.intro;
    document.getElementById("result-desc").textContent = result.description;

    displayRelatedBags(winner);
}
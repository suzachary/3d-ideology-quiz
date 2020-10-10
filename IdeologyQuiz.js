var cultural = 0
var government = 0
var economic = 0

const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');

questions = [
    // example of how question object is structured
    {
        text: "I prefer a strong central government.",
        category: "government"
    },
    {
        text: "I believe morality is subjective, rather than objective.",
        category: "cultural"
    },
    {
        text: "Our country's should always try to minimize unemployment.",
        category: "economic"
    }
]

questionNo = 0
answers = ["StronglyAgree", "Agree", "Disagree", "StronglyDisagree"]
text_answers = ["Strongly agree!", "Agree.", "Disagree.", "Strongly Disagree!"]

function printQuestion() {
    output = []
    currentQuestion = questions[questionNo]

    output.push(`
        <div>
            ${currentQuestion.text}
        </div>
        <br>
    `)

    for (var i = 0; i < answers.length; i++) {
        output.push(`
            <div>
                <input type="radio" name=${currentQuestion.category}${questionNo} value=${answers[i]} /> ${text_answers[i]}
            </div>
        `)
    }

    output.push(`<br>`)

    quizContainer.innerHTML = output.join("")
}

printQuestion();

function next() {
    // initialize
    questionCategory = questions[questionNo].category;
    var userAnswer;

    // TODO: get the value of the radio button
    var radios = document.getElementsByName(`${questionCategory}${questionNo}`)

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            userAnswer = radios[i].value;
            break;
        }
    }

    // score
    if (userAnswer == answers[0]) {
        var questionScore = 2;
    } else if (userAnswer == answers[1]) {
        var questionScore = 1;
    } else if (userAnswer == answers[2]) {
        var questionScore = -1;
    } else {
        var questionScore = -2;
    }

    // adjust totals
    if (questionCategory == "government") {
        government = government + questionScore;
    } else if (questionCategory == "cultural") {
        cultural = cultural + questionScore;
    } else {
        economic = economic + questionScore;
    }

    if (questionNo < (questions.length - 1)) {
        questionNo++;
        printQuestion();
    } else {
        // take out submit button
        submitButton.innerHTML = "";

        console.log(cultural, government, economic)

        var ideology = "";
        if (cultural > 0) {
            if (government > 0) {
                if (economic > 0) {
                    ideology = "Modern liberalism"
                } else {
                    ideology = "Authoritarian capitalist"
                }
            } else {
                if (economic > 0) {
                    ideology = "Anarcho-syndicalism"
                } else {
                    ideology = "Civil libertarianism"
                }
            }
        } else {
            if (government > 0) {
                if (economic > 0) {
                    ideology = "Fascism"
                } else {
                    ideology = "Classic conservatism"
                }
            } else {
                if (economic > 0) {
                    ideology = "Communalism"
                } else {
                    ideology = "Modern conservatism"
                }
            }
        }

        quizContainer.innerHTML = `Your ideology is: ${ideology}!`
    }
}

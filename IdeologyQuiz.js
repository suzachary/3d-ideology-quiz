// initialize the scores which we will use to classify the ideology
var cultural = 0
var government = 0
var economic = 0

// initialize the various containers that we will reference
const quizContainer = document.getElementById('quiz');
const submitButton = document.getElementById('submit');
const errorContainer = document.getElementById('errors');
const graphContainer = document.getElementById('graph');
const resultsContainer = document.getElementById('results');

// try to keep an even number of question
// that is to say, keep the same number of government, cultural, and economic questions
questions = [
    // example of how question object is structured
    {
        text: "I prefer a strong central government.",      // the actual text of the question, which will appear on screen
        category: "government",                             // the category by which to score the answer
        effect: 1                                           // 1 if left/authoritarian/socialist, -1 otherwise
    },
    {
        text: "I believe morality is subjective, rather than objective.",
        category: "cultural",
        effect: 1
    },
    {
        text: "Our country should always try to minimize unemployment.",
        category: "economic",
        effect: 1
    },
    {
        text: "Education should be centralized and controlled by the federal rather than state/province governments.",
        category: "government",
        effect: 1
    },
    {
        text: "An unborn child should have the same rights as his or her mother.",
        category: "cultural",
        effect: -1
    },
    {
        text: "The Nordic states are better examples of how to run an economy than the United States.",
        category: "economic",
        effect: 1
    },
    {
        text: "The government belongs to the people and vox populi.",
        category: "government",
        effect: -1
    },
    {
        text: "It is important to learn religious values in modern society.",
        category: "cultural",
        effect: 1
    },
    {
        text: "Capitalism will eventually die out and be replaced by socialism, whether Marxist or democratic.",
        category: "economic",
        effect: 1
    },
    {
        text: "The government should have a registry of firearms for the sake of the safety of the citizens.",
        category: "government",
        effect: 1
    },
    {
        text: "Equality is more important than freedom.",
        category: "cultural",
        effect: 1
    },
    {
        text: "The interests of large corporations tend to align with the interests of humanity and the commmon person.",
        category: "economic",
        effect: -1
    },
    {
        text: "Domestic surveillance is important to protect our nation.",
        category: "government",
        effect: 1
    },
    {
        text: "It is important that we continue affirmative action programs for the sake of equality.",
        category: "cultural",
        effect: 1
    },
    {
        text: "Wealth inequality in America is too high.",
        category: "economic",
        effect: 1
    }
]

// initialize the current question
// we start at 0 so we can reference the array of questions
questionNo = 0

// the id of the question div that will be used to reference in the code
answers = ["StronglyAgree", "Agree", "Disagree", "StronglyDisagree"]
// the actual text that will show up on screen
text_answers = ["Strongly agree!", "Agree.", "Disagree.", "Strongly Disagree!"]


function printQuestion() {
    // prints the current question and its possible answer choices

    // we store everything in an output array
    output = []
    // obtain the current question object in the array
    currentQuestion = questions[questionNo]

    // print the current question's text
    output.push(`
        <div id="question">
            ${currentQuestion.text}
        </div>
    `)

    // print each of the answer choices, 1 by 1
    for (var i = 0; i < answers.length; i++) {
        output.push(`
            <div id="answers">
                <input type="radio" name=${currentQuestion.category}${questionNo} value=${answers[i]} /> ${text_answers[i]}
            </div>
        `)
    }

    // put the output on the screen
    quizContainer.innerHTML = output.join("")
}

printQuestion();    // start the program by printing the first question


function classify(cultural1, government1, economic1, displayed) {
    // classifies an ideology based on the user's cultural, government, and economic scores
    // since the user scores are already named cultural, government, etc. we use cultural1, government1, etc. for parameter names
    var ideology = "";

    if (cultural1 == 0 && government1 == 0 && economic1 == 0) {
        return "Centrism"           // centrists have no political lean
    }

    if (cultural1 == cultural && government1 == government && economic1 == economic && displayed) {
        return "Your Ideology"      // used to label on the graph tooltip
    }

    // actual classification
    // check for centrism before any other ideology
    l = questions.length / 2
    if (Math.abs(cultural1) < l && Math.abs(government1) < l && Math.abs(economic1) < l) {
        return "Centrism"
    }

    if (cultural1 > 0) {
        if (government1 > 0) {
            if (economic1 > 0) {
                ideology = "Modern liberalism"
            } else {
                ideology = "Authoritarian capitalist"
            }
        } else {
            if (economic1 > 0) {
                ideology = "Anarcho-syndicalism"
            } else {
                ideology = "Neoliberalism"
            }
        }
    } else {
        if (government1 > 0) {
            if (economic1 > 0) {
                ideology = "Fascism"
            } else {
                ideology = "Classic conservatism"
            }
        } else {
            if (economic1 > 0) {
                ideology = "Communalism"
            } else {
                ideology = "Modern conservatism"
            }
        }
    }

    // return the ideology as a string
    return ideology
}


function next() {
    // the function that is executed when the user hits the restart or submit button

    errorContainer.innerHTML = ""   // remove any error message from previous press of button
    
    if (questionNo == questions.length) {
        // i.e. if we're already at the end
        // restarts the whole quiz from question 1

        // reset user scores
        cultural = 0;
        government = 0;
        economic = 0;

        // reset at question 1
        questionNo = 0;

        // turn the reset button back to submit button
        submitButton.innerHTML = "Submit"

        // remove the graph from the screen
        graphContainer.innerHTML = ""

        // print the new question
        printQuestion();

        // stop the function
        return null;
    }

    // initialize
    questionCategory = questions[questionNo].category;
    var userAnswer = 1;     // a starting point for the user answer

    // obtain the value of all radio buttons
    var radios = document.getElementsByName(`${questionCategory}${questionNo}`)

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            userAnswer = radios[i].value;       // obtain the user answer, or the button that is checked
            break;
        }
    }

    if (userAnswer === 1) {
        // i.e. if the user did not check any radio button
        errorContainer.innerHTML = `Please enter an answer.`
        return null;    // end the function
    }

    // score
    if (userAnswer == answers[0]) {
        // Strongly agree
        var questionScore = 2;
    } else if (userAnswer == answers[1]) {
        // Agree
        var questionScore = 1;
    } else if (userAnswer == answers[2]) {
        // Disagree
        var questionScore = -1;
    } else {
        // Strongly disagree
        var questionScore = -2;
    }

    // adjust user scores according to answer
    if (questionCategory == "government") {
        government = government + (questionScore * questions[questionNo].effect);
    } else if (questionCategory == "cultural") {
        cultural = cultural + (questionScore * questions[questionNo].effect);
    } else {
        economic = economic + (questionScore * questions[questionNo].effect);
    }

    if (questionNo < (questions.length - 1)) {
        // i.e. if we are not yet at the end

        questionNo++;       // go to next question
        printQuestion();    // print next question

    } else if (questionNo == (questions.length - 1)) {
        // i.e. if we are at the end of the quiz

        questionNo++;   // to show that we are already at the end

        // take out submit button
        submitButton.innerHTML = (`Restart`)

        // show the user's ideology
        var userIdeology = classify(cultural, government, economic, false);
        quizContainer.innerHTML = `Your ideology is: ${userIdeology}!`

        // create a new data set and add the user's scores
        var data = new vis.DataSet();
        data.add({
            x: cultural,
            y: government,
            z: economic,
        });

        const maxDataVal = ((questionNo / 3) * 2) + 1

        // add all reference points, representing each ideology
        xPoints = [0, maxDataVal, maxDataVal, maxDataVal, maxDataVal, (-1 * maxDataVal), (-1 * maxDataVal), (-1 * maxDataVal), (-1 * maxDataVal)]
        yPoints = [0, maxDataVal, (-1 * maxDataVal), maxDataVal, (-1 * maxDataVal), maxDataVal, (-1 * maxDataVal), maxDataVal, (-1 * maxDataVal)]
        zPoints = [0, maxDataVal, (-1 * maxDataVal), (-1 * maxDataVal), maxDataVal, maxDataVal, (-1 * maxDataVal), (-1 * maxDataVal), maxDataVal]

        for (var i=0; i < xPoints.length; i++) {
            data.add({
                x: xPoints[i],
                y: yPoints[i],
                z: zPoints[i]
            });
        }

        // set options for the graph
        var options = {
            // set minimum and maximum values for all axes
            xMax: maxDataVal,
            xMin: (maxDataVal * -1),
            yMax: maxDataVal,
            yMin: (maxDataVal * -1),
            zMax: maxDataVal,
            zMin: (maxDataVal * -1),

            // add labels for the axes
            xLabel: "Cultural",
            yLabel: "Government",
            zLabel: "Economic",

            // tooltip displays the ideology of its point OR "Your Ideology"
            tooltip: function (point) {
                var pointIdeology = classify(point.x, point.y, point.z, true);

                return pointIdeology
            }
        }
        
        // graph the data, including user results and reference points
        graph3d = new vis.Graph3d(graphContainer, data, options)
    }
}

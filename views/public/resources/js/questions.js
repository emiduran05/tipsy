
const pollId = new URLSearchParams(window.location.search).get("pollId");

const tabs = document.querySelectorAll(".poll-tab");
const contents = document.querySelectorAll(".poll-tab-content");

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        const selectedTab = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove("active"));

        contents.forEach(content => {
            content.classList.remove("active");
        });

        tab.classList.add("active");

        document.getElementById(selectedTab)
            .classList.add("active");

    });

});



async function fetchUQuestions(pollId) {
    try {
        const res = await fetch(`/unanswered/questions/${pollId}`);

        if (!res.ok) {
            throw new Error("Error fetching questions");
        }

        const questions = await res.json();

        displayQuestions(questions);

    } catch (error) {
        console.error(error);
    }
}

function displayQuestions(questions) {

    const container = document.getElementById("questions-container");

    container.innerHTML = "";

    questions.forEach(question => {

        // Create question card
        const card = document.createElement("article");
        card.className = "question-card";

        // Question title
        const title = document.createElement("h2");
        title.textContent = question.name;

        // Options container
        const optionsContainer = document.createElement("div");
        optionsContainer.className = "options";

        let questionId = "";
        let questionAnswerId = "";

        // Create each option
        question.options.forEach(option => {

            const button = document.createElement("button");


            button.textContent = option.label;

            button.addEventListener("click", () => {

                optionsContainer.querySelectorAll(".active-option").forEach(button => button.classList.remove("active-option"));

                button.classList.add("active-option")
                questionId = question.id;
                questionAnswerId = option.id;



            });


            optionsContainer.appendChild(button);
        });

        const sendButton = document.createElement("button");
        sendButton.classList.add("send-option-btn")
        sendButton.textContent = "Send"

        // Question footer
        const footer = document.createElement("div");
        footer.className = "question-footer";

        const status = document.createElement("span");
        status.textContent = "Status: OPEN";


        footer.appendChild(status);
        footer.appendChild(sendButton)


        sendButton.addEventListener("click", async () => {

            if (!questionAnswerId) {
                alert("Please select an option");
                return;
            }

            sendButton.disabled = true;

            const answer = await fetchPostAnswer(questionId, questionAnswerId);

            if (answer) {
                await Promise.all([
                    fetchUQuestions(pollId),
                    fetchAnsweredQuestions(pollId),
                    fetchLeaderboard(pollId)
                ]);
            } else {
                sendButton.disabled = false;
            }

        });


        // Add everything to card
        card.appendChild(title);
        card.appendChild(optionsContainer);
        card.appendChild(footer);

        // Add card to HTML
        container.appendChild(card);
    });
}



async function fetchAnsweredQuestions(pollId) {
    try {
        const res = await fetch(`/answered/questions/${pollId}`);
        const questions = await res.json();

        displayAnsweredQuestions(questions);

    } catch (error) {
        console.error(error);
    }
}

function displayAnsweredQuestions(questions) {

    const container = document.getElementById("answered-container");
    container.replaceChildren();

    questions.forEach(question => {

        const card = document.createElement("article");
        card.className = "question-card";

        const title = document.createElement("h2");
        title.textContent = question.name;

        const optionsContainer = document.createElement("div");
        optionsContainer.className = "options";

        question.options.forEach(option => {

            const button = document.createElement("button");
            button.textContent = option.label;
            button.disabled = true;

            if (option.id === question.option_id) {
                button.classList.add("selected-answer");
            }

            optionsContainer.appendChild(button);
        });

        const footer = document.createElement("div");
        footer.className = "question-footer";
        footer.textContent = "Answered";

        card.appendChild(title);
        card.appendChild(optionsContainer);
        card.appendChild(footer);

        container.appendChild(card);
    });
}



async function fetchLeaderboard(pollId) {
    try {
        const res = await fetch(`/polls/${pollId}/leaderboard`);
        const users = await res.json();

        displayLeaderboard(users);

    } catch (error) {
        console.error(error);
    }
}

function displayLeaderboard(users) {

    const container = document.getElementById("leaderboard-list");
    container.replaceChildren();

    users.forEach((user, index) => {

        const row = document.createElement("div");
        row.className = "leaderboard-user";

        if (index === 0) row.classList.add("first");
        if (index === 1) row.classList.add("second");
        if (index === 2) row.classList.add("third");

        const position = document.createElement("span");
        position.textContent = index + 1;

        const username = document.createElement("span");
        username.textContent = user.username;

        const points = document.createElement("strong");
        points.textContent = `${user.total_points} pts`;

        row.appendChild(position);
        row.appendChild(username);
        row.appendChild(points);

        container.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    fetchPolls(pollId);
    fetchUQuestions(pollId);
    fetchAnsweredQuestions(pollId);
    fetchLeaderboard(pollId);

});


//Create question

const createBtn = document.querySelector(".create-btn");
const overlay = document.querySelector(".overlay");
const xmark = document.querySelector(".xmark");

createBtn.addEventListener("click", () => {
    overlay.classList.add("overlay-active")
})

xmark.addEventListener("click", (e) => {
    overlay.classList.remove("overlay-active")
})

const addButton = document.querySelector(".addButton");
const optionsContainer = document.querySelector(".options_container");

addButton.addEventListener("click", () => {
    const option = document.createElement("div");
    option.classList.add("options_container_option");

    const index = optionsContainer.querySelectorAll(".options_container_option").length;

    option.innerHTML = `
        <input type="radio" value="${index}" name="correct_option" class="correct_answer">
        <input type="text" placeholder="Option ${index + 1}" required class="option_answer">
        <input type="number" placeholder="Points" min="0" required class="option_value">
    `;

    optionsContainer.appendChild(option);
});

const form = document.getElementById("createQuestion");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("question").value;
    const optionElements = document.querySelectorAll(".options_container_option");

    const options = [];

    for (const option of optionElements) {
        const label = option.querySelector('.option_answer').value;
        const points = Number(option.querySelector('.option_value').value);
        const correct_option = option.querySelector('.correct_answer').checked;

        options.push({
            label: label,
            points: points,
            correct_option: correct_option
        });
    }

    const question = {
        name: name,
        options: options
    };

    overlay.classList.remove("overlay-active")
    await fetchPostQuestion(pollId, question);
    fetchUQuestions(pollId)


});

//fetch post question

async function fetchPostQuestion(pollId, question) {
    try {
        const res = await fetch(`/polls/${pollId}/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(question)
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error);
            return;
        }


    } catch (error) {
        console.error(error);
    }
}


/*poll data*/

async function fetchPolls(pollId) {
    try {
        const res = await fetch(`/polls/${pollId}`);

        if (!res.ok) {
            throw new Error("Error fetching poll");
        }

        const poll = await res.json();

        displayPolls(poll);

    } catch (error) {
        console.error(error);
    }
}

function displayPolls(poll) {

    const container = document.querySelector(".poll-info");

    const title = container.querySelector(".poll-details h2");
    const description = container.querySelector(".poll-details p");
    const date = container.querySelector(".poll-meta span");

    title.textContent = poll.name;

    if (poll.deadline) {
        const deadline = new Date(poll.deadline);

        date.textContent = deadline.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    } else {
        date.textContent = "No date";
    }
}



async function fetchPostAnswer(questionId, optionId) {
    try {
        const res = await fetch(`/questions/${questionId}/answers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                option_id: optionId
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error submitting answer");
        }

        return data;

    } catch (error) {
        console.error(error);
        alert(error.message);
        return null;
    }
}

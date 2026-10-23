async function fetchCurrentUser() {
    try {
        const res = await fetch("/users/me");

        if (!res.ok) {
            throw new Error("Error fetching user");
        }

        const user = await res.json();

        document.querySelector(".user-welcome").textContent = `Hey, ${user.username}`
        return user;

    } catch (error) {
        console.error(error);
    }
}


async function fetchPolls() {
    try {
        const res = await fetch("/polls");

        if (!res.ok) {
            throw new Error("Error fetching polls");
        }

        const polls = await res.json();

        displayPolls(polls);

    } catch (error) {
        console.error(error);
    }
}

function displayPolls(polls) {

    const container = document.getElementById("polls-container");
    container.replaceChildren();

    if (polls.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "No events yet.";
        container.appendChild(empty);
        return;
    }

    polls.forEach(poll => {

        const card = document.createElement("li");
        card.className = "event-card";

        const title = document.createElement("h3");
        title.textContent = poll.name;

        const date = document.createElement("time");
        if (poll.deadline) {
            const deadline = new Date(poll.deadline);
            date.dateTime = deadline.toISOString();
            date.textContent = deadline.toLocaleDateString("en-GB", {
                weekday: "short", day: "numeric", month: "short", year: "numeric"
            });
        } else {
            date.textContent = "No date";
        }

        const questionCount = document.createElement("p");
        questionCount.textContent = `${poll.question_count} polls`;

        const userCount = document.createElement("p");
        userCount.textContent = `${poll.user_count} users`;

        const link = document.createElement("a");
        link.href = `/questions?pollId=${poll.id}`;
        link.textContent = "Open";

        card.appendChild(title);
        card.appendChild(date);
        card.appendChild(questionCount);
        card.appendChild(userCount);
        card.appendChild(link);

        container.appendChild(card);
    });
}

async function createPoll(event) {

    event.preventDefault();  

    const form = document.getElementById("create-event-form");

    const name = document.getElementById("event-name").value;
    const date = document.getElementById("event-date").value;
    const description = document.getElementById("event-description").value;

    try {
        const res = await fetch("/polls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                deadline: date,
                description: description || null
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error);
        }

        form.reset();
        document.getElementById("create-event-popup").hidePopover();   // close the popup
        fetchPolls();   //reload page

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Execute when page loads
document.addEventListener("DOMContentLoaded", () => {

    fetchCurrentUser();
    fetchPolls();

    document.getElementById("create-event-form")
        .addEventListener("submit", createPoll);

});
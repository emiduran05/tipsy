async function fetchLogin(email, password) {
    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: email,
                password: password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Login failed");
            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        alert("Server not reachable");
        return false;
    }
}


async function fetchRegister(name, lastname, username, email, password) {
    try {
        const res = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                lastname: lastname,
                username: username,
                email: email,
                password: password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Registration failed");
            return false;
        }

        return true;

    } catch (error) {
        console.error(error);
        alert("Server not reachable");
        return false;
    }
}


document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login_form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const loggedIn = await fetchLogin(username, password);

            if (loggedIn) {
                window.location.href = "/user-page";
            }
        });
    }


    const registerForm = document.getElementById("register_form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("firstname").value;
            const lastname = document.getElementById("lastname").value;
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const registered = await fetchRegister(name, lastname, username, email, password);

            if (!registered) return;

            const loggedIn = await fetchLogin(email, password);

            if (loggedIn) {
                window.location.href = "/user-page";
            }
        });
    }

});
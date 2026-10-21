//login fethc
async function fetchLogin(username, password) {

    await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err))

}


//register fetch
async function fetchRegister(name, lastname, username, email, password) {
    await fetch("/register", {
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
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(error))
}


document.addEventListener("DOMContentLoaded", () => {

    /* For LOGIN */

    const loginForm = document.getElementById("login_form");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            await fetchLogin(username, password);
        });
    }

    /* For REGISTER */

    const registerForm = document.getElementById("register_form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const name = document.getElementById("firstname").value;
            const lastname = document.getElementById("lastname").value;
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            await fetchRegister(name, lastname, username, email, password);
        });
    }

});
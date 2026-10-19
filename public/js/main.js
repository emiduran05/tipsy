async function fetchLogin(username, password){

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


document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login_form");


    form.addEventListener("submit", async(event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        await fetchLogin(email, password);
        
        
    })


})
alert("New Login JS Loaded");

const API = "http://localhost:5000/api";

async function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Login button clicked");

    try {

        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        console.log("Status:", res.status);

        const data = await res.json();

        console.log("Response:", data);

        if (res.ok) {

            localStorage.setItem("token", data.token);

            console.log("Token after save:", localStorage.getItem("token"));

            alert("Login Success");
            
            window.location.href = "index.html";

        } else {

            alert(data.message);

        }

    } catch (err) {

        console.error(err);

    }

}
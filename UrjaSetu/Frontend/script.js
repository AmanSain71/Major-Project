
let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
const workoutForm = document.getElementById("workoutForm");

if (workoutForm) {

    workoutForm.addEventListener("submit", async function (e) {

         console.log("Form Submitted");

        e.preventDefault();

        const token = localStorage.getItem("token");

        console.log("Token:", token);

    
        if (!token) {
            alert("Please Login First");
            return;
        }

        const challengeId = localStorage.getItem("challengeId");

        console.log("ChallengeId:", challengeId);

        if (!challengeId) {
            alert("Please Join Challenge First");
            return;
        }

        const calories = Number(document.getElementById("calories").value);

        const today = new Date().toISOString().split("T")[0];

        console.log("Token:", token);
        console.log("ChallengeId:", challengeId);
        console.log("Sending Request...");


        const res = await fetch(`${API}/progress`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

                Authorization: "Bearer " + token

            },

            body: JSON.stringify({

                challengeId: challengeId,
                date: today,
                progress: calories

            })

        });

        console.log("Status:", res.status);

        const data = await res.json();

        console.log(data);

        alert(data.message);

        updateDashboard();

        workoutForm.reset();

    });

}
function updateDashboard(){
let totalWorkout =
document.getElementById("totalWorkout");
let totalPoints =
document.getElementById("totalPoints");
let totalCalories =
document.getElementById("totalCalories");
let streak =
document.getElementById("streak");
if(totalWorkout){
totalWorkout.innerHTML =
workouts.length;
let points = 0;
let calories = 0;

workouts.forEach(function(item){
points += item.points;
calories += item.calories;
});
totalPoints.innerHTML = points;
totalCalories.innerHTML = calories;
streak.innerHTML =
workouts.length;
}
}
updateDashboard();
function scrollToWorkout(){
document
.getElementById("workout")
.scrollIntoView({
behavior:"smooth"
});
}
const beforeImage =
document.getElementById("beforeImage");

const afterImage =
document.getElementById("afterImage");
if(beforeImage){
beforeImage.addEventListener(
"change",
function(event){
let reader = new FileReader();
reader.onload=function(){
document
.getElementById("beforePreview")
.src = reader.result;
};
reader.readAsDataURL(
event.target.files[0]
);
});
}

if(afterImage){
afterImage.addEventListener(
"change",
function(event){
let reader = new FileReader();
reader.onload=function(){
document
.getElementById("afterPreview")
.src = reader.result;
};
reader.readAsDataURL(
event.target.files[0]
);
});
}

async function loadDashboard() {

    const token = localStorage.getItem("token");

    if (!token) return;

    const res = await fetch(`${API}/progress/my`, {
        headers: {
            Authorization: "Bearer " + token
        }
    });

    const data = await res.json();

    if (!data.success) return;

    const progress = data.progress;

    document.getElementById("totalWorkout").innerHTML = progress.length;

    let totalCalories = 0;

    progress.forEach((item) => {
        totalCalories += item.progress;
    });

    document.getElementById("totalCalories").innerHTML = totalCalories;

    document.getElementById("totalPoints").innerHTML = totalCalories;

    document.getElementById("streak").innerHTML = progress.length;
}
const API = "http://major-project-mu-vert.vercel.app/api";

async function loadLeaderboard() {
    try {
        const challengeId = localStorage.getItem("challengeId");

        if (!challengeId) return;

        const res = await fetch(`${API}/leaderboard/${challengeId}`);
        const data = await res.json();

        const table = document.getElementById("leaderboardBody");

        table.innerHTML = "";

        data.leaderboard.forEach((user) => {

            table.innerHTML += `
                <tr>
                    <td>${user.rank}</td>
                    <td>${user.name}</td>
                    <td>${user.totalProgress}</td>
                </tr>
            `;

        });

    } catch (err) {
        console.log(err);
    }
}

loadLeaderboard();

async function loadChallenges() {

    try {

        const res = await fetch(`${API}/challenges`);

        const data = await res.json();

        const container = document.getElementById("challengeContainer");

        container.innerHTML = "";

        data.challenges.forEach((challenge) => {

            container.innerHTML += `

            <div class="challenge-card">

                <h3>${challenge.title}</h3>

                <p>${challenge.description}</p>

                <button onclick="joinChallenge('${challenge._id}')">

                    Join Challenge

                </button>

            </div>

            `;

        });

    } catch (err) {

        console.log(err);

    }

}

async function joinChallenge(id) {

    console.log("Join button clicked");
    console.log("Challenge ID:", id);

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    const res = await fetch(`${API}/challenges/${id}/join`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token
        }
    });

    console.log("Response Status:", res.status);

    const data = await res.json();
    console.log("Response Data:", data);

   if (res.ok || data.message === "You have already joined this challenge") {
        localStorage.setItem("challengeId", id);
        console.log("Saved ChallengeId:", localStorage.getItem("challengeId"));
    }

    alert(data.message);
}
let quotes=[
"Small steps every day create big results.",
"Your body can achieve what your mind believes.",
"Discipline is the bridge between goals and success.",
"Don't stop when you are tired, stop when you are done.",
"Healthy habits create a healthy life."
];
let quoteBox =
document.getElementById("quote");
if(quoteBox){
let randomQuote =
quotes[
Math.floor(
Math.random()*quotes.length
)
];

quoteBox.innerHTML =
randomQuote;
}

let username =
localStorage.getItem("username");
if(!username){
username =
prompt(
"Enter your name to start fitness journey:"
);

if(username){

localStorage.setItem(
"username",
username
);
}
}

window.onload = function () {

    console.log("Fitness Challenge Community Loaded Successfully");

    loadChallenges();

    loadLeaderboard();

    loadDashboard();

};
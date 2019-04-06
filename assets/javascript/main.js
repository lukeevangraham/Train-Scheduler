// Initialize Firebase
var config = {
apiKey: "AIzaSyDXoWWWGL5Fd_1U0AJnbXeR2Ur0VoM54RY",
authDomain: "train-scheduler-fb382.firebaseapp.com",
databaseURL: "https://train-scheduler-fb382.firebaseio.com",
projectId: "train-scheduler-fb382",
storageBucket: "train-scheduler-fb382.appspot.com",
messagingSenderId: "181508120277"
};
firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Initial Values
var name = "";
var destination = "";
var initialTime = 0;
var frequency = "";

// Capture Button Click
$("#add-train").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();

    console.log("clicked");

    // Storing and retrieving the most recent user.
    // Don't forget to provide initial data to your Firebase database.
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    initialTime = $("#initial-time-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    database.ref().set({
        name: name,
        destination: destination,
        initialTime: initialTime,
        frequency: frequency
    })
});
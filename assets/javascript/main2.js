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

// Capture Button Click
$("#add-train").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();


    // Storing and retrieving the most recent user.
    // Don't forget to provide initial data to your Firebase database.
    let name = $("#name-input").val().trim();
    let destination = $("#destination-input").val().trim();
    let initialTime = $("#initial-time-input").val().trim();
    let frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: name,
        destination: destination,
        initialTime: initialTime,
        frequency: frequency
    };

    // Upload train data to the database
    database.ref().push(newTrain);

    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#initial-time-input").val("");
    $("#frequency-input").val("");
});

// Firebase event for adding train to the database and a row in the html when the user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // store everything into a variables
    let name = childSnapshot.val().name;
    let destination = childSnapshot.val().destination;
    let initialTime = childSnapshot.val().initialTime;
    let frequency = childSnapshot.val().frequency;

    var prefferedFormat = "HH:mm"
    var convertedTime = (moment(initialTime, prefferedFormat));

    // if train started running
    if (moment(convertedTime).isBefore(moment())) {

        // Calculate minutes away
        var calc = moment().diff(convertedTime, "minutes") % frequency;
        var minAway = frequency - calc;

    // if train hasn't started
    } else {
        // Calculate minutes away
        var minAway = convertedTime.diff(moment(), "minutes") + 1;
    }
    
    // Calculate next arrival
    var nextArr = moment().add(minAway, "minutes").format("hh:mm A");

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextArr),
        $("<td>").text(minAway),
    );

    // Apprend the new row to the table
    $("#train-table > tbody").append(newRow);
})
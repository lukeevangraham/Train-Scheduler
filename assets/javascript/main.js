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
$("#add-train").on("click", function (event) {
    // Don't refresh the page!
    event.preventDefault();


    // Storing and retrieving the most recent user.
    // Don't forget to provide initial data to your Firebase database.
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    initialTime = $("#initial-time-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: name,
        destination: destination,
        initialTime: initialTime,
        frequency: frequency
    };

    // Upload train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.initialTime);
    console.log(newTrain.frequency);

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

    // store everything into a variable
    let trainName = childSnapshot.val().name;
    let trainDest = childSnapshot.val().destination;
    let trainInitTime = childSnapshot.val().initialTime;
    let trainFreq = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainInitTime);
    console.log(trainFreq);

    var a = moment(trainInitTime, "hh:mma");
    var b = moment().format("hh:mma");

    var timeFormat = "hh:mma"
    var convertedTime = moment(trainInitTime, timeFormat);

    // console.log("look here first", convertedTime.format("hh:mma"));

    // if train hasn't started
    if (moment(b, "hh:mma").isBefore(moment(a, "hh:mma"))) {
        // console.log(trainName, "train hasn't left yet")
        nextArr = convertedTime.format("hh:mm A");
        // console.log(nextArr)
        // console.log("look at", moment(trainInitTime))

        // Calculate the Minutes Away
        // a = moment(trainInitTime, "hh:mma");
        // b = moment().format("hh:mma");
        // console.log(trainInitTime);
        // console.log(b);
        // var calc = moment(moment(b, "hh:mma").diff(moment(a, "hh:mma"))).format("mm");
        // var minAway = trainFreq - calc

        var currentTime = moment().format(timeFormat);
        // console.log("look here", currentTime);
        // console.log("look here", convertedTime);
        // console.log("look here", convertedTime.diff(currentTime));

        console.log("look here friend", convertedTime.diff(moment(), "minutes"));
        var minAway = convertedTime.diff(moment(), "minutes") + 1;

    } else {
        // Calculate the Minutes Away
        a = moment(trainInitTime, "H:m");
        b = moment().format("H:m");
        var calc = moment(moment(b, "H:m").diff(moment(a, "H:m"))).format("mm") % trainFreq;
        var minAway = trainFreq - calc

        // Calculate the next arrival
        var duration = moment.duration({ 'minutes': minAway })
        var nextArrNoFormat = moment().add(duration);
        var nextArr = moment(nextArrNoFormat).format("h:mm A");
    }

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextArr),
        $("<td>").text(minAway),
    );

    // Apprend the new row to the table
    $("#train-table > tbody").append(newRow);
})
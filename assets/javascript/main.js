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
database.ref().on("child_added", function(childSnapshot){
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

    // Calculate the Minutes Away
    var a = moment(trainInitTime, "H:m");
    var b = moment().format("H:m");
    var calc = moment(moment(b, "H:m").diff(moment(a, "H:m"))).format("mm");
    // var calcNoMod = moment(moment(b, "H:m").diff(moment(a, "H:m"))).format("mm");
    var minAway = trainFreq - calc

    console.log(calc + " is calc")
    // console.log(calc + " is calcNoMod")



    // Calculate the next arrival
    var nextArr = ""

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
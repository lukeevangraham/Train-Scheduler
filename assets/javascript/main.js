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

// var provider = new firebase.auth.GoogleAuthProvider();

// Create a variable to reference the database
var database = firebase.database();

let editClicked = false;
var preventClearBtns = false;

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
  signInOptions: [
    // List of OAuth providers supported.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
  // Other config options...
});

// let currentData = []


// firebase.auth().signInWithPopup(provider).then(function(result) {
//   // This gives you a Google Access Token. You can use it to access the Google API.
//   var token = result.credential.accessToken;
//   // The signed-in user info.
//   var user = result.user;
//   // ...
// }).catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // The email of the user's account used.
//   var email = error.email;
//   // The firebase.auth.AuthCredential type that was used.
//   var credential = error.credential;
//   // ...
// });


function clearForm() {
  $("#clear-btn").remove();
  preventClearBtns = false;

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#initial-time-input").val("");
  $("#frequency-input").val("");
}

function delChild(key) {
  database.ref(key).remove();
}

function editChild(name) {
editClicked = true;

  let nameArray = name.split(", ")

  // $('#name-input').focus()
  $("#name-input").val(nameArray[0]);
  $("#destination-input").val(nameArray[1]);
  $("#frequency-input").val(nameArray[2]);
  $("#initial-time-input").val(nameArray[3]);

  $(`#add-train`).attr("key", nameArray[4])

  if (!preventClearBtns) {
    // make a clear button
    $(`#add-train`).after(`<button class="btn btn-secondary btn-sm ml-2" id="clear-btn" onclick="clearForm()">Clear</button>`)
    preventClearBtns = true;
    
  }

  

}

function adjustNextArrAndMinAway(params) {
$(`tr.item`).each(function() {
    // console.log("MinAway: ", $(this).find(`td.minAway`).html());
    let nextArr = moment($(this).find(`td.nextArr`).html(), ["h:mm A"])

    if (moment(nextArr).isAfter(moment())) {
        let minAway = $(this).find(`td.minAway`).html()
        minAway--;
        $(this).find(`td.minAway`).text(minAway)
    } else if (moment(nextArr).isSame(moment(), 'minute')) {
      // add frequency to nextArr
      nextArr = moment(nextArr).add($(this).find(`td.frequency`).html(), 'm')
      $(this).find(`td.nextArr`).text(moment(nextArr).format('h:mm A'));

      // reset minAway to frequency
      $(this).find(`td.minAway`).text($(this).find(`td.frequency`).html());
    }


})
}

function prepFillTable() {
  $("#train-table > tbody").empty();
  database.ref().on("child_added", function(childSnapshot) {
    fillTable(childSnapshot);
  });
}

// Function gets data from database and fills rows
function fillTable(childSnapshot, string) {

  // string denotes a second argument prompting a ".replace" instead of a ".append"

  // store everything into a variables
  let name = childSnapshot.val().name;
  let destination = childSnapshot.val().destination;
  let initialTime = childSnapshot.val().initialTime;
  let frequency = childSnapshot.val().frequency;

  var prefferedFormat = "HH:mm";
  var convertedTime = moment(initialTime, prefferedFormat);

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
  var nextArr = moment()
    .add(minAway, "minutes")
    .format("hh:mm A");

  // Create the new row
  var newRow = $("<tr class='item' id='" + childSnapshot.ref.key + "'>").append(
    $("<td class='name'>").text(name),
    $("<td>").text(destination),
    $("<td class='frequency'>").text(frequency),
    $("<td class='nextArr'>").text(nextArr),
    $("<td class='minAway'>").text(minAway),
    $("<td>").html(`<a href="#" class="text-danger" onclick="delChild('` + childSnapshot.ref.key + `')"><i class="fas fa-trash-alt p-1"></i></a><a href="#" class="text-secondary" onclick="editChild('` + name  + `, ` + destination + `, ` + frequency + `, ` + initialTime + ` , ` + childSnapshot.ref.key +`')"><i class="fas fa-edit p-1"></i></a>`)
  );

  if (string === "replace") {
    // $("#train-table > tbody").append(newRow);  
    $(`#` + childSnapshot.ref.key).replaceWith(newRow);
  } else {
    // Apprend the new row to the table
    $("#train-table > tbody").append(newRow);
  }
}

function removeTableItem(childSnapshot) {
$(`#`+ childSnapshot.ref.key).remove()
}

// Capture Button Click
$("#add-train").on("click", function(event) {
  // Don't refresh the page!
  event.preventDefault();

  // Storing and retrieving the most recent user.
  // Don't forget to provide initial data to your Firebase database.
  let name = $("#name-input")
    .val()
    .trim();
  let destination = $("#destination-input")
    .val()
    .trim();
  let initialTime = $("#initial-time-input")
    .val()
    .trim();
  let frequency = $("#frequency-input")
    .val()
    .trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: name,
    destination: destination,
    initialTime: initialTime,
    frequency: frequency
  };


  if (editClicked === false) {
    // Upload train data to the database
    database.ref().push(newTrain);
  
    alert("Train successfully added");
    
  } else if (editClicked === true) {
    database.ref($("#add-train").attr("key")).set({name: name, destination: destination, initialTime: initialTime, frequency: frequency})
  }

  clearForm();
});

// Firebase event for adding train to the database and a row in the html when the user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  // currentData.push(childSnapshot);
  fillTable(childSnapshot);
});

database.ref().on("child_removed", function(childSnapshot) {
  removeTableItem(childSnapshot);
})

database.ref().on("child_changed", function(childSnapshot) {
  fillTable(childSnapshot, "replace")
})

// $("#auth").click(function() {
//   console.log("authing")
//   firebase.auth().signInWithPopup(provider)
// })

// setInterval(prepFillTable, 60000);
setInterval(adjustNextArrAndMinAway, 60000);

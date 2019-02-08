// JavaScript Document
$(document).ready(function(){
    console.log('document.ready!');
    $("#currTime").html("Current Time: " + moment(currentTime).format("HH:mm"));
});

// firebase object
var config = {
    apiKey: "AIzaSyA6n4g8rk6aexMRb7C-R0BjkWxDekDuBpA",
    authDomain: "train-scheduler-ef432.firebaseapp.com",
    databaseURL: "https://train-scheduler-ef432.firebaseio.com",
    projectId: "train-scheduler-ef432",
    storageBucket: "train-scheduler-ef432.appspot.com",
    messagingSenderId: "741863754196"
};

//initialize firebase app
firebase.initializeApp(config);

var database = firebase.database(); //database var

var tId = 0;
var tName = "";   
var destZ = "";  
var destC = "";  
var destS = "";  
var tFrequency = $('#trainFreq').html(); //val from the trainFreq input
var firstTime = $('#trainStart').html();  // val from trainStart input
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");  // start time value converted
var currentTime = moment();  // Current Time
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");  // Difference between the times
var tRemainder = diffTime % tFrequency;  // Time apart (remainder)
var tMinutesTillTrain = tFrequency - tRemainder;  // Minute Until Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");  // Next Train

//when zip code is entered city and state are populated
$('#destZip').change(function(){
    var zip = $(this).val();
    var queryUrl = "http://api.zippopotam.us/us/" + zip;
    $.ajax({
        url: queryUrl,
        method: 'GET',
        success: function(result, success){
            console.log(result);
            places = result['places'][0];
            destC = places['place name'];
            destS = places['state'];
            $('#destCity').val(places['place name']);
            $('#destState').val(places['state']);
            console.log("Destination Zip Code: " + destZ);
            console.log("Destination City: " + destC);
            console.log("Destination State: " + destS);
        },
        error: function(result, success){
            console.log('ERROR: zippopotam');
        }
    });
});

$('#trainName').on('change', function(){
    tName = $(this).val();
});


$('#trainStart').on('change', function(){
    firstTime = $(this).val();
});

$('#trainFreq').on('change', function(){
    tFrequency = $(this).val();
    console.log("FIRST TIME CONVERTED: " + firstTimeConverted);
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));
    console.log("DIFFERENCE IN TIME: " + diffTime);
    console.log("REMAINDER: " + tRemainder);
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
});

//save new train to database
$('#save').on('click', function(){
    event.preventDefault();
    tId++;
    var newTrain = {
        ID: tId,
        name: tName,
        zip: destZ,
        city: destC,
        state: destS,
        start: tStart,
        frequency: tFreq,
        //nextTrain: tNext,
        //minutesTill: tTill
    };
    database.ref().push(newTrain);
    alert("New Train Added!");
});

database.ref().on('child_added', function(childSnapshot){
    //console.log(childSnapshot.val());
    var tName = childSnapshot.val().name;
    var destZ = childSnapshot.val().zip;
    var destC = childSnapshot.val().city;
    var destS = childSnapshot.val().state;
    var tStart = childSnapshot.val().start;
    var tFreq = childSnapshot.val().frequency;
    var newRow = $('<tr>').append(
        $("<td>").text(tName),
        $("<td>").text(destC),
        $("<td>").text(destS),
        $("<td>").text(destZ),
        $("<td>").text(tFreq),
        //$("<td>").text(tNext),
        //$("<td>").text(tTill)
    );
    $('#trainTable > tbody').append(newRow);
});
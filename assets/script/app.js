// JavaScript Document
$(document).ready(function(){
    var now = moment();
    console.log(now);
    console.log('document.ready!');
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA6n4g8rk6aexMRb7C-R0BjkWxDekDuBpA",
    authDomain: "train-scheduler-ef432.firebaseapp.com",
    databaseURL: "https://train-scheduler-ef432.firebaseio.com",
    projectId: "train-scheduler-ef432",
    storageBucket: "train-scheduler-ef432.appspot.com",
    messagingSenderId: "741863754196"
};
firebase.initializeApp(config);

var database = firebase.database();

var tName = $('#trainName').val().trim();
var destZ = $('#destZip').val().trim();
var destC = $('#destZip').val().trim();
var destS = $('#destZip').val().trim();
var tStart = $('#trainTime').val().trim();
var tFreq = $('#trainFreq').val().trim();

$('#save').on('click', function(){
    event.preventDefault();
    
    var newTrain = {
        name: tName,
        zip: destZ,
        city: destC,
        state: destS,
        start: tStart,
        frequency: tFreq
    };
    
    database.ref().push(newTrain);
    
    console.log('Name: ' + newTrain.name);
    console.log('Zip Code: ' + newTrain.zip);
    console.log('City: ' + newTrain.city);
    console.log('State: ' + newTrain.state);
    console.log('Start Time: ' + newTrain.start);
    console.log('Frequency: ' + newTrain.frequency);
    
    console.log("New Train Added!")
    
    $('#trainName').val('');
    $('#destZip').val('');
    $('#destZip').val('');
    $('#destZip').val('');
    $('#trainTime').val('');
    $('#trainFreq').val('');
});

database.ref().on('child_added', function(childSnapshot){
    console.log(childSnapshot.val());
    
    var tName = childSnapshot.val().name;
    var destZ = childSnapshot.val().zip;
    var destC = childSnapshot.val().city;
    var destS = childSnapshot.val().state;
    var tStart = childSnapshot.val().start;
    var tFreq = childSnapshot.val().frequency;
    
    console.log(tName);
    console.log(destZ);
    console.log(destC);
    console.log(destZ);
    console.log(tStart);
    console.log(tFreq);
    
    var newRow = $('<tr>').append(
        $("<td>").text(tName),
        $("<td>").text(destZ),
        $("<td>").text(destC),
        $("<td>").text(destS),
        $("<td>").text(tStart),
        $("<td>").text(tFreq)
    );
    
    $('#trainTable > tbody').append(newRow);
});

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
            $('#destCity').val(places['place name']);
            $('#destState').val(places['state']);
            destC = places['place name'];
            destS = places['state'];
        },
        error: function(result, success){
            console.log('ERROR: zippopotam')
        }
    });
});
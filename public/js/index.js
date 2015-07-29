/* global Firebase, document */

'use strict'
var baseRef = new Firebase('https://exquisitehues.firebaseio.com/'),
    currentRef = new Firebase('https://exquisitehues.firebaseio.com/current'),
    poemsRef = new Firebase('https://exquisitehues.firebaseio.com/poems'),
    $lastLine = document.getElementById('lastline'),
    $poems = document.getElementById('poems');

baseRef.on('value', function(snapshot) {
    var data = snapshot.val();
    // console.log(data);
});

poemsRef.on('value', function(snapshot) {
    var poems = snapshot.val();
    poems.forEach(showPoem);
});

currentRef.on('value', logCurrent);
currentRef.on('value', showLastLine);

function logCurrent(snapshot) {
  var curr = snapshot.val();
  console.log(curr.count.toString(), 'out of', curr.max.toString(), 'lines');
  curr.lines.forEach(function(el, i, a) {
    console.log(el);
  });
}

// function addLine(el, i, a) {
//   // var  = $lastLine.innerHTML;
//   $lastLine.innerHTML = el;
// }

function showLastLine(snapshot) {
    var curr = snapshot.val();
    $lastLine.innerHTML = curr.lines.pop();
}

function showPoem(el) {
    var $poem = document.createElement('section'),
    $header = document.createElement('h1');
    $header.innerText = el.name;

    el.lines.forEach(function(el, i, a) {
        var $p = document.createElement('p');
        $p.innerText = el;
        $poem.appendChild($p);
    });

    $poems.appendChild($header);
    $poems.appendChild($poem);
}
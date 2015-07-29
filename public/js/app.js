/* global Firebase, document */

'use strict'
var
  currentRef = new Firebase('https://exquisitehues.firebaseio.com/current'),
  poemsRef = new Firebase('https://exquisitehues.firebaseio.com/poems'),
  $lastLine = document.getElementById('lastline'),
  $poems = document.getElementById('poems');


currentRef.on('value', logCurrent);
currentRef.on('value', showLastLine);

poemsRef.orderByPriority().limitToLast(1).on('value', function(snapshot) {
  snapshot.forEach(function(child) {
    var poem = child.val(),
      $poem = document.createElement('section'),
      $header = document.createElement('h3');
    $header.innerText = poem.name;

    poem.lines.forEach(function(poem, i, a) {
      var $p = document.createElement('p');
      $p.innerText = poem;
      $poem.appendChild($p);
    });

    $poems.appendChild($header);
    $poems.appendChild($poem);
  });
});

function logCurrent(snapshot) {
  var curr = snapshot.val();
  console.log(curr.count.toString(), 'out of', curr.max.toString(), 'lines');
  curr.lines.forEach(function(el, i, a) {
    console.log(el);
  });
}

function showLastLine(snapshot) {
  var curr = snapshot.val();
  $lastLine.innerHTML = curr.lines.pop();
}
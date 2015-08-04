/* global Firebase, document */

'use strict'
var
  currentRef = new Firebase('https://exquisitehues.firebaseio.com/current'),
  poemsRef = new Firebase('https://exquisitehues.firebaseio.com/poems'),

  // linesRef = new Firebase('https://exquisitehues.firebaseio.com/current/lines'),
  $lastLine = document.getElementById('lastline'),
  $poems = document.getElementById('poems');

currentRef.on('value', showLastLine);

poemsRef.orderByPriority().limitToLast(1).on('value', function(snapshot) {
  snapshot.forEach(function(child) {
    var poem = child.val(),
      $poem = document.createElement('section'),
      $header = document.getElementById('title');
      
    $header.innerText = child.key();

    poem.lines.forEach(function(poem) {
      var $p = document.createElement('p');
      $p.innerText = poem;
      $poem.appendChild($p);
    });

    $poems.appendChild($poem);
  });
});


function showLastLine(snapshot) {
  var curr = snapshot.val();
  if (curr.lines) {
    console.log(curr.lines.length.toString(), 'out of', curr.max.toString(),
      'lines');
    curr.lines.forEach(function(el, i, a) {
      console.log(el);
    });
    $lastLine.innerHTML = curr.lines.pop();
  }
  else {
    $lastLine.innerHTML = 'a  fresh start';
  }

}
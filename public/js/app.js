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
            $header = document.getElementById('title'),
            $time = document.getElementById('time'),
            date = new Date(poem.timestamp);

        $header.innerText = child.key();
        if (!isNaN(date)) {
            $time.innerText = renderDate(date);
        }

        else {
            $time.innerText = 'unknown';
        }

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
        $lastLine.innerHTML = curr.lines.pop();
    }
    else {
        $lastLine.innerHTML = 'No poem yet! Start one now';
    }

}

function renderDate(date) {
    var year = date.getUTCFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = String("00" + date.getHours()).slice(-2),
        minutes = String("00" + date.getMinutes()).slice(-2);

    return month + '/' + day + '/' + year + ' ' + hour + ':' +
        minutes;
}
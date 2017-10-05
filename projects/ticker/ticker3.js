(function() {
    function ticker(id, direction) {
        var headlines = document.getElementById(id);
        var links = document.getElementsByTagName('A');
        var curX = direction < 0 ? headlines.offsetLeft : -headlines.offsetWidth;
        var animID;

        function moveHeadlines() {
            var firstHeadLine = direction < 0 ? links[0] : links[links.length - 1];
            console.log('direction' + direction);
            console.log(firstHeadLine);
            if( direction > 0 ) {

            //move headlines from left to right at bottom
            //here I window.innerWidth, another way to solve this problem is to put the ticker in a div and give it a width of 100%.  Then I can use the width of that element to get the window's innerWidth b/c maybe this isn't the same on other browsers?
                if(curX + headlines.offsetWidth - firstHeadLine.offsetWidth > window.innerWidth) {
                //subtract space from front of headline = to length of last headline
                    curX -= firstHeadLine.offsetWidth;
                    //remove last headline  and add to front
                    headlines.insertBefore(firstHeadLine, headlines.firstChild);
                }

            } else {
            // move headlines from right to left at top
                if(curX < -firstHeadLine.offsetWidth + 5) {
                //note that the order that I do this doesn't matter b/c I have a reference to the moved headline, not the necesarrily the first headline.
                    curX += firstHeadLine.offsetWidth;
                    headlines.appendChild(firstHeadLine);

                }
            }

            curX += direction*3;
            headlines.style.left = curX + 'px';
            animID = requestAnimationFrame(moveHeadlines);
        }

        moveHeadlines();

        headlines.addEventListener('mouseover', function(){
            cancelAnimationFrame(animID);
        });
        headlines.addEventListener('mouseleave', function(){
            moveHeadlines();
        })
    }

    ticker('headlines', -1);
    ticker('bottomLines', 1);
}());

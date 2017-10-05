(function(){
    var isRunning = true;
    //save a reference to the headlines div
    var hl = document.getElementById('headlines');
    //get current position (note that I moved this from inside moveHead.  Doesn't matter where I put it for functioning, but allocating memory just once seems better then everytime moveHead is called);
    var curX = hl.offsetLeft;

    function moveHead() {
        if(isRunning){
            //get length of first a tag (headline)
            var firstHeadline = document.querySelector('#headlines > a');

            //find position when first headline is off screen
            //if current position is = to or less than, move first headline to the end of the headlines div
            //reset current position to account for loss of first headline, otherwise you get some craziness.
            if(curX < -firstHeadline.offsetWidth) {
                //note that the order that I do this doesn't matter b/c I have a reference to the moved headline, not the necesarrily the first headline.
                hl.appendChild(firstHeadline);
                curX += firstHeadline.offsetWidth;
            }

            //decrement by 1 px;
            curX -=2;
            //set new position as depracated current x value
            hl.style.left = curX + 'px';
            requestAnimationFrame(moveHead);
        }
    }

    function pause(){
        isRunning = !isRunning;
        moveHead();
    }

    hl.addEventListener('mouseenter', pause);
    hl.addEventListener('mouseleave', pause);

    moveHead();

})();

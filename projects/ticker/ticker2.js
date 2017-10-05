(function(){
    //save a reference to the headlines div


    var hl = document.getElementById('headlines'),
        bl = document.getElementById('bottomLines');
    //get current position (note that I moved this from inside moveHead.  Doesn't matter where I put it for functioning, but allocating memory just once seems better then everytime moveHead is called);
    var curX = hl.offsetLeft,
        curXbl = -bl.offsetWidth;

    //set bottom ticker to be all the way to the left of the screen.
    //still works w/o this line because of the padding which hides the fact that it is actually starting two pixesl to the right of where it should
    bl.style.left = curXbl;

    //save references to animation framses for canceling later
    var animHLID,
        animBLID;

    function moveBottom(){
        //get length of last headlines
        var lastHeadline = document.querySelector('#bottomLines a:last-child');

        //find position when last headline is off screen
        //This will be when the (curXbl + the size of the bottomLines dive minus the size of the last headline is larger than the window
        if(curXbl + bl.offsetWidth - lastHeadline.offsetWidth > window.innerWidth) {
            //subtract space from front of headline = to length of last headline
            curXbl -= lastHeadline.offsetWidth;
            //remove last headline  and add to front
            bl.insertBefore(lastHeadline, bl.firstChild);
        }
        curXbl +=2;
        bl.style.left = curXbl + 'px';
        animBLID = requestAnimationFrame(moveBottom);
    }

    function moveHead() {
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
        animHLID = requestAnimationFrame(moveHead);

    }


    hl.addEventListener('mouseenter', function(){
        cancelAnimationFrame(animHLID);
    });
    hl.addEventListener('mouseleave', function(){
        moveHead();
    });

    bl.addEventListener('mouseenter', function(){
        cancelAnimationFrame(animBLID);
    });

    bl.addEventListener('mouseleave', function(){
        moveBottom();
    });

    moveHead();
    moveBottom();

})();

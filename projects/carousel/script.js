(function() {
    var current = 0;
    var next = 1;
    var timer;

    var images = document.getElementsByClassName('beach');
    var dots = document.getElementsByClassName('dot');

    function getDotNum(e) {
        for(var j = 0; j < dots.length; j++) {
            if(e.target.id == dots[j].id) {
                console.log('User clicked on: ' + j);

                return j;
            }
        }
        return null;
    }

    function dotFill() {
        //loop through the dots and find out if any have the selected className
        // this function will remove the current selected dot and add a selected class to the next dot
        //can't rely on the past "current" for removal becasue the user might have clicked on one of the images out of order
        for(var i = 0; i < dots.length; i++) {
            if(dots[i].classList.contains('selected')){
                dots[i].classList.remove('selected');
            }
        }

        dots[current].classList.add('selected');
    }

    function moveImages() {

        images[current].classList.remove('onscreen');
        images[current].classList.add('exit');
        images[next].classList.add('onscreen');

        current = next;
        next = current + 1;
        if(next >= images.length) {
            next = 0;
        }

        dotFill();
    }

    document.addEventListener('transitionend', function(){
        for(var i = 0; i < images.length; i++){
            if(images[i].classList.contains('exit')){
                images[i].classList.remove('exit');
                timer = setTimeout(moveImages, 5000);
            }
        }
    });

    document.getElementById('dots-wrapper').addEventListener('click', function(e){
        //this is going to tell us which dot was chosen
        //we're going to use this to set what next is are and then call moveImages 
        //check to see that a dot was clicked on, not just the wrapper
        if(e.target.classList.contains('dot')){
            clearTimeout(timer);
            console.log(e);
            var dotClicked = getDotNum(e);
            if(dotClicked == current){
                return;
            }
            next = dotClicked;
            moveImages();
        }
    });

    timer = setTimeout(moveImages, 5000);
})();

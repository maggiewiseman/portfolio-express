
(function() {
    var $container = $('.container');

    function dragBar(e){
        e.preventDefault();

        //once the mousedown event has happened, now start listening for the mousemove events
        //use the location of the mouse, evt.PageX which is relative to the 0,0 position of the screen,
        //to set the bar's offset which is also relative to the 0,0 position of the screen.
        //Then set width of top image to equal the position the bar's pageX - the container's offset
        //Had to make sure the top image had a fixed size. If I used percents, the image would resize!
        //also, the div containing the img has to have overflow hidden! 
        $container.on('mousemove', function(evt){

            evt.preventDefault();

            if(evt.pageX < $('.container').offset().left + $container.width() ) {
                console.log('mousemove: ' + evt);
                $('#bar').offset({left: evt.pageX});
                $('#old-parth').width(evt.pageX - $('.container').offset().left);
            }
        });

        $container.on('mouseup', function(){
            $container.off('mousemove');
        });
    }
    //add eventListener for mousedown and call the dragBar method which will handle mousemove events
    $('#bar').on('mousedown', dragBar);
}());

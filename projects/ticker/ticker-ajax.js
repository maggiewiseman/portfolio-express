(function(){
    var isRunning = true;
    //save a reference to the headlines div
    var hl = $('#headlines');
    //get current position (note that I moved this from inside moveHead.  Doesn't matter where I put it for functioning, but allocating memory just once seems better then everytime moveHead is called);
    var curX = hl.offset().left;

    function moveHead() {
        if(isRunning){
            //get length of first a tag (headline)
            var fhlWidth = $('a').eq(0).width();

            //find position when first headline is off screen
            //if current position is = to or less than, move first headline to the end of the headlines div
            //reset current position to account for loss of first headline, otherwise you get some craziness.
            if(curX < -fhlWidth) {
                //this order is important b/c I don't have a live list..
                curX += fhlWidth;
                console.log('in if');
                $('#headlines').append($('a').eq(0));
            }

            //decrement by 1 px;
            curX -=2;
            //set new position as depracated current x value
            hl.css({left: curX + 'px'});
            requestAnimationFrame(moveHead);
        }
    }

    function pause(){
        isRunning = !isRunning;
        moveHead();
    }

    function getHeadlines(){
        console.log('in get headlines');
        $.ajax({
            url: 'urls.json',
            method: 'GET',
            success: function(data) {
                console.log(data);
                renderHeadlines(data);
            },
            error: function(e) {
                console.log(e);
            }
        });
    }

    function renderHeadlines(urls) {
        console.log('urls' + urls);
        //json object comes in
        //loop through it and prepare html string
        var html = '';

        urls.forEach(function(item){

            html += '<a href="'+ item.url + '" class="link">' + item.text + '</a>';
        });
        //get the headlines element and then add the html
        hl.html(html);
    }
    getHeadlines();

    hl.on('mouseenter', pause);
    hl.on('mouseleave', pause);

    moveHead();



})();

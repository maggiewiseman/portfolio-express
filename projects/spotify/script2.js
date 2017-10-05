
    var xhr,
        $input = $('#artist'),
        $type = $('#type'),
        $results = $('#results');

    var currData = currData ? currData : '';
    var next20;
    var timerIndex;

    var htmlStartToLink = '<div class="artist"><figure class="cover-art"><a href="',
        htmlImgUrl = '" class="artist-img"><img src="',
        htmlToNameLink ='" alt="album cover" class="image"></a></figure><h3 class="artist-h"><a href="',
        htmlToArtistName = '" class="artist-a">',
        htmlEnd = '</a></h3></div>',
        moreButton = '<a href="#" class="button" id="more">More</a>',
        noResults = '<h3 class="no-results">No Results</h3>',
        blankUrl = '<h3 class="no-results">Please type an artist or album in the search field</h3>';

    function reduceDataToHTML(data) {

        currData += data.items.reduce(function(prev, curr){

            var imgUrl = curr.images.length > 0 ? curr.images[0].url : 'default-thumbnail.jpg',
                linkUrl = curr.external_urls.spotify,
                name = curr.name;

            var htmlString = htmlStartToLink + linkUrl + htmlImgUrl + imgUrl + htmlToNameLink + linkUrl + htmlToArtistName + name + htmlEnd;

            return prev + htmlString;
        }, currData);
        //console.log(currData);
        return currData;
    }

    function getHeader() {
        return '<header><h2>Search results for: '+ $input.val() +'</h2></header>';
    }

    function infiniteScroll() {
        return location.search.indexOf('?scroll=infinite') > -1 ? true : false;
    }

    function scrolledToBottom() {
        var top = $(document).scrollTop(),
            pageHeight = $(document).height(),
            windowHeight = $(window).height();

        if (top + windowHeight >= pageHeight - 100) {
            return true;
        } else {
            return false;
        }
    }

    function setTimer() {
        console.log('timer starting');
        timerIndex  = setTimeout(function timer() {
            if(scrolledToBottom()){
                console.log('canceling timer');

                request();
            } else {
                setTimeout(timer, 500);
            }
            clearTimeout(timerIndex);
        }, 500);
    }

    function displayResults(data) {
        if(!data.total) {
            $results.html(noResults);
            return false;
        }

        var htmlToAppend = getHeader() + reduceDataToHTML(data);

        if(data.next) {
            if (infiniteScroll()) {
                //start a timer that compares page height to document height
                setTimer();

            } else {
                //console.log('there is a next value, show the more button');
                htmlToAppend += moreButton;
            }
            next20 = setNext20Url(data.next);

        }

        $results.html(htmlToAppend);

        $('#more').on('click', request);

    }

    function setNext20Url(spotifyUrl){
        if(!spotifyUrl) {
            return;
        }
        return spotifyUrl.replace('api.spotify.com/v1/search', 'elegant-croissant.glitch.me/spotify');
    }

    function callAjax(url, queryParams) {
        if(xhr) {
            xhr.abort();
            console.log('aborting');
        }

        xhr = $.ajax({
            url: url,
            method: 'GET',
            data: queryParams,
            success: function(data) {
                data = data.artists || data.albums;

                displayResults(data);
                xhr = null;
            },
            error: function(e) {
                console.log(e);
            }
        });
    }

    function request(e) {
        if(!e) {
            //triggered b/c of timer...not an events
            console.log('calling Ajax b/c of scrolling');
            callAjax(next20);
            return;
        }

        if(e.target.id == 'search') {
            e.preventDefault();
            callAjax('https://elegant-croissant.glitch.me/spotify', {
                q: $input.val(),
                type:$type.val()
            });
        } else {
            e.preventDefault();
            //console.log('next20', next20);
            callAjax(next20);
        }
    }
    $('#search').on('click', function(e){
        currData = '';
        next20 = '';

        if(!$input.val()) {
            console.log('blank');
            $results.html(blankUrl);
            return;
        }

        $results.html('');
        request(e);
    });

(function() {
    var xhr,
        username,
        password,
        ghUser,
        commitTarget,
        $search = $('#search'),
        $submitCreds = $('#submitCreds'),
        $results = $('#results'),
        $commitTarget;

    function saveCreds() {

        console.log('in save creds');

        if(!validCreds()) {
            return false;
        }

        console.log('creds saved un' + username + ' pw ' + password);
        showRepoSearch();
    }

    function validCreds() {
        username = $('#username').val().trim();
        password = $('#password').val().trim();

        if(!username) {
            $results.html('<div class="errorMsg">Please enter a username.</div>');
            return false;
        } else if (!password) {
            $results.html('<div class="errorMsg">Please enter a password.</div>');
            return false;
        }
        return true;
    }

    function showRepoSearch() {
        $results.html('');
        $('#userInfo').hide();
        $('#repoSearch').show();
    }

    function requestRepo() {
        if(ghUser == $('#gh-user').val().trim()) {
            //already got data for this user.
            return;
        }

        ghUser = $('#gh-user').val().trim();
        var url = 'https://api.github.com/users/'+ ghUser +'/repos';

        callAjax(url, 'repos');
    }

    function callAjax(url, dataType) {
        console.log('url: ' + url);
        if(xhr) {
            xhr.abort();
            console.log('aborting');
        }

        xhr = $.ajax({
            url: url,
            method: 'GET',
            headers: {
                Authorization: 'Basic ' + btoa(username + ':' + password)
            },
            success: function(data) {
                console.log(data);

                displayResults(data, dataType);
            },
            error: function(e) {
                console.log(e);
                if(dataType == 'commits') {
                    $commitTarget.html('<div class="errorMsg">No commits found. </div>');
                } else {
                    $results.html('<div class="errorMsg">No repos found. </div>');
                }
            }
        });
        xhr = null;
    }

    function displayResults(data, dataType) {

        var html;
        if(!data){
            console.log('no data');
            $results.html(`<div class="no-results">No ${dataType} found.</div>`);
            return false;
        }

        if(dataType == 'commits'){
            data = data.slice(0, 10);
            html = hb.templates.commits(data);
            $commitTarget.html(html);

        } else {

            html = hb.templates.repos({repo: data});
            $('#results').html(html);
            $('.repo-link').on('click', getCommits);
        }
    }

    function getCommits(e) {
        //prevent defaults from clicking on anchor element
        e.preventDefault();
        if(commitTarget == e.target) {
            console.log('already got these commits');
            return;
        }

        commitTarget = e.target;
        $commitTarget = $(e.target).next();
        var repoName = $(e.target).html().split('/');

        //repos/:owner/:repo/commits
        var url = 'https://api.github.com/repos/'+ repoName[0] +'/'+ repoName[1] + '/commits';
        callAjax(url, 'commits');
    }

    var hb  = {
        init : function() {
            //check to make sure there are no other templates in the template object
            Handlebars.templates = Handlebars.templates || {};

            //get templates from my html
            var templates = document.querySelectorAll('template');

            //add my templates to the handlebars.template object and compile the templates into functions.
            //each of these functions will be named the same as the template id from my index.html
            Array.prototype.slice.call(templates).forEach(function(tmpl) {
            Handlebars.templates[tmpl.id] = Handlebars.compile(tmpl.innerHTML.replace(/{{&gt;/g, '{{>'));
            });

            Handlebars.partials = Handlebars.templates;
            this.templates = Handlebars.templates;
        }
    };

    //initialize the handlebars templates
    hb.init();
    $submitCreds.on('click', saveCreds);
    $search.on('click', requestRepo);

}());


QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});


QUnit.test( "equal test", function( assert ) {
    assert.equal( 0, 0, "Zero, Zero; equal succeeds" );
    assert.equal( "", 0, "Empty, Zero; equal succeeds" );
    assert.equal( "", "", "Empty, Empty; equal succeeds" );
    assert.equal( 0, false, "Zero, false; equal succeeds" );

});

QUnit.test( "setNext20Url Test", function( assert ) {
    var nextUrl = 'https://elegant-croissant.glitch.me/spotify?query=Adele&type=artist&offset=20&limit=20';
    var url = 'https://api.spotify.com/v1/search?query=Adele&type=artist&offset=20&limit=20';

    assert.equal(nextUrl, setNext20Url(url), 'message to display');
    assert.equal(undefined, setNext20Url(null), 'can handle null');
    assert.equal(undefined, setNext20Url(undefined), 'can handle undefined');
});

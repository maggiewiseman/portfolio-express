(function startMe(){

  // take the width of screen, and save it as initial position (add also a first initial offset)
  var position = window.innerWidth + 20;

  // select the '.headlines' node to move
  var headlines = document.querySelector("#headlines");

  // define the animation function
  function moveHeadline(){

    // save a reference for the first child of '.headlines'
    var firstChild = headlines.firstElementChild;

    // check if the element is already out of the screen
    if(position<-firstChild.offsetWidth){
      // if so, move the first element to the bottom of the list --> the second child will become the first one
      headlines.appendChild(firstChild);
      // increment the value of 'position' to the width of the switched element
      position += firstChild.offsetWidth;
    }

    // decrement 'position' by 2 every time the 'requestAnimationFrame' gets invoked
    position -= 4;
    // move the element's position
    headlines.style.left = position + "px";

    // recursively recall the function again
    requestAnimationFrame(moveHeadline);
  }

  // start the animation
  window.requestAnimationFrame(moveHeadline)

})();

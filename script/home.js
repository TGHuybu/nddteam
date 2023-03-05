var background = document.getElementById("bg-img");
// var home = document.getElementById("home");
// var projects = document.getElementById("projects");

// var height = screen.height;

window.addEventListener("scroll", function() {
    background.style.opacity = 1 - +window.pageYOffset/550 + "";
    background.style.top = +window.pageYOffset + "px";
    background.style.backgroundPositionY = - +window.pageYOffset/2 + "px";
});

// yea copied from the net, god i am dumb why am i even here
// someone please help me i am so useless please do something
// i can't take it anymore what on earth is a java what the hell is a script
// what even is jquery
$(function() {
    $('.to-projects').click(function() {
        $('html, body').animate({scrollTop: $('#project-wrapper').offset().top }, 'slow');
        return false;
    });
});
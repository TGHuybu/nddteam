var background = document.getElementById("bg-img");

window.addEventListener("scroll", function() {
    background.style.opacity = 1 - +window.pageYOffset/550 + "";
    background.style.top = +window.pageYOffset + "px";
    background.style.backgroundPositionY = - +window.pageYOffset/2 + "px";
});

$(function() {
    $('.to-projects').click(function() {
        $('html, body').animate({scrollTop: $('.project-wrapper').offset().top }, 'slow');
        return false;
    });
});
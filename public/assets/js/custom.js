$(document).ready(function () {
    if (window.self !== window.top) {
        window.top.location.href = window.location.href;
    }

    initaializeAOS();
    trimSpaceInTextBoxes();
})

function initaializeAOS() {
    AOS.init({
        duration: 700
    });
}

function trimSpaceInTextBoxes() {
    $('input').blur(function (e) {
        $(this).val($(this).val().trim());
    })
}
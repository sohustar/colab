
$(document).ready(function() {

    $('.colab').click(function(){
        $('#masterPlan').attr('viewBox' , '0,0,469,499');
     });

    $('.present').click(function(){
        $('#masterPlan').attr('viewBox' , '0,0,200,225');
    });

   $('.circleCafe').click(function(){
        $('#masterPlan').attr('viewBox' , '0,275,200,225');
     });

     var toggleButton = $('.toggle-button');
     toggleButton.on('click', function() {
       $('.left-gap').toggle();
       $('.svg-icon').toggleClass('active');
     });

     /*
     svg path
     svg text
     svg rect
     
     */

     
}); 
$('.toggle').on('click', function(){
    var nav = $('#navigation')
    nav.toggleClass('responsive')
    var icon = $('.hamburger i').attr('class')
    if (icon == 'fas fa-bars'){
        $('.hamburger i').attr('class','fas fa-times')
    }else{
        $('.hamburger i').attr('class','fas fa-bars')
    }
})
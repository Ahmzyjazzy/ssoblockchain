(function(){

    //set active menu 
    const activeMenu = () => {
        const path = window.location.pathname;
        $('.sidebar-fixed a').removeClass('active')
        $(`.sidebar-fixed a[href="${path}"]`).addClass('active');
    }
    

    activeMenu();

}());
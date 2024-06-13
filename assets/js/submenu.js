document.addEventListener("DOMContentLoaded", function() {
    var navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(function(navItem) {
        navItem.addEventListener("click", function(event) {
            var submenu = this.nextElementSibling;
            closeAllSubmenus();

            if (submenu && submenu.classList.contains("sub-menu")) {
                event.preventDefault();
                submenu.classList.toggle("show");
                this.querySelector('.submenu-toggle-icon').classList.toggle('open');
            } else {
                window.location.href = this.href;
            }
        });
    });

    document.addEventListener('click', function(event) {
        var isClickInside = document.querySelector('.navigation').contains(event.target);
        if (!isClickInside) {
            closeAllSubmenus();
        }
    });
});
function closeAllSubmenus() {
    var subMenus = document.querySelectorAll('.sub-menu');
    subMenus.forEach(function(subMenu) {
        subMenu.classList.remove('show');
    });

    var submenuToggleIcons = document.querySelectorAll('.submenu-toggle-icon');
    submenuToggleIcons.forEach(function(icon) {
        icon.classList.remove('open');
    });
}

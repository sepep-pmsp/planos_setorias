function toggleDropdown(event) {
    event.preventDefault();
    const dropdownMenu = event.target.nextElementSibling;
    if (dropdownMenu.style.display === "block") {
      dropdownMenu.style.display = "none";
    } else {
      dropdownMenu.style.display = "block";
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    // Check if the current page URL matches any of the subitem URLs to keep the dropdown open
    const currentUrl = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function(item) {
      if (item.classList.contains('active') && item.closest('.dropdown')) {
        item.closest('.dropdown').querySelector('.sub-menu').style.display = 'block';
      }
    });
  });
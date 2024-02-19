const toggleButtons = document.querySelectorAll('.toggle-author');
toggleButtons.forEach(button => {
  button.addEventListener('click', function() {
    const parentCard = this.parentElement;
    const authorInfo = parentCard.querySelector('.author-info');
    // Fecha todos os accordions abertos
    document.querySelectorAll('.author-info.active').forEach(acc => {
      if (acc !== authorInfo) {
        acc.classList.remove('active');
      }
    });
    authorInfo.classList.toggle('active');
  });
});

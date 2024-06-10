const buttonsWrapper = document.querySelector(".map");
const slides = document.querySelector(".interna");

buttonsWrapper.addEventListener("click", e => {
  if (e.target.nodeName === "BUTTON") {
    Array.from(buttonsWrapper.children).forEach(item =>
      item.classList.remove("active")
    );
    if (e.target.classList.contains("first")) {
      slides.style.transform = "translateX(-0%)";
      e.target.classList.add("active");
    } else if (e.target.classList.contains("second")) {
      slides.style.transform = "translateX(-33.33333333333333%)";
      e.target.classList.add("active");
    } else if (e.target.classList.contains('third')){
      slides.style.transform = 'translatex(-66.6666666667%)';
      e.target.classList.add('active');
    }
  }
});

const buttonsEmbrulho = document.querySelector(".mapa");
const deslizamentos = document.querySelector(".interna2");

buttonsEmbrulho.addEventListener("click", e => {
  if (e.target.nodeName === "BUTTON") {
    Array.from(buttonsEmbrulho.children).forEach(item =>
      item.classList.remove("active")
    );
    if (e.target.classList.contains("first2")) {
      deslizamentos.style.transform = "translateX(-0%)";
      e.target.classList.add("active2");
    } else if (e.target.classList.contains("second2")) {
      deslizamentos.style.transform = "translateX(-33.33333333333333%)";
      e.target.classList.add("active");
    } else if (e.target.classList.contains('third2')){
      deslizamentos.style.transform = 'translatex(-66.6666666667%)';
      e.target.classList.add('active');
    }
  }
});

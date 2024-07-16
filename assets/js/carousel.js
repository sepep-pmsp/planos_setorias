document.addEventListener("DOMContentLoaded", function() {
  let plans = [];

  const carouselsData = [
      { id: 'carousel-inner1', indicatorsId: 'carousel-indicators1', plans: [] },
      { id: 'carousel-inner2', indicatorsId: 'carousel-indicators2', plans: [] }
  ];

  var achajson = gen_url ('/assets/Json/excel_to_.json');
  fetch(achajson)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          plans = data;
          renderCarousels();
      })
      .catch(error => {
          console.error('Erro ao carregar o JSON:', error);
      });

  function renderCarousels() {
      carouselsData.forEach((carouselData, index) => {
          carouselData.plans = plans.filter(plan => plan.id === "1").slice(index * 5, (index + 1) * 5);
          renderCarousel(carouselData);
      });
  }

  function renderCarousel(carouselData) {
      const carouselInner = document.getElementById(carouselData.id);
      const carouselIndicators = document.getElementById(carouselData.indicatorsId);
      carouselInner.innerHTML = carouselData.plans.map(plan => {
          let imgSrc = '';
          if (plan.Sigla) {
              imgSrc = `${BASE_URL}/assets/images/img-plans/${plan.Sigla}.png`;
          } else if (plan.Título) {
              imgSrc = `${BASE_URL}/assets/images/img-plans/${plan.Título}.png`;
          }
          if (!imgSrc) {
              imgSrc = `${BASE_URL}/assets/images/img-plans/generic.png`;
          }
          return `<div class="carousel-item"><a href="${BASE_URL}/planos#${plan.Título || plan.Sigla}"><img src="${imgSrc}" alt="${plan.Título}"></a></div>`;
      }).join('');

      carouselIndicators.innerHTML = carouselData.plans.map((_, index) => {
          return `<button onclick="setSlide(${index}, '${carouselData.id}')"></button>`;
      }).join('');
      const items = carouselInner.querySelectorAll('.carousel-item');
      let currentIndex = 0;

      function updateCarousel() {
          carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
          adjustCarouselHeight(carouselInner, currentIndex);
      }

      function adjustCarouselHeight(carouselInner, currentIndex) {
          const activeItem = items[currentIndex];
          const img = activeItem.querySelector('img');
          img.onload = () => {
              carouselInner.style.height = `${img.height}px`;
          };
          if (img.complete) {
              carouselInner.style.height = `${img.height}px`;
          }
      }

      window.setSlide = function(index, carouselId) {
          const carouselInner = document.getElementById(carouselId);
          currentIndex = index;
          updateCarousel(carouselInner);
      };
      setInterval(() => {
          currentIndex = (currentIndex + 1) % items.length;
          updateCarousel(carouselInner);
      }, 3000);
      updateCarousel(carouselInner);
  }
});

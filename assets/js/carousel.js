document.addEventListener('DOMContentLoaded', function () {
    let plans = [];

    const carouselsData = [
        { id: 'carousel-inner', indicatorsId: 'carousel-indicators', plans: [] },
    ];

    const carouselControllers = new Map();
    const achajson = gen_url('/assets/Json/excel_to_.json');

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
            carouselData.plans = plans
                .filter(plan => plan.id === '1')
                .slice(index * 10, (index + 1) * 10);

            renderCarousel(carouselData);
        });
    }

    function renderCarousel(carouselData) {
        const carouselInner = document.getElementById(carouselData.id);
        const carouselIndicators = document.getElementById(carouselData.indicatorsId);

        if (!carouselInner || !carouselIndicators) return;

        const basePath = `${BASE_URL}/assets/images/img-plans`;
        const extensions = ['png', 'jpeg', 'jpg'];
        let currentIndex = 0;

        const slides = carouselData.plans.map((plan, index) => {
            const imgSources = [];

            // Prioriza a sigla e depois tenta o título, em todas as extensões.
            [plan.Sigla, plan.Título].forEach(name => {
                if (typeof name !== 'string' || !name.trim()) return;

                const fileName = encodeURIComponent(name.trim());
                extensions.forEach(extension => {
                    imgSources.push(`${basePath}/${fileName}.${extension}`);
                });
            });

            // A imagem genérica é o último recurso.
            const sources = [...new Set([...imgSources, `${basePath}/generic.png`])];

            const item = document.createElement('div');
            item.className = 'carousel-item';

            const link = document.createElement('a');
            link.href = `${BASE_URL}/planos#${plan.linkrelativo}`;

            const img = document.createElement('img');
            img.alt = plan.Título || plan.Sigla || 'Plano';

            let attempt = 0;

            img.addEventListener('error', () => {
                attempt++;

                if (attempt < sources.length) {
                    img.src = sources[attempt];
                }
            });

            img.addEventListener('load', () => {
                if (index === currentIndex) {
                    adjustCarouselHeight();
                }
            });

            link.appendChild(img);
            item.appendChild(link);
            img.src = sources[0];

            return item;
        });

        carouselInner.replaceChildren(...slides);

        carouselIndicators.replaceChildren(...carouselData.plans.map((_, index) => {
            const button = document.createElement('button');
            button.addEventListener('click', () => setCurrentSlide(index));
            return button;
        }));

        const items = carouselInner.querySelectorAll('.carousel-item');

        if (items.length === 0) return;

        function adjustCarouselHeight() {
            const activeItem = items[currentIndex];
            if (!activeItem) return;

            const img = activeItem.querySelector('img');
            if (!img || !img.complete || img.naturalWidth === 0) return;

            carouselInner.style.height = `${img.height}px`;
        }

        function updateCarousel() {
            carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
            adjustCarouselHeight();
        }

        function setCurrentSlide(index) {
            if (!Number.isInteger(index) || index < 0 || index >= items.length) return;

            currentIndex = index;
            updateCarousel();
        }

        carouselControllers.set(carouselData.id, setCurrentSlide);

        if (items.length > 1) {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % items.length;
                updateCarousel();
            }, 3000);
        }

        window.addEventListener('resize', adjustCarouselHeight);
        updateCarousel();
    }

    // Mantém a função disponível para chamadas externas, caso existam.
    window.setSlide = function (index, carouselId) {
        const setCurrentSlide = carouselControllers.get(carouselId);
        if (setCurrentSlide) setCurrentSlide(index);
    };
});

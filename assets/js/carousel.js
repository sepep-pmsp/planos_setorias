document.addEventListener('DOMContentLoaded', async function () {
    const carouselInner = document.getElementById('carousel-inner');
    const carouselIndicators = document.getElementById('carousel-indicators');

    if (!carouselInner || !carouselIndicators) return;

    const basePath = `${BASE_URL}/assets/images/image_carousel/`;
    const extensions = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

    let currentIndex = 0;
    let slides = [];

    try {
        // Busca os arquivos disponíveis na pasta.
        const response = await fetch(basePath);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const directoryUrl = new URL(basePath, window.location.href);

        const images = [...new Set(
            Array.from(doc.querySelectorAll('a[href]'))
                .map(link => new URL(
                    link.getAttribute('href'),
                    directoryUrl
                ))
                .filter(url =>
                    url.origin === directoryUrl.origin &&
                    url.pathname.startsWith(directoryUrl.pathname) &&
                    !url.pathname.slice(directoryUrl.pathname.length).includes('/') &&
                    extensions.test(url.pathname)
                )
                .map(url => url.href)
        )].sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true })
        );

        if (images.length === 0) {
            console.warn('Nenhuma imagem encontrada na pasta do carrossel.');
            return;
        }

        // Cria os slides.
        slides = images.map((image, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';

            const img = document.createElement('img');
            img.alt = `Imagem ${index + 1}`;

            img.addEventListener('load', () => {
                if (index === currentIndex) {
                    adjustCarouselHeight();
                }
            });

            img.src = image;

            item.appendChild(img);

            return item;
        });

        carouselInner.replaceChildren(...slides);

        // Cria os indicadores.
        carouselIndicators.replaceChildren(
            ...images.map((_, index) => {
                const button = document.createElement('button');
                button.type = 'button';

                button.setAttribute(
                    'aria-label',
                    `Exibir imagem ${index + 1}`
                );

                button.addEventListener('click', () => {
                    setCurrentSlide(index);
                });

                return button;
            })
        );

        // Ajusta a altura do carrossel.
        function adjustCarouselHeight() {
            const activeItem = slides[currentIndex];

            if (!activeItem) return;

            const img = activeItem.querySelector('img');

            if (!img || !img.complete || img.naturalWidth === 0) {
                return;
            }

            carouselInner.style.height = `${img.height}px`;
        }

        // Atualiza a posição do carrossel.
        function updateCarousel() {
            carouselInner.style.transform =
                `translateX(-${currentIndex * 100}%)`;

            adjustCarouselHeight();

            Array.from(carouselIndicators.children).forEach(
                (button, index) => {
                    button.classList.toggle(
                        'active',
                        index === currentIndex
                    );
                }
            );
        }

        // Seleciona uma imagem.
        function setCurrentSlide(index) {
            if (
                !Number.isInteger(index) ||
                index < 0 ||
                index >= slides.length
            ) {
                return;
            }

            currentIndex = index;
            updateCarousel();
        }

        // Transição automática a cada 3 segundos.
        if (slides.length > 1) {
            setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            }, 3000);
        }

        // Mantém a compatibilidade com chamadas externas.
        window.setSlide = function (index, carouselId) {
            if (carouselId === 'carousel-inner') {
                setCurrentSlide(index);
            }
        };

        window.addEventListener('resize', adjustCarouselHeight);

        updateCarousel();

    } catch (error) {
        console.error('Erro ao carregar imagens do carrossel:', error);
    }
});
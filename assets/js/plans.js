document.addEventListener("DOMContentLoaded", function () {
    const filterSelect = document.getElementById('filter');
    const sortSelect = document.getElementById('sort');
    const accordion = document.getElementById('accordion');
    const paginationDiv = document.getElementById('pagination');

    let plans = [];
    let displayedPlans = [];

    const itensPorPagina = 10;
    let paginaAtual = 0;

    function getHashValue() {
        return window.location.hash ? window.location.hash.substring(1) : null;
    }

    function getImageCandidates(plan) {
        const basePath = '/assets/images/img-plans';
        const candidates = [];

        if (plan.Sigla) {
            const sigla = encodeURIComponent(plan.Sigla.trim());
            candidates.push(
                gen_url(`${basePath}/${sigla}.png`),
                gen_url(`${basePath}/${sigla}.jpeg`),
                gen_url(`${basePath}/${sigla}.jpg`)
            );
        }

        if (plan["Título"]) {
            const titulo = encodeURIComponent(plan["Título"].trim());
            candidates.push(
                gen_url(`${basePath}/${titulo}.png`),
                gen_url(`${basePath}/${titulo}.jpeg`),
                gen_url(`${basePath}/${titulo}.jpg`)
            );
        }

        candidates.push(gen_url(`${basePath}/generic.png`));

        return [...new Set(candidates)];
    }

    function createPlanImage(plan) {
        const img = document.createElement('img');
        img.alt = plan["Título"] || plan.Sigla || 'Plano';

        const candidates = getImageCandidates(plan);
        let currentIndex = 0;

        function tryNextImage() {
            if (currentIndex < candidates.length) {
                img.src = candidates[currentIndex];
                currentIndex++;
            }
        }

        img.onerror = function () {
            tryNextImage();
        };

        tryNextImage();

        return img;
    }

    function renderPlans(plansToRender) {
        accordion.innerHTML = '';
        displayedPlans = plansToRender;

        const hashLink = getHashValue();

        if (hashLink) {
            const index = displayedPlans.findIndex(plan => plan.linkrelativo === hashLink);
            if (index !== -1) {
                paginaAtual = Math.floor(index / itensPorPagina);
            }
        }

        const startIndex = paginaAtual * itensPorPagina;
        const endIndex = Math.min(startIndex + itensPorPagina, displayedPlans.length);
        const planosPagina = displayedPlans.slice(startIndex, endIndex);

        planosPagina.forEach(plan => {
            const accordionItem = document.createElement('div');
            accordionItem.classList.add('accordion-item');

            const accordionHeader = document.createElement('div');
            accordionHeader.classList.add('accordion-header');
            accordionHeader.textContent = plan["Título"] || '';

            const accordionContent = document.createElement('div');
            accordionContent.classList.add('accordion-content');

            const resumo = plan.Resumo || '';

            const vigencia = (plan["Início"] && plan["Fim"])
                ? `<p class="vigencia">Vigência: </p><p class="vigencia-r">${plan["Início"]} - ${plan["Fim"]}</p>`
                : '';

            const orgaoCoordenador = plan["Órgão Coordenador"]
                ? `<p class="responsavel">Órgão Responsável: </p><p class="respon-r">${plan["Órgão Coordenador"]}</p>`
                : '';

            const linkAcesso = plan["Link para Acesso"]
                ? `<p><button class="btn-informacao"><a href="${plan["Link para Acesso"]}" target="_blank" rel="noopener noreferrer">Mais informações</a></button></p>`
                : '';

            const textContent = document.createElement('div');
            textContent.classList.add('text-content');
            textContent.innerHTML = `
                <p class="resumo">${resumo}</p>
                ${vigencia}
                ${orgaoCoordenador}
                ${linkAcesso}
            `;

            const imageContent = document.createElement('div');
            imageContent.classList.add('image-content');

            const planImage = createPlanImage(plan);

            if (plan["Link para Acesso"]) {
                const imageLink = document.createElement('a');
                imageLink.href = plan["Link para Acesso"];
                imageLink.target = '_blank';
                imageLink.rel = 'noopener noreferrer';
                imageLink.appendChild(planImage);
                imageContent.appendChild(imageLink);
            } else {
                imageContent.appendChild(planImage);
            }

            accordionContent.appendChild(textContent);
            accordionContent.appendChild(imageContent);

            accordionHeader.addEventListener('click', () => {
                const currentlyOpenContent = document.querySelector('.accordion-content.open');
                const currentlyOpenHeader = document.querySelector('.accordion-header.open');

                if (currentlyOpenContent && currentlyOpenContent !== accordionContent) {
                    currentlyOpenContent.classList.remove('open');
                }

                if (currentlyOpenHeader && currentlyOpenHeader !== accordionHeader) {
                    currentlyOpenHeader.classList.remove('open');
                }

                accordionContent.classList.toggle('open');
                accordionHeader.classList.toggle('open');
            });

            accordionItem.appendChild(accordionHeader);
            accordionItem.appendChild(accordionContent);
            accordion.appendChild(accordionItem);

            if (plan.linkrelativo === hashLink) {
                accordionContent.classList.add('open');
                accordionHeader.classList.add('open');
                accordionItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        criarLinksPaginacao();
    }

    function criarLinksPaginacao() {
        paginationDiv.innerHTML = '';
        const numeroDePaginas = Math.ceil(displayedPlans.length / itensPorPagina);

        for (let i = 0; i < numeroDePaginas; i++) {
            const link = document.createElement('span');
            link.textContent = i + 1;
            link.classList.add('pagination-number');

            if (i === paginaAtual) {
                link.classList.add('active');
            }

            link.addEventListener('click', function () {
                paginaAtual = i;
                renderPlans(displayedPlans);
                atualizarLinksAtivos();
            });

            paginationDiv.appendChild(link);
        }
    }

    function atualizarLinksAtivos() {
        const links = paginationDiv.querySelectorAll('.pagination-number');
        links.forEach((link, index) => {
            if (index === paginaAtual) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function filterPlans(plans, filter) {
        if (filter === 'vigente') {
            return plans.filter(plan => plan.Status === 'Vigente');
        } else if (filter === 'encerrado') {
            return plans.filter(plan => plan.Status === 'Encerrado');
        } else {
            return plans;
        }
    }

    function sortPlans(plans, sort) {
        const sorted = [...plans];

        return sorted.sort((a, b) => {
            if (sort === 'recent') {
                return new Date(b["Início"]) - new Date(a["Início"]);
            } else if (sort === 'oldest') {
                return new Date(a["Início"]) - new Date(b["Início"]);
            } else if (sort === 'az') {
                return (a["Título"] || '').localeCompare(b["Título"] || '');
            } else if (sort === 'za') {
                return (b["Título"] || '').localeCompare(a["Título"] || '');
            }
            return 0;
        });
    }

    filterSelect.addEventListener('click', function () {
        const options = filterSelect.querySelector('.options');
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });

    filterSelect.addEventListener('click', function (e) {
        const option = e.target.closest('li');
        if (option) {
            const filterValue = option.getAttribute('data-value');
            const filteredPlans = filterPlans(plans, filterValue);
            paginaAtual = 0;
            renderPlans(filteredPlans);
            filterSelect.querySelector('.selected-option').textContent = option.textContent;
            filterSelect.querySelector('.options').style.display = 'none';
        }
    });

    sortSelect.addEventListener('click', function () {
        const options = sortSelect.querySelector('.options');
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });

    sortSelect.addEventListener('click', function (e) {
        const option = e.target.closest('li');
        if (option) {
            const sortValue = option.getAttribute('data-value');
            const sortedPlans = sortPlans(displayedPlans.length ? displayedPlans : plans, sortValue);
            paginaAtual = 0;
            renderPlans(sortedPlans);
            sortSelect.querySelector('.selected-option').textContent = option.textContent;
            sortSelect.querySelector('.options').style.display = 'none';
        }
    });

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
            displayedPlans = data;
            renderPlans(plans);
        })
        .catch(error => {
            console.error('Erro ao carregar o JSON:', error);
        });

    window.renderPlans = renderPlans;
});
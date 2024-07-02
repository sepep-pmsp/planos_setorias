document.addEventListener("DOMContentLoaded", function () {
    const filterSelect = document.getElementById('filter');
    const sortSelect = document.getElementById('sort');
    const accordion = document.getElementById('accordion');
    const paginationDiv = document.getElementById('pagination');
    let plans = [];
  
    const itensPorPagina = 4; 
    let paginaAtual = 0; 
  
    function renderPlans(plans) {
        accordion.innerHTML = '';
        const startIndex = paginaAtual * itensPorPagina;
        const endIndex = Math.min(startIndex + itensPorPagina, plans.length);
        const planosPagina = plans.slice(startIndex, endIndex);
  
        planosPagina.forEach(plan => {
            const accordionItem = document.createElement('div');
            accordionItem.classList.add('accordion-item');
  
            const accordionHeader = document.createElement('div');
            accordionHeader.classList.add('accordion-header');
            accordionHeader.textContent = plan.Título;
  
            const accordionContent = document.createElement('div');
            accordionContent.classList.add('accordion-content');
  
            const resumo = plan.Resumo || '';
            const vigencia = plan.Início && plan.Fim ? `<p>Vigência: ${plan.Início} - ${plan.Fim}</p>` : '';
            const orgaoCoordenador = plan["Órgão Coordenador"] ? `<p>Órgão Responsável: ${plan["Órgão Coordenador"]}</p>` : '';
            const linkAcesso = plan["Link para Acesso"] ? `<p>Mais informações em: <a href="${plan["Link para Acesso"]}">${plan["Link para Acesso"]}</a></p>` : '';
  
            let imgSrc = '';
            if (plan.Sigla) {
                imgSrc = `/assets/images/img-plans/${plan.Sigla}.png`;
            } else if (plan.Título) {
                imgSrc = `/assets/images/img-plans/${plan.Título}.png`;
            }
            if (!imgSrc) {
                imgSrc = '/assets/images/img-plans/generic.png';
            }
  
            imgSrc = gen_url(imgSrc)
  
            accordionContent.innerHTML = `
                <div class="text-content">
                    <p>${resumo}</p>
                    ${vigencia}
                    ${orgaoCoordenador}
                    ${linkAcesso}
                </div>
                <div class="image-content">
                    <img src="${imgSrc}" alt="${plan.Título}">
                </div>
            `;
  
            accordionHeader.addEventListener('click', () => {
                const currentlyOpenContent = document.querySelector('.accordion-content.open');
                if (currentlyOpenContent && currentlyOpenContent !== accordionContent) {
                    currentlyOpenContent.classList.remove('open');
                }
                accordionContent.classList.toggle('open');
                accordionHeader.classList.toggle('open'); // Toggle 'open' class on header
            });
  
            accordionItem.appendChild(accordionHeader);
            accordionItem.appendChild(accordionContent);
            accordion.appendChild(accordionItem);
        });
  
        criarLinksPaginacao();
        criarControlesPaginacao();
    }
    
    function criarControlesPaginacao() {
      paginationDiv.innerHTML = '';
  
      const numeroDePaginas = Math.ceil(plans.length / itensPorPagina);
      const firstPageLink = document.createElement('span');
      firstPageLink.textContent = '<<';
      firstPageLink.classList.add('pagination-control'); 
      firstPageLink.addEventListener('click', () => {
          if (paginaAtual !== 0) {
              paginaAtual = 0;
              renderPlans(plans);
              atualizarLinksAtivos();
          }
      });
      paginationDiv.appendChild(firstPageLink);
      const prevPageLink = document.createElement('span');
      prevPageLink.textContent = '<';
      prevPageLink.classList.add('pagination-control'); 
      prevPageLink.addEventListener('click', () => {
          if (paginaAtual > 0) {
              paginaAtual--;
              renderPlans(plans);
              atualizarLinksAtivos();
          }
      });
      paginationDiv.appendChild(prevPageLink);
  
      // Links numéricos das páginas
      for (let i = 0; i < numeroDePaginas; i++) {
          const link = document.createElement('span');
          link.textContent = i + 1;
          link.classList.add('pagination-number'); 
  
          if (i === paginaAtual) {
              link.classList.add('active');
          }
  
          link.addEventListener('click', (function(pagina) {
              return function() {
                  paginaAtual = pagina;
                  renderPlans(plans);
                  atualizarLinksAtivos();
              };
          })(i));
  
          paginationDiv.appendChild(link);
      }
      const nextPageLink = document.createElement('span');
      nextPageLink.textContent = '>';
      nextPageLink.classList.add('pagination-control'); 
      nextPageLink.addEventListener('click', () => {
          if (paginaAtual < numeroDePaginas - 1) {
              paginaAtual++;
              renderPlans(plans);
              atualizarLinksAtivos();
          }
      });
      paginationDiv.appendChild(nextPageLink);
      const lastPageLink = document.createElement('span');
      lastPageLink.textContent = '>>';
      lastPageLink.classList.add('pagination-control'); 
      lastPageLink.addEventListener('click', () => {
          if (paginaAtual !== numeroDePaginas - 1) {
              paginaAtual = numeroDePaginas - 1;
              renderPlans(plans);
              atualizarLinksAtivos();
          }
      });
      paginationDiv.appendChild(lastPageLink);
    }
  
    function atualizarLinksAtivos() {
        const links = paginationDiv.querySelectorAll('.pagination-link');
        links.forEach((link, index) => {
            if (index === paginaAtual) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
  
    function criarLinksPaginacao() {
      paginationDiv.innerHTML = '';
      const numeroDePaginas = Math.ceil(plans.length / itensPorPagina);
  
      for (let i = 0; i < numeroDePaginas; i++) {
          const link = document.createElement('span');
          link.textContent = i + 1;
          link.classList.add('pagination-number'); 
  
          if (i === paginaAtual) {
              link.classList.add('active');
          }
  
          link.addEventListener('click', (function(pagina) {
              return function() {
                  paginaAtual = pagina;
                  renderPlans(plans);
                  atualizarLinksAtivos();
              };
          })(i));
  
          paginationDiv.appendChild(link);
      }
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
        return plans.sort((a, b) => {
            if (sort === 'recent') {
                return new Date(b.Início) - new Date(a.Início);
            } else if (sort === 'oldest') {
                return new Date(a.Início) - new Date(b.Início);
            } else if (sort === 'az') {
                return a.Título.localeCompare(b.Título);
            } else if (sort === 'za') {
                return b.Título.localeCompare(a.Título);
            }
        });
    }
  
    filterSelect.addEventListener('click', function (e) {
        const options = filterSelect.querySelector('.options');
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });
  
    filterSelect.addEventListener('click', function (e) {
        const option = e.target.closest('li');
        if (option) {
            const filterValue = option.getAttribute('data-value');
            const filteredPlans = filterPlans(plans, filterValue);
            renderPlans(filteredPlans);
            filterSelect.querySelector('.selected-option').textContent = option.textContent;
            filterSelect.querySelector('.options').style.display = 'none';
        }
    });
  
    sortSelect.addEventListener('click', function (e) {
        const options = sortSelect.querySelector('.options');
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });
  
    sortSelect.addEventListener('click', function (e) {
        const option = e.target.closest('li');
        if (option) {
            const sortValue = option.getAttribute('data-value');
            const sortedPlans = sortPlans(plans, sortValue);
            renderPlans(sortedPlans);
            sortSelect.querySelector('.selected-option').textContent = option.textContent;
            sortSelect.querySelector('.options').style.display = 'none';
        }
    });
    
    var achajson = gen_url ('/assets/Json/excel_to_.json')
    fetch(achajson)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            plans = data;
            renderPlans(plans);
        })
        .catch(error => {
            console.error('Erro ao carregar o JSON:', error);
        });
  });
  
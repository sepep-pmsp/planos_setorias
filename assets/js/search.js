document.addEventListener("DOMContentLoaded", function () {
    const searchBox = document.querySelector('.input-search');
    const accordion = document.getElementById('accordion');
    let plans = [];

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
            renderPlans(plans); // Render all plans initially
        })
        .catch(error => {
            console.error('Erro ao carregar o JSON:', error);
        });

    searchBox.addEventListener('input', function () {
        const searchTerm = searchBox.value.toLowerCase();
        const filteredPlans = plans.filter(plan => plan.Título.toLowerCase().includes(searchTerm));
        renderPlans(filteredPlans);
    });
});

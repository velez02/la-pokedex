const API_BASE = 'https://pokeapi.co/api/v2/';
const PAGE_LIMIT = 20;

let offset = 0;
let totalCount = 0;

const cardsRow = document.getElementById('cardsRow');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');
const btnSearch = document.getElementById('btnSearch');
const searchInput = document.getElementById('searchInput');
const btnRandom = document.getElementById('btnRandom');

const pokeModal = new bootstrap.Modal(document.getElementById('pokeModal'));
const pokeModalTitle = document.getElementById('pokeModalTitle');
const pokeSprite = document.getElementById('pokeSprite');
const typeBadges = document.getElementById('typeBadges');
const abilitiesEl = document.getElementById('abilities');
const statsEl = document.getElementById('stats');
const movesEl = document.getElementById('moves');
const heightWeight = document.getElementById('heightWeight');
const openOnPoke = document.getElementById('openOnPoke');

function capitalizar(s){ return s ? s[0].toUpperCase()+s.slice(1):''; }
async function cargarLista(off = 0){
    cardsRow.innerHTML = '<div class="text-center w-100 py-5 text-muted">Cargando...</div>';
    try {
        const res = await fetch(`${API_BASE}/pokemon?limit=${PAGE_LIMIT}&offset=${off}`);
        const data = await res.json();
        totalCount = data.count;
        renderLista(data.results);
        pageInfo.textContent = `Mostrando ${off + 1} - ${Math.min(off + PAGE_LIMIT, totalCount)} de ${totalCount}`;
        prevBtn.disabled = off === 0;
        nextBtn.disabled = off + PAGE_LIMIT >= totalCount;
    } catch (err) {
        console.error(err);
        cardsRow.innerHTML = '<div class="text-center w-100 py-5 text-danger">Error al cargar la lista.</div>';
    }
}

async function renderLista(results) {
    cardsRow.innerHTML = '';
    const detailsPromises = results.map(r => fetch(r.url).then(res => res.json()).catch(()=>null));
    const details = await Promise.all(detailsPromises);

    details.forEach(pokemon => {
        if(!detail) return;
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-md-4 col-lg-3';

        const typesHtml = detail.types.map(t => `<span class="badge bg-secundary type-badge">${capitalizar(t.type.name)}</span>`).join(' ');

        col.innerHTML = `
        <div class="card pokemon-card h-100" data-name="${detail.name}">
            <div class="card-body d-flex align-items-center">
                <img src="${detail.sprites.front_default || ''}" alt="${detail.name}" class="me-3 sprite">
                <div>
                    <h5 class="card-title mb-1">${capitalizar(detail.name)}<small class="text-muted">${typesHtml}</small></h5>
                    <div>${typesHtml}</div>
                </div>
            </div>
        </div>
        `;
        col.querySelector('.pokemon-card').addEventListener('click', () => abrirPokemon(detail.name));
        cardsRow.appendChild(col);
    });
}

async function abrirPokemon(nombreOId) {
    try {
        const res = await fetch(`${API_BASE}/pokemon/${encodeURIComponent(nombreOId.toString().toLowerCase())}`);
        if (!res.ok) {
            alert('Pokémon no encontrado.');
            return;
    }
    const p = await res.json();
    mostrarPokemon(p);
} catch (err) {
    console.error(err);
    alert('Error al cargar Pokémon.');
}
}

function mostrarPokemon(p) {
    pokeModalTitle.textContent = `${capitalizar(p.name)} - #${p.id}`;
    pokeSprite.src = p.sprites.other?.['officioal-artwork']?.front_default || p.sprites.front_default || '';
    typeBadges.innerHTML = p.types.map(t => `<span class="badge bg-info text-dark type-badge">${capitalizar(t.type.name)}</span>`).join(' ');

}
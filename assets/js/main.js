const pokemonList = document.querySelector('#pokemonList');
const overlay = document.getElementById('overlay');
const loadMoreButton = document.getElementById('loadMoreButton');

const limit = 12;
let offset = 0;
const maxRecords = 102;

loadPokemonItens(offset, limit);

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons
      .map(pokemon => `
        <li class="ol__li--list ${pokemon.type}" data-pokemon-number="${pokemon.number}">
          <span class="number">#${pokemon.number}</span>
          <span class="name">${pokemon.name}</span>
          <div class="details">
            <ol class="types">
              ${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
          </div>
        </li>
      `)
      .join('');
    pokemonList.innerHTML += newHtml;
  });
}

// Função para carregar mais itens ao clicar no botão "Load More"
loadMoreButton.addEventListener('click', () => {
  offset += limit;
  const qtdRecordNextPage = offset + limit;

  if (qtdRecordNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

// Função para exibir os detalhes do Pokémon no overlay
function showCard(pokemon) {
  overlay.querySelector('.name__overlay').innerText = pokemon.name;
  overlay.querySelector('.number__overlay').innerText = `#${pokemon.number}`;
  overlay.querySelector('.type__overlay').innerText = pokemon.types[0];
  overlay.querySelector('.type2__overlay').innerText = pokemon.types[1] || '';
  overlay.querySelector('.img__overlay').src = pokemon.photo;
  overlay.querySelector('.Species__status span').innerText = pokemon.species;
  overlay.querySelector('.Height__status span').innerText = pokemon.height;
  overlay.querySelector('.Weight__status span').innerText = pokemon.weight;
  overlay.querySelector('.Abilities__status span').innerText = pokemon.abilities;

  // Exibe o overlay
  overlay.classList.add('open--overlay');
}

// Adiciona um evento de clique para cada item da lista de Pokémon
pokemonList.addEventListener('click', (event) => {
  const pokemonItem = event.target.closest('li[data-pokemon-number]');

  if (pokemonItem) {
    const pokemonNumber = pokemonItem.getAttribute('data-pokemon-number');
    pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}` })
      .then(showCard);
  }
});

// Fecha o overlay ao clicar fora dele
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    overlay.classList.remove('open--overlay');
  }
});

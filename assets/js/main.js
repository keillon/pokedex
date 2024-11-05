const pokemonList = document.querySelector('#pokemonList');
const overlay = document.getElementById('overlay');
const loadMoreButton = document.getElementById('loadMoreButton');
const details = document.querySelector('.content-details');
const close = document.querySelector('.imgClose');

const limit = 12;
let offset = 0;
const maxRecords = 102;

const typeColors = {
  grass: '#78C850',
  fire: '#F08030',
  water: '#6890F0',
  bug: '#A8B820',
  normal: '#A8A878',
  poison: '#A040A0',
  electric: '#F8D030',
  ground: '#E0C068',
  fairy: '#EE99AC',
  fighting: '#C03028',
  psychic: '#F85888',
  rock: '#B8A038',
  ghost: '#705898',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  flying: '#A890F0'
  // Adicione mais tipos conforme necessário
}


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
function showCard (pokemon) {
  overlay.querySelector('.name__overlay').innerText = pokemon.name
  overlay.querySelector('.number__overlay').innerText = `#${pokemon.number}`

  // Atualiza os tipos de Pokémon no overlay de forma dinâmica
  overlay.querySelector('.details__overlay .ol__details--overlay').innerHTML = `
    ${pokemon.types
      .map(type => `<li class="type ${type}">${type}</li>`)
      .join('')}
  `

  overlay.querySelector('.img__overlay').src = pokemon.photo
  overlay.querySelector('.Species__status span').innerText = pokemon.species
  overlay.querySelector('.Height__status span').innerText = pokemon.height
  overlay.querySelector('.Weight__status span').innerText = pokemon.weight
  overlay.querySelector('.Abilities__status span').innerText = pokemon.abilities

  // Define a cor de fundo do overlay com base no tipo principal do Pokémon
  const primaryType = pokemon.type
  details.style.backgroundColor = typeColors[primaryType] || '#fff' // Default para branco caso não haja cor definida
  
  // Exibe o overlay
  overlay.classList.add('open--overlay')
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
  if (event.target === close) {
    overlay.classList.remove('open--overlay');
  }
  
});

// Fecha o overlay ao clicar fora dele
overlay.addEventListener('click', (event) => {
  if (event.target === overlay) {
    overlay.classList.remove('open--overlay');
  }
  
});

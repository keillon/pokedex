
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const overlay = document.getElementById('overlay')
const nameOverlay = document.querySelector('.name__overlay')
const liList = document.querySelector('.ol__li--list')


const limit = 12
let offset = 0
const maxRecords = 102
loadPokemonItens(offset, limit)

function loadPokemonItens (offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map((pokemon) => `
<li class="ol__li--list ${pokemon.type}">
<span class="number">#${pokemon.number}</span>
<span class="name">${pokemon.name}</span>
<div class="details">
<ol class="types">
${pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('')}
</ol>
<img src="${pokemon.photo}" 
alt="${pokemon.name}">
</div>
</li>
`
      )
      .join('')
    pokemonList.innerHTML += newHtml
  
  })
}

loadMoreButton.addEventListener('click', () => {
  offset += limit

  const qtdRecordNextPage = offset + limit

  if (qtdRecordNextPage >= maxRecords) {
    const newLimite = maxRecords - offset
    loadPokemonItens(offset, newLimite)
    loadMoreButton.parentElement.removeChild(loadMoreButton)
  } else {
    loadPokemonItens(offset, limit)
  }
})





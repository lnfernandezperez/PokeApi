let container = document.querySelector(".pokemons");
let navigation = document.querySelector(".navigation");
let search = document.querySelector(".buscador");

let pokemons = [];
const pokeUrl = "https://pokeapi.co/api/v2/";
let prevLink = "";
let nextLink = "";
let perPage = 25;
let currentPage = 0;

const changePg = (value) => {
  let newUrl = `${pokeUrl}pokemon?limit=${value}`;
  perPage = value;
  getPokemons(newUrl);
};

const prev = () => {
  if (prevLink) {
    getPokemons(prevLink);
  }
};

const next = () => {
  if (nextLink) {
    getPokemons(nextLink);
  }
};

const getPokemons = (url) => {
  let params = new URLSearchParams(url.split("?")[1]);
  let offset = params.get("offset") || 0;
  currentPage = offset / perPage;

  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      prevLink = responseJson.previous;
      nextLink = responseJson.next;
      showPokemons(responseJson.results);
      updateNavigationButtons();
    });
};

const showPokemons = (array) => {
  clearContainer();
  const promises = array.map((item) =>
    fetch(item.url).then((response) => response.json())
  );

  Promise.all(promises)
    .then((results) => {
      results.forEach((data) => {
        loadCard(data);
      });
    })
    .catch((error) => {
      console.error("Error al cargar los Pokémon: ", error);
    });
};

const loadCard = (data) => {
  const image = data.sprites.other.home.front_default;
  const types = data.types;
  const type = types.map((types) => {
    return types.type.name;
  });
  let newImage = image ? image : "/images/default.png";
  let card = document.createElement("div");
  card.classList.add("pokemon");
  let content = `
        <img src="${newImage}" alt="${data.name}" class="imgPoke">
        <p>${data.name}</p>
        <p class="tipos"> ${type}</p>
    `;
  card.innerHTML = content;
  container.appendChild(card);
};

const clearContainer = () => (container.innerHTML = "");

const updateNavigationButtons = () => {
  navigation.innerHTML = `
        <button onclick="prev()" ${!prevLink ? "disabled" : ""}>Back</button>
        <button onclick="next()" ${!nextLink ? "disabled" : ""}>Next</button>
    `;
};

const searchPokemon = (url = `${pokeUrl}pokemon?limit=${perPage}&offset=0`) => {
  let searchTerm = search.value.trim().toLowerCase();

  if (searchTerm === "") {
    getPokemons(`${pokeUrl}pokemon?offset=0&limit=25`);
    return;
  }

  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      prevLink = responseJson.previous;
      nextLink = responseJson.next;
      let filteredPokemons = responseJson.results.filter((pokemon) =>
        pokemon.name.includes(searchTerm)
      );

      if (filteredPokemons.length > 0) {
        showPokemons(filteredPokemons);
        updateNavigationButtons();
      } else {
        console.error("No se encontro el pokemon que buscaba");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

search.addEventListener("input", () => searchPokemon());
getPokemons(`${pokeUrl}pokemon?offset=0&limit=25`);

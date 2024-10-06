let container = document.querySelector(".pokemons");

const pokeUrl = "https://pokeapi.co/api/v2/pokemon/";
let = nextLink = "";
let = prevLink = "";

const prev = () => {
  getPokemons(prevLink);
};
const next = () => {
  getPokemons(nextLink);
};
const getPokemons = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      nextLink = responseJson.next;
      prevLink = responseJson.previous;
      showPokemons(responseJson.results);
    });
};
const showPokemons = (array) => {
  clearContainer();
  array.map((item) => {
    fetch(item.url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        loadCard(data);
      });
  });
};

const loadCard = (data) => {
  const image = data.sprites.other["official-artwork"].front_default;
  const name = data.name;
  const types = data.types;
  const type = types.map((types) => {
    return types.type.name;
  });

  let card = document.createElement("div");
  card.classList.add("pokemon");
  let content = `
    <img src="${image}" alt="${name}">
    <p>${name}</p>
    <p>${type}</p>
    `;
  card.innerHTML = content;
  container.appendChild(card);
};
const clearContainer = () => (container.innerHTML = "");
getPokemons(`${pokeUrl}?offset=0&limit=25`);

let pokemonRepository = (function () {
  let pokemonList = [];
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
  let entryNo = 1; //easier to increment variable than call details for pokedex id

  function getAll() {
    return pokemonList;
  }

  function toggleLoadingMessage() {
    const loader = document.querySelector('.loader');
    loader.classList.toggle('is-active');
  }

  //Build document structure for Pokedex list
  function addListItem(pokemon) {
    const pokedexList = document.querySelector('.pokedex-list');
    const listItem = document.createElement('li');
    const button = document.createElement('button');

    //Generate each Pokemon entry
    button.innerText = pokemon.entry + ' ' + pokemon.name;
    button.classList.add(
      'pokemon-name',
      'pokedex-list__item',
      'list-group-item',
      'list-group-item-action',
      'mb-2'
    );
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#pokemon-modal');
    button.addEventListener('click', function () {
      showDetails(pokemon);
    });

    //Generate list structure
    listItem.appendChild(button);
    pokedexList.appendChild(listItem);
  }

  //Display detail modal for selected Pokemon
  function showDetails(pokemon) {
    //Hide modal while fetching details from PokeAPI
    const modal = document.querySelector('.modal');
    modal.classList.add('invisible');

    loadDetails(pokemon).then(function () {
      const modalTitle = document.querySelector('.modal-title');
      const modalBody = document.querySelector('.modal-body');
      modalBody.classList.add('pb-2');
      const modalFooter = document.querySelector('.modal-footer');

      //Clear existing modal
      modalTitle.innerHTML = '';
      modalBody.innerHTML = '';
      modalFooter.innerHTML = '';

      //Build modal by section
      const pokePortrait = document.createElement('img');
      pokePortrait.classList.add('modal__image', 'col-4', 'p-0', 'mx-auto');
      pokePortrait.src = pokemon.imageUrl;
      pokePortrait.setAttribute(
        'alt',
        'A "high resolution" sprite of ' + pokemon.name
      );

      const modalDetails = document.createElement('div');
      modalDetails.classList.add(
        'modal__details',
        'col-sm-8',
        'p-sm-0',
        'text-center'
      );

      const pokemonName = document.createElement('h1');
      pokemonName.classList.add('modal__details--item');
      pokemonName.innerHTML = pokemon.name;

      const pokemonSpeciesType = document.createElement('p');
      pokemonSpeciesType.classList.add(
        'modal__details--item',
        'mb-2',
        'mb-sm-3'
      );
      pokemonSpeciesType.innerHTML = pokemon.speciesType;

      const pokemonWeight = document.createElement('p');
      pokemonWeight.classList.add('modal__details--item', 'mb-2', 'mb-sm-3');
      pokemonWeight.innerHTML = 'Height: ' + pokemon.height + 'm';

      const pokemonHeight = document.createElement('p');
      pokemonHeight.classList.add('modal__details--item', 'mb-2', 'mb-sm-3');
      pokemonHeight.innerHTML = 'Weight: ' + pokemon.weight + 'kg';

      const pokemonType = document.createElement('p');
      pokemonType.classList.add(
        'pokemon-type',
        'modal__details--item',
        'mb-2',
        'mb-sm-3'
      );
      pokemonType.innerHTML = pokemon.types;

      const pokemonDescription = document.createElement('p');
      pokemonDescription.classList.add('modal__description');
      pokemonDescription.innerHTML = pokemon.flavorText;

      //Build modal structure
      modalTitle.innerHTML = pokemon.name;
      modalDetails.append(
        pokemonSpeciesType,
        pokemonHeight,
        pokemonWeight,
        pokemonType
      );
      modalBody.append(pokePortrait, modalDetails);
      modalFooter.append(pokemonDescription);
      modal.classList.remove('invisible');
    });
  }

  //Search by Pokemon name
  function find() {
    const searchInput = document
      .querySelector('#search-bar')
      .value.toUpperCase();
    const fullList = document.querySelectorAll('.pokedex-list__item');

    fullList.forEach(function (entry) {
      if (entry.innerText.toUpperCase().indexOf(searchInput) > -1) {
        entry.style.display = '';
      } else {
        entry.style.display = 'none';
      }
    });
  }

  //Load entries from PokeAPI
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            entry: (entryNo++).toString().padStart(3, '0'), //add leading zeros
            name: item.name,
            detailsUrl: item.url,
          };

          pokemonList.push(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //Load entry details from PokeAPI
  function loadDetails(pokemon) {
    toggleLoadingMessage();
    let url = pokemon.detailsUrl;

    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        //Convert types to comma separated string
        let rawTypes = [];
        details.types.forEach(function (pokemon) {
          rawTypes.push(pokemon.type.name);
        });

        let types = rawTypes.join(', ');

        //Build object with additional details
        pokemon.imageUrl = details.sprites.front_default;
        pokemon.height = details.height / 10; //converted from dm to m
        pokemon.weight = details.weight / 10; //converted from hg to kg
        pokemon.types = types;

        //Fetch further detail from Pokemon species url
        return fetch(details.species.url);
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        //Filter for English flavor text from Pokemon Red
        const rawFlavorText = details.flavor_text_entries.filter(function (
          pEntry
        ) {
          if (pEntry.language.name === 'en' && pEntry.version.name === 'red') {
            return true;
          }
        });

        //Grab string and remove special characters
        const flavorText = rawFlavorText[0].flavor_text.replace(
          /[\n\f]+/g,
          ' '
        );

        //Add final details to pokemon object
        pokemon.speciesType = details.genera[7].genus;
        pokemon.flavorText = flavorText;

        toggleLoadingMessage();
      })
      .catch(function (e) {
        console.error(e);
        toggleLoadingMessage();
      });
  }

  return {
    getAll: getAll,
    addEventListener: addEventListener,
    addListItem: addListItem,
    showDetails: showDetails,
    find: find,
    loadList: loadList,
    loadDetails: loadDetails,
  };
})();

//Iterate through each Pokemon in our database and generate list
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});

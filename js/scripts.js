let pokemonRepository = (function() {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
    let modalContainer = document.querySelector('#modal-container');

    function getAll() {
        return pokemonList;
    }
    
    function hideDetails() {
        modalContainer.classList.remove('is-visible');
    }

    function toggleLoadingMessage() {
        let loader = document.querySelector('.loader');
        loader.classList.toggle('is-active');
    }

    function addEventListener(button, pokemon) {
        button.addEventListener('click', function() {
            showDetails(pokemon);
        });
    }

    //Build document structure for Pokedex list
    function addListItem(pokemon) {
        let pokedexList = document.querySelector('ul');
        let listItem = document.createElement('li');
        let button = document.createElement('button');

        //Generate each Pokemon entry
        button.innerText = pokemon.name;
        button.classList.add('pokedex-list__item');
        addEventListener(button, pokemon);

        //Generate list structure
        listItem.appendChild(button);
        pokedexList.appendChild(listItem);
    }

    //Display detail modal for selected Pokemon
    function showDetails(pokemon) {
        loadDetails(pokemon).then(function() {
            //Clear existing modal
            modalContainer.innerHTML = '';
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    hideDetails();
                }
            });

            //Generate modal
            let modal = document.createElement('div');
            modal.classList.add('modal');

            //Generate content for modal
            let closeButtonElement = document.createElement('button');
            closeButtonElement.classList.add('modal__close', 'top-right');
            closeButtonElement.innerHTML = '✕';
            closeButtonElement.addEventListener('click', () => {
                hideDetails();
            })

            let pokePortrait = document.createElement('img');
            pokePortrait.classList.add('modal__image');
            pokePortrait.src = pokemon.imageUrl;

            let modalDetails = document.createElement('div');
            modalDetails.classList.add('modal__details');

            let pokemonName = document.createElement('h1');
            pokemonName.classList.add('modal__details--item');
            pokemonName.innerHTML = pokemon.name;

            let pokemonSpeciesType = document.createElement('p');
            pokemonSpeciesType.classList.add('modal__details--item');
            pokemonSpeciesType.innerHTML = pokemon.speciesType;

            let pokemonWeight = document.createElement('p');
            pokemonWeight.classList.add('modal__details--item');
            pokemonWeight.innerHTML = `Height: ${pokemon.height}m`;

            let pokemonHeight = document.createElement('p');
            pokemonHeight.classList.add('modal__details--item');
            pokemonHeight.innerHTML = `Weight: ${pokemon.weight}kg`;

            let pokemonType = document.createElement('p');
            pokemonType.classList.add('modal__details--item');
            pokemonType.innerHTML = pokemon.types;

            let pokemonDescription = document.createElement('p');
            pokemonDescription.classList.add('modal__description');
            pokemonDescription.innerHTML = pokemon.flavorText;

            //Build modal structure

            modalDetails.append(pokemonName, pokemonSpeciesType, pokemonHeight, pokemonWeight, pokemonType)
            modal.append(closeButtonElement, pokePortrait, modalDetails, pokemonDescription);
            modalContainer.append(modal);

            //Visibility
            modalContainer.classList.add('is-visible');

            //Esc key functionality
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
                    hideDetails();
                }
            });
        });
    }

    //Build pokemonList array
    function addEntry(pokemon) {
        if (typeof(pokemon) === 'object') {
            //No longer necessary due to implementation of API, preserving for posterity
            //------
            //Store the object keys template as well as the requested entry
            // let pokeKeys = Object.keys(pokemonList[0]);
            // let entryKeys = Object.keys(pokemon);

            // //Create array of entries not included in template
            // const match = pokeKeys.filter((key) => !entryKeys.includes(key));

            // if (match.length === 0) {
            //    pokemonList.push(pokemon);
            //}
            pokemonList.push(pokemon);
        } else {
            return console.log('Pokemon entered is not properly formatted as an object');
        }
    }

    //Search by Pokemon name
    function find(pokemonSearch) {
       return pokemonList.filter(pokemon => pokemon.name === pokemonSearch);
    }

    //Capitalize each Pokemon's name
    function toProperCase(name) {
        return name[0].toUpperCase() + name.substring(1);
    }

    //Load entries from PokeAPI
    function loadList() {

        return fetch(apiUrl).then(function(response) {
            return response.json();
        }).then(function(json) {
            json.results.forEach(function(item) {
                let pokemon = {
                    name: toProperCase(item.name),
                    detailsUrl: item.url
                };

                addEntry(pokemon);
            });
        }).catch(function(e) {
            console.error(e);
        });
    }

    //Load entry details from PokeAPI
    function loadDetails(pokemon) {
        toggleLoadingMessage();
        let url = pokemon.detailsUrl;

        return fetch(url).then(function(response) {
            return response.json();
        }).then(function(details) {
            //Convert types to comma separated string
            let rawTypes = []
            details.types.forEach( pokemon => {
                rawTypes.push(toProperCase(pokemon.type.name));
            });

            let types = rawTypes.join(', ');

            //Build object with additional details
            pokemon.entry = details.id.toString().padStart(3, '0'); //add leading zeroes
            pokemon.imageUrl = details.sprites.front_default;
            pokemon.height = details.height/10; //converted from dm to m
            pokemon.weight = details.weight/10; //converted from hg to kg
            pokemon.types = types;

            //Fetch further detail from Pokemon species url
            return fetch(details.species.url);
        }).then(function(response) {
            return response.json();
        }).then(function(details) {
            //Filter for English flavor text from Pokemon Red
            let rawFlavorText = details.flavor_text_entries
                .filter( pEntry => (pEntry.language.name === 'en') && (pEntry.version.name === 'red'));

            //Grab string and remove special characters    
            let flavorText = rawFlavorText[0].flavor_text.replace(/[\n\f]+/g, " ");

            //Add final details to pokemon object
            pokemon.speciesType = details.genera[7].genus;
            pokemon.flavorText = flavorText;

            toggleLoadingMessage();
        })
        .catch(function(e) {
            console.error(e);
            toggleLoadingMessage();
        });

    }

    return {
        getAll: getAll,
        addEventListener: addEventListener,
        addListItem: addListItem,
        showDetails: showDetails,
        addEntry: addEntry,
        find: find,
        toProperCase: toProperCase,
        loadList: loadList,
        loadDetails: loadDetails
    };
})();

//Iterate through each Pokemon in our database and generate list
pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});


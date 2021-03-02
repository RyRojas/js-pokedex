let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
    let entryNo = 1; //easier to increment variable than call details for pokedex id

    function getAll() {
        return pokemonList;
    }

    function toggleLoadingMessage() {
        let loader = document.querySelector('.loader');
        loader.classList.toggle('is-active');
    }

    function addEventListener(button, pokemon) {
        button.addEventListener('click', function () {
            showDetails(pokemon);
        });
    }

    //Build document structure for Pokedex list
    function addListItem(pokemon) {
        let pokedexList = document.querySelector('.pokedex-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');

        //Generate each Pokemon entry
        button.innerText = `${pokemon.entry} ${pokemon.name}`;
        button.classList.add('pokedex-list__item', 'list-group-item', 'list-group-item-action');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#pokemon-modal');
        addEventListener(button, pokemon);

        //Generate list structure
        listItem.appendChild(button);
        pokedexList.appendChild(listItem);
    }

    //Display detail modal for selected Pokemon
    function showDetails(pokemon) {

        //Hide modal while fetching details from PokeAPI
        let modal = document.querySelector('.modal');
        modal.classList.add('invisible');
        
        loadDetails(pokemon).then(function () {
            let modalTitle = document.querySelector('.modal-title');
            let modalBody = document.querySelector('.modal-body');
            let modalFooter = document.querySelector('.modal-footer');
            
            //Clear existing modal
            modalTitle.innerHTML = '';
            modalBody.innerHTML = '';
            modalFooter.innerHTML = '';

            let pokePortrait = document.createElement('img');
            pokePortrait.classList.add('modal__image', 'col-4');
            pokePortrait.src = pokemon.imageUrl;

            let modalDetails = document.createElement('div');
            modalDetails.classList.add('modal__details', 'col-8');

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
            modalTitle.innerHTML = pokemon.name;
            modalDetails.append(pokemonSpeciesType, pokemonHeight, pokemonWeight, pokemonType);
            modalBody.append(pokePortrait, modalDetails);
            modalFooter.append(pokemonDescription);
            modal.classList.remove('invisible');
        });
    }

    //Search by Pokemon name
    function find(pokemonSearch) {
        return pokemonList.filter(pokemon => pokemon.name === pokemonSearch);
    }

    //Capitalize each Pokemon's name
    function toProperCase(name) {
        let splitName = name.replace(/-/g, " ").split(" ");

        for (let i = 0; i < splitName.length; i++) {
            splitName[i] = splitName[i][0].toUpperCase() + splitName[i].substring(1);
        }

        return splitName.join(" ");
    }

    //Load entries from PokeAPI
    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    entry: (entryNo++).toString().padStart(3, '0'), //add leading zeros 
                    name: toProperCase(item.name),
                    detailsUrl: item.url
                };

                pokemonList.push(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        });
    }

    //Load entry details from PokeAPI
    function loadDetails(pokemon) {
        toggleLoadingMessage();
        let url = pokemon.detailsUrl;

        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            //Convert types to comma separated string
            let rawTypes = []
            details.types.forEach(pokemon => {
                rawTypes.push(toProperCase(pokemon.type.name));
            });

            let types = rawTypes.join(', ');

            //Build object with additional details
            pokemon.imageUrl = details.sprites.front_default;
            pokemon.height = details.height / 10; //converted from dm to m
            pokemon.weight = details.weight / 10; //converted from hg to kg
            pokemon.types = types;

            //Fetch further detail from Pokemon species url
            return fetch(details.species.url);
        }).then(function (response) {
            return response.json();
        }).then(function (details) {
            //Filter for English flavor text from Pokemon Red
            let rawFlavorText = details.flavor_text_entries
                .filter(pEntry => (pEntry.language.name === 'en') && (pEntry.version.name === 'red'));

            //Grab string and remove special characters    
            let flavorText = rawFlavorText[0].flavor_text.replace(/[\n\f]+/g, " ");

            //Add final details to pokemon object
            pokemon.speciesType = details.genera[7].genus;
            pokemon.flavorText = flavorText;

            toggleLoadingMessage();
        }).catch(function (e) {
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
        toProperCase: toProperCase,
        loadList: loadList,
        loadDetails: loadDetails
    };
})();

//Iterate through each Pokemon in our database and generate list
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});


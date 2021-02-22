let pokemonRepository = (function() {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function getAll() {
        return pokemonList;
    }
    
    function addEventListener(button, pokemon) {
        button.addEventListener('click', function() {
            showDetails(pokemon);
        });
    }

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

    function showDetails(pokemon) {
        loadDetails(pokemon).then(function() {
            console.log(pokemon);
        });
    }

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

    function find(pokemonSearch) {
       return pokemonList.filter(pokemon => pokemon.name === pokemonSearch);
    }

    function loadList() {
        return fetch(apiUrl).then(function(response) {
            return response.json();
        }).then(function(json) {
            json.results.forEach(function(item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };

                addEntry(pokemon);
            });
        }).catch(function(e) {
            console.error(e);
        })
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        
        return fetch(url).then(function(response) {
            return response.json();
        }).then(function(details) {
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.weight = details.weight;
            item.types = details.types;
        }).catch(function(e) {
            console.error(e);
        });
    }

    return {
        getAll: getAll,
        addEventListener: addEventListener,
        addListItem: addListItem,
        showDetails: showDetails,
        addEntry: addEntry,
        find: find,
        loadList: loadList,
        loadDetails: loadDetails
    }
})();

//Iterate through each Pokemon in our database and generate list
pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});


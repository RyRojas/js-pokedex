let pokemonRepository = (function() {
    let pokemonList = [
        {
            name: 'Bulbasaur',
            height: 0.7,
            type: ['grass', 'poison']
        },
        {
            name: 'Charmander',
            height: 0.6,
            type: ['fire']
        },
        {
            name: 'Squirtle',
            height: 0.5,
            type: ['water']
        },
        {
            name: 'Pikachu',
            height: 0.4,
            type: ['electric']
        }
    ];

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
        console.log(pokemon);
    }

    function addEntry(pokemon) {
        if (typeof(pokemon) === 'object') {
            //Store the object keys template as well as the requested entry
            let pokeKeys = Object.keys(pokemonList[0]);
            let entryKeys = Object.keys(pokemon);

            //Create array of entries not included in template
            const match = pokeKeys.filter((key) => !entryKeys.includes(key));

            if (match.length === 0) {
                pokemonList.push(pokemon);
            }
        } else {
            return console.log('Pokemon entered is not properly formatted as an object');
        }
    }

    function find(pokemonSearch) {
       return pokemonList.filter(pokemon => pokemon.name === pokemonSearch);
    }

    return {
        getAll: getAll,
        addEventListener: addEventListener,
        addListItem: addListItem,
        showDetails: showDetails,
        addEntry: addEntry,
        find: find
    }
})();

//Iterate through each Pokemon in our database and generate list
pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
});

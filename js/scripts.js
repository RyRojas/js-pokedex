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

    function add(pokemon) {
        if (typeof(pokemon) === 'object') {
            //Store the object keys for first object in array as well as the requested entry
            let pokeKeys = Object.keys(pokemonList[0])
            let entryKeys = Object.keys(pokemon)

            //Dummy variable to store results of conditional statement
            let match = null;
            //Iterate through both key arrays in order to compare them (switched back to for loop to match by index)
            for (let i = 0; i < pokeKeys.length; i++)
                if (pokeKeys[i] !== entryKeys[i]) {
                    match = false;
                    return console.log('Object properties do not match');
                } else {
                    match = true;
                }
            if (match) {
                return pokemonList.push(pokemon);
            }
        } else {
            return console.log('Pokemon entered is not an object')
        }
    }

    function find(pokemonSearch) {
       return pokemonList.filter(pokemon => pokemon.name === pokemonSearch);
    }

    return {
        getAll: getAll,
        add: add,
        find: find
    }
})();

//Iterate through each Pokemon in our list (now in forEach cinemascope)
pokemonRepository.getAll().forEach(function(pokemon) {
    //Initialize variable to build complete message, scope remains within block
    let pokemonJudgement = `${pokemon.name} (Height: ${pokemon.height}m)`;
    
    //Find the less short guys
    if (pokemon.height > 0.5) {
        pokemonJudgement = pokemonJudgement + ' - WOW! That\'s big. Well...it\'s not <b>too</b> short';
    }

    document.write(`${pokemonJudgement} <br>`);
});

//BLOCK TO TEST ADD FUNCTION
//---------------------------
// let x = {
//     name: 'Pokemon Man',
//     height: 1.2,
//     type: ['Normal']
// };
//
//pokemonRepository.add(x)

//BLOCK TO TEST SEARCH FUNCTION
//-----------------------------
//console.log(pokemonRepository.find('Squirtle'));
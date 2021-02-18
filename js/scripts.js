pokemonList = [
    {
        name: 'Bulbasaur',
        height: 0.7,
        type: ['grass', 'poison'],
    }, 
    {
        name: 'Charmander',
        height: 0.6,
        type: ['fire'],
    }, 
    {
        name: 'Squirtle',
        height: 0.5,
        type: ['water'],
    }, 
    {
        name: 'Pikachu',
        height: 0.4,
        type: ['electric'],
    },
];

//Iterate through each Pokemon in our list
for (let i = 0; i < pokemonList.length; i++) {

    //Initialize variable to build complete message, scope remians within loop block
    let pokemonJudgement = `${pokemonList[i].name} (Height: ${pokemonList[i].height}m)`;
    
    //Find the less short guys
    if (pokemonList[i].height > 0.5) {
        pokemonJudgement = pokemonJudgement + ' - WOW! That\'s big. Well...it\'s not <b>too</b> short';
    }

    document.write(`${pokemonJudgement} <br>`);
}
class starWars {
    // Extraimos somente o necessario para criar um starWars
    constructor({gender, hair_color, height, homeworld, mass, name, skin_color}) {
        this.gender = gender
        this.hair_color = hair_color
        this.height = height
        this.homeworld = homeworld
        this.mass = mass
        this.name = name
        this.skin_color = skin_color
    }
}

module.exports = starWars
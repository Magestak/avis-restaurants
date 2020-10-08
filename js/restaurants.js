class Restaurant {
    /**
     * Classe correspondant aux restaurants
     * @param { object } maCarte        // La map
     * @param { object } service        // Les services de l'API
     * @param { number } id             // L'identifiant du restaurant
     * @param { object } location       // La latitude et la longitude du restaurant
     * @param { string } name           // Le nom du restaurant
     * @param { string } address        // L'adresse du restaurant
     * @param { number } rating         // La note moyenne du restaurant
     * @param { object } photos         // Photo retourné par l'API du restaurant
     * @param { object } commentsJson   // Indique si le restaurant est à prendre dans la base JSON ou dans l'API
     */
    constructor(maCarte, service, id, location, name, address, rating, photos, commentsJson) {
        this.maCarte = maCarte;
        this.service = service;
        this.id = id;
        this.location = location;
        this.name = name;
        this.address = address;
        this.rating = rating;
        this.photos = photos;
        if (commentsJson != undefined) {
            this.commentsJson = commentsJson;
        }
    }

    /**
     * Crée et intègre les marqueurs des restaurants à la map
     * @return { object }
     */
    createMarker() {
        let that = this;
        let latLng = this.location;
        let titleInfo = `
        ${that.name}
        ${that.address}
        `;
        // TODO: personnalisation de l'icône à faire
        let marqueur = L.marker(latLng).addTo(that.maCarte);
        marqueur.bindPopup(titleInfo);
}

    // TODO: création de la méthode html pour apparition des infos sur la map.
}
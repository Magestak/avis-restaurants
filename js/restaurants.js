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
        let iconResto = L.icon({
            iconUrl: '../img/map-marker-alt-solid-red.png',
            iconSize: [25, 38],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
        });
        // TODO: personnalisation de l'icône à faire
        let marqueur = L.marker(latLng, {icon: iconResto}).addTo(that.maCarte);
        marqueur.bindPopup(titleInfo);
}
    /**
     * Crée la liste des restaurants affichés sur le côté de la map
     */
    // TODO: Méthode à finir
    initHtml() {
        let that = this;
        let a = 0;

        // On crée un clone de la structure HTML pour insérer chaque résultat obtenu
        let resultats = document.querySelector('.resultats').cloneNode(true);

        // On crée insère le nom dfu restaurant
        let nameResto = document.querySelector('.name-resto');
        nameResto.style.display = 'block';
        nameResto.textContent = `${that.name}`;

        // On ajoute l'adresse du restaurant
        let addressResto = document.querySelector('.address-resto');
        addressResto.style.display = 'block';
        addressResto.textContent = `${that.address}`;

        // rge la note moyenne du restaurant et la masque
        let noteResto = document.querySelector('.note-resto');
        let x = Math.round(that.rating);
        noteResto.textContent = `${x}`;
        noteResto.style.display = "none";

        // Affiche avant l'adresse le png de la note moyenne du restaurant
        let etoileResto = document.querySelector('.note-resto-img');
        etoileResto.style.display = 'block';
        if (x === 1) {etoileResto.src = "../img/1_star.png";}
        else if (x === 2) {etoileResto.src = "../img/2_stars.png";}
        else if (x === 3) {etoileResto.src = "../img/3_stars.png";}
        else if (x === 4) {etoileResto.src = "../img/4_stars.png";}
        else if (x === 5) {etoileResto.src = "../img/5_stars.png";}
        else {etoileResto.src = "../img/0_star.png";}
        let parentAddressResto = addressResto.parentNode;
        parentAddressResto.insertBefore(etoileResto, addressResto);

        // Charge avant la note moyenne une photo du restaurant et la masque
        var imageResto = document.createElement('img');
        imageResto.src = that.photos;
        imageResto.style.display = "none";
        let parentNoteResto = noteResto.parentNode;
        parentNoteResto.insertBefore(imageResto, noteResto);

        // Charge avant l' adresse du restaurant un bouton permettant de fermer les commentaires et le masque
        var closeCommentResto = document.createElement('img');
        closeCommentResto.className = "close";
        closeCommentResto.src = "../img/close.png";
        closeCommentResto.style.display = "none";
        parentAddressResto.insertBefore(closeCommentResto, addressResto);

        // Charge les commentaires provenant de l' API et les masques
        //resultats.style.height = "90px";
        //resultats.style.overflow = "hidden";






        // On insère les éléments crées dans le DOM
        let listRestaurants = document.getElementById('restaurants-list');
        listRestaurants.appendChild(resultats);

    }
}
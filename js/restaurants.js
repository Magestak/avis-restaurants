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

        // On crée une <div> pour accueillir le contenu HTML pour chaque restaurant
        let resultats = document.createElement('div');
        resultats.className = 'resultats';

        // On crée un élément <h3> pour le nom du restaurant
        let nameResto = document.createElement('h3');
        nameResto.className = 'name-resto';
        nameResto.textContent = `${that.name}`;

        // On ajoute l'adresse du restaurant
        let addressResto = document.createElement('h4');
        addressResto.className = 'address';
        addressResto.textContent = `${that.address}`;

        // Charge la note moyenne du restaurant et la masque
        let noteResto = document.createElement('p');
        let x = Math.round(that.rating);
        noteResto.className = 'note-resto';
        noteResto.textContent = `${x}`;
        noteResto.style.display = "none";

        // Affiche l'image des étoiles de la note moyenne du restaurant
        let etoileResto = document.createElement('img');
        etoileResto.className = 'note-resto-img';
        if (x === 1) {etoileResto.src = "../img/1_star.png";}
        else if (x === 2) {etoileResto.src = "../img/2_stars.png";}
        else if (x === 3) {etoileResto.src = "../img/3_stars.png";}
        else if (x === 4) {etoileResto.src = "../img/4_stars.png";}
        else if (x === 5) {etoileResto.src = "../img/5_stars.png";}
        else {etoileResto.src = "../img/0_star.png";}

        // Crée une <div> pour les commentaires
        let commentResto = document.createElement('div');
        commentResto.className = 'comment-resto';
        commentResto.style.display = 'none';

        // Crée les différents éléments de la <div> commentaires
        let commentInfoResto = document.createElement('p');
        commentInfoResto.className = 'comment-info-resto';
        let commentAuteurResto = document.createElement('p');
        commentAuteurResto.className = 'comment-auteur-resto';
        let commentaireResto = document.createElement('p');
        commentaireResto.className = 'comment-class-resto';
        let commentDateResto = document.createElement('p');
        commentDateResto.className = 'comment-date-resto';
        let commentImageResto = document.createElement('img');
        commentImageResto.className = 'comment-image-resto';
        let commentNoteResto = document.createElement('p');
        commentNoteResto.className = 'comment-note-resto';
        // On rattache les éléments crées à la <div> commentaires
        commentResto.appendChild(commentInfoResto);
        commentResto.appendChild(commentAuteurResto);
        commentResto.appendChild(commentaireResto);
        commentResto.appendChild(commentDateResto);
        commentResto.appendChild(commentImageResto);
        commentResto.appendChild(commentNoteResto);


        // Crée une balise <img> pour afficher une photo du restaurant et la masque
        let imageResto = document.createElement('img');
        imageResto.src = that.photos;
        imageResto.style.display = "none";

        // Crée une balise <img> permettant de fermer les commentaires et la masque
        let closeCommentResto = document.createElement('img');
        closeCommentResto.className = "close";
        closeCommentResto.src = "../img/close.png";
        closeCommentResto.style.display = "none";

        // Charge les commentaires provenant de l' API et les masques
        resultats.style.height = "120px";
        resultats.style.overflow = "hidden";







        // On insère les éléments crées dans le DOM
        let listRestaurants = document.getElementById('restaurants-list');
        resultats.appendChild(nameResto);
        resultats.appendChild(etoileResto);
        resultats.appendChild(closeCommentResto);
        resultats.appendChild(addressResto);
        resultats.appendChild(commentResto);
        resultats.appendChild(imageResto);
        resultats.appendChild(noteResto);
        listRestaurants.appendChild(resultats);

    }
}
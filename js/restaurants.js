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
     * @param { object } commentsJson   // Indique si le restaurant est à prendre dans la base JSON ou dans l'API
     */
    constructor(maCarte, service, id, location, name, address, rating, commentsJson) {
        this.maCarte = maCarte;
        this.service = service;
        this.id = id;
        this.location = location;
        this.name = name;
        this.address = address;
        this.rating = rating;
        if (commentsJson != undefined) {
            this.commentsJson = commentsJson;
        }
        this.photos = this.getUrl();
        this.resultats;
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
        let marqueur = L.marker(latLng, {icon: iconResto}).addTo(that.maCarte);
        marqueur.bindPopup(titleInfo);
}
    /**
     * Crée la liste des restaurants affichés sur le côté de la map
     */
    // TODO: Méthode à finir
    initHtml() {
        let that = this;

        // On crée une <div> pour accueillir le contenu HTML pour chaque restaurant
        this.resultats = document.createElement('div');
        this.resultats.className = 'resultats';

        // On crée un élément <h3> pour le nom du restaurant
        let nameResto = document.createElement('h3');
        nameResto.className = 'name-resto';
        nameResto.textContent = `${that.name}`;

        // On ajoute l'adresse du restaurant
        let addressResto = document.createElement('h4');
        addressResto.className = 'address';
        addressResto.textContent = `${that.address}`;

        // Charge la note moyenne du restaurant et la rend non visible
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

        // TODO: voir si sa place n'est pas plutôt dans getComments et si oui comment l'insérer dans "résultats" à la bonne place.
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
        ///////////////////////////////////////////////////////////////

        // Crée une balise <img> pour afficher une photo du restaurant et la rend non visible
        let imageResto = document.createElement('img');
        imageResto.src = that.photos;
        imageResto.style.display = "none";

        // Crée une balise <img> permettant de fermer les commentaires et la rend non visible
        let closeCommentResto = document.createElement('img');
        closeCommentResto.className = "close";
        closeCommentResto.src = "../img/close.png";
        closeCommentResto.style.display = "none";

        // Charge les commentaires provenant de l' API et les rend non visibles
        this.resultats.style.height = "120px";
        this.resultats.style.overflow = "hidden";

        // Crée un bouton d'exécution "modal" et le rend non visible
        let boutonAjoutCommentResto = document.createElement('button');
        boutonAjoutCommentResto.className = 'bouton-ajout-comment-resto';
        boutonAjoutCommentResto.setAttribute("onclick", "document.getElementById('myModal').style.display='block'");
        boutonAjoutCommentResto.textContent = "Ajouter un commentaire";
        boutonAjoutCommentResto.style.display = 'none';

        // "EventListener" sur le nom du restaurant qui permet l'affichage des éléments non visibles
        nameResto.addEventListener('click', function (e) {
            e.target.style.color = "#FC6354";
            that.resultats.style.backgroundColor = "#EFEEE4";
            that.resultats.style.height = "500px";
            that.resultats.style.overflow = "auto";

            // Affiche la photo du restaurant
            imageResto.style.display = 'block';

            // Affiche le bouton "close"
            closeCommentResto.style.display = 'block';

            // Affiche les commentaires de l'API
            that.getComments();

            // Affiche le bouton qui permet l' ajout de commentaire par l' utilisateur via l' ouverture d'une modal
            boutonAjoutCommentResto.style.display = 'block';

            // On écoute l'ouverture de la modale d'ajout de commentaires
            boutonAjoutCommentResto.addEventListener('click', function () {
                // On récupère le formulaire
                let formCommentResto = document.forms.commentaires;
                let boutonValidModalResto = document.getElementById('bouton-valid-modal-resto');

                // Pour activer le bouton d'envoi du formulaire, on s'assure que les input sont bien remplis
                if (formCommentResto.pseudo !== "") {
                        boutonValidModalResto.disabled = false;
                }

                // On écoute la validation du bouton d'envoi du formulaire
                boutonValidModalResto.addEventListener('submit', function (event) {
                    event.preventDefault();

                    if(typeof sessionStorage !='undefined') {
                        // On enregistre les données saisies par l'utilisateur par l'intermédiaire de "session storage"
                        sessionStorage.setItem('pseudo-comment-modal-resto', document.getElementById('pseudo-comment-modal-resto').value);
                        sessionStorage.setItem('comment-modal-resto', document.getElementById('comment-modal-resto').value);
                        sessionStorage.setItem('note-modal-resto', document.getElementById('note-modal-resto').value);

                        // On récupère les données stockées dans "session storage"
                        let pseudo = sessionStorage.getItem("pseudo-comment-modal-resto");
                        let commentaire = sessionStorage.getItem("comment-modal-resto");
                        let note = sessionStorage.getItem("note-modal-resto");

                        // Création du nouveau commentaire avec les données recueillies
                        let commentUser = new Comment(pseudo, note, commentaire, that.resultats);
                        commentUser.initializeHtmlCommentUser();
                        console.log("COMMENT DANS VALIDATION COMMENTAIRE: ", commentUser);

                        // Si le commentaire existe, on masque le bouton d'ajout de commentaires pour cet utilisateur
                        if (commentUser) {
                            that.resultats.querySelector('.bouton-ajout-comment-resto').style.display = "none";
                            // On vide le contenu de session storage
                            sessionStorage.removeItem('pseudo-comment-modal-resto');
                            sessionStorage.removeItem('comment-modal-resto');
                            sessionStorage.removeItem('note-modal-resto');

                            // On réinitialise les valeurs des input
                            document.getElementById('pseudo-comment-modal-resto').value = '';
                            document.getElementById('comment-modal-resto').value = '';
                            document.getElementById('note-modal-resto').value = '';

                        }

                    } else {
                        alert("sessionStorage n'est pas supporté");
                    }
                })


            })



            // Fonction qui masque les éléments qui étaient par défaut non visible.
            closeCommentResto.addEventListener('click', function() {
                nameResto.style.color = "";
                that.resultats.style.backgroundColor = '';
                boutonAjoutCommentResto.style.display = "none";
                that.resultats.style.height = "120px";
                that.resultats.style.overflow = "hidden";
                closeCommentResto.style.display = "none";
            })


        })

        // On insère les éléments crées dans le DOM
        let listRestaurants = document.getElementById('restaurants-list');
        this.resultats.appendChild(nameResto);
        this.resultats.appendChild(etoileResto);
        this.resultats.appendChild(closeCommentResto);
        this.resultats.appendChild(addressResto);
        this.resultats.appendChild(boutonAjoutCommentResto);
        this.resultats.appendChild(commentResto);
        this.resultats.appendChild(imageResto);
        this.resultats.appendChild(noteResto);
        listRestaurants.appendChild(this.resultats);

    }

    /**
     * Charge les commentaires de l' API
     * @return { object } Les commentaires correspondant aux restaurants
     */
    getComments() {
        let that = this;

        let ajoutCommentaires = document.querySelector('.ajout-commentaires');
        ajoutCommentaires.innerHTML = "";

        if (that.commentsJson) {
            that.commentsJson.forEach(function(comment) {
                let commentObject = new Comment("Anonyme", comment.stars, comment.comment, that.resultats);
                commentObject.initializeHtml();
            });
        } else {
            console.log("METHODE GET COMMENTS A FINIR :", );
        }
    }

    /**
     * Récupère l'image du restaurant avec street view
     * @return {string}
     */
    getUrl() {
        let latitude = this.location.lat;
        let longitude = this.location.lng;

        let urlPhotos = "https://maps.googleapis.com/maps/api/streetview?size=300x150&" +
            "location="+latitude+","+longitude+"&heading=151.78&pitch=-0.76&radius=50&key=AIzaSyDLGGNHkcJlMUPGCeneagK5ar6lHWJ7UqU";
        return urlPhotos;
    }

}
class Restaurant {
    /**
     * Classe correspondant aux restaurants
     * @param { object } maCarte        // La map
     * @param { number } id             // L'identifiant du restaurant
     * @param { object } location       // La latitude et la longitude du restaurant
     * @param { string } name           // Le nom du restaurant
     * @param { string } address        // L'adresse du restaurant
     * @param { number } rating         // La note moyenne du restaurant
     * @param { object } commentsJson   // Indique si les commentaires sont à prendre dans la base JSON ou dans l'API
     */
    constructor(maCarte, id, location, name, address, rating, commentsJson) {
        this.maCarte = maCarte;
        this.id = id;
        this.location = location;
        this.name = name;
        this.address = address;
        this.rating = rating;
        if (commentsJson !== undefined) {
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
    initHtml() {
        let that = this;
        let a = 0;

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

        // Crée une balise <img> pour afficher une photo du restaurant et la rend non visible
        let imageResto = document.createElement('img');
        imageResto.src = that.photos;
        imageResto.style.display = "none";

        // Crée une balise <img> permettant de fermer les commentaires et la rend non visible
        let closeCommentResto = document.createElement('img');
        closeCommentResto.className = "close";
        closeCommentResto.src = "../img/close.png";
        closeCommentResto.style.display = "none";

        // Charge les avis provenant de l' API et les rend non visibles
        this.resultats.style.height = "120px";
        this.resultats.style.overflow = "hidden";

        // Crée un bouton pour l'ouverture d'une "modale" d'ajout d'avis user et le rend non visible
        let boutonAjoutCommentResto = document.createElement('button');
        boutonAjoutCommentResto.className = 'bouton-ajout-comment-resto';
        boutonAjoutCommentResto.setAttribute("onclick", "document.getElementById('myModal').style.display='block'");
        boutonAjoutCommentResto.textContent = "Ajouter un avis";
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
            if (a === 0) {
                that.getComments();
                a = 1;
            } else if (a === 1) {
                console.log("Pas de nouveaux commentaires");
            }

            // Affiche le bouton qui permet l' ajout d'avis par l' utilisateur via l' ouverture d'une modale
            boutonAjoutCommentResto.style.display = 'block';

            // On écoute l'ouverture de la modale d'ajout de commentaires
            boutonAjoutCommentResto.addEventListener('click', function () {

                // On récupère le bouton d'envoi du formulaire
                let boutonValidModalResto = document.getElementById('bouton-valid-modal-resto');

                // On récupère le formulaire
                let formCommentResto = document.getElementById('form-comment-resto');

                // Pour activer le bouton d'envoi du formulaire, on s'assure que les input sont bien remplis
                formCommentResto.pseudo.addEventListener('change', verifInput);
                formCommentResto.comment.addEventListener('change', verifInput);
                formCommentResto.note.addEventListener('change', verifInput);

                function verifInput() {
                    if ((formCommentResto.pseudo.value !== '')&&
                    (formCommentResto.comment.value !== '') &&
                    (formCommentResto.note.value !== '')) {
                        boutonValidModalResto.disabled = false;
                    }
                }
                // On écoute la validation du bouton d'envoi du formulaire
                boutonValidModalResto.addEventListener('click', function (event) {
                    // On bloque l'envoi du formulaire
                    event.preventDefault();

                    // On utilise sessionStorage pour stocker les commentaires le temps de la visite
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
                        if ((pseudo !== "") && (note !== "") && (commentaire !== "")) {
                            let commentUser = new Comment(pseudo, note, commentaire, that.resultats);
                            commentUser.initializeHtml();

                            // Si le commentaire existe
                            if (commentUser) {
                                // On masque le bouton d'ajout de commentaires
                                boutonAjoutCommentResto.style.display = "none";

                                // On vide le contenu de session storage
                                sessionStorage.removeItem('pseudo-comment-modal-resto');
                                sessionStorage.removeItem('comment-modal-resto');
                                sessionStorage.removeItem('note-modal-resto');

                                // On réinitialise les valeurs des input
                                document.getElementById('pseudo-comment-modal-resto').value = '';
                                document.getElementById('comment-modal-resto').value = '';
                                document.getElementById('note-modal-resto').value = '';

                                // On remet l'attribut "disabled" sur le bouton d'envoi du formulaire
                                boutonValidModalResto.disabled = true;

                                // On ferme la modale
                                document.getElementById('myModal').style.display = "none";
                            }
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
        this.resultats.appendChild(imageResto);
        this.resultats.appendChild(noteResto);
        listRestaurants.appendChild(this.resultats);

    }

    /**
     * Charge les commentaires du fichier JSON et de l' API
     * @return { object } Les commentaires correspondant aux restaurants
     */
    getComments() {
        let that = this;

        if (that.commentsJson) {
            that.commentsJson.forEach(function(comment) {
                let commentObject = new Comment("Anonyme", comment.stars, comment.comment, that.resultats);
                commentObject.initializeHtml();
            });
        } else {
            let placeId = that.id;
            that.getCommentsApi(placeId);
        }
    }

    /**
     * Requête pour récupérer les commentaires des restaurants via l'api
     * @param placeId
     */
    getCommentsApi(placeId) {
        let that = this;
        // Utilisation de la fonction XHR "ajaxGet"
        ajaxGet(
            "https://maps.googleapis.com/maps/api/place/details/json?place_id="+placeId+"&language=fr&fields=name,rating,vicinity,reviews&key=AIzaSyDLGGNHkcJlMUPGCeneagK5ar6lHWJ7UqU",
            function (result) {
            let results = JSON.parse(result);
            console.log("RESULTS: ", results.result.reviews);
            for (let i =0; i < results.result.reviews.length; i++) {
                let pseudo = results.result.reviews[i].author_name;
                let commentaire = results.result.reviews[i].text;
                let note = results.result.reviews[i].rating;

                let commentApi = new Comment(pseudo, note, commentaire, that.resultats);
                commentApi.initializeHtml();
            }
        });
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
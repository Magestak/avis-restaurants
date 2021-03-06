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
        this.photos = this.getPhoto();
        this.resultats;
        this.marqueurResto = {}; // Le marqueur qui identifie le restaurant sur la carte
        this.magic = "AIzaSyBDUNetyL3ydc7HBVvK2DFIhNZ1veToQ50";
    }

    /**
     * Crée et intègre les marqueurs des restaurants à la map
     * @return { object }
     */
    createMarker() {
        let latLng = this.location;
        let titleInfo = `
        ${this.name}
        ${this.address}
        `;
        let iconResto = L.icon({
            iconUrl: 'img/map-marker-alt-solid-red.png',
            iconSize: [25, 38],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
        });
        this.marqueurResto = L.marker(latLng, {icon: iconResto}).addTo(this.maCarte);
        this.marqueurResto.bindPopup(titleInfo);
    }

    /**
     * Supprime le marqueur qui identifie le restaurant sur la map
     */
    removeMarker() {
        this.maCarte.removeLayer(this.marqueurResto);
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
        if (x === 1) {etoileResto.src = "img/1_star.png";}
        else if (x === 2) {etoileResto.src = "img/2_stars.png";}
        else if (x === 3) {etoileResto.src = "img/3_stars.png";}
        else if (x === 4) {etoileResto.src = "img/4_stars.png";}
        else if (x === 5) {etoileResto.src = "img/5_stars.png";}
        else {etoileResto.src = "img/0_star.png";}

        // Crée une balise <img> pour afficher une photo du restaurant et la rend non visible
        let imageResto = document.createElement('img');
        imageResto.className = "image-resto";
        imageResto.src = that.photos;
        imageResto.style.display = "none";

        // Crée une balise <img> permettant de fermer les commentaires et la rend non visible
        let closeCommentResto = document.createElement('img');
        closeCommentResto.className = "close";
        closeCommentResto.src = "img/close.png";
        closeCommentResto.style.display = "none";

        // On récupère la modal d'ajout de commentaire par l'utilisateur
        let commentModal = document.querySelector("#myModal");

        // On récupère le bouton d'envoi du formulaire d'ajout d'avis
        let boutonValidModalResto = document.getElementById('bouton-valid-modal-resto');

        // Ajoute le commentaire utilisateur au restaurant demandé
        function validAjoutComment(event) {
            // On bloque l'envoi du formulaire
            event.preventDefault();

            // On utilise sessionStorage pour stocker les commentaires le temps de la visite
            if(typeof sessionStorage !='undefined') {
                // On enregistre les données saisies par l'utilisateur
                sessionStorage.setItem('pseudo-comment-modal-resto', document.getElementById('pseudo-comment-modal-resto').value);
                sessionStorage.setItem('comment-modal-resto', document.getElementById('comment-modal-resto').value);
                sessionStorage.setItem('note-modal-resto', document.getElementById('note-modal-resto').value);

                // On récupère les données stockées dans "session storage"
                let pseudo = sessionStorage.getItem("pseudo-comment-modal-resto");
                let commentaire = sessionStorage.getItem("comment-modal-resto");
                let note = sessionStorage.getItem("note-modal-resto");

                // On crée le commentaire avec les données recueillies dans le formulaire et on l'affiche
                let commentUser = new Comment(pseudo, note, commentaire, that.resultats);
                commentUser.initializeHtml();

                // On identifie le nom du resto associé au commentaire crée et on le stocke dans session storage
                // pour réutilisation ultérieure du commentaire si nécessaire
                let nameRestoUser = that.name;
                sessionStorage.setItem("nameRestoUser", nameRestoUser);

                // On masque le bouton d'ajout de commentaires
                boutonAjoutCommentResto.style.display = "none";

                // On remet l'attribut "disabled" sur le bouton d'envoi du formulaire
                boutonValidModalResto.disabled = true;

                // On ferme la modale
                document.getElementById('myModal').style.display = "none";
            } else {
                alert("sessionStorage n'est pas supporté");
            }
        }

        // On écoute le bouton de fermeture de la modal d'ajout de commentaire
        let closeCommentModalButton = document.querySelector("#close-comment-modal");
        closeCommentModalButton.addEventListener('click', e => {
            e.preventDefault();
            commentModal.style.display = "none";

            // On annule l'écouteur d'évènement sur le bouton de validation de la modal pour éviter
            // l'ajout de commentaire lié à l'ouverture de la modal sans validation
            boutonValidModalResto.removeEventListener('click', validAjoutComment);
        });

        // Crée un bouton pour l'ouverture d'une "modal" d'ajout d'avis user et le rend non visible
        let boutonAjoutCommentResto = document.createElement('button');
        boutonAjoutCommentResto.className = 'bouton-ajout-comment-resto';
        boutonAjoutCommentResto.setAttribute("onclick", "document.getElementById('myModal').style.display='block'");
        boutonAjoutCommentResto.textContent = "Ajouter un avis";
        boutonAjoutCommentResto.style.display = 'none';

        // "EventListener" sur le nom du restaurant qui permet l'affichage des éléments non visibles
        nameResto.addEventListener('click', function (e){
            e.target.style.color = "#FC6354";
            nameResto.style.color = "#FC6354";
            that.resultats.style.backgroundColor = "#FFE6CC";
            that.resultats.style.height = "500px";
            that.resultats.style.overflow = "auto";

            // Affiche la photo du restaurant
            imageResto.style.display = 'block';

            // Affiche le bouton "close"
            closeCommentResto.style.display = 'block';

            // Affiche le bouton qui permet l' ajout d'avis par l' utilisateur via l' ouverture d'une modale
            boutonAjoutCommentResto.style.display = 'block';

            // Affiche les commentaires de l'API
            if (a === 0) {
                that.getComments();
                a = 1;
            } else if (a === 1) {
                console.log("Pas de nouveaux commentaires");
            }

            // Fonction qui masque les éléments qui étaient par défaut non visible.
            closeCommentResto.addEventListener('click', function() {
                nameResto.style.color = "";
                that.resultats.style.backgroundColor = '';
                boutonAjoutCommentResto.style.display = "none";
                that.resultats.style.height = "100px";
                that.resultats.style.overflow = "hidden";
                closeCommentResto.style.display = "none";
            })
        })

        // On écoute l'ouverture de la modale d'ajout de commentaires
        boutonAjoutCommentResto.addEventListener('click',function () {
            // On récupère le formulaire
            let formCommentResto = document.getElementById('form-comment-resto');

            // Si il y a déjà eu un commentaire et que l'utilisateur a utilisé "clear" dans "session storage",
            // On réinitialise les valeurs des input
            document.getElementById('pseudo-comment-modal-resto').value = '';
            document.getElementById('comment-modal-resto').value = '';
            document.getElementById('note-modal-resto').value = '';

            // Pour activer le bouton d'envoi du formulaire, on s'assure que les input sont bien remplis
            formCommentResto.pseudo.addEventListener('change', verifInput);
            formCommentResto.comment.addEventListener('change', verifInput);
            formCommentResto.note.addEventListener('change', verifInput);

            function verifInput() {
                if ((formCommentResto.pseudo.value !== '') &&
                    (formCommentResto.comment.value !== '') &&
                    (formCommentResto.note.value !== '')) {
                    boutonValidModalResto.disabled = false;
                }
            }
            // On écoute la validation du bouton d'envoi du formulaire
            boutonValidModalResto.addEventListener('click', validAjoutComment);
        })
        if ((sessionStorage.getItem("pseudo-comment-modal-resto")) &&
            (sessionStorage.getItem("comment-modal-resto")) &&
            (sessionStorage.getItem("note-modal-resto"))) {
            boutonAjoutCommentResto.disabled = true;
        }

        // On insère les éléments crées dans le DOM
        let listRestaurants = document.getElementById('restaurants-list');
        that.resultats.appendChild(nameResto);
        that.resultats.appendChild(etoileResto);
        that.resultats.appendChild(closeCommentResto);
        that.resultats.appendChild(addressResto);
        that.resultats.appendChild(boutonAjoutCommentResto);
        that.resultats.appendChild(imageResto);
        that.resultats.appendChild(noteResto);
        listRestaurants.appendChild(that.resultats);

    }

    /**
     * Charge les commentaires du fichier JSON et de l' API
     * @return { object } Les commentaires correspondant aux restaurants
     */
    getComments() {
        let that = this;

        // Si le restaurant est issu du fichier JSON, on prend les commentaires dans le fichier
        if (that.commentsJson) {
            that.commentsJson.forEach(function(comment) {
                let commentObject = new Comment("Anonyme", comment.stars, comment.comment, that.resultats);
                commentObject.initializeHtml();
            });
        } else {
            // Si les commentaires sont issus de l'API Google Places, on récupère les commentaires via une requête AJAX et le "placeID" du restaurant
            let placeId = that.id;
            if (placeId !== null) {
                that.getCommentsApi(placeId);
            } else {
                console.log("Pas encore de commentaires, car le restaurant a été ajouté par l'utilisateur.")
            }
        }
        // Si un commentaire associé au nom du restaurant est stocké dans session storage, on l'affiche
        if (sessionStorage.getItem('nameRestoUser') === that.name) {
            // On récupère les données stockées dans "session storage"
            let pseudo = sessionStorage.getItem("pseudo-comment-modal-resto");
            let commentaire = sessionStorage.getItem("comment-modal-resto");
            let note = sessionStorage.getItem("note-modal-resto");

            // On recrée le commentaire avec les données récupérées dans "session storage"
            let commentUser = new Comment(pseudo, note, commentaire, that.resultats);
            commentUser.initializeHtml();
        }
    }

    /**
     * Requête pour récupérer les commentaires des restaurants via l'api Google Places
     * @param placeId
     */
    getCommentsApi(placeId) {
        let that = this;
        // Utilisation de la fonction XHR "ajaxGet"
        ajaxGet(
            "https://blooming-sierra-85473.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id="+placeId+"&language=fr&fields=name,rating,vicinity,reviews&key="+this.magic,
            function (result) {
            let results = JSON.parse(result);

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
    getPhoto() {
        let latitude = this.location.lat;
        let longitude = this.location.lng;

        return "https://maps.googleapis.com/maps/api/streetview?size=400x200&location="+latitude+","+longitude+"&heading=151.78&pitch=-0.76&radius=50&key=AIzaSyBDUNetyL3ydc7HBVvK2DFIhNZ1veToQ50";
    }

}
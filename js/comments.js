class Comment {
    constructor(name, rating, comment, resultats) {
        this.name = name;
        this.rating = rating;
        this.comment = comment;
        this.resultats = resultats;
    }

    /**
     * Insère le contenu du commentaire lors du chargement des fichiers Json
     * @return { object } le contenu html correspondant au commentaire
     */
    initializeHtml() {
        let that = this;
        let ajoutCommentaires = document.body.querySelector('.ajout-commentaires');


        // Récupère le pseudo
        let ajoutNomCommentaires = document.createElement('div');
        ajoutNomCommentaires.className = 'ajout-nom-commentaires';
        ajoutNomCommentaires.textContent = `Votre pseudo : ${that.name}`;

        // Récupère la note
        let x = Math.floor(that.rating);
        let ajoutNoteCommentaires = document.createElement('div');
        ajoutNoteCommentaires.className = 'ajout-note-commentaires';
        ajoutNoteCommentaires.textContent = `${x}`;
        ajoutNoteCommentaires.style.display = "none";
        let etoilesCommentaires = document.createElement('img');
        etoilesCommentaires.className = 'etoiles-commentaires';
        if (x === 1) {etoilesCommentaires.src = "../img/1_star.png";}
        else if (x === 2) {etoilesCommentaires.src = "../img/2_stars.png";}
        else if (x === 3) {etoilesCommentaires.src = "../img/3_stars.png";}
        else if (x === 4) {etoilesCommentaires.src = "../img/4_stars.png";}
        else if (x === 5) {etoilesCommentaires.src = "../img/5_stars.png";}
        else {etoilesCommentaires.src = "../img/0_star.png";};

        // Récupère le commentaire
        let ajoutCommentCommentaires = document.createElement('div');
        ajoutCommentCommentaires.className = 'ajout-comment-commentaires';
        ajoutCommentCommentaires.textContent = `Votre commentaire : " ${that.comment} "`;

        // Insère les éléments crées dans le DOM
        ajoutCommentaires.appendChild(ajoutNomCommentaires);
        ajoutCommentaires.appendChild(etoilesCommentaires);
        ajoutCommentaires.appendChild(ajoutCommentCommentaires);
        that.resultats.appendChild(ajoutCommentaires);
    }

    /**
     * Insère le contenu du commentaire saisi par l'utilisateur
     * @return { object } le contenu html correspondant au commentaire
     */
    initializeHtmlCommentUser() {
        let that = this;
        let ajoutCommentairesUser = document.createElement('div');
        ajoutCommentairesUser.className = 'ajout-commentaires-user';


        // Récupère le pseudo
        let ajoutNomCommentairesUser = document.createElement('div');
        ajoutNomCommentairesUser.className = 'ajout-nom-commentaires-user';
        ajoutNomCommentairesUser.textContent = `Votre pseudo : ${that.name}`;

        // Récupère la note
        let x = Math.floor(that.rating);
        let ajoutNoteCommentairesUser = document.createElement('div');
        ajoutNoteCommentairesUser.className = 'ajout-note-commentaires-user';
        ajoutNoteCommentairesUser.textContent = `${x}`;
        ajoutNoteCommentairesUser.style.display = "none";
        let etoilesCommentairesUser = document.createElement('img');
        etoilesCommentairesUser.className = 'etoiles-commentaires-user';
        if (x === 1) {etoilesCommentairesUser.src = "../img/1_star.png";}
        else if (x === 2) {etoilesCommentairesUser.src = "../img/2_stars.png";}
        else if (x === 3) {etoilesCommentairesUser.src = "../img/3_stars.png";}
        else if (x === 4) {etoilesCommentairesUser.src = "../img/4_stars.png";}
        else if (x === 5) {etoilesCommentairesUser.src = "../img/5_stars.png";}
        else {etoilesCommentairesUser.src = "../img/0_star.png";};

        // Récupère le commentaire
        let ajoutCommentCommentairesUser = document.createElement('div');
        ajoutCommentCommentairesUser.className = 'ajout-comment-commentaires-user';
        ajoutCommentCommentairesUser.textContent = `Votre commentaire : " ${that.comment} "`;

        // Insère les éléments crées dans le DOM
        ajoutCommentairesUser.appendChild(ajoutNomCommentairesUser);
        ajoutCommentairesUser.appendChild(etoilesCommentairesUser);
        ajoutCommentairesUser.appendChild(ajoutCommentCommentairesUser);
        that.resultats.appendChild(ajoutCommentairesUser);
    }
}
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
        let ajoutCommentaires = document.createElement('div');
        ajoutCommentaires.className = 'ajout-commentaires';


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
        if (x === 1) {etoilesCommentaires.src = "img/1_star.png";}
        else if (x === 2) {etoilesCommentaires.src = "img/2_stars.png";}
        else if (x === 3) {etoilesCommentaires.src = "img/3_stars.png";}
        else if (x === 4) {etoilesCommentaires.src = "img/4_stars.png";}
        else if (x === 5) {etoilesCommentaires.src = "img/5_stars.png";}
        else {etoilesCommentaires.src = "img/0_star.png";};

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
}
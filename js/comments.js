class Comment {
    constructor(name, note, comment) {
        this.nom = nom;
        this.note = note;
        this.comment = comment;
        this.resultats = document.getElementsByClassName('resultats');
    }

    /**
     * Insère le contenu du commentaire lors du chargement des fichiers Json
     * @return {object} le contenu html correspondant au commentaire
     */
    initializeHtml() {
        let that = this;
        let ajoutCommentaires = document.getElementsByClassName('ajout-commentaires');
        ajoutCommentaires.removeAttribute("hidden");

        // pseudo
        let ajoutNomCommentaires = document.createElement('div');
        ajoutNomCommentaires.className = 'ajout-nom-commentaires';
        ajoutNomCommentaires.style.display = "block";
        ajoutNomCommentaires.textContent = `Votre pseudo : ${that.nom}`;

        // note
        let x = Math.floor(that.note);
        let ajoutNoteCommentaires = document.createElement('div');
        ajoutNoteCommentaires.className = 'ajout-note-commentaires';
        ajoutNoteCommentaires.textContent = "";
        ajoutNoteCommentaires.style.display = "block";
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

        // modal comment
        //self.itemNode.querySelector('#buttonModalAddCommentId').display = "none";

        // commentaire
        let ajoutCommentCommentaires = document.createElement('div');
        ajoutCommentCommentaires.className = 'ajout-comment-commentaires';
        ajoutCommentCommentaires.style.display = "block";
        ajoutCommentCommentaires.textContent = `Votre commentaire : " ${that.comment} "`;

        // appendchild
        ajoutCommentaires.appendChild(ajoutNomCommentaires);
        ajoutCommentaires.appendChild(ajoutNoteCommentaires);
        ajoutCommentaires.appendChild(etoilesCommentaires);
        ajoutCommentaires.appendChild(ajoutCommentCommentaires);
    }
}
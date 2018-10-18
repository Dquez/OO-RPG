$(document).ready(function () {

    var GoTRPG = {
        characters: {
            Daenerys: {
                health: 100,
                attack: 14,
                counterAttack: 5,
                baseAP: 14
            },
            KhalDrogo: {
                health: 150,
                attack: 8,
                counterAttack: 20,
                baseAP: 8
            },
            Jaime: {
                health: 120,
                attack: 10,
                counterAttack: 15,
                baseAP: 10
            },
            JonSnow: {
                health: 180,
                attack: 7,
                counterAttack: 25,
                baseAP: 7
            }
        },
        characterChosen: null,
        enemyChosen: null,
        enemiesWaiting: [],
        gameInPlay: false,


        start: function (name) {

            if (this.characterChosen) {
                return;
            }
            this.characterChosen = name;
            this.enemiesWaiting = Object.keys(this.characters).filter(function (character) {
                return character !== name;
            })
            this.setUpZones(name);
        },
        setUpZones: function (name) {
            var that = this;
            var GotCharacters = this.characters;
            var characters = $(".characters").find(".card");
            $.each(characters, function (index, character) {
                var characterName = character.id;
                var stats = $(character).find(".stats");
                stats.html(
                    "<p>Health : <span class='health'>" + GotCharacters[characterName].health + "</span></p>" +
                    "<p>Attack : <span class='attack'>" + GotCharacters[characterName].attack + "</span></p>" +
                    "<p>Counter Attack : <span class='counter'>" + GotCharacters[characterName].counterAttack + "</span></p>"
                )
            })
            characters = characters.filter(function (index, character) {
                return character.id !== name;
            })

            $("#enemy-area").append(characters);
        },
        chooseAttacker: function (name) {
            this.gameInPlay = true;
            var that = this;
            this.enemiesWaiting = this.enemiesWaiting.filter(function (enemy) {
                return enemy !== that.enemyChosen;
            })
            var enemy = $("#enemy-area").find("#" + this.enemyChosen);
            $("#defender-area").append(enemy);
            $("#enemy-area").parent().css("display", "none");

            // Attack button

            var isButtonAppended = $("#" + this.characterChosen).find(".attackBtn");
            if (isButtonAppended.length < 1) {
                var attackBtn = $("<button>Attack</button>");
                attackBtn.addClass("btn attackBtn btn-danger btn-md");
                $("#" + this.characterChosen).append(attackBtn);
            }
        },
        attack: function(){
            this.characters[this.enemyChosen].health -= this.characters[this.characterChosen].attack;
            this.characters[this.characterChosen].attack += this.characters[this.characterChosen].baseAP;
            $(".characters").find(".attack").text(this.characters[this.characterChosen].attack);
            $("#defender-area").find(".health").text(this.characters[this.enemyChosen].health);
            if (this.characters[this.enemyChosen].health <= 0) {
                if (GoTRPG.enemiesWaiting.length === 0) {
                    $("#defender-area").empty();
                    alert("You win");
                    location.reload();
                } else {
                    $("#defender-area").empty();
                    $("#enemy-area").parent().css("display", "initial");
                    GoTRPG.enemyChosen = false;
                }
            } else {
                this.characters[this.characterChosen].health -= this.characters[this.enemyChosen].counterAttack;
                $(".characters").find(".health").text(this.characters[this.characterChosen].health);
                if (this.characters[this.characterChosen].health <= 0) {
                    alert("You lose");
                    location.reload();
                }
            }
        }


    }

// On click events that user controls
    $(".card").on("click", function () {
        GoTRPG.start($(this).attr("id"));

    })

    $("#enemy-area").on("click", function (event) {
        if (!GoTRPG.enemyChosen) {
            GoTRPG.enemyChosen = event.target.getAttribute("data-name");
            GoTRPG.chooseAttacker();
        }
    })

    $(document).on("click", ".attackBtn", function () {
        if (!GoTRPG.enemyChosen) {
            return false;
        }
        GoTRPG.attack();
    })

});
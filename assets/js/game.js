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
            this.enemiesWaiting = this.enemiesWaiting.filter(function (enemy) {
                return enemy !== this.enemyChosen;
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
        }


    }


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
        var enemy = GoTRPG.enemyChosen;
        var character = GoTRPG.characterChosen;
        GoTRPG.characters[enemy].health -= GoTRPG.characters[character].attack;
        GoTRPG.characters[character].attack += GoTRPG.characters[character].baseAP;
        $(".characters").find(".attack").text(GoTRPG.characters[character].attack);
        $("#defender-area").find(".health").text(GoTRPG.characters[enemy].health);
        if (GoTRPG.characters[enemy].health <= 0) {
            if (GoTRPG.enemiesWaiting.length === 0) {
                $("#defender-area").empty();
                alert("You win");
            } else {
                $("#defender-area").empty();
                $("#enemy-area").parent().css("display", "initial");
                GoTRPG.enemyChosen = false;
            }
        } else {
            GoTRPG.characters[character].health -= GoTRPG.characters[enemy].counterAttack;
            $(".characters").find(".health").text(GoTRPG.characters[character].health);
        }
    })

});

// Whenever the player clicks attack, their character damages the defender. The opponent will lose HP (health points). These points are displayed at the bottom of the defender's picture.
// The opponent character will instantly counter the attack. When that happens, the player's character will lose some of their HP. These points are shown at the bottom of the player character's picture.





// The player will keep hitting the attack button in an effort to defeat their opponent.

// When the defender's HP is reduced to zero or below, remove the enemy from the defender area. The player character can now choose a new opponent.



// The player wins the game by defeating all enemy characters. The player loses the game the game if their character's HP falls to zero or below.



// Option 2 Game design notes


// Each character in the game has 3 attributes: Health Points, Attack Power and Counter Attack Power.


// Each time the player attacks, their character's Attack Power increases by its base Attack Power.

// For example, if the base Attack Power is 6, each attack will increase the Attack Power by 6 (12, 18, 24, 30 and so on).



// The enemy character only has Counter Attack Power.

// Unlike the player's Attack Points, Counter Attack Power never changes.



// The Health Points, Attack Power and Counter Attack Power of each character must differ.


// No characters in the game can heal or recover Health Points.

// A winning player must pick their characters wisely by first fighting an enemy with low Counter Attack Power. This will allow them to grind Attack Power and to take on enemies before they lose all of their Health Points. Healing options would mess with this dynamic.



// Your players should be able to win and lose the game no matter what character they choose. The challenge should come from picking the right enemies, not choosing the strongest player.
function toggle(button) {

    let details = button.previousElementSibling;

    if (details.style.display == "block") {
        details.style.display = "none";
        button.innerHTML = "Show Details";
    } else {
        details.style.display = "block";
        button.innerHTML = "Hide Details";
    }

}

function searchStudent() {

    let input = document.getElementById("search").value.toLowerCase().trim();

    let cards = document.querySelectorAll(".card");

    let found = false;

    for (let i = 0; i < cards.length; i++) {

        removeHighlight(cards[i]);

        let text = cards[i].innerText.toLowerCase();

        if (text.includes(input) || input == "") {

            cards[i].style.display = "block";

            found = true;

            if (input != "") {
                highlight(cards[i], input);
            }

        } else {

            cards[i].style.display = "none";

        }

    }

    if (found) {
        document.getElementById("message").style.display = "none";
    } else {
        document.getElementById("message").style.display = "block";
    }

}

function highlight(card, word) {

    let data = card.querySelectorAll("h2, p");

    let safeWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    let regex = new RegExp("(" + safeWord + ")", "gi");

    for (let i = 0; i < data.length; i++) {

        let text = data[i].textContent;

        data[i].innerHTML = text.replace(regex, "<mark>$1</mark>");

    }

}

function removeHighlight(card) {

    let marks = card.querySelectorAll("mark");

    for (let i = 0; i < marks.length; i++) {

        marks[i].outerHTML = marks[i].innerHTML;

    }

}
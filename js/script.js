let dreams = [];

let currentFilter = "All";

const dreamName = document.getElementById("dreamName");
const dreamCategory = document.getElementById("dreamCategory");
const dreamGrid = document.getElementById("dreamGrid");
const emptyMessage = document.getElementById("emptyMessage");
const formHint = document.getElementById("formHint");


function getEmoji(category) {
    if (category == "Travel") {
        return "✈️";
    } else if (category == "Adventure") {
        return "⛰️";
    } else if (category == "Learn") {
        return "📚";
    } else {
        return "☀️";
    }
}


function displayDreams() {
    dreamGrid.innerHTML = "";
    let shownCount = 0;

    for (let i = 0; i < dreams.length; i++) {
        if (currentFilter == "All" || dreams[i].category == currentFilter) {
            shownCount++;

            let card = document.createElement("div");
            card.className = "dream-card";

            if (dreams[i].done == true) {
                card.className = "dream-card completed";
            }

            card.innerHTML =
                '<div class="card-top">' +
                    '<span class="category-tag category-' + dreams[i].category + '">' + dreams[i].category + '</span>' +
                    '<span class="card-emoji">' + getEmoji(dreams[i].category) + '</span>' +
                '</div>' +
                '<h3></h3>' +
                '<div class="card-actions">' +
                    '<button class="done-button" onclick="markDone(' + i + ')">' +
                        (dreams[i].done == true ? "✓ Completed" : "Mark as done") +
                    '</button>' +
                    '<button class="delete-button" onclick="deleteDream(' + i + ')">Delete</button>' +
                '</div>';

            card.getElementsByTagName("h3")[0].textContent = dreams[i].name;
            dreamGrid.appendChild(card);
        }
    }

    if (shownCount == 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    updateProgress();
}


function addDream() {
    let name = dreamName.value.trim();
    let category = dreamCategory.value;

    
    if (name == "") {
        alert("Please enter a dream before adding it!");
        dreamName.focus();
        return false;
    }

    dreams.push({ name: name, category: category, done: false });

    document.getElementById("dreamForm").reset();
    formHint.innerHTML = "Lovely! Your new dream has been added ✨";
    displayDreams();

    
    setTimeout(function() {
        formHint.innerHTML = "Tip: You can add anything — there are no silly dreams.";
    }, 2500);

    return false;
}


function markDone(index) {
    if (dreams[index].done == false) {
        dreams[index].done = true;
    } else {
        dreams[index].done = false;
    }
    displayDreams();
}


function deleteDream(index) {
    let answer = confirm("Are you sure you want to remove this dream?");

    if (answer == true) {
        dreams.splice(index, 1);
        displayDreams();
    }
}


function updateProgress() {
    let total = dreams.length;
    let completed = 0;

    for (let i = 0; i < dreams.length; i++) {
        if (dreams[i].done == true) {
            completed++;
        }
    }

    let percentage = 0;
    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    document.getElementById("totalCount").innerHTML = total;
    document.getElementById("doneCount").innerHTML = completed;
    document.getElementById("progressText").innerHTML = percentage + "%";
    document.getElementById("progressFill").style.width = percentage + "%";
}


let filterButtons = document.getElementsByClassName("filter-button");

for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].onclick = function() {
        currentFilter = this.getAttribute("data-filter");

        for (let j = 0; j < filterButtons.length; j++) {
            filterButtons[j].className = "filter-button";
        }

        this.className = "filter-button active";
        displayDreams();
    };
}


window.onload = function() {
    displayDreams();
};

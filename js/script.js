const supabaseUrl = "https://vafuapkxrnhlgjaexwtg.supabase.co";
const supabaseKey = "sb_publishable_nSox28GOANTL9a8TesdFNA_o3oYkn5e";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

let dreams = [];

let currentFilter = "All";

const dreamName = document.getElementById("dreamName");
const dreamCategory = document.getElementById("dreamCategory");
const dreamGrid = document.getElementById("dreamGrid");
const emptyMessage = document.getElementById("emptyMessage");
const formHint = document.getElementById("formHint");

async function loadDreams() {
    const { data, error } = await supabaseClient
        .from("dreams")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        alert("Could not load dreams: " + error.message);
        return;
    }

    dreams = data;
    displayDreams();
}


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


async function addDream(event) {
    event.preventDefault();

    let name = dreamName.value.trim();
    let category = dreamCategory.value;

    if (name == "") {
        alert("Please enter a dream before adding it!");
        dreamName.focus();
        return;
    }

    const { error } = await supabaseClient
        .from("dreams")
        .insert([{ name: name, category: category, done: false }]);

    if (error) {
        alert(error.message);
        return;
    }

    document.getElementById("dreamForm").reset();
    formHint.innerHTML = "Lovely! Your new dream has been added ✨";

    loadDreams();
}


async function markDone(index) {
    let newStatus = !dreams[index].done;

    const { error } = await supabaseClient
        .from("dreams")
        .update({ done: newStatus })
        .eq("id", dreams[index].id);

    if (error) {
        alert(error.message);
        return;
    }

    loadDreams();
}


async function deleteDream(index) {
    let answer = confirm("Are you sure you want to remove this dream?");

    if (answer == true) {
        const { error } = await supabaseClient
            .from("dreams")
            .delete()
            .eq("id", dreams[index].id);

        if (error) {
            alert(error.message);
            return;
        }

        loadDreams();
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
    loadDreams();
};
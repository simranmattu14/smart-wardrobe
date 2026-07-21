let db;

// Connect html elements to Javascript variables to upload images
const uploadBox = document.getElementById("uploadBox");
const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const uploadText = document.getElementById("uploadText");

console.log("Upload box, photo input, preview, and upload text elements connected successfully.");


let selectedCategory = "";

uploadBox.addEventListener("click", () => {
    photoInput.click();
});

// When user selects a photo file, get the file object and validate it exists
photoInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) return; // No file selected, stop processing

    // Read the file and display it as a preview
    const reader = new FileReader(); 

    reader.onload = function(e) {
        preview.src = e.target.result; // Set image preview to the loaded file
        preview.hidden = false; // Show the preview
        uploadText.hidden = true; // Hide the upload prompt
    };

    reader.readAsDataURL(file); // Read the file as a data URL for preview
});

// Make category buttons toggle (only one selected at a time)
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        // Deselect all category buttons
        document
            .querySelectorAll(".category")
            .forEach(btn => btn.classList.remove("selected"));
        // Highlight the clicked button
        button.classList.add("selected");
        // Save which category was selected
        selectedCategory = button.textContent;
    });
});

const request = indexedDB.open("WardrobeDB", 1);

request.onupgradeneeded = function (event) {

    db = event.target.result;

    db.createObjectStore("clothing", {
        keyPath: "id",
        autoIncrement: true
    });

};

request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Database opened!");
};

document
    .getElementById("wardrobeForm")
    .addEventListener("submit", function(e) {
        e.preventDefault(); // Prevent form submission

        const itemName =
            document.getElementById("itemName");
        const itemColor = document.getElementById("itemColor");
        const itemMaterial = document.getElementById("itemMaterial");
        const itemSeason = document.getElementById("itemSeason");
        const itemNotes = document.getElementById("itemNotes");
        const itemPhoto = preview.src;
        const itemCategory = selectedCategory;

        item = {
            "image": itemPhoto,
            "name": itemName.value,
            "color": itemColor.value,
            "material": itemMaterial.value,
            "season": itemSeason.value,
            "notes": itemNotes.value
        };

        itemName.value = "";
        itemColor.value = "";
        itemMaterial.value = "";
        itemSeason.value = "";
        itemNotes.value = "";

        const transaction =
            db.transaction("clothing", "readwrite");

        const store =
            transaction.objectStore("clothing");

        store.add(item);

        console.log("Item added to wardrobe:", item);
    });

window.addEventListener("DOMContentLoaded", () => {
    itemName.value = localStorage.getItem("itemName") || "";
    itemColor.value = localStorage.getItem("itemColor") || "";
    itemMaterial.value = localStorage.getItem("itemMaterial") || "";
    itemSeason.value = localStorage.getItem("itemSeason") || "";
    itemNotes.value = localStorage.getItem("itemNotes") || "";

    const savedPhoto = localStorage.getItem("itemPhoto");
    if (savedPhoto) {
        preview.src = savedPhoto;
    }

    selectedCategory = localStorage.getItem("itemCategory") || "";
});


function saveForm() {
    localStorage.setItem("itemName", itemName.value);
    localStorage.setItem("itemColor", itemColor.value);
    localStorage.setItem("itemMaterial", itemMaterial.value);
    localStorage.setItem("itemSeason", itemSeason.value);
    localStorage.setItem("itemNotes", itemNotes.value);
    localStorage.setItem("itemPhoto", preview.src);
    localStorage.setItem("itemCategory", selectedCategory);
}

itemName.addEventListener("input", saveForm);
itemColor.addEventListener("input", saveForm);
itemMaterial.addEventListener("input", saveForm);
itemSeason.addEventListener("change", saveForm);
itemNotes.addEventListener("input", saveForm);


document
    .getElementById("wardrobeForm")
    .addEventListener("reset", function(e) {
        localStorage.clear();
        itemName.value = "";
        itemColor.value = "";
        itemMaterial.value = "";
        itemSeason.value = "";
        itemNotes.value = "";
        preview.src = "";
})
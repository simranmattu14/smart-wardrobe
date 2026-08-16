import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { supabase } from './supabaseClient.js';

let clerkReady = false;

async function ensureClerkLoaded() {
  if (clerkReady) return;

  if (typeof window !== "undefined" && window.Clerk?.load) {
    try {
      await window.Clerk.load();
      clerkReady = true;
    } catch (error) {
      console.warn("Clerk could not be loaded:", error);
    }
  }
}

// Connect html elements to Javascript variables to upload images
const uploadBox = document.getElementById("uploadBox");
const photoInput = document.getElementById("photoInput");
const preview = document.getElementById("preview");
const uploadText = document.getElementById("uploadText");


// Functions
// Add a clothing item
async function addClothingItem(item) {
    const { data, error } = await supabase
        .from('clothing_items')
        .insert([{
            name: item.name,
            category: item.category,
            color: item.color,
            image_url: item.image,
            created_at: new Date().toISOString(),
            material: item.material,
            season: item.season,
            notes: item.notes
        }])
        .select(); // Return the inserted row

    if (error) {
        console.error(error);
        return null;
    }
    return data;
}


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

document
    .getElementById("wardrobeForm")
    .addEventListener("submit", async function(e) {
        e.preventDefault(); // Prevent form submission

        const itemName = document.getElementById("itemName");
        const itemColor = document.getElementById("itemColor");
        const itemMaterial = document.getElementById("itemMaterial");
        const itemSeason = document.getElementById("itemSeason");
        const itemNotes = document.getElementById("itemNotes");
        const itemPhoto = preview.src;
        const itemCategory = selectedCategory;

        const item = {
            image: itemPhoto,
            name: itemName.value,
            color: itemColor.value,
            material: itemMaterial.value,
            season: itemSeason.value,
            notes: itemNotes.value,
            category: itemCategory
        };

        console.log("Item to be added:", item);

        // Save the item to the database
        const savedItem = await addClothingItem(item);
        if (savedItem) {
            console.log("Item added to wardrobe:", savedItem);
            // Optionally, you can reset the form and preview here
            itemName.value = "";
            itemColor.value = "";
            itemMaterial.value = "";
            itemSeason.value = "";
            itemNotes.value = "";
            preview.src = "";
            preview.hidden = true;
            uploadText.hidden = false;
            selectedCategory = "";
            document.querySelectorAll(".category").forEach(btn => btn.classList.remove("selected"));
        } else {
            console.error("Failed to add item to wardrobe.");
        }
    });

    

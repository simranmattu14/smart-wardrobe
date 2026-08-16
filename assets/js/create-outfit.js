import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { supabase } from './supabaseClient.js';

// Get the logged-in user's clothing items
async function getUserClothing(category) {
    console.log('Fetching clothing items for category:', category);
    let data, error;
    if (category == "Top") {
        ({ data, error } = await supabase.from('clothing_items').select('id, name, image_url').eq('category', '👕 Tops'));
    }
    if (category == "Bottom") {
        ({ data, error } = await supabase.from('clothing_items').select('id, name, image_url').eq('category', '👖 Bottoms'));
    }

    console.log('Data fetched:', data);

    if (error) {
        console.error('Error loading clothing:', error);
        return [];
    }

    return data;
}

async function addOutfit(outfit) {
    const { data, error } = await supabase
        .from('outfits')
        .insert([{
            name: outfit.name,
            item_ids: outfit.item_ids,
            created_at: new Date().toISOString()
        }])
        .select(); // Return the inserted row

    if (error) {
        console.error(error);
        return null;
    }
    return data;
}

async function loadWardrobe() {
    const wardrobeTop = await getUserClothing("Top");
    const wardrobeBottom = await getUserClothing("Bottom");
    console.log('User clothing (Top):', wardrobeTop);
    console.log('User clothing (Bottom):', wardrobeBottom);
    displaywardrobeItems(wardrobeTop, wardrobeBottom);
}

function displaywardrobeItems(wardrobeTop, wardrobeBottom) {
    const topGrid = document.getElementById("topGrid");
    const bottomGrid = document.getElementById("bottomGrid");

    topGrid.innerHTML = "";
    bottomGrid.innerHTML = "";

    wardrobeTop.forEach(item => {
        console.log('Displaying item:', item);
        topGrid.innerHTML += `
            <div class="wardrobe-item-link" data-id="${item.id}" data-name="${item.name}" data-category="Top">
                <img
                    src="${item.image_url}"
                    alt="${item.itemName}"
                    id="topItem-${item.id}"
                    class="card-image">
                    
                <div class="card-content">
                    <h3>${item.name}</h3>
                </div>

            </div>
        `;
    });

    wardrobeBottom.forEach(item => {
        console.log('Displaying item:', item);
        bottomGrid.innerHTML += `
            <div class="wardrobe-item-link" data-id="${item.id}" data-name="${item.name}" data-category="Bottom">
                <img
                    src="${item.image_url}"
                    alt="${item.itemName}"
                    id="bottomItem-${item.id}"
                    class="card-image">
                    
                <div class="card-content">
                    <h3>${item.name}</h3>
                </div>

            </div>
        `;
    });

    // Track selected items in a Map for quick lookup
    if (!window.__selectedItems) window.__selectedItems = new Map();

    function toggleSelectionForElement(el) {
        const id = el.dataset.id;
        const name = el.dataset.name;
        const category = el.dataset.category;
        if (!id) return;

        el.classList.toggle('selected');

        if (el.classList.contains('selected')) {
            window.__selectedItems.set(id, { id, name, category });
        } else {
            window.__selectedItems.delete(id);
        }
    }

    // Use event delegation so clicks on image/text also toggle
    topGrid.addEventListener('click', (e) => {
        const el = e.target.closest('.wardrobe-item-link');
        if (!el) return;
        toggleSelectionForElement(el);
    });

    bottomGrid.addEventListener('click', (e) => {
        const el = e.target.closest('.wardrobe-item-link');
        if (!el) return;
        toggleSelectionForElement(el);
    });
}

// Helper to read selected items from console or other scripts
window.getSelectedItems = function() {
    if (!window.__selectedItems) return [];
    return Array.from(window.__selectedItems.values());
};

loadWardrobe();

document
    .getElementById("outfitForm")
    .addEventListener("submit", async function(e) {
        e.preventDefault(); // Prevent form submission

        const outfitName = document.getElementById("outfitName").value;
        const selectedItems = window.getSelectedItems();

        if (!outfitName || selectedItems.length === 0) {
            alert("Please provide an outfit name and select at least one item.");
            return;
        }

        const item_ids = selectedItems.map(item => item.id);

        const outfit = {
            name: outfitName,
            item_ids: item_ids
        };

        console.log("Outfit to be added:", outfit);

        // Save the outfit to the database
        const savedOutfit = await addOutfit(outfit);
        if (savedOutfit) {
            console.log("Outfit added:", savedOutfit);
            // Optionally, you can reset the form and selections here
            document.getElementById("outfitForm").reset();
            window.__selectedItems.clear();
            document.querySelectorAll(".wardrobe-item-link.selected").forEach(el => el.classList.remove("selected"));
        } else {
            console.error("Failed to add outfit.");
        }
    });


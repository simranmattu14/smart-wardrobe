import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { supabase } from './supabaseClient.js';
import { CONFIG } from './config.js';

// Get the logged-in user's clothing items
async function getUserClothing() {
    const { data, error } = await supabase.from('clothing_items').select('*');
    
    if (error) {
        console.error('Error loading clothing:', error);
        return [];
    }

    return data;
}

async function loadWardrobe() {
    const wardrobe = await getUserClothing();
    console.log('User clothing:', wardrobe);
    displayWardrobe(wardrobe);
}

function displayWardrobe(data) {
    const container = document.getElementById("wardrobe-items");
    container.innerHTML = "";

    data.forEach(item => {
        console.log('Displaying item:', item);
        container.innerHTML += `
            <div class="wardrobe-card">
            
                <img
                    src="${item.image_url}"
                    alt="${item.itemName}"
                    class="card-image">
                    
                <div class="card-content">
                    <h3>${item.name}</h3>

                    <div class="tags">
                        <span class="tag">${item.category}</span>
                        <span class="tag">${item.color}</span>
                        <span class="tag">${item.season}</span>
                    </div>
                </div>

            </div>
            `;
    });

}

loadWardrobe();

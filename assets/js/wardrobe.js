let db;

const request = indexedDB.open("WardrobeDB", 1);

request.onsuccess = function (event) {
    
    db = event.target.result;

    displayWardrobe();

};

function loadWardrobe(callback) {

    const transaction = db.transaction("clothing", "readonly");
    const store = transaction.objectStore("clothing");

    const request = store.getAll();

    request.onsuccess = function () {
        callback(request.result);
    };

}

function displayWardrobe() {
    const container =
        document.getElementById("wardrobe-items");

    container.innerHTML = "";

    loadWardrobe(function(wardrobe) {
        wardrobe.forEach(item => {
            container.innerHTML += `
                <div class="wardrobe-card">

                    <img
                        src="${item.image}"
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
    });
}
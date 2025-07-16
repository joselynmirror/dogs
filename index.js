const itemsDogs = document.getElementById("items-dogs")

const baseUrl = "https://api.thedogapi.com/v1";
const endpoint = "/images/search";
const params = new URLSearchParams();
params.append("limit", "10")
params.append("api_key", "live_GvCfLgue0bFzcy0n3dSVPua6cp8HOnpQgkrInSSqHiD3sRbQujRz42KE83TDjUh9")

const url = `${baseUrl}${endpoint}?${params}`

class Item {
    constructor(rawItem) {
        this.id = rawItem.id;
        this.name = rawItem.breeds?.[0]?.name || "Perro adorable";
        this.imageUrl = rawItem.url;
        this.breed = rawItem.breeds?.[0]?.name || "Desconocida";
        this.temperament = rawItem.breeds?.[0]?.temperament || "Temperamento no disponible";
    }
}

function transformRawData(rawData) {
    const data = rawData.map((item) => {
        return new Item(item)
    })
    return data;
}

async function fetchItems() {
    try {
        itemsDogs.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Cargando perros...</div>';
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al cargar los perros");
        return await response.json();
    } catch (error) {
        console.error("Error fetching dogs:", error);
        itemsDogs.innerHTML = `<div class="loading">Error al cargar los perros: ${error.message}</div>`;
        return [];
    }
}

function renderItems(items) {
    if (items.length === 0) {
        itemsDogs.innerHTML = '<div class="loading">No se encontraron perros. Intenta recargar.</div>';
        return;
    }

    itemsDogs.innerHTML = "";

    items.forEach(element => {
        const itemContainer = document.createElement("div");
        itemContainer.className = "dog-card";

        itemContainer.innerHTML = `
            <img src="${element.imageUrl}" alt="${element.name}" class="dog-image" loading="lazy">
            <div class="dog-info">
                <h3 class="dog-name">
                    <i class="fas fa-dog"></i> ${element.name}
                </h3>
                <p class="dog-id">ID: ${element.id}</p>
                ${element.breed !== "Desconocida" ? `<p><strong>Raza:</strong> ${element.breed}</p>` : ""}
                ${element.temperament !== "Temperamento no disponible" ? `<p><strong>Temperamento:</strong> ${element.temperament}</p>` : ""}
            </div>
        `;

        itemsDogs.appendChild(itemContainer);
    });
}

async function main() {
    const rawItems = await fetchItems();
    const newData = transformRawData(rawItems);
    renderItems(newData);
}

main();
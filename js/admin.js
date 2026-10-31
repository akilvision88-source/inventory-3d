/* ============================================================
   admin.js — Logique du panneau d'administration
   - Statistiques en temps réel
   - Ajout de pièces via formulaire
   - Tableau avec suppression
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que data.js est chargé
    if (typeof inventoryDB === 'undefined') {
        alert("❌ data.js n'est pas chargé. Vérifiez le chemin js/data.js");
        return;
    }

    // Initialisation
    updateStats();
    renderPartsTable();

    // Formulaire d'ajout
    const form = document.getElementById('addPartForm');
    form.addEventListener('submit', handleAddPart);
});

/* ============================================================
   Gestion de l'ajout d'une pièce
   ============================================================ */
function handleAddPart(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Récupérer les valeurs
    const name = formData.get('name').trim();
    const sku = formData.get('sku').trim();
    const category = formData.get('category').trim();
    const brand = formData.get('brand').trim();
    const price = parseFloat(formData.get('price'));
    const quantity = parseInt(formData.get('quantity'));
    const description = formData.get('description').trim();
    const compatibleRaw = formData.get('compatible').trim();
    const model3d = formData.get('model3d').trim();
    const room = formData.get('room').trim();
    const shelf = formData.get('shelf').trim();
    const level = parseInt(formData.get('level'));
    const box = parseInt(formData.get('box'));

    // Validation
    if (!name || !sku || !category || !brand) {
        alert('❌ Veuillez remplir tous les champs obligatoires.');
        return;
    }

    if (isNaN(price) || price < 0) {
        alert('❌ Le prix doit être un nombre positif.');
        return;
    }

    if (isNaN(quantity) || quantity < 0) {
        alert('❌ La quantité doit être un nombre positif.');
        return;
    }

    // Construire l'objet pièce
    const newPart = {
        name: name,
        sku: sku,
        category: category,
        brand: brand,
        price: price,
        quantity: quantity,
        description: description || 'Aucune description.',
        compatible: compatibleRaw
            ? compatibleRaw.split(',').map(s => s.trim()).filter(s => s)
            : ['Universel'],
        model3d: model3d || '',
        image: makeSvgImage(category, name), // Générer une image SVG
        location: {
            room: room,
            shelf: shelf,
            level: level,
            box: box
        }
    };

    // Ajouter à la base de données
    inventoryDB.add(newPart);

    // Notification
    alert('✅ Pièce ajoutée avec succès !');

    // Réinitialiser le formulaire
    form.reset();

    // Mettre à jour l'affichage
    updateStats();
    renderPartsTable();
}

/* ============================================================
   Mise à jour des statistiques
   ============================================================ */
function updateStats() {
    const parts = inventoryDB.parts;

    if (!parts || parts.length === 0) {
        document.getElementById('statTotal').textContent = '0';
        document.getElementById('statCategories').textContent = '0';
        document.getElementById('statLowStock').textContent = '0';
        document.getElementById('statValue').textContent = '0';
        return;
    }

    // Nombre total de pièces
    const total = parts.length;

    // Nombre de catégories uniques
    const categories = [...new Set(parts.map(p => p.category))].length;

    // Pièces en stock faible (< 5)
    const lowStock = parts.filter(p => p.quantity < 5).length;

    // Valeur totale du stock
    const totalValue = parts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    // Affichage
    document.getElementById('statTotal').textContent = total;
    document.getElementById('statCategories').textContent = categories;
    document.getElementById('statLowStock').textContent = lowStock;
    document.getElementById('statValue').textContent = totalValue.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/* ============================================================
   Affichage du tableau des pièces
   ============================================================ */
function renderPartsTable() {
    const tbody = document.getElementById('partsTableBody');
    const parts = inventoryDB.parts;

    if (!parts || parts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:2rem; color:#7f8c8d;">
                    Aucune pièce dans le stock.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = parts.map(p => `
        <tr>
            <td><code>${p.sku}</code></td>
            <td>${p.name}</td>
            <td><span class="badge-category">${p.category}</span></td>
            <td class="${p.quantity < 5 ? 'low-stock' : ''}">
                ${p.quantity} ${p.quantity < 5 ? '⚠️' : ''}
            </td>
            <td>${p.price.toFixed(2)} MAD</td>
            <td>${p.location.room} / ${p.location.shelf}-${p.location.level}-${p.location.box}</td>
            <td>
                <button class="btn-delete" onclick="deletePart('${p.id}')" title="Supprimer">🗑️</button>
            </td>
        </tr>
    `).join('');
}

/* ============================================================
   Suppression d'une pièce
   ============================================================ */
function deletePart(id) {
    const part = inventoryDB.getById(id);
    if (!part) return;

    if (!confirm(`Voulez-vous vraiment supprimer « ${part.name} » ?`)) {
        return;
    }

    inventoryDB.delete(id);
    updateStats();
    renderPartsTable();
}
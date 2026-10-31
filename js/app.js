/* ============================================================
   app.js — Logique de la page principale
   - Recherche interactive avec suggestions
   - Affichage des cartes avec images
   - Ouverture des détails au clic
   - Lancement du viewer 3D (viewer3d.js)
   ============================================================ */

let currentViewer = null;

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const suggestions = document.getElementById('suggestions');
    const resultsGrid = document.getElementById('resultsGrid');
    const backBtn = document.getElementById('backBtn');

    /* ===== Recherche interactive ===== */
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();

        if (query.length < 2) {
            suggestions.classList.remove('show');
            if (query.length === 0) {
                document.getElementById('resultsSection').classList.add('hidden');
                document.getElementById('detailsSection').classList.add('hidden');
                document.getElementById('welcomeSection').classList.remove('hidden');
            }
            return;
        }

        const results = inventoryDB.search(query);

        if (results.length === 0) {
            suggestions.classList.remove('show');
            return;
        }

        // Suggestions (5 max)
        suggestions.innerHTML = results.slice(0, 5).map(p => `
            <div class="suggestion-item" data-id="${p.id}">
                <strong>${p.name}</strong> <small>(${p.sku})</small>
            </div>
        `).join('');
        suggestions.classList.add('show');

        // Afficher tous les résultats
        displayResults(results);
    });

    /* ===== Clic sur une suggestion ===== */
    suggestions.addEventListener('click', (e) => {
        const item = e.target.closest('.suggestion-item');
        if (item) {
            showPartDetails(item.dataset.id);
            suggestions.classList.remove('show');
            searchInput.value = '';
        }
    });

    /* ===== Fermer les suggestions en cliquant ailleurs ===== */
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
            suggestions.classList.remove('show');
        }
    });

    /* ===== Boutons de catégories rapides ===== */
    document.querySelectorAll('.quick-categories button').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.cat;
            const results = inventoryDB.parts.filter(p => p.category === cat);
            displayResults(results);
        });
    });

    /* ===== Bouton retour ===== */
    backBtn.addEventListener('click', () => {
        document.getElementById('detailsSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
        document.getElementById('welcomeSection').classList.remove('hidden');
        searchInput.value = '';

        if (currentViewer) {
            currentViewer.dispose();
            currentViewer = null;
        }
    });
});

/* ============================================================
   Affichage des résultats (avec images)
   ============================================================ */
function displayResults(parts) {
    const grid = document.getElementById('resultsGrid');
    const section = document.getElementById('resultsSection');
    const welcome = document.getElementById('welcomeSection');

    if (!parts || parts.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column:1/-1; padding:2rem;">❌ Aucun résultat</p>';
    } else {
        grid.innerHTML = parts.map(p => `
            <div class="part-card" data-id="${p.id}">
                <div class="part-card-image">
                    <img src="${p.image}" alt="${p.name}" loading="lazy">
                    ${p.model3d ? '<span class="badge-3d">🧊 3D</span>' : ''}
                </div>
                <div class="part-card-body">
                    <h3>${p.name}</h3>
                    <div class="card-sku">🔖 ${p.sku}</div>
                    <div class="card-sku">📂 ${p.category} • ${p.brand}</div>
                    <div class="card-qty">📦 Quantité : ${p.quantity}</div>
                    <div class="card-price">💰 ${p.price.toFixed(2)} MAD</div>
                </div>
            </div>
        `).join('');
    }

    welcome.classList.add('hidden');
    section.classList.remove('hidden');
    document.getElementById('detailsSection').classList.add('hidden');

    // Clic sur une carte
    grid.querySelectorAll('.part-card').forEach(card => {
        card.addEventListener('click', () => showPartDetails(card.dataset.id));
    });
}

/* ============================================================
   Affichage des détails d'une pièce
   ============================================================ */
function showPartDetails(id) {
    const part = inventoryDB.getById(id);
    if (!part) return;

    // Masquer les autres sections
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('welcomeSection').classList.add('hidden');
    document.getElementById('detailsSection').classList.remove('hidden');

    // Remplir les données
    document.getElementById('partName').textContent = part.name;
    document.getElementById('partSku').textContent = part.sku;
    document.getElementById('partCategory').textContent = part.category;
    document.getElementById('partBrand').textContent = part.brand;
    document.getElementById('partPrice').textContent = part.price.toFixed(2);
    document.getElementById('partQty').textContent = part.quantity;
    document.getElementById('partDesc').textContent = part.description || 'Aucune description.';

    // Compatibilité
    document.getElementById('partCompatible').innerHTML =
        (part.compatible || []).map(c => `<li>${c}</li>`).join('') || '<li>—</li>';

    // Localisation
    document.getElementById('roomLabel').textContent = `🏠 ${part.location.room}`;
    document.getElementById('locRoom').textContent = part.location.room;
    document.getElementById('locShelf').textContent = `Étagère ${part.location.shelf}`;
    document.getElementById('locLevel').textContent = `Niveau ${part.location.level}`;
    document.getElementById('locBox').textContent = `Boîte ${part.location.box}`;

    // Visualisation des étagères
    const shelves = ['A', 'B', 'C', 'D', 'E'];
    document.getElementById('shelfVisual').innerHTML = shelves.map(s => `
        <div class="shelf-unit ${s === part.location.shelf ? 'active' : ''}">
            <div style="position:absolute; bottom:-20px; width:100%; text-align:center; font-size:0.8rem;">${s}</div>
        </div>
    `).join('');

    // Charger le viewer 3D
    load3DViewer(part.model3d);
}

/* ============================================================
   Chargement du viewer 3D
   ============================================================ */
function load3DViewer(modelUrl) {
    const container = document.getElementById('viewer3D');

    // Nettoyer le viewer précédent
    if (currentViewer) {
        currentViewer.dispose();
        currentViewer = null;
    }

    // Vérifier que la classe Viewer3D existe
    if (typeof Viewer3D === 'undefined') {
        console.warn("Viewer3D n'est pas chargé (viewer3d.js manquant).");
        container.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;text-align:center;padding:20px;">
                <div>
                    <p style="font-size:2rem;">⚠️</p>
                    <p>Viewer 3D non chargé</p>
                    <p style="font-size:0.85rem;opacity:0.7;">Vérifiez js/viewer3d.js</p>
                </div>
            </div>
        `;
        return;
    }

    // Vérifier que Three.js est chargé
    if (typeof THREE === 'undefined') {
        console.warn("Three.js n'est pas chargé.");
        container.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;text-align:center;padding:20px;">
                <div>
                    <p style="font-size:2rem;">⚠️</p>
                    <p>Three.js non chargé</p>
                    <p style="font-size:0.85rem;opacity:0.7;">Vérifiez votre connexion Internet.</p>
                </div>
            </div>
        `;
        return;
    }

    // Créer le viewer
    try {
        currentViewer = new Viewer3D(container, modelUrl);
    } catch (err) {
        console.error('Erreur lors de la création du viewer 3D:', err);
        container.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;text-align:center;padding:20px;">
                <div>
                    <p style="font-size:2rem;">⚠️</p>
                    <p>Erreur du viewer 3D</p>
                    <p style="font-size:0.85rem;opacity:0.7;">${err.message}</p>
                </div>
            </div>
        `;
    }
}
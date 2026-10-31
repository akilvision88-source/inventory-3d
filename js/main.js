/* ============================================================
   AutoPièces Pro — main.js (version finale sécurisée)
   - Affiche les cartes immédiatement
   - Clic sur image → ouvre le modal (toujours)
   - Three.js chargé en arrière-plan (si dispo → 3D, sinon → message)
   ============================================================ */

let THREE = null;
let GLTFLoader = null;
let OrbitControls = null;
let threeReady = false;

let currentRenderer = null;
let currentControls = null;
let animationId = null;

/* ===== INITIALISATION AU CHARGEMENT ===== */
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== main.js démarré ===');

    if (typeof partsData === 'undefined') {
        document.getElementById('results').innerHTML =
            '<p class="no-results" style="color:red;">❌ data.js non chargé</p>';
        return;
    }

    console.log('✅ Pièces :', partsData.length);

    // 1) Afficher les cartes IMMÉDIATEMENT
    displayResults(partsData);

    // 2) Attacher les événements
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cat = btn.dataset.category;
            displayResults(filterByCategory(cat));
            document.getElementById('resultsTitle').textContent =
                cat === "Tout" ? "Toutes les pièces" : `Catégorie : ${cat}`;
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // 3) Charger Three.js en arrière-plan (sans bloquer)
    loadThreeJS();
});

/* ===== CHARGEMENT ASYNCHRONE DE THREE.JS ===== */
async function loadThreeJS() {
    try {
        console.log('⏳ Chargement de Three.js...');
        THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
        const gltfMod = await import('https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js');
        GLTFLoader = gltfMod.GLTFLoader;
        const orbitMod = await import('https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js');
        OrbitControls = orbitMod.OrbitControls;
        threeReady = true;
        console.log('✅ Three.js prêt');
    } catch (err) {
        console.warn('⚠️ Three.js non chargé (3D désactivée) :', err.message);
        threeReady = false;
    }
}

/* ===== RECHERCHE ===== */
function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const results = findParts(query);
    displayResults(results);
    document.getElementById('resultsTitle').textContent =
        query ? `Résultats pour « ${query} » (${results.length})` : `Toutes les pièces (${results.length})`;
}

/* ===== AFFICHAGE DES CARTES ===== */
function displayResults(parts) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (!parts || parts.length === 0) {
        resultsDiv.innerHTML = '<p class="no-results">❌ Aucune pièce trouvée.</p>';
        return;
    }

    parts.forEach(part => {
        const card = document.createElement('div');
        card.className = 'part-card';

        const has3d = part.model3d && part.model3d.trim() !== '';
        const badge3d = has3d ? '<span class="badge-3d">🧊 Vue 3D</span>' : '';

        card.innerHTML = `
            <div class="part-image-wrapper" style="cursor:pointer;">
                <img src="${part.image}" alt="${part.name}" class="part-image"
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/400x200?text=Pas+d+image'">
                ${badge3d}
                <div class="image-overlay"><span>🔍 Voir en 3D</span></div>
            </div>
            <div class="part-card-body">
                <div class="part-card-header">
                    <h3>${part.name}</h3>
                    <span class="badge">${part.category}</span>
                </div>
                <p class="part-ref">Réf: ${part.ref}</p>
                <p class="part-location">📍 ${part.location}</p>
                <div class="part-footer">
                    <span class="part-qty ${part.qty < 10 ? 'low-stock' : ''}">
                        ${part.qty} en stock ${part.qty < 10 ? '⚠️' : ''}
                    </span>
                    <span class="part-price">${formatPrice(part.price)}</span>
                </div>
            </div>
        `;

        // Événement clic sur l'image
        const wrapper = card.querySelector('.part-image-wrapper');
        wrapper.addEventListener('click', function () {
            console.log('Clic sur :', part.name);
            openModal(part);
        });

        resultsDiv.appendChild(card);
    });
}

/* ===== MODAL ===== */
window.openModal = function (part) {
    console.log('openModal appelé pour :', part.name);

    const modal = document.getElementById('modal3d');
    if (!modal) {
        console.error('modal3d introuvable dans le DOM');
        return;
    }

    modal.style.display = 'flex';

    document.getElementById('modalName').textContent = part.name;
    document.getElementById('modalCategory').textContent = part.category;
    document.getElementById('modalRef').textContent = part.ref;
    document.getElementById('modalCompatibility').textContent = part.compatibility || 'Non spécifiée';
    document.getElementById('modalLocation').textContent = part.location;
    document.getElementById('modalQty').textContent = part.qty + ' unité(s)';
    document.getElementById('modalPrice').textContent = formatPrice(part.price);
    document.getElementById('modalSupplier').textContent = part.supplier || 'Non spécifié';

    const qtyEl = document.getElementById('modalQty');
    qtyEl.className = 'info-value' + (part.qty < 10 ? ' low-stock' : '');

    // 3D
    init3DViewer(part.model3d);
};

window.closeModal = function () {
    document.getElementById('modal3d').style.display = 'none';
    cleanup3D();
};

/* ===== NETTOYAGE ===== */
function cleanup3D() {
    if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    if (currentControls) { currentControls.dispose(); currentControls = null; }
    if (currentRenderer) { currentRenderer.dispose(); currentRenderer = null; }
    const c = document.getElementById('3d-container');
    if (c) c.innerHTML = '';
}

/* ===== VIEWER 3D ===== */
function init3DViewer(modelPath) {
    const container = document.getElementById('3d-container');
    container.innerHTML = '';
    cleanup3D();

    if (!modelPath || modelPath.trim() === '') {
        container.innerHTML = `
            <div class="no-3d-model">
                <p>🧊 Aucun modèle 3D disponible</p>
                <p class="hint">Cette pièce n'a pas de fichier .glb associé.</p>
            </div>
        `;
        return;
    }

    if (!threeReady) {
        container.innerHTML = `
            <div class="no-3d-model">
                <p>⚠️ Three.js non chargé</p>
                <p class="hint">Vérifiez votre connexion Internet.</p>
                <p class="hint">Fichier attendu : ${modelPath}</p>
            </div>
        `;
        return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef2f7);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    currentRenderer = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dl1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dl1.position.set(5, 5, 5);
    scene.add(dl1);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.6);
    dl2.position.set(-5, 3, -5);
    scene.add(dl2);

    const grid = new THREE.GridHelper(10, 20, 0xcccccc, 0xe0e0e0);
    grid.position.y = -0.5;
    scene.add(grid);

    const loader = new GLTFLoader();
    loader.load(
        modelPath,
        (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            model.position.x -= center.x;
            model.position.y -= center.y;
            model.position.z -= center.z;

            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) {
                const fov = camera.fov * (Math.PI / 180);
                let dist = (maxDim / (2 * Math.tan(fov / 2))) * 1.8;
                camera.position.set(dist * 0.6, dist * 0.5, dist);
            }

            scene.add(model);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.08;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 2.0;
            controls.target.set(0, 0, 0);
            currentControls = controls;

            function animate() {
                animationId = requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
            animate();
        },
        undefined,
        (error) => {
            console.warn('Erreur 3D:', error);
            container.innerHTML = `
                <div class="no-3d-model">
                    <p>⚠️ Modèle introuvable</p>
                    <p class="hint">Fichier : ${modelPath}</p>
                    <p class="hint">Vérifiez qu'il existe dans models/</p>
                </div>
            `;
        }
    );
}

/* ===== REDIMENSIONNEMENT ===== */
window.addEventListener('resize', () => {
    const container = document.getElementById('3d-container');
    if (currentRenderer && container && container.clientWidth > 0) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        currentRenderer.setSize(w, h);
        if (currentControls) {
            const camera = currentControls.object;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
    }
});
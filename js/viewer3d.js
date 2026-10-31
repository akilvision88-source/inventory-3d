/* ============================================================
   viewer3d.js — Visionneuse 3D (Three.js r128)
   - Charge un modèle .glb si disponible
   - Sinon affiche un cube 3D en rotation (forme de secours)
   - Rotation automatique + OrbitControls
   ============================================================ */

class Viewer3D {
    constructor(container, modelUrl) {
        this.container = container;
        this.modelUrl = modelUrl;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animationId = null;
        this.fallbackDiv = null;

        this.init();
    }

    /* ===== INITIALISATION ===== */
    init() {
        // Nettoyer le conteneur
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }

        const width = this.container.clientWidth || 600;
        const height = this.container.clientHeight || 500;

        // Scène
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x2c3e50);

        // Caméra
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 2, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        // Éclairage
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.35);
        backLight.position.set(-5, 3, -5);
        this.scene.add(backLight);

        // Grille au sol
        const gridHelper = new THREE.GridHelper(10, 10, 0x555555, 0x333333);
        gridHelper.position.y = -1;
        this.scene.add(gridHelper);

        // Contrôles
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.06;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 1.8;
            this.controls.target.set(0, 0, 0);
        } else {
            console.warn('OrbitControls non chargé.');
        }

        // Charger le modèle (toujours, car toutes les pièces en ont un)
        if (this.modelUrl && this.modelUrl.trim() !== '') {
            this.loadModel();
        } else {
            this.showFallbackShape("Aucun modèle 3D associé");
        }

        // Boucle d'animation
        this.animate();

        // Redimensionnement
        window.addEventListener('resize', () => this.onResize());
    }

    /* ===== CHARGEMENT DU MODÈLE ===== */
    loadModel() {
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.warn('GLTFLoader non chargé.');
            this.showFallbackShape("GLTFLoader non chargé");
            return;
        }

        const loader = new THREE.GLTFLoader();
        const modelPath = this.modelUrl;

        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;

                // Centrer le modèle
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());

                model.position.x -= center.x;
                model.position.y -= center.y;
                model.position.z -= center.z;

                // Adapter l'échelle
                const maxDim = Math.max(size.x, size.y, size.z);
                if (maxDim > 0) {
                    const scale = 2.5 / maxDim;
                    model.scale.set(scale, scale, scale);
                }

                // Ombres
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                this.scene.add(model);
                console.log('✅ Modèle 3D chargé :', modelPath);
            },
            undefined,
            (error) => {
                // ⚠️ Fichier introuvable → afficher un cube 3D en rotation
                console.warn('⚠️ Modèle introuvable, affichage du cube de secours :', modelPath);
                this.showFallbackShape("Fichier introuvable : " + modelPath.split('/').pop());
            }
        );
    }

    /* ===== FORME DE SECOURS (CUBE 3D ROTATIF) ===== */
    showFallbackShape(message) {
        // Cube 3D
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const material = new THREE.MeshPhongMaterial({
            color: 0x3498db,
            specular: 0x111111,
            shininess: 40,
            transparent: true,
            opacity: 0.85
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;

        // Arêtes blanches
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        cube.add(wireframe);

        this.scene.add(cube);

        // Message d'information
        this.fallbackDiv = document.createElement('div');
        this.fallbackDiv.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            background: rgba(0, 0, 0, 0.75);
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            text-align: center;
            pointer-events: none;
            max-width: 90%;
            font-size: 0.85rem;
            z-index: 5;
        `;
        this.fallbackDiv.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.2rem;">📦 Aperçu 3D (forme de secours)</div>
            <div style="font-size: 0.78rem; opacity: 0.85;">${message}</div>
        `;

        // S'assurer que le conteneur est positionné
        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }
        this.container.appendChild(this.fallbackDiv);
    }

    /* ===== BOUCLE D'ANIMATION ===== */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        this.renderer.render(this.scene, this.camera);
    }

    /* ===== REDIMENSIONNEMENT ===== */
    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 500;

        if (width === 0 || height === 0) return;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /* ===== NETTOYAGE ===== */
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }

        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }

        if (this.fallbackDiv && this.fallbackDiv.parentNode) {
            this.fallbackDiv.parentNode.removeChild(this.fallbackDiv);
            this.fallbackDiv = null;
        }

        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}
/* ============================================================
   data.js — Base de données de stock (inventoryDB)
   - 30 pièces avec images SVG locales
   - Prix en MAD
   - Chaque pièce a un modèle 3D (réparti sur 3 fichiers)
   ============================================================ */

/* ===== Générateur d'images SVG par catégorie ===== */
function makeSvgImage(category, name) {
    const colors = {
        "Filtration":   { bg: "#e8f4fd", fg: "#2c5282", icon: "🔵" },
        "Moteur":       { bg: "#fef3c7", fg: "#b45309", icon: "⚙️" },
        "Freinage":     { bg: "#fee2e2", fg: "#b91c1c", icon: "🛑" },
        "Suspension":   { bg: "#e0e7ff", fg: "#3730a3", icon: "🔧" },
        "Électricité":  { bg: "#fef9c3", fg: "#a16207", icon: "⚡" },
        "Camion":       { bg: "#dcfce7", fg: "#166534", icon: "🚛" },
        "Carrosserie":  { bg: "#f3e8ff", fg: "#6b21a8", icon: "🚗" },
        "Transmission": { bg: "#ffedd5", fg: "#9a3412", icon: "🔩" }
    };
    const c = colors[category] || { bg: "#f1f5f9", fg: "#475569", icon: "🔧" };
    const shortName = name.length > 30 ? name.substring(0, 30) + "…" : name;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
            <rect width="400" height="200" fill="${c.bg}"/>
            <circle cx="200" cy="80" r="45" fill="${c.fg}" opacity="0.15"/>
            <text x="200" y="95" font-size="50" text-anchor="middle" dominant-baseline="middle">${c.icon}</text>
            <text x="200" y="150" font-size="14" font-family="Arial, sans-serif" font-weight="bold"
                  fill="${c.fg}" text-anchor="middle">${shortName}</text>
            <text x="200" y="172" font-size="11" font-family="Arial, sans-serif"
                  fill="${c.fg}" opacity="0.7" text-anchor="middle">${category}</text>
        </svg>
    `.trim();
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* ===== Base de données ===== */
const inventoryDB = {
    parts: [
        // ===== FILTRATION → fuel-pump-module.glb =====
        {
            id: "1", name: "Filtre à huile Toyota Corolla", sku: "TOY-OF-2201",
            category: "Filtration", brand: "Toyota", price: 146.46, quantity: 45,
            description: "Filtre à huile d'origine de haute qualité, garantit la purification de l'huile.",
            compatible: ["Corolla 2018-2023", "Auris 2019+"],
            model3d: "models/fuel-pump-module.glb",
            image: makeSvgImage("Filtration", "Filtre à huile Toyota"),
            location: { room: "Salle A", shelf: "A", level: 2, box: 15 }
        },
        {
            id: "2", name: "Filtre à air Renault Clio IV", sku: "REN-AF-3310",
            category: "Filtration", brand: "Renault", price: 116.00, quantity: 32,
            description: "Filtre à air haute efficacité pour Clio IV et Captur.",
            compatible: ["Clio IV 2012-2019", "Captur 2013+"],
            model3d: "models/fuel-pump-module.glb",
            image: makeSvgImage("Filtration", "Filtre à air Renault"),
            location: { room: "Salle A", shelf: "A", level: 1, box: 8 }
        },
        {
            id: "3", name: "Filtre à carburant Peugeot 308", sku: "PEU-FC-4402",
            category: "Filtration", brand: "Peugeot", price: 175.75, quantity: 18,
            description: "Filtre à carburant d'origine pour Peugeot 308 et 3008.",
            compatible: ["308 2014-2021", "3008 2016+"],
            model3d: "models/fuel-pump-module.glb",
            image: makeSvgImage("Filtration", "Filtre à carburant Peugeot"),
            location: { room: "Salle A", shelf: "B", level: 3, box: 22 }
        },
        // ===== MOTEUR → fuel-pump-module.glb =====
        {
            id: "4", name: "Pompe à eau Volkswagen Golf VII", sku: "VW-WP-5501",
            category: "Moteur", brand: "Volkswagen", price: 796.74, quantity: 7,
            description: "Pompe à eau d'origine pour moteur 1.4 TSI.",
            compatible: ["Golf VII 2013-2020"],
            model3d: "models/fuel-pump-module.glb",
            image: makeSvgImage("Moteur", "Pompe à eau Volkswagen"),
            location: { room: "Salle A", shelf: "C", level: 1, box: 5 }
        },
        {
            id: "5", name: "Courroie de distribution Ford Focus", sku: "FOR-TB-6601",
            category: "Moteur", brand: "Ford", price: 644.42, quantity: 12,
            description: "Courroie de distribution d'origine pour Focus diesel.",
            compatible: ["Focus 1.6 TDCi 2011-2018"],
            model3d: "models/fuel-pump-module.glb",
            image: makeSvgImage("Moteur", "Courroie Ford"),
            location: { room: "Salle A", shelf: "C", level: 2, box: 11 }
        },
        // ===== FREINAGE → double-wishbone.glb =====
        {
            id: "6", name: "Plaquettes de frein avant BMW Série 3", sku: "BMW-BP-7701",
            category: "Freinage", brand: "BMW", price: 1042.79, quantity: 24,
            description: "Plaquettes de frein d'origine haute performance.",
            compatible: ["Série 3 F30 2012-2019"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Freinage", "Plaquettes BMW"),
            location: { room: "Salle B", shelf: "A", level: 1, box: 30 }
        },
        {
            id: "7", name: "Disque de frein arrière Audi A4", sku: "AUD-BD-8802",
            category: "Freinage", brand: "Audi", price: 849.46, quantity: 16,
            description: "Disque de frein arrière ventilé.",
            compatible: ["A4 B8 2008-2016"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Freinage", "Disque Audi"),
            location: { room: "Salle B", shelf: "A", level: 2, box: 12 }
        },
        {
            id: "8", name: "Étrier de frein Mercedes Classe C", sku: "MER-BC-9903",
            category: "Freinage", brand: "Mercedes", price: 2460.51, quantity: 5,
            description: "Étrier de frein d'origine.",
            compatible: ["Classe C W205 2014-2021"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Freinage", "Étrier Mercedes"),
            location: { room: "Salle B", shelf: "B", level: 1, box: 3 }
        },
        {
            id: "9", name: "Liquide de frein DOT4 1L", sku: "GEN-BF-1001",
            category: "Freinage", brand: "Bosch", price: 99.59, quantity: 60,
            description: "Liquide de frein haute qualité DOT4.",
            compatible: ["Universel"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Freinage", "Liquide de frein"),
            location: { room: "Salle B", shelf: "C", level: 1, box: 40 }
        },
        {
            id: "10", name: "Flexible de frein avant Seat Ibiza", sku: "SEA-BH-2204",
            category: "Freinage", brand: "Seat", price: 210.90, quantity: 3,
            description: "Flexible de frein haute pression.",
            compatible: ["Ibiza 6J 2008-2017"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Freinage", "Flexible Seat"),
            location: { room: "Salle B", shelf: "C", level: 2, box: 7 }
        },
        // ===== SUSPENSION → double-wishbone.glb =====
        {
            id: "11", name: "Amortisseur avant Citroën C4", sku: "CIT-SA-3305",
            category: "Suspension", brand: "Citroën", price: 1113.09, quantity: 8,
            description: "Amortisseur avant à gaz.",
            compatible: ["C4 II 2010-2018"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Suspension", "Amortisseur Citroën"),
            location: { room: "Salle C", shelf: "A", level: 1, box: 4 }
        },
        {
            id: "12", name: "Ressort de suspension arrière Opel Astra", sku: "OPE-SS-4406",
            category: "Suspension", brand: "Opel", price: 492.10, quantity: 14,
            description: "Ressort de suspension arrière d'origine.",
            compatible: ["Astra J 2009-2015"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Suspension", "Ressort Opel"),
            location: { room: "Salle C", shelf: "A", level: 2, box: 9 }
        },
        {
            id: "13", name: "Rotule de direction Fiat Punto", sku: "FIA-TR-5507",
            category: "Suspension", brand: "Fiat", price: 328.07, quantity: 22,
            description: "Rotule de direction d'origine.",
            compatible: ["Punto 2012-2018"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Suspension", "Rotule Fiat"),
            location: { room: "Salle C", shelf: "B", level: 1, box: 15 }
        },
        {
            id: "14", name: "Bras de suspension Nissan Qashqai", sku: "NIS-CA-6608",
            category: "Suspension", brand: "Nissan", price: 1406.00, quantity: 6,
            description: "Bras de suspension avant.",
            compatible: ["Qashqai J11 2014+"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Suspension", "Bras Nissan"),
            location: { room: "Salle C", shelf: "B", level: 3, box: 2 }
        },
        // ===== ÉLECTRICITÉ → dashboard.glb =====
        {
            id: "15", name: "Batterie 12V 70Ah Bosch", sku: "BOS-BAT-7709",
            category: "Électricité", brand: "Bosch", price: 1288.84, quantity: 15,
            description: "Batterie de voiture 12V 70Ah.",
            compatible: ["Universel"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Électricité", "Batterie Bosch"),
            location: { room: "Salle D", shelf: "A", level: 1, box: 20 }
        },
        {
            id: "16", name: "Alternateur Hyundai i30", sku: "HYU-ALT-8810",
            category: "Électricité", brand: "Hyundai", price: 2109.01, quantity: 4,
            description: "Alternateur d'origine.",
            compatible: ["i30 2012-2019"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Électricité", "Alternateur Hyundai"),
            location: { room: "Salle D", shelf: "A", level: 2, box: 5 }
        },
        {
            id: "17", name: "Démarreur Kia Sportage", sku: "KIA-STA-9911",
            category: "Électricité", brand: "Kia", price: 2284.76, quantity: 2,
            description: "Démarreur d'origine.",
            compatible: ["Sportage 2016-2022"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Électricité", "Démarreur Kia"),
            location: { room: "Salle D", shelf: "B", level: 1, box: 1 }
        },
        {
            id: "18", name: "Bougies d'allumage NGK (x4)", sku: "NGK-SP-1012",
            category: "Électricité", brand: "NGK", price: 374.93, quantity: 50,
            description: "Jeu de bougies d'allumage d'origine.",
            compatible: ["Universel essence"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Électricité", "Bougies NGK"),
            location: { room: "Salle D", shelf: "B", level: 2, box: 35 }
        },
        // ===== CAMION → double-wishbone.glb =====
        {
            id: "19", name: "Filtre à gasoil Volvo FH", sku: "VOL-FG-2001",
            category: "Camion", brand: "Volvo", price: 527.25, quantity: 30,
            description: "Filtre à carburant pour camions Volvo.",
            compatible: ["FH12/FH16 2012+"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Camion", "Filtre Volvo"),
            location: { room: "Salle E", shelf: "A", level: 1, box: 25 }
        },
        {
            id: "20", name: "Pompe à injection Scania R", sku: "SCA-IP-3002",
            category: "Camion", brand: "Scania", price: 9959.20, quantity: 3,
            description: "Pompe à injection haute pression.",
            compatible: ["R-series 2010-2018"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Camion", "Pompe Scania"),
            location: { room: "Salle E", shelf: "A", level: 2, box: 2 }
        },
        {
            id: "21", name: "Plaquettes de frein MAN TGX", sku: "MAN-BP-4003",
            category: "Camion", brand: "MAN", price: 1581.75, quantity: 20,
            description: "Plaquettes de frein pour camions.",
            compatible: ["TGX 2014-2020"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Camion", "Plaquettes MAN"),
            location: { room: "Salle E", shelf: "B", level: 1, box: 18 }
        },
        {
            id: "22", name: "Amortisseur de cabine Mercedes Actros", sku: "MER-CAB-5004",
            category: "Camion", brand: "Mercedes", price: 2577.67, quantity: 9,
            description: "Amortisseur de cabine.",
            compatible: ["Actros MP4 2011+"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Camion", "Amortisseur Actros"),
            location: { room: "Salle E", shelf: "B", level: 2, box: 7 }
        },
        {
            id: "23", name: "Courroie d'alternateur DAF XF", sku: "DAF-AB-6005",
            category: "Camion", brand: "DAF", price: 445.23, quantity: 11,
            description: "Courroie d'alternateur.",
            compatible: ["XF 105/106 2008-2020"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Camion", "Courroie DAF"),
            location: { room: "Salle E", shelf: "C", level: 1, box: 8 }
        },
        {
            id: "24", name: "Radiateur Iveco Stralis", sku: "IVE-RAD-7006",
            category: "Camion", brand: "Iveco", price: 7264.35, quantity: 1,
            description: "Radiateur d'origine.",
            compatible: ["Stralis 2008-2019"],
            model3d: "models/double-wishbone.glb",
            image: makeSvgImage("Camion", "Radiateur Iveco"),
            location: { room: "Salle E", shelf: "C", level: 2, box: 1 }
        },
        // ===== CARROSSERIE → dashboard.glb =====
        {
            id: "25", name: "Essuie-glaces Bosch Aerotwin (paire)", sku: "BOS-WP-8007",
            category: "Carrosserie", brand: "Bosch", price: 257.77, quantity: 40,
            description: "Essuie-glaces pare-brise.",
            compatible: ["Universel 600/450mm"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Carrosserie", "Essuie-glaces Bosch"),
            location: { room: "Salle A", shelf: "D", level: 1, box: 30 }
        },
        {
            id: "26", name: "Rétroviseur extérieur gauche Renault Mégane", sku: "REN-MIR-9008",
            category: "Carrosserie", brand: "Renault", price: 995.92, quantity: 6,
            description: "Rétroviseur extérieur gauche.",
            compatible: ["Mégane III 2008-2016"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Carrosserie", "Rétroviseur Renault"),
            location: { room: "Salle B", shelf: "D", level: 1, box: 5 }
        },
        {
            id: "27", name: "Phaque avant droit Peugeot 208", sku: "PEU-HL-1109",
            category: "Carrosserie", brand: "Peugeot", price: 1698.92, quantity: 4,
            description: "Phaque avant droit.",
            compatible: ["208 I 2012-2019"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Carrosserie", "Phaque Peugeot"),
            location: { room: "Salle B", shelf: "D", level: 2, box: 3 }
        },
        {
            id: "28", name: "Pare-chocs avant Toyota Yaris", sku: "TOY-BUM-2210",
            category: "Carrosserie", brand: "Toyota", price: 2694.84, quantity: 2,
            description: "Pare-chocs avant.",
            compatible: ["Yaris 2017-2020"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Carrosserie", "Pare-chocs Toyota"),
            location: { room: "Salle C", shelf: "D", level: 1, box: 2 }
        },
        // ===== TRANSMISSION → dashboard.glb =====
        {
            id: "29", name: "Embrayage complet LUK Volkswagen Polo", sku: "LUK-CL-3311",
            category: "Transmission", brand: "LUK", price: 3222.09, quantity: 5,
            description: "Kit d'embrayage complet.",
            compatible: ["Polo 6R 1.2 TSI 2009-2017"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Transmission", "Embrayage LUK"),
            location: { room: "Salle C", shelf: "E", level: 1, box: 4 }
        },
        {
            id: "30", name: "Boîte de vitesses reconditionnée Ford Transit", sku: "FOR-GB-4412",
            category: "Transmission", brand: "Ford", price: 14645.88, quantity: 1,
            description: "Boîte de vitesses reconditionnée.",
            compatible: ["Transit 2.2 TDCi 2011-2019"],
            model3d: "models/dashboard.glb",
            image: makeSvgImage("Transmission", "Boîte Ford"),
            location: { room: "Salle D", shelf: "E", level: 2, box: 1 }
        }
    ],

    /* ===== Recherche ===== */
    search(query) {
        if (!query || query.trim() === "") return this.parts;
        const q = query.toLowerCase().trim();
        return this.parts.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.compatible.some(c => c.toLowerCase().includes(q))
        );
    },

    /* ===== Obtenir une pièce par ID ===== */
    getById(id) {
        return this.parts.find(p => p.id === id) || null;
    },

    /* ===== Ajouter une pièce ===== */
    add(part) {
        part.id = String(Date.now());
        this.parts.push(part);
        return part;
    },

    /* ===== Supprimer une pièce ===== */
    delete(id) {
        const index = this.parts.findIndex(p => p.id === id);
        if (index !== -1) {
            this.parts.splice(index, 1);
            return true;
        }
        return false;
    }
};
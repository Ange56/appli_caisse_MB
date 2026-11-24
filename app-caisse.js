// Produits initialisés avec tes données exactes
const produitsInitiaux = [
  // Peluches
  { id: '1', nom: 'Dragon', categorie: 'Peluche', prix: 35, stock: 2 },
  { id: '2', nom: 'Clown (grand)', categorie: 'Peluche', prix: 25, stock: 2 },
  { id: '3', nom: 'Clown (petit)', categorie: 'Peluche', prix: 20, stock: 2 },
  { id: '4', nom: 'Tortues', categorie: 'Peluche', prix: 13, stock: 2 },
  { id: '5', nom: 'Raie', categorie: 'Peluche', prix: 10, stock: 1 },
  { id: '6', nom: 'Totoro (grand)', categorie: 'Peluche', prix: 15, stock: 1 },
  { id: '7', nom: 'Totoro (petit)', categorie: 'Peluche', prix: 15, stock: 1 },
  { id: '8', nom: 'Souris', categorie: 'Peluche', prix: 10, stock: 1 },
  { id: '9', nom: 'Abeille', categorie: 'Peluche', prix: 15, stock: 1},

  // Porte clés
  { id: '10', nom: 'Grenouilles', categorie: 'Porte clé', prix: 8, stock: 6 },
  { id: '11', nom: 'Souris (porte-clé)', categorie: 'Porte clé', prix: 8, stock: 1 },
  { id: '12', nom: 'Poussin', categorie: 'Porte clé', prix: 8, stock: 7 },
  { id: '13', nom: 'Poule', categorie: 'Porte clé', prix: 5, stock: 5 },
  { id: '14', nom: 'Poulpe', categorie: 'Porte clé', prix: 6, stock: 2 },
  { id: '15', nom: 'Baleine', categorie: 'Porte clé', prix: 8, stock: 3 },
  { id: '16', nom: 'Abeille', categorie: 'Porte clé', prix: 8, stock: 2 },

  // Décorations
  { id: '17', nom: 'Sucre d\'orge', categorie: 'Décoration', prix: 5, stock: 0 },
  { id: '18', nom: 'Petite guirlande', categorie: 'Décoration', prix: 3, stock: 0 },
  { id: '19', nom: 'Sapin', categorie: 'Décoration', prix: 8, stock: 0 },
  { id: '20', nom: 'Déco rétroviseur', categorie: 'Décoration', prix: 6, stock: 0 },
  { id: '21', nom: 'Dessous de verre flocon', categorie: 'Décoration', prix: 3, stock: 12 },

  // Vêtements
  { id: '22', nom: 'Mitaines', categorie: 'Vêtements', prix: 13, stock: 3 }
];

let produits = JSON.parse(localStorage.getItem('stand_produits')) || produitsInitiaux;
let ventes = JSON.parse(localStorage.getItem('stand_ventes')) || [];
let ticketCourant = [];
let categorieFiltre = 'Toutes';

function sauvegarderLocal() {
  localStorage.setItem('stand_produits', JSON.stringify(produits));
  localStorage.setItem('stand_ventes', JSON.stringify(ventes));
  render();
}

function switchTab(tabId, event) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function filtrerCategorie(cat) {
  categorieFiltre = cat;
  render();
}

function ajouterAuTicket(produitId) {
  const prod = produits.find(p => p.id === produitId);
  if (!prod || prod.stock <= 0 || prod.prix === null) return;

  prod.stock--;
  ticketCourant.push({ id: prod.id, nom: prod.nom, prix: prod.prix });
  sauvegarderLocal();
}

function AnnulerArticleTicket(index) {
  const article = ticketCourant[index];
  const prod = produits.find(p => p.id === article.id);
  if (prod) prod.stock++;
  ticketCourant.splice(index, 1);
  sauvegarderLocal();
}

function validerVente() {
  if (ticketCourant.length === 0) return;
  const total = ticketCourant.reduce((sum, item) => sum + item.prix, 0);
  ventes.push({ date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }), articles: [...ticketCourant], total });
  ticketCourant = [];
  sauvegarderLocal();
  alert('Vente validée !');
}

function sauvegarderProduit(e) {
  e.preventDefault();
  const id = document.getElementById('prod-id').value || Date.now().toString();
  const nom = document.getElementById('prod-nom').value;
  const categorie = document.getElementById('prod-categorie').value;
  const prixVal = document.getElementById('prod-prix').value;
  const prix = prixVal !== "" ? parseFloat(prixVal) : null;
  const stock = parseInt(document.getElementById('prod-stock').value);

  const existingIndex = produits.findIndex(p => p.id === id);
  if (existingIndex > -1) {
    produits[existingIndex] = { id, nom, categorie, prix, stock };
  } else {
    produits.push({ id, nom, categorie, prix, stock });
  }

  document.getElementById('form-produit').reset();
  document.getElementById('prod-id').value = '';
  document.getElementById('form-title').innerText = "Ajouter / Modifier un produit";
  sauvegarderLocal();
}

function editerProduit(id) {
  const p = produits.find(item => item.id === id);
  if (!p) return;
  document.getElementById('prod-id').value = p.id;
  document.getElementById('prod-nom').value = p.nom;
  document.getElementById('prod-categorie').value = p.categorie;
  document.getElementById('prod-prix').value = p.prix !== null ? p.prix : '';
  document.getElementById('prod-stock').value = p.stock;
  document.getElementById('form-title').innerText = "Modifier : " + p.nom;
  switchTab('produits', { target: document.querySelectorAll('nav button')[1] });
}

function supprimerProduit(id) {
  if (confirm('Supprimer ce produit ?')) {
    produits = produits.filter(p => p.id !== id);
    sauvegarderLocal();
  }
}

function exporterPDF() {
  const element = document.getElementById('pdf-report');
  const opt = {
    margin:       10,
    filename:     `bilan_marche_${new Date().toISOString().slice(0,10)}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}

function exporterDonneesJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ produits, ventes }));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `sauvegarde_marche_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importerDonneesJSON(event) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.produits) produits = data.produits;
      if (data.ventes) ventes = data.ventes;
      sauvegarderLocal();
      alert('Données réimportées !');
    } catch (err) {
      alert('Fichier JSON non valide.');
    }
  };
  reader.readAsText(event.target.files[0]);
}

function reinitialiserTout() {
  if (confirm('Réinitialiser les stocks et effacer l\'historique des ventes ?')) {
    localStorage.clear();
    produits = produitsInitiaux;
    ventes = [];
    ticketCourant = [];
    sauvegarderLocal();
  }
}

function render() {
  // 1. Filtres par catégorie
  const categoriesDisponibles = ['Toutes', ...new Set(produits.map(p => p.categorie))];
  const catFiltersContainer = document.getElementById('category-filters');
  catFiltersContainer.innerHTML = categoriesDisponibles.map(c => `
    <button class="chip-filter ${categorieFiltre === c ? 'active' : ''}" onclick="filtrerCategorie('${c}')">${c}</button>
  `).join('');

  // 2. Grille Caisse avec sections par catégorie
  const container = document.getElementById('grid-produits');
  
  const ordreCategories = ['Peluche', 'Porte clé', 'Décoration', 'Vêtements'];
  const categoriesAfficher = categorieFiltre === 'Toutes' ? ordreCategories : [categorieFiltre];

  let htmlContent = '';

  categoriesAfficher.forEach(cat => {
    const prodsCat = produits.filter(p => p.categorie === cat);
    if (prodsCat.length === 0) return;

    if (categorieFiltre === 'Toutes') {
      const titreAffichage = cat === 'Porte clé' ? 'Porte-clés' : cat + 's';
      htmlContent += `<div class="category-section"><div class="category-section-title">${titreAffichage}</div><div class="grid">`;
    } else {
      htmlContent += `<div class="grid">`;
    }

    htmlContent += prodsCat.map(p => {
      const sansPrix = p.prix === null;
      const epuise = p.stock <= 0;
      return `
        <div class="btn-product ${epuise ? 'out-of-stock' : ''} ${sansPrix ? 'no-price' : ''}" onclick="ajouterAuTicket('${p.id}')">
          <span class="title">${p.nom}</span>
          <span class="price">${sansPrix ? 'Prix à définir' : p.prix.toFixed(2) + ' €'}</span>
          <span class="stock">Stock: ${p.stock} ${epuise ? '<span class="badge-warning">ÉPUISÉ</span>' : ''}</span>
        </div>
      `;
    }).join('');

    htmlContent += `</div></div>`;
  });

  container.innerHTML = htmlContent;
  container.style.display = 'block';

  // 3. Ticket
  const ticketList = document.getElementById('ticket-list');
  ticketList.innerHTML = ticketCourant.map((item, index) => `
    <li class="history-item">
      <span>${item.nom} (${item.prix.toFixed(2)} €)</span>
      <button onclick="AnnulerArticleTicket(${index})">X</button>
    </li>
  `).join('');

  const total = ticketCourant.reduce((sum, item) => sum + item.prix, 0);
  document.getElementById('ticket-total').innerText = total.toFixed(2) + ' €';

  // 4. Table Produits
  const tbody = document.querySelector('#table-produits tbody');
  tbody.innerHTML = produits.map(p => `
    <tr>
      <td><strong>${p.nom}</strong></td>
      <td>${p.categorie}</td>
      <td>${p.prix !== null ? p.prix.toFixed(2) + ' €' : '<em style="color:var(--berry);">À définir</em>'}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editerProduit('${p.id}')" style="border:none; background:none; cursor:pointer;">✏️</button>
        <button onclick="supprimerProduit('${p.id}')" style="border:none; background:none; cursor:pointer;">🗑️</button>
      </td>
    </tr>
  `).join('');

  // 5. Bilan & PDF
  const grandTotal = ventes.reduce((sum, v) => sum + v.total, 0);
  const nbArticles = ventes.reduce((sum, v) => sum + v.articles.length, 0);
  document.getElementById('bilan-total').innerText = grandTotal.toFixed(2) + ' €';
  document.getElementById('bilan-articles').innerText = nbArticles;

  const bilanDetails = document.getElementById('bilan-details-list');
  bilanDetails.innerHTML = ventes.map(v => `
    <li class="history-item">
      <span><strong>${v.date}</strong> - ${v.articles.map(a => a.nom).join(', ')}</span>
      <strong>${v.total.toFixed(2)} €</strong>
    </li>
  `).join('');
}

render();

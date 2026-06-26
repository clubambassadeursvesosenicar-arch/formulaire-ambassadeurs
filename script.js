// ========================================
// GESTION DES ÉTAPES DU FORMULAIRE
// ========================================

let currentStep = 0;
const totalSteps = 5;

// Ratings globaux
let rating_leadership = '';
let rating_comm = '';

// ========================================
// AFFICHER/MASQUER LES SECTIONS
// ========================================
function updateFormDisplay() {
  // Masquer toutes les sections
  for (let i = 0; i < totalSteps; i++) {
    document.getElementById(`section-${i}`).classList.remove('active');
    document.getElementById(`dot-${i}`).classList.remove('active');
  }
  
  // Afficher la section actuelle
  document.getElementById(`section-${currentStep}`).classList.add('active');
  document.getElementById(`dot-${currentStep}`).classList.add('active');
  
  // Mettre à jour les lignes de progression
  for (let i = 0; i < currentStep; i++) {
    const line = document.getElementById(`line-${i}`);
    if (line) line.classList.add('active');
  }
  for (let i = currentStep; i < totalSteps - 1; i++) {
    const line = document.getElementById(`line-${i}`);
    if (line) line.classList.remove('active');
  }
  
  // Afficher le résumé à l'étape 5
  if (currentStep === 4) {
    displayRecap();
  }
  
  // Scroll vers le haut
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// NAVIGATION
// ========================================
function goNext(step) {
  if (validateStep(step)) {
    currentStep = step + 1;
    updateFormDisplay();
  }
}

function goPrev(step) {
  currentStep = step - 1;
  updateFormDisplay();
}

// ========================================
// VALIDATION PAR ÉTAPE
// ========================================
function validateStep(step) {
  let isValid = true;
  
  if (step === 0) {
    // Étape 1 : Infos personnelles
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();
    const niveau = document.getElementById('niveau').value;
    const specialite = document.getElementById('specialite').value;
    
    if (!nom || !email || !niveau || !specialite) {
      alert('❌ Veuillez remplir tous les champs obligatoires (Nom, Email, Niveau, Spécialité)');
      isValid = false;
    }
  }
  
  if (step === 1) {
    // Étape 2 : Poste & Motivation
    const poste = document.querySelector('input[name="poste"]:checked');
    const motivation = document.getElementById('motivation').value.trim();
    
    if (!poste || !motivation || motivation.split(' ').length < 20) {
      alert('❌ Sélectionnez un poste et écrivez au moins 20 mots pour votre motivation');
      isValid = false;
    }
  }
  
  if (step === 2) {
    // Étape 3 : Expériences (pas obligatoire mais on peut ajouter une validation)
    // Laissé volontairement minimaliste
  }
  
  if (step === 3) {
    // Étape 4 : Vision & Projet
    const projet = document.getElementById('projet').value.trim();
    const conflict = document.getElementById('conflict').value.trim();
    
    if (!projet || !conflict) {
      alert('❌ Remplissez les champs "Projet concret" et "Gestion des désaccords"');
      isValid = false;
    }
    
    if (!rating_leadership || !rating_comm) {
      alert('❌ Complétez les auto-évaluations (Leadership et Communication)');
      isValid = false;
    }
  }
  
  return isValid;
}

// ========================================
// GESTION DES CHOIX (RADIO/CHECKBOX)
// ========================================
function selectChoice(element, type) {
  const input = element.querySelector('input');
  
  if (type === 'radio') {
    // Désélectionner les autres radios du même groupe
    const name = input.name;
    const group = element.closest('.choices') || element.parentElement;
    group.querySelectorAll(`input[name="${name}"]`).forEach(r => {
      r.checked = false;
      r.parentElement.classList.remove('selected');
    });
    
    // Sélectionner celui-ci
    input.checked = true;
    element.classList.add('selected');
  } else if (type === 'checkbox') {
    // Toggle le checkbox
    input.checked = !input.checked;
    if (input.checked) {
      element.classList.add('selected');
    } else {
      element.classList.remove('selected');
    }
  }
}

// ========================================
// GESTION DES RATINGS
// ========================================
function setRating(category, value, btn) {
  // Mettre à jour les variables globales
  if (category === 'leadership') {
    rating_leadership = value;
  } else if (category === 'comm') {
    rating_comm = value;
  }
  
  // Mettre à jour l'affichage (ajouter 'selected' au bouton)
  const parent = btn.parentElement;
  parent.querySelectorAll('.rating-btn').forEach(b => {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
}

// ========================================
// AFFICHAGE DU RÉSUMÉ (ÉTAPE 5)
// ========================================
function displayRecap() {
  const recap = document.getElementById('recap');
  
  const nom = document.getElementById('nom').value.trim();
  const prenom = document.getElementById('prenom').value.trim();
  const date_naissance= document.getElementById('date_naissance').value || "";
  const email = document.getElementById('email').value.trim();
  const tel = document.getElementById('tel').value.trim();
  const niveau = document.getElementById('niveau').value;
  const specialite = document.getElementById('specialite').value;
  const poste = document.querySelector('input[name="poste"]:checked')?.parentElement.querySelector('.choice-text strong').textContent || 'Non défini';
  const motivation = document.getElementById('motivation').value.trim();
  const experiences = document.getElementById('experiences').value.trim() || 'Non renseigné';
  const dispo = document.getElementById('dispo').value;
  const vision = document.getElementById('vision').value.trim();
  const projet = document.getElementById('projet').value.trim();
  
  recap.innerHTML = `
    <div style="background:var(--bg-light);padding:16px;border-radius:8px;font-size:0.9rem;">
      <h4 style="margin-top:0;color:var(--primary);">📋 Résumé de votre candidature</h4>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px;">
        <div><strong>Nom :</strong> ${nom} ${prenom}</div>
        <div><strong>Email :</strong> ${email}</div>
        <div><strong>Niveau :</strong> ${niveau}</div>
        <div><strong>Spécialité :</strong> ${specialite}</div>
        <div><strong>Poste :</strong> ${poste}</div>
        <div><strong>Disponibilité :</strong> ${dispo}</div>
      </div>
      
      <p style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);"><strong>Motivation :</strong> <br>${motivation.substring(0, 150)}${motivation.length > 150 ? '...' : ''}</p>
      
      <p style="margin-bottom:0;"><em style="color:var(--muted);">✓ Tous les champs ont été vérifiés. Cliquez ci-dessous pour confirmer.</em></p>
    </div>
  `;
}

// ========================================
// SOUMISSION GOOGLE SHEET
// ========================================
function submitForm() {
  // ✅ Validation : engagement obligatoire
  if (!document.getElementById('engagement').checked) {
    alert('❌ Vous devez confirmer votre engagement avant de soumettre.');
    return;
  }

  // ✅ Récupérer les compétences (checkboxes cochées)
  const skillsCheckboxes = document.querySelectorAll('#skills-choices input[type="checkbox"]:checked');
  const competences = Array.from(skillsCheckboxes).map(cb => cb.value).join(', ') || 'Aucune sélection';

  // 📦 Collecter TOUTES les données
  const data = {
    timestamp: new Date().toLocaleString('fr-FR'),
    nom: document.getElementById('nom').value.trim(),
    prenom: document.getElementById('prenom').value.trim(),
    date_naissance: document.getElementById('date_naissance').value || "",
    email: document.getElementById('email').value.trim(),
    telephone: document.getElementById('tel').value.trim(),
    niveau: document.getElementById('niveau').value,
    specialite: document.getElementById('specialite').value,
    poste: document.querySelector('input[name="poste"]:checked')?.value || '',
    motivation: document.getElementById('motivation').value.trim(),
    experience_club: document.querySelector('input[name="exp"]:checked')?.value || '',
    experiences: document.getElementById('experiences').value.trim(),
    competences: competences,
    disponibilite: document.getElementById('dispo').value,
    vision: document.getElementById('vision').value.trim(),
    projet: document.getElementById('projet').value.trim(),
    gestion_conflits: document.getElementById('conflict').value.trim(),
    leadership_score: rating_leadership,
    communication_score: rating_comm,
    informations_complementaires: document.getElementById('ajout').value.trim(),
    engagement_confirmed: true
  };
 
console.log(data);

  // 🌐 URL de l'Apps Script
  const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbxHzfb4uuvYdO5EgTZcAlOLal0zoSaKVChwr5pIDL2StJw1w-BLXbVMcOEvt26Lf9M1/exec';

 
  // 📤 Envoyer les données
  fetch(appsScriptUrl, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      // ✅ Marquer comme soumis dans localStorage
      localStorage.setItem('formulaire_soumis', 'true');
      
      // Afficher le message final et bloquer
      document.body.innerHTML = `
        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        ">
          <div style="
            background: white;
            padding: 60px 40px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 500px;
          ">
            <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
            <h2 style="margin: 0 0 10px 0; color: #333;">Candidature enregistrée !</h2>
            <p style="color: #666; font-size: 16px; margin: 0 0 20px 0;">
              Merci pour votre engagement envers le Club Ambassadeurs SOS Villages d'Enfants.
            </p>
            <p style="color: #999; font-size: 14px; margin: 0;">
              Votre candidature a été enregistrée avec succès.<br>
              ⚠️ Vous ne pouvez pas remplir ce formulaire à nouveau.
            </p>
          </div>
        </div>
      `;
    } else {
      alert('❌ Erreur lors de l\'enregistrement. Veuillez réessayer.');
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    alert('❌ Une erreur s\'est produite lors de l\'envoi.\nVérifiez votre connexion et réessayez.');
  });
}
// ========================================
// VÉRIFIER SI DÉJÀ SOUMIS
// ========================================
function checkIfAlreadySubmitted() {
  const alreadySubmitted = localStorage.getItem('formulaire_soumis');
  
  if (alreadySubmitted) {
    alert('⚠️ Vous avez déjà soumis ce formulaire.\nVous n\'avez pas le droit de le remplir à nouveau.');
    // Bloquer l'accès
    document.body.innerHTML = '<div style="padding:40px;text-align:center;"><h2>Accès refusé</h2><p>Vous avez déjà soumis votre candidature.</p></div>';
    return false;
  }
  return true;
}

// ========================================
// INITIALISATION AU CHARGEMENT
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  checkIfAlreadySubmitted();  // Vérif au chargement
  updateFormDisplay();
});

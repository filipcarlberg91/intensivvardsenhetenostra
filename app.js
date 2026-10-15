/**
 * IVA Dokumenthub - Applikationslogik & Tillståndshantering
 * Intensivvårdsapplikation med lokal IndexedDB-lagring, flytande meny,
 * rutnätsvy, sid- och totalsökning samt dokumenthantering.
 */

class IvaDocApp {
  constructor() {
    this.dbName = "IVADokumentDB";
    this.dbVersion = 1;
    this.db = null;

    this.activeCategory = "HOME"; // Standardvy: Startsida
    this.currentViewMode = "grid"; // 'grid' eller 'list'
    this.currentSort = "date-desc"; // 'date-desc', 'title-asc', 'priority', 'size-desc'
    this.pageSearchQuery = "";
    this.globalSearchQuery = "";

    this.documents = [];
    this.categories = CATEGORIES;

    // Google-konto och användarens personliga favoriter
    this.currentUser = this.loadCurrentUser();
    this.userFavorites = this.loadUserFavorites();

    // Läkemedel, Doskalkylator & Blandbarhet i CVK
    this.currentDrugTab = "calc"; // 'calc', 'recipes', 'compat'
    this.calcWeight = 70;
    this.calcDrugId = "noradrenalin";
    this.calcDose = 0.10;
    this.calcRate = 4.2;
    this.drugSearchQuery = "";
    this.compatDrugA = "noradrenalin";
    this.compatDrugB = "furosemid";

    this.pendingUploadFile = null;

    // FAB-meny & Min Sida tillstånd
    this.fabMenuOpen = false;
    this.myPageCategoryFilter = "ALL";
    this.myPageSearchQuery = "";

    // Notiser & Ändringshistorik
    this.notifications = this.loadNotifications();
    this.notificationDropdownOpen = false;

    // Rollbaserad behörighet (RBAC) & Inbjudna redaktörer
    this.ownerEmail = "filipcarlberg91@gmail.com";
    this.authorizedEditors = this.loadAuthorizedEditors();
    this.simulateReadOnly = false;
    this.defaultAdminPasswordHash = "62ffb63c763cd2ddbe1dbafa3b79949a6321a4ad709609b85adec034ae7f2543"; // Default: Sahlgrenska2026!
    this.pendingLoginUser = null;

    // Sjukdomstillstånd på IVA
    this.selectedDiseaseId = "circ-failure";
    this.diseaseSearchQuery = "";

    // Smärta och Sedering (CPOT & RASS)
    this.painSedationTab = "cpot"; // 'cpot', 'rass'
    this.cpotScores = { facial: 0, movements: 0, muscle_tone: 0, vent_or_vocal: 0 };
    this.selectedRassScore = 0;

    // Start av arbetspass - Klinisk Checklista (12 punkter)
    this.shiftChecklist = this.loadShiftChecklist();

    // Chrome Reader Mode för PM & Dokumentvisare
    this.readerFontSize = 18; // px
    this.readerTheme = "light"; // 'light', 'sepia', 'dark'
    this.readerLineHeight = 1.8;
    this.currentViewingDoc = null;

    // Syra-Bas Balans & Blodgaskalkylator (Radiometer ABL slip Bild 1 + Ventilator)
    this.abpH = 7.433;
    this.abpCO2 = 5.03; // kPa
    this.abpO2 = 11.5; // kPa
    this.abHCO3 = 25.2; // mmol/L
    this.abBE = 0.9; // mmol/L
    this.abHct = 0.339; // decimal
    this.abctHb = 111; // g/L
    this.absO2 = 97.8; // %
    this.abFCOHb = 1.2; // %
    this.abFMetHb = 0.2; // %
    this.abNa = 140; // mmol/L
    this.abK = 4.4; // mmol/L
    this.abCa = 1.11; // mmol/L
    this.abCl = 108; // mmol/L
    this.abGlu = 7.0; // mmol/L
    this.abLactate = 0.5; // mmol/L
    this.abAlbumin = 40; // g/L
    // Ventilatorparametrar kopplade till blodgasen
    this.abFiO2 = 40; // % (t.ex. 40% = 0.40)
    this.abVentPEEP = 8; // cmH2O
    this.abVentAF = 16; // andetag/minut
    this.abVentVt = 450; // ml
    this.abVentPBW = 70; // kg idealvikt

    // Dropptaktskalkylator
    this.dripVolume = 1000; // ml
    this.dripTimeHours = 8; // h
    this.dripTimeMinutes = 0; // min
    this.dripSelectedFactor = 20; // 20 drp/ml

    // Östra Excel Vätskebalanskalkylator (Bild 2)
    this.excelFluidData = this.loadExcelFluidData();

    // Vätskebalans & Vätsketyper
    this.fluidAdmissionWeight = 75; // kg
    this.fluidCumulativeBalance = 4.2; // Liter
    this.fluidCurrentTab = "excel"; // 'excel', 'calc', 'drip', 'types', 'blood', 'rose', 'fo'
    this.selectedFluidId = "ringer-acetat";

    // Vätskebalanskalkylator & Diuresmål (24h)
    this.fluidCalcWeight = 75; // kg
    this.fluidCalcTargetBalance = 0; // ml
    this.fluidInCrystalloids = 1500; // ml
    this.fluidInGlucose5 = 500; // ml
    this.fluidInGlucose10 = 0; // ml
    this.fluidInDrugs = 350; // ml
    this.fluidInEnteral = 1000; // ml
    this.fluidInTPN = 0; // ml
    this.fluidInBlood = 0; // ml
    this.fluidInOther = 0; // ml
    this.fluidOutStomach = 150; // ml
    this.fluidOutDrains = 100; // ml
    this.fluidOutStoma = 0; // ml
    this.fluidOutCRRT = 0; // ml
    this.fluidOutPerspiratio = 750; // ml

    // Apparatur & Servo-U Ventilator
    this.equipCurrentTab = "overview"; // 'overview', 'modes', 'diagnostics', 'alarms', 'calc'
    this.equipSelectedMode = "prvc";
    this.equipPatientGender = "male";
    this.equipPatientHeight = 178; // cm
    this.equipPatientVtSetting = 6; // ml/kg PBW
    this.equipMeasuredPplat = 22; // cmH2O
    this.equipMeasuredPEEP = 10; // cmH2O
    this.equipMeasuredVt = 440; // ml
    this.equipMeasuredRR = 18; // andetag/min

    // Nutritionskalkylator (ESPEN & Kaloritabell IVA 343)
    this.nutrCurrentTab = "calc"; // 'calc', 'calories', 'targets'
    this.nutrWeight = 75; // kg
    this.nutrHeight = 178; // cm
    this.nutrGender = "male"; // 'male' eller 'female'
    this.nutrAge = 62; // år
    this.nutrPhase = "early"; // 'early', 'stable', 'recovery'
    this.nutrCondition = "standard"; // 'standard', 'crrt', 'burn', 'obesity'
    this.nutrPropofolRate = 15; // ml/h (10 mg/ml)
    this.nutrGlucoseVol = 0; // ml 5% glukos/dygn
    this.nutrCitrateCcal = 0; // kcal från citratdialys
    this.nutrSelectedFormula = "fresubin-hp-energy";
    this.nutrSelectedCalorieAmounts = {};
    this.calorieSearchQuery = "";
  }

  // =========================================================================
  // Hjälpmetoder för lokal lagring av Skiftchecklista & Excel-vätskebalans
  // =========================================================================

  loadShiftChecklist() {
    try {
      const stored = localStorage.getItem("iva_shift_checklist");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    const template = typeof SHIFT_CHECKLIST_TEMPLATE !== "undefined" ? SHIFT_CHECKLIST_TEMPLATE : [];
    return template.map(item => ({
      ...item,
      checked: false,
      notes: ""
    }));
  }

  saveShiftChecklist() {
    try {
      localStorage.setItem("iva_shift_checklist", JSON.stringify(this.shiftChecklist));
    } catch (e) {}
  }

  loadExcelFluidData() {
    try {
      const stored = localStorage.getItem("iva_excel_fluid_data");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      weight: 75,
      periodHours: 24,
      targetBalance: 0,
      inCrystalloids: 1500,
      inGlucose5: 500,
      inGlucose10: 0,
      inDrugs: 350,
      inEnteral: 1000,
      inTPN: 0,
      inBlood: 0,
      inOther: 100,
      outUrine: 1600,
      outStomach: 150,
      outDrains: 100,
      outStoma: 0,
      outCRRT: 0,
      outPerspiratio: 750,
      outOther: 0,
      notes: ""
    };
  }

  saveExcelFluidData() {
    try {
      localStorage.setItem("iva_excel_fluid_data", JSON.stringify(this.excelFluidData));
    } catch (e) {}
  }

  // =========================================================================
  // Google Inloggning & Favorithantering
  // =========================================================================

  loadCurrentUser() {
    try {
      const u = localStorage.getItem("iva_google_user");
      if (u) {
        const user = JSON.parse(u);
        if (user.email === "filip.iva@gmail.com") {
          user.email = this.ownerEmail;
          localStorage.setItem("iva_google_user", JSON.stringify(user));
        }
        return user;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  loadUserFavorites() {
    if (!this.currentUser || !this.currentUser.email) return [];
    try {
      const favs = localStorage.getItem(`iva_favorites_${this.currentUser.email}`);
      return favs ? JSON.parse(favs) : [];
    } catch (e) {
      return [];
    }
  }

  saveUserFavorites() {
    if (!this.currentUser || !this.currentUser.email) return;
    try {
      localStorage.setItem(`iva_favorites_${this.currentUser.email}`, JSON.stringify(this.userFavorites));
    } catch (e) {}
  }

  loadAuthorizedEditors() {
    try {
      const stored = localStorage.getItem("iva_authorized_editors");
      if (stored) {
        let list = JSON.parse(stored);
        if (Array.isArray(list) && list.length > 0) {
          // Rensa eventuell tidigare test-adress
          list = list.filter((e) => e.email.toLowerCase() !== "filip.iva@gmail.com");
          if (!list.some((e) => e.email.toLowerCase() === this.ownerEmail.toLowerCase())) {
            list.unshift({
              email: this.ownerEmail,
              name: "Filip",
              role: "OWNER",
              addedAt: new Date().toISOString()
            });
          }
          return list;
        }
      }
    } catch (e) {
      console.warn("Kunde inte läsa in behöriga redaktörer:", e);
    }

    return [
      {
        email: this.ownerEmail,
        name: "Filip",
        role: "OWNER",
        addedAt: new Date().toISOString()
      }
    ];
  }

  saveAuthorizedEditors() {
    try {
      localStorage.setItem("iva_authorized_editors", JSON.stringify(this.authorizedEditors));
    } catch (e) {
      console.warn("Kunde inte spara behöriga redaktörer:", e);
    }
  }

  canUserEdit() {
    if (this.simulateReadOnly) return false;
    if (!this.currentUser || !this.currentUser.email) return false;
    const email = this.currentUser.email.trim().toLowerCase();

    // 1. Ägaren har alltid redaktörsbehörighet
    if (email === this.ownerEmail.toLowerCase()) return true;

    // 2. Inbjudna redaktörer har behörighet
    return this.authorizedEditors.some(
      (ed) => ed.email && ed.email.trim().toLowerCase() === email
    );
  }

  isUserOwner() {
    if (!this.currentUser || !this.currentUser.email) return false;
    return this.currentUser.email.trim().toLowerCase() === this.ownerEmail.toLowerCase();
  }

  isEmailAuthorizedEditor(email) {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    if (clean === this.ownerEmail.toLowerCase()) return true;
    return this.authorizedEditors.some(
      (ed) => ed.email && ed.email.trim().toLowerCase() === clean
    );
  }

  getAdminPasswordHash() {
    try {
      const stored = localStorage.getItem("iva_admin_password_hash");
      if (stored === "8056f0dac1831936cc36393e9793a9566505219fc56d015db83460d0cf704005") {
        localStorage.removeItem("iva_admin_password_hash");
        return this.defaultAdminPasswordHash;
      }
      if (stored && typeof stored === "string" && stored.length > 10) {
        return stored;
      }
    } catch (e) {}
    return this.defaultAdminPasswordHash;
  }

  setAdminPasswordHash(hash) {
    try {
      localStorage.setItem("iva_admin_password_hash", hash);
    } catch (e) {
      console.warn("Kunde inte spara admin-lösenordshash:", e);
    }
  }

  async computeSha256(text) {
    if (window.crypto && window.crypto.subtle) {
      try {
        const enc = new TextEncoder().encode(text);
        const buf = await window.crypto.subtle.digest("SHA-256", enc);
        return Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
      } catch (err) {
        console.warn("crypto.subtle ej tillgängligt, fallback:", err);
      }
    }
    // Deterministisk SHA-256 fallback
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return "hash_" + Math.abs(hash);
  }

  getUserRole() {
    if (this.simulateReadOnly) return "VIEWER";
    if (this.isUserOwner()) return "OWNER";
    if (this.canUserEdit()) return "EDITOR";
    return "VIEWER";
  }

  updatePermissionsUI() {
    const canEdit = this.canUserEdit();
    const isOwnerOrEditor = this.isUserOwner() || this.authorizedEditors.some(
      (e) => this.currentUser && e.email.toLowerCase() === this.currentUser.email.toLowerCase()
    );

    // 1. Topphuvud: Ladda upp knapp
    const btnUpload = document.getElementById("btnHeaderUpload");
    if (btnUpload) {
      btnUpload.style.display = canEdit ? "inline-flex" : "none";
    }

    // 2. Topphuvud: Behörigheter-knapp (visas för inloggad ägare/redaktör)
    const btnPermissions = document.getElementById("btnHeaderPermissions");
    if (btnPermissions) {
      btnPermissions.style.display = isOwnerOrEditor ? "inline-flex" : "none";
    }

    // 3. Dokumentvisare: Redigera & Ta bort
    const viewerEditBtn = document.getElementById("viewerEditBtn");
    if (viewerEditBtn) {
      viewerEditBtn.style.display = canEdit ? "inline-flex" : "none";
    }
    const viewerDeleteBtn = document.getElementById("viewerDeleteBtn");
    if (viewerDeleteBtn) {
      viewerDeleteBtn.style.display = canEdit ? "inline-flex" : "none";
    }

    // 4. Testläge Banner
    const simBanner = document.getElementById("simulateReadOnlyBanner");
    if (simBanner) {
      simBanner.style.display = this.simulateReadOnly ? "block" : "none";
    }
  }

  openPermissionsModal() {
    const isOwnerOrEditor = this.isUserOwner() || this.authorizedEditors.some(
      (e) => this.currentUser && e.email.toLowerCase() === this.currentUser.email.toLowerCase()
    );
    if (!isOwnerOrEditor) {
      this.showToast("Kräver administratörsbehörighet 🔒");
      return;
    }
    this.renderAuthorizedEditorsList();
    const modal = document.getElementById("permissionsModal");
    if (modal) modal.classList.add("is-open");
  }

  closePermissionsModal() {
    const modal = document.getElementById("permissionsModal");
    if (modal) modal.classList.remove("is-open");
  }

  renderAuthorizedEditorsList() {
    const listEl = document.getElementById("authorizedEditorsList");
    const countBadge = document.getElementById("authorizedEditorsCountBadge");
    if (!listEl) return;

    if (countBadge) {
      countBadge.textContent = this.authorizedEditors.length;
    }

    listEl.innerHTML = this.authorizedEditors
      .map((ed) => {
        const isOwner = ed.email.toLowerCase() === this.ownerEmail.toLowerCase();
        const initial = (ed.name || ed.email || "U").charAt(0).toUpperCase();
        const addedDate = ed.addedAt ? new Date(ed.addedAt).toLocaleDateString("sv-SE") : "Aktiv";

        return `
          <div class="authorized-editor-item">
            <div class="editor-info-left">
              <div class="editor-avatar-circle" style="background: ${isOwner ? '#b45309' : '#0284c7'};">
                ${initial}
              </div>
              <div class="editor-details">
                <div class="editor-name">
                  ${this.escapeHtml(ed.name || ed.email)}
                  <span class="user-role-tag ${isOwner ? 'owner' : 'editor'}">
                    ${isOwner ? '👑 Huvudägare' : '✏️ Redaktör'}
                  </span>
                </div>
                <div class="editor-email">${this.escapeHtml(ed.email)} • Tillagd ${addedDate}</div>
              </div>
            </div>
            <div class="editor-actions-right">
              ${isOwner ? `
                <span style="font-size:0.75rem; color:#94a3b8; font-weight:600; padding:0.2rem 0.5rem;">Standard</span>
              ` : `
                <button type="button" class="btn-revoke-editor" onclick="app.revokeEditorPermission('${this.escapeHtml(ed.email)}')">
                  Ta bort behörighet
                </button>
              `}
            </div>
          </div>
        `;
      })
      .join("");
  }

  handleInviteEditorSubmit() {
    const emailInput = document.getElementById("inviteEmailInput");
    const nameInput = document.getElementById("inviteNameInput");
    if (!emailInput) return;

    const email = (emailInput.value || "").trim().toLowerCase();
    const name = (nameInput?.value || "").trim();

    if (!email || !email.includes("@")) {
      alert("Ange en giltig Google e-postadress.");
      return;
    }

    if (email === this.ownerEmail.toLowerCase()) {
      alert("Detta konto är redan registrerat som Huvudägare.");
      return;
    }

    if (this.authorizedEditors.some((e) => e.email.toLowerCase() === email)) {
      alert(`Kontot "${email}" har redan redaktörsbehörighet.`);
      return;
    }

    this.authorizedEditors.push({
      email,
      name: name || email.split("@")[0],
      role: "EDITOR",
      addedAt: new Date().toISOString()
    });

    this.saveAuthorizedEditors();
    emailInput.value = "";
    if (nameInput) nameInput.value = "";

    this.renderAuthorizedEditorsList();
    this.updatePermissionsUI();
    this.showToast(`Inbjudan sparad! ${email} kan nu ladda upp och redigera.`);
  }

  revokeEditorPermission(email) {
    if (email.toLowerCase() === this.ownerEmail.toLowerCase()) {
      alert("Huvudägaren kan inte tas bort.");
      return;
    }

    if (confirm(`Är du säker på att du vill återkalla redaktörsbehörigheten för "${email}"?`)) {
      this.authorizedEditors = this.authorizedEditors.filter(
        (e) => e.email.toLowerCase() !== email.toLowerCase()
      );
      this.saveAuthorizedEditors();
      this.renderAuthorizedEditorsList();
      this.updatePermissionsUI();
      this.showToast(`Behörighet för ${email} har tagits bort.`);
    }
  }

  toggleSimulateReadOnly() {
    this.simulateReadOnly = !this.simulateReadOnly;
    this.closePermissionsModal();
    this.renderAuthHeader();
    this.renderFloatingMenu();
    this.updateBadgeCounts();
    this.updateDocumentDisplay();
    this.updatePermissionsUI();

    this.showToast(
      this.simulateReadOnly
        ? "Testläge aktivt: Visar som vanlig personal (läsbehörighet) 👁️"
        : "Testläge avslutat: Administratörsbehörighet återställd 👑"
    );
  }

  renderAuthHeader() {
    const container = document.getElementById("headerAuthContainer");
    if (!container) return;

    const myPageBadge = document.getElementById("headerMyPageBadge");
    if (myPageBadge) {
      const favCount = this.userFavorites.length;
      myPageBadge.textContent = favCount;
      myPageBadge.style.display = favCount > 0 ? "inline-flex" : "none";
    }

    if (!this.currentUser) {
      container.innerHTML = `
        <button class="btn-google-login" onclick="app.openGoogleLoginModal()" title="Logga in med Google">
          ${ICONS.google}
          <span>Logga in med Google</span>
        </button>
      `;
    } else {
      const initial = (this.currentUser.name || "U").charAt(0).toUpperCase();
      const role = this.getUserRole();
      let roleBadgeHtml = "";
      if (role === "OWNER") {
        roleBadgeHtml = `<span class="user-role-tag owner" title="Huvudägare & Full administratörsbehörighet">👑 Admin</span>`;
      } else if (role === "EDITOR") {
        roleBadgeHtml = `<span class="user-role-tag editor" title="Behörig Redaktör (Kan ladda upp & redigera)">✏️ Redaktör</span>`;
      } else {
        roleBadgeHtml = `<span class="user-role-tag reader" title="Läsbehörighet">👁️ Läsare</span>`;
      }

      container.innerHTML = `
        <div class="user-profile-badge" onclick="app.switchCategory('MY_PAGE')" title="Inloggad som ${this.escapeHtml(this.currentUser.email)} (${role === 'OWNER' ? 'Huvudägare' : role === 'EDITOR' ? 'Redaktör' : 'Läsare'})">
          <div class="user-avatar-circle">${initial}</div>
          <span class="user-name-text">${this.escapeHtml(this.currentUser.name)}</span>
          ${roleBadgeHtml}
          <button class="btn-user-logout" onclick="event.stopPropagation(); app.logoutUser()" title="Logga ut">
            ${ICONS.logOut}
          </button>
        </div>
      `;
    }

    this.updatePermissionsUI();
  }

  openGoogleLoginModal() {
    const modal = document.getElementById("googleLoginModal");
    if (modal) modal.classList.add("is-open");
  }

  closeGoogleLoginModal() {
    const modal = document.getElementById("googleLoginModal");
    if (modal) modal.classList.remove("is-open");
    this.cancelAdminPasswordPrompt();
  }

  promptAccountLogin(name, email) {
    const isEditorOrOwner = this.isEmailAuthorizedEditor(email);
    const pwdSection = document.getElementById("adminPasswordSection");
    const errorEl = document.getElementById("loginPasswordError");
    const inputEl = document.getElementById("adminPasswordInput");
    const emailEl = document.getElementById("loginSelectedEmail");

    if (isEditorOrOwner) {
      this.pendingLoginUser = { name, email };
      if (pwdSection) pwdSection.style.display = "block";
      if (emailEl) emailEl.textContent = email;
      if (errorEl) {
        errorEl.style.display = "none";
        errorEl.textContent = "";
      }
      if (inputEl) {
        inputEl.value = "";
        setTimeout(() => inputEl.focus(), 80);
      }
    } else {
      if (pwdSection) pwdSection.style.display = "none";
      this.pendingLoginUser = null;
      this.loginWithGoogleProfile(name, email);
    }
  }

  cancelAdminPasswordPrompt() {
    this.pendingLoginUser = null;
    const pwdSection = document.getElementById("adminPasswordSection");
    if (pwdSection) pwdSection.style.display = "none";
    const errorEl = document.getElementById("loginPasswordError");
    if (errorEl) {
      errorEl.style.display = "none";
      errorEl.textContent = "";
    }
  }

  async submitAdminLogin() {
    if (!this.pendingLoginUser) {
      this.showToast("Inget konto har valts.");
      return;
    }
    const inputEl = document.getElementById("adminPasswordInput");
    const errorEl = document.getElementById("loginPasswordError");
    const pwd = (inputEl ? inputEl.value : "").trim();

    if (!pwd) {
      if (errorEl) {
        errorEl.textContent = "Vänligen ange administratörslösenordet.";
        errorEl.style.display = "block";
      }
      return;
    }

    const enteredHash = await this.computeSha256(pwd);
    const expectedHash = this.getAdminPasswordHash();

    if (enteredHash === expectedHash) {
      const user = this.pendingLoginUser;
      this.pendingLoginUser = null;
      this.cancelAdminPasswordPrompt();
      this.loginWithGoogleProfile(user.name, user.email);
      this.showToast("Lösenord godkänt! Administratörsbehörighet aktiverad 👑");
    } else {
      if (errorEl) {
        errorEl.textContent = "Felaktigt lösenord. Försök igen (Standard: Sahlgrenska2026!).";
        errorEl.style.display = "block";
      }
      if (inputEl) {
        inputEl.style.borderColor = "#dc2626";
        inputEl.focus();
        setTimeout(() => {
          inputEl.style.borderColor = "";
        }, 2000);
      }
    }
  }

  async handleChangeAdminPasswordSubmit() {
    if (!this.isUserOwner()) {
      this.showToast("Endast huvudägaren (filipcarlberg91@gmail.com) kan ändra administratörslösenordet.");
      return;
    }
    const newPwdInput = document.getElementById("newAdminPasswordInput");
    const confirmPwdInput = document.getElementById("confirmAdminPasswordInput");
    const statusEl = document.getElementById("changePasswordStatus");

    const p1 = (newPwdInput ? newPwdInput.value : "").trim();
    const p2 = (confirmPwdInput ? confirmPwdInput.value : "").trim();

    if (!p1 || p1.length < 6) {
      if (statusEl) {
        statusEl.style.color = "#dc2626";
        statusEl.textContent = "Lösenordet måste vara minst 6 tecken långt.";
      }
      return;
    }

    if (p1 !== p2) {
      if (statusEl) {
        statusEl.style.color = "#dc2626";
        statusEl.textContent = "Lösenorden matchar inte.";
      }
      return;
    }

    const newHash = await this.computeSha256(p1);
    this.setAdminPasswordHash(newHash);

    if (newPwdInput) newPwdInput.value = "";
    if (confirmPwdInput) confirmPwdInput.value = "";
    if (statusEl) {
      statusEl.style.color = "#16a34a";
      statusEl.textContent = "✓ Nytt administratörslösenord sparades!";
      setTimeout(() => {
        statusEl.textContent = "";
      }, 4000);
    }
    this.showToast("Nytt admin-lösenord har sparats! 🔒");
  }

  loginWithGoogleProfile(name, email) {
    this.currentUser = { name, email, loggedInAt: new Date().toISOString() };
    try {
      localStorage.setItem("iva_google_user", JSON.stringify(this.currentUser));
    } catch (e) {}
    this.userFavorites = this.loadUserFavorites();
    this.closeGoogleLoginModal();
    this.renderAuthHeader();
    this.renderFloatingMenu();
    this.updateBadgeCounts();
    this.updateDocumentDisplay();
    this.updatePermissionsUI();

    const role = this.getUserRole();
    if (role === "OWNER") {
      this.showToast(`Inloggad som Huvudägare (${name})! 👑 Full behörighet aktiv.`);
    } else if (role === "EDITOR") {
      this.showToast(`Välkommen ${name}! ✏️ Du är inloggad med redaktörsbehörighet.`);
    } else {
      this.showToast(`Inloggad som ${name} (Läsbehörighet) ⭐`);
    }
  }

  logoutUser() {
    const name = this.currentUser ? this.currentUser.name : "";
    this.currentUser = null;
    this.userFavorites = [];
    try {
      localStorage.removeItem("iva_google_user");
    } catch (e) {}
    if (this.activeCategory === "FAVORITES" || this.activeCategory === "MY_PAGE") {
      this.switchCategory("HOME");
    }
    this.renderAuthHeader();
    this.renderFloatingMenu();
    this.updateBadgeCounts();
    this.updateDocumentDisplay();
    this.updatePermissionsUI();
    this.showToast(name ? `Utloggad från ${name}` : "Utloggad");
  }

  toggleFavoriteDocument(docId) {
    if (!this.currentUser) {
      this.openGoogleLoginModal();
      this.showToast("Logga in med ditt Google-konto för att favoritmarkera");
      return;
    }

    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return;

    const idx = this.userFavorites.indexOf(docId);
    if (idx >= 0) {
      this.userFavorites.splice(idx, 1);
      this.showToast(`Borttagen från favoriter`);
    } else {
      this.userFavorites.push(docId);
      this.showToast(`Sparad i dina Google-favoriter ⭐`);
    }

    this.saveUserFavorites();
    this.renderAuthHeader();
    this.renderFloatingMenu();
    this.updateBadgeCounts();
    this.updateDocumentDisplay();
  }

  isDocumentFavorited(docId) {
    return this.userFavorites.includes(docId);
  }

  // =========================================================================
  // Notishantering (Notification Center & Web Notifications API)
  // =========================================================================

  loadNotifications() {
    try {
      const stored = localStorage.getItem("iva_notifications");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Kunde inte läsa in notiser:", e);
    }

    // Standardnotiser så användaren direkt ser hur notiscenter fungerar
    return [
      {
        id: "notif-init-1",
        type: "upload",
        title: "Nytt dokument uppladdat",
        docTitle: "Ventilatorinställning vid ARDS (Lungprotektiv ventilation)",
        category: "Respiration",
        docId: "doc-resp-01",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        read: false
      },
      {
        id: "notif-init-2",
        type: "edit",
        title: "Dokument uppdaterat",
        docTitle: "Inotropa & Vasoaktiva Läkemedel - Titreringsprotokoll",
        category: "Circulation",
        docId: "doc-circ-01",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false
      }
    ];
  }

  saveNotifications() {
    try {
      localStorage.setItem("iva_notifications", JSON.stringify(this.notifications.slice(0, 50)));
    } catch (e) {
      console.warn("Kunde inte spara notiser:", e);
    }
  }

  getUnreadNotificationsCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  updateNotificationBadge() {
    const unreadCount = this.getUnreadNotificationsCount();

    const badge = document.getElementById("notificationBadge");
    if (badge) {
      badge.textContent = unreadCount > 99 ? "99+" : unreadCount;
      badge.style.display = unreadCount > 0 ? "inline-flex" : "none";
    }

    const tag = document.getElementById("notificationUnreadTag");
    if (tag) {
      tag.textContent = `${unreadCount} nya`;
    }

    const triggerBtn = document.getElementById("btnNotificationTrigger");
    if (triggerBtn) {
      triggerBtn.innerHTML = `
        ${unreadCount > 0 ? ICONS.bellRinging : ICONS.bell}
        <span class="notification-badge" id="notificationBadge" style="${unreadCount > 0 ? 'display:inline-flex;' : 'display:none;'}">${unreadCount > 99 ? '99+' : unreadCount}</span>
      `;
    }
  }

  toggleNotificationDropdown(e) {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    this.notificationDropdownOpen = !this.notificationDropdownOpen;
    const dropdown = document.getElementById("notificationDropdown");
    const triggerBtn = document.getElementById("btnNotificationTrigger");

    if (dropdown) {
      dropdown.classList.toggle("is-open", this.notificationDropdownOpen);
    }
    if (triggerBtn) {
      triggerBtn.classList.toggle("active", this.notificationDropdownOpen);
    }

    if (this.notificationDropdownOpen) {
      this.renderNotificationDropdown();
    }
  }

  closeNotificationDropdown() {
    this.notificationDropdownOpen = false;
    const dropdown = document.getElementById("notificationDropdown");
    const triggerBtn = document.getElementById("btnNotificationTrigger");
    if (dropdown) dropdown.classList.remove("is-open");
    if (triggerBtn) triggerBtn.classList.remove("active");
  }

  renderNotificationDropdown() {
    // 1. Statusbanner för systemnotiser (Web Notifications API)
    const banner = document.getElementById("notificationPermissionBanner");
    if (banner) {
      if (!("Notification" in window)) {
        banner.style.display = "none";
      } else {
        const perm = Notification.permission;
        banner.style.display = "flex";
        if (perm === "granted") {
          banner.className = "notification-permission-banner";
          banner.innerHTML = `
            <span>🔔 Systemnotiser är aktiva (Windows/Android)</span>
            <span style="font-weight:700; color:#166534;">✓ Aktiv</span>
          `;
        } else if (perm === "denied") {
          banner.className = "notification-permission-banner blocked";
          banner.innerHTML = `
            <span>⚠️ Systemnotiser blockerade i webbläsaren</span>
            <span style="font-size:0.7rem; color:#991b1b;">Ändra i inställningar</span>
          `;
        } else {
          banner.className = "notification-permission-banner prompt";
          banner.innerHTML = `
            <span>🔔 Få notiser i Windows & Android-skärmen</span>
            <button class="btn-enable-system-notif" onclick="app.requestNotificationPermission()">Aktivera</button>
          `;
        }
      }
    }

    // 2. Notislistan
    const list = document.getElementById("notificationList");
    if (!list) return;

    if (this.notifications.length === 0) {
      list.innerHTML = `
        <div class="notification-empty">
          ${ICONS.bell}
          <div>Inga notiser ännu</div>
          <p style="font-size:0.75rem; color:#94a3b8; margin:0;">
            Notiser skapas automatiskt så fort ett nytt dokument laddas upp eller ändras.
          </p>
        </div>
      `;
      return;
    }

    list.innerHTML = this.notifications
      .map((notif) => {
        const isUpload = notif.type === "upload";
        const iconHtml = isUpload ? ICONS.upload : ICONS.edit;
        const iconClass = isUpload ? "upload" : "edit";
        const timeAgo = this.formatRelativeTime(notif.timestamp);

        return `
          <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="app.openDocumentFromNotification('${notif.id}', '${notif.docId}')">
            <div class="notif-item-icon ${iconClass}">
              ${iconHtml}
            </div>
            <div class="notif-item-body">
              <div class="notif-item-title">${this.escapeHtml(notif.docTitle || notif.title)}</div>
              <div class="notif-item-meta">
                <span class="notif-item-category">${this.escapeHtml(notif.category || 'IVA')}</span>
                <span>• ${notif.type === 'upload' ? 'Nytt dokument' : 'Uppdaterat'}</span>
                <span class="notif-item-time">• ${timeAgo}</span>
              </div>
            </div>
            ${!notif.read ? '<div class="notif-unread-dot" title="Oläst"></div>' : ''}
          </div>
        `;
      })
      .join("");
  }

  formatRelativeTime(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Just nu";
    if (diffMin < 60) return `${diffMin} min sedan`;
    if (diffHour < 24) return `${diffHour} tim sedan`;
    if (diffDay === 1) return "Igår";
    if (diffDay < 7) return `${diffDay} dagar sedan`;
    return date.toLocaleDateString("sv-SE", { month: "short", day: "numeric" });
  }

  markAllNotificationsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.saveNotifications();
    this.updateNotificationBadge();
    this.renderNotificationDropdown();
    this.showToast("Alla notiser markerade som lästa");
  }

  clearAllNotifications() {
    this.notifications = [];
    this.saveNotifications();
    this.updateNotificationBadge();
    this.renderNotificationDropdown();
    this.showToast("Notishistorik har rensats");
  }

  openDocumentFromNotification(notifId, docId) {
    const notif = this.notifications.find((n) => n.id === notifId);
    if (notif) {
      notif.read = true;
      this.saveNotifications();
      this.updateNotificationBadge();
    }

    this.closeNotificationDropdown();

    const doc = this.documents.find((d) => d.id === docId);
    if (doc) {
      if (doc.category && this.activeCategory !== doc.category && this.activeCategory !== "ALL") {
        this.switchCategory(doc.category);
      }
      this.openDocumentViewer(docId);
    } else {
      this.showToast("Dokumentet hittades inte eller har raderats");
    }
  }

  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      this.showToast("Webbläsaren stöder inte skrivbordsnotiser");
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      this.renderNotificationDropdown();
      if (permission === "granted") {
        this.showToast("Systemnotiser aktiverade! 🔔");
        this.sendNativeNotification(
          "IVA Dokumenthub: Notiser aktiverade",
          "Du får nu direkta systemnotiser när rutiner laddas upp eller ändras.",
          null,
          "IVA"
        );
      } else {
        this.showToast("Systemnotiser nekades");
      }
    } catch (err) {
      console.warn("Fel vid begäran om notistillstånd:", err);
    }
  }

  addNotification({ type, docTitle, category, docId }) {
    const notif = {
      id: "notif-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      type, // 'upload' eller 'edit'
      title: type === "upload" ? "Nytt dokument uppladdat" : "Dokument uppdaterat",
      docTitle,
      category,
      docId,
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(notif);
    if (this.notifications.length > 50) {
      this.notifications.pop();
    }

    this.saveNotifications();
    this.updateNotificationBadge();

    if (this.notificationDropdownOpen) {
      this.renderNotificationDropdown();
    }

    // Skicka systemnotis (Windows Notification Center / Android status bar)
    const sysTitle = type === "upload" ? `Nytt IVA-dokument: ${docTitle}` : `Ändrat IVA-dokument: ${docTitle}`;
    const sysBody = `Kategori: ${category} • Klicka för att öppna direkt`;
    this.sendNativeNotification(sysTitle, sysBody, docId, category);
  }

  sendNativeNotification(title, body, docId, category) {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    try {
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, {
            body,
            icon: "./icon-192.png",
            badge: "./icon-192.png",
            vibrate: [200, 100, 200],
            tag: "iva-doc-" + (docId || Date.now()),
            renotify: true,
            data: { docId, category }
          }).catch(() => {
            new Notification(title, { body, icon: "./icon-192.png" });
          });
        });
      } else {
        new Notification(title, {
          body,
          icon: "./icon-192.png"
        });
      }
    } catch (err) {
      console.warn("Kunde inte visa systemnotis:", err);
    }
  }

  // =========================================================================
  // Initialisering & Databas
  // =========================================================================

  async init() {
    this.renderAuthHeader();
    this.renderFloatingMenu();
    this.updateNotificationBadge();
    this.setupEventListeners();
    this.setupGlobalKeyboardShortcuts();

    await this.initIndexedDB();
    await this.loadDocuments();
    this.renderAuthHeader();
    this.updateBadgeCounts();
    this.updateNotificationBadge();
    this.renderCategoryPage(this.activeCategory);

    // Lyssna på meddelanden från Service Worker (t.ex. klick på notiser i bakgrunden)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "OPEN_DOCUMENT" && event.data.docId) {
          if (event.data.category) this.switchCategory(event.data.category);
          this.openDocumentViewer(event.data.docId);
        }
      });
    }

    // Öppna dokument automatiskt om docId finns i URL (klick från låsskärm/notis)
    const urlParams = new URLSearchParams(window.location.search);
    const docIdFromUrl = urlParams.get("docId");
    if (docIdFromUrl) {
      setTimeout(() => {
        const doc = this.documents.find((d) => d.id === docIdFromUrl);
        if (doc) {
          if (doc.category) this.switchCategory(doc.category);
          this.openDocumentViewer(docIdFromUrl);
        }
      }, 250);
    }
  }

  async initIndexedDB() {
    return new Promise((resolve) => {
      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      // Skydd mot att indexedDB hänger sig vid file:// URL:er i Chromium
      const timer = setTimeout(() => {
        if (!this.db) {
          console.warn("IndexedDB timeout (typiskt vid lokal körning via file://), aktiverar localStorage fallback");
          this.useFallbackStorage = true;
          done();
        }
      }, 400);

      try {
        if (!window.indexedDB) {
          console.warn("IndexedDB stöds inte, använder fallback");
          this.useFallbackStorage = true;
          clearTimeout(timer);
          return done();
        }
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains("documents")) {
            const store = db.createObjectStore("documents", { keyPath: "id" });
            store.createIndex("category", "category", { unique: false });
            store.createIndex("dateAdded", "dateAdded", { unique: false });
          }
        };

        request.onsuccess = (e) => {
          clearTimeout(timer);
          this.db = e.target.result;
          done();
        };

        request.onerror = (e) => {
          clearTimeout(timer);
          console.warn("IndexedDB otillgänglig, använder localStorage fallback:", e);
          this.useFallbackStorage = true;
          done();
        };

        request.onblocked = (e) => {
          clearTimeout(timer);
          console.warn("IndexedDB blockerad, använder fallback");
          this.useFallbackStorage = true;
          done();
        };
      } catch (err) {
        clearTimeout(timer);
        console.warn("IndexedDB undantag, fallback aktiverad:", err);
        this.useFallbackStorage = true;
        done();
      }
    });
  }

  async loadDocuments() {
    const cleanList = (docsList) => {
      const defaultList = typeof DEFAULT_DOCUMENTS !== "undefined" ? DEFAULT_DOCUMENTS : [];
      const defaultIds = defaultList.map((d) => d.id);
      // Rensa bort gamla test-PM men behåll användarens egna samt F&P 950 PM
      const cleaned = (docsList || []).filter((d) => !d.id.startsWith("doc-") || defaultIds.includes(d.id));
      for (const def of defaultList) {
        if (!cleaned.some((d) => d.id === def.id)) {
          cleaned.push(def);
        }
      }
      return cleaned;
    };

    if (this.useFallbackStorage || !this.db) {
      try {
        const stored = localStorage.getItem("iva_docs_data");
        if (stored) {
          this.documents = cleanList(JSON.parse(stored));
          try { localStorage.setItem("iva_docs_data", JSON.stringify(this.documents)); } catch (e) {}
          return;
        }
      } catch (e) {}
      this.documents = typeof DEFAULT_DOCUMENTS !== "undefined" ? [...DEFAULT_DOCUMENTS] : [];
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction("documents", "readonly");
        const store = tx.objectStore("documents");
        const request = store.getAll();

        request.onsuccess = async () => {
          let docs = request.result || [];
          if (docs.length === 0 && typeof DEFAULT_DOCUMENTS !== "undefined") {
            await this.seedDefaultDocuments();
            docs = DEFAULT_DOCUMENTS;
          } else {
            const cleaned = cleanList(docs);
            if (cleaned.length !== docs.length) {
              try {
                const clearTx = this.db.transaction("documents", "readwrite");
                const clearStore = clearTx.objectStore("documents");
                clearStore.clear();
                for (const item of cleaned) {
                  clearStore.put(item);
                }
              } catch (e) {}
            }
            docs = cleaned;
          }
          this.documents = docs;
          try { localStorage.setItem("iva_docs_data", JSON.stringify(this.documents)); } catch (e) {}
          resolve();
        };

        request.onerror = () => {
          this.documents = typeof DEFAULT_DOCUMENTS !== "undefined" ? [...DEFAULT_DOCUMENTS] : [];
          resolve();
        };
      } catch (e) {
        this.documents = typeof DEFAULT_DOCUMENTS !== "undefined" ? [...DEFAULT_DOCUMENTS] : [];
        resolve();
      }
    });
  }

  async seedDefaultDocuments() {
    if (!this.db) return;
    try {
      const tx = this.db.transaction("documents", "readwrite");
      const store = tx.objectStore("documents");
      for (const doc of DEFAULT_DOCUMENTS) {
        store.put(doc);
      }
      return new Promise((resolve) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch (e) {
      console.warn("Kunde inte förfylla IndexedDB:", e);
    }
  }

  async saveDocumentToDb(doc) {
    const idx = this.documents.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      this.documents[idx] = doc;
    } else {
      this.documents.unshift(doc);
    }
    this.updateBadgeCounts();

    if (this.useFallbackStorage || !this.db) {
      try {
        localStorage.setItem("iva_docs_data", JSON.stringify(this.documents));
      } catch (e) {
        console.warn("localStorage kunde inte spara:", e);
      }
      return doc;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction("documents", "readwrite");
        const store = tx.objectStore("documents");
        store.put(doc);
        tx.oncomplete = () => resolve(doc);
        tx.onerror = () => resolve(doc);
      } catch (e) {
        resolve(doc);
      }
    });
  }

  async deleteDocumentFromDb(docId) {
    this.documents = this.documents.filter((d) => d.id !== docId);
    this.updateBadgeCounts();

    if (this.useFallbackStorage || !this.db) {
      try {
        localStorage.setItem("iva_docs_data", JSON.stringify(this.documents));
      } catch (e) {}
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction("documents", "readwrite");
        const store = tx.objectStore("documents");
        store.delete(docId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  // =========================================================================
  // FAB (Floating Action Button) & Utfällbar Navigationsmeny
  // =========================================================================

  renderFloatingMenu() {
    const container = document.getElementById("floatingMenuContainer");
    if (!container) return;

    const favCount = this.userFavorites.length;
    const isMyPageActive = this.activeCategory === "MY_PAGE" || this.activeCategory === "FAVORITES";
    const userName = this.currentUser ? this.currentUser.name : "Gäst";
    const userSub = this.currentUser 
      ? (favCount === 1 ? "1 sparad favorit" : `${favCount} sparade favoriter`) 
      : "Logga in för att spara";

    let menuHtml = `
      <!-- Backdrop: Klick utanför stänger menyn -->
      <div class="fab-backdrop" id="fabBackdrop" onclick="app.closeFabMenu()"></div>

      <!-- Själva FAB-knappen -->
      <button class="fab-main-btn" id="fabMainBtn" onclick="event.stopPropagation(); app.toggleFabMenu(event)" title="Öppna IVA-menyn (Navigering & Sidor)" aria-label="Öppna navigationsmeny" aria-expanded="${this.fabMenuOpen}">
        <span class="fab-icon-menu">
          ${ICONS.menu || ICONS.layers}
        </span>
        <span class="fab-icon-close">
          ${ICONS.x}
        </span>
        <span class="fab-badge-pill" id="fabBadgePill" style="${favCount > 0 ? 'display:flex' : 'display:none'}">${favCount}</span>
      </button>

      <!-- Utfällbar meny-panel -->
      <div class="fab-menu-panel" id="fabMenuPanel" onclick="event.stopPropagation()" role="menu">
        <!-- Panel Header -->
        <div class="fab-panel-header">
          <div class="fab-panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span>IVA Navigering</span>
          </div>
          <div class="fab-header-actions">
            <button class="fab-mini-btn" onclick="app.closeFabMenu(); app.openGlobalSearchModal()" title="Sök i hela appen (Ctrl+K)">
              ${ICONS.search}
            </button>
            ${this.canUserEdit() ? `
              <button class="fab-mini-btn primary" onclick="app.closeFabMenu(); app.openUploadModal()" title="Ladda upp nytt PM">
                ${ICONS.plus}
              </button>
            ` : ''}
          </div>
        </div>

        <!-- STARTSIDA / HEM -->
        <div class="fab-mypage-card ${this.activeCategory === 'HOME' ? 'active' : ''}" 
             style="background: ${this.activeCategory === 'HOME' ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(14, 165, 233, 0.2) 100%)' : 'rgba(255, 255, 255, 0.06)'}; border-color: ${this.activeCategory === 'HOME' ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)'}; margin-bottom: 0.65rem;"
             onclick="app.switchCategory('HOME'); app.closeFabMenu();"
             title="Öppna Startsidan">
          <div class="fab-mypage-icon" style="background:#0284c7; color:#ffffff;">
            ${ICONS.home || ICONS.hospital}
          </div>
          <div class="fab-mypage-info">
            <div class="fab-mypage-title" style="color:#ffffff;">Startsida</div>
            <div class="fab-mypage-sub">IVA Översikt & Guider</div>
          </div>
          <span style="font-size:1.1rem; color:#38bdf8; font-weight:700;">🏠</span>
        </div>

        <!-- MIN SIDA & FAVORITER (Framträdande personlig sektion) -->
        <div class="fab-mypage-card ${isMyPageActive ? 'active' : ''}" 
             onclick="app.switchCategory('MY_PAGE'); app.closeFabMenu();"
             title="Öppna Min Sida med dina sparade favoriter">
          <div class="fab-mypage-icon">
            ${ICONS.starFilled}
          </div>
          <div class="fab-mypage-info">
            <div class="fab-mypage-title">Min Sida</div>
            <div class="fab-mypage-sub">${this.escapeHtml(userName)} • ${userSub}</div>
          </div>
          <span class="fab-badge" id="fab-badge-MYPAGE">${favCount}</span>
        </div>

        <!-- Rutiner/PM -->
        <div class="fab-section-label">Rutiner/PM</div>
        <div class="fab-category-grid">
    `;

    this.categories.forEach((cat) => {
      const count = this.documents.filter((d) => d.category === cat.id).length;
      const isActive = this.activeCategory === cat.id;
      const iconSvg = ICONS[cat.icon] || (cat.icon && ICONS[cat.icon.toLowerCase()]) || ICONS[cat.id.toLowerCase()] || ICONS.filePdf;

      menuHtml += `
        <button class="fab-cat-btn ${isActive ? 'active' : ''}" 
                data-category="${cat.id}"
                onclick="app.switchCategory('${cat.id}'); app.closeFabMenu();"
                title="${cat.name} (${cat.subtitle})">
          <span class="fab-cat-icon" style="${isActive ? '' : `color:${cat.color}`}">${iconSvg}</span>
          <span class="fab-cat-name">${cat.name}</span>
          <span class="fab-badge" id="badge-count-${cat.id}">${count}</span>
        </button>
      `;
    });

    menuHtml += `
        </div>

        <!-- Kliniska Verktyg & Sektioner -->
        <div class="fab-section-label">Kliniska Moduler & AI</div>

        <!-- Gemini AI Snabbknapp -->
        <div style="margin-bottom: 0.6rem;">
          <button class="fab-cat-btn" style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; width: 100%; border: none; padding: 0.65rem 0.85rem; border-radius: 12px; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; box-shadow: 0 4px 10px rgba(124, 58, 237, 0.35);"
                  onclick="if(window.geminiIVA) window.geminiIVA.openChat(); app.closeFabMenu();"
                  title="Öppna Gemini IVA-Assistent (Ctrl+J)">
            <span style="display:flex; align-items:center; color:#ffffff;">${ICONS.sparkles}</span>
            <span style="font-weight:700; font-size:0.875rem; flex:1; text-align:left;">Fråga Gemini IVA AI</span>
            <span style="background:rgba(255,255,255,0.2); font-size:0.68rem; font-weight:700; padding:0.15rem 0.45rem; border-radius:9999px;">AI-Assistent</span>
          </button>
        </div>

        <div class="fab-tools-row" style="grid-template-columns: repeat(2, 1fr); gap: 0.45rem;">
          <button class="fab-cat-btn ${this.activeCategory === 'PAIN_SEDATION' ? 'active' : ''}" 
                  data-category="PAIN_SEDATION"
                  onclick="app.switchCategory('PAIN_SEDATION'); app.closeFabMenu();"
                  title="Smärta och Sedering (CPOT & RASS)">
            <span class="fab-cat-icon" style="color:#d946ef;">${ICONS.activity || ICONS.heart}</span>
            <span class="fab-cat-name">CPOT & RASS</span>
          </button>
          <button class="fab-cat-btn ${this.activeCategory === 'DISEASES' ? 'active' : ''}" 
                  data-category="DISEASES"
                  onclick="app.switchCategory('DISEASES'); app.closeFabMenu();"
                  title="Sjukdomstillstånd på IVA (Chock, Respirationssvikt, AKI, m.m.)">
            <span class="fab-cat-icon" style="color:#e11d48;">${ICONS.stethoscope}</span>
            <span class="fab-cat-name">Sjukdomar</span>
          </button>

          <button class="fab-cat-btn ${this.activeCategory === 'ACID_BASE' ? 'active' : ''}" 
                  data-category="ACID_BASE"
                  onclick="app.switchCategory('ACID_BASE'); app.closeFabMenu();"
                  title="Syra-Bas Balans & Interaktiv Blodgaskalkylator">
            <span class="fab-cat-icon" style="color:#7c3aed;">${ICONS.flask}</span>
            <span class="fab-cat-name">Syra-Bas</span>
          </button>

          <button class="fab-cat-btn ${this.activeCategory === 'FLUID_BALANCE' ? 'active' : ''}" 
                  data-category="FLUID_BALANCE"
                  onclick="app.switchCategory('FLUID_BALANCE'); app.closeFabMenu();"
                  title="Vätskebalans & Vätsketyper (Ringer, NaCl, Albumin, ROSE)">
            <span class="fab-cat-icon" style="color:#059669;">${ICONS.droplets}</span>
            <span class="fab-cat-name">Vätskor</span>
          </button>

          <button class="fab-cat-btn ${this.activeCategory === 'NUTRITION_CALC' ? 'active' : ''}" 
                  data-category="NUTRITION_CALC"
                  onclick="app.switchCategory('NUTRITION_CALC'); app.closeFabMenu();"
                  title="Nutritionskalkylator & ESPEN-riktlinjer">
            <span class="fab-cat-icon" style="color:#d97706;">${ICONS.scale}</span>
            <span class="fab-cat-name">Nutrition</span>
          </button>

          <button class="fab-cat-btn ${this.activeCategory === 'DRUGS' ? 'active' : ''}" 
                  data-category="DRUGS"
                  onclick="app.switchCategory('DRUGS'); app.closeFabMenu();"
                  title="Doskalkylator & CVK Blandbarhet">
            <span class="fab-cat-icon" style="color:#0ea5e9;">${ICONS.pill}</span>
            <span class="fab-cat-name">Dos & CVK</span>
          </button>

          <button class="fab-cat-btn ${this.activeCategory === 'EQUIPMENT' ? 'active' : ''}" 
                  data-category="EQUIPMENT"
                  onclick="app.switchCategory('EQUIPMENT'); app.closeFabMenu();"
                  title="Medicinteknisk Apparatur (Servo-U Ventilator m.fl.)">
            <span class="fab-cat-icon" style="color:#0891b2;">${ICONS.ventilator || ICONS.gauge}</span>
            <span class="fab-cat-name">Apparatur</span>
          </button>

          <button class="fab-cat-btn ${this.activeCategory === 'ALL' ? 'active' : ''}" 
                  data-category="ALL"
                  onclick="app.switchCategory('ALL'); app.closeFabMenu();"
                  title="Samlad översikt över alla dokument">
            <span class="fab-cat-icon" style="color:#64748b;">${ICONS.layers}</span>
            <span class="fab-cat-name">Alla PM</span>
            <span class="fab-badge" id="badge-count-ALL">${this.documents.length}</span>
          </button>
        </div>
      </div>
    `;

    container.innerHTML = menuHtml;
  }

  toggleFabMenu(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    if (this.fabMenuOpen) {
      this.closeFabMenu();
    } else {
      this.openFabMenu();
    }
  }

  openFabMenu() {
    this.fabMenuOpen = true;
    const container = document.getElementById("floatingMenuContainer");
    if (container) {
      container.classList.add("is-open");
      const btn = document.getElementById("fabMainBtn");
      if (btn) btn.setAttribute("aria-expanded", "true");
    }
  }

  closeFabMenu() {
    this.fabMenuOpen = false;
    const container = document.getElementById("floatingMenuContainer");
    if (container) {
      container.classList.remove("is-open");
      const btn = document.getElementById("fabMainBtn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    }
  }

  updateBadgeCounts() {
    const allBadge = document.getElementById("badge-count-ALL");
    if (allBadge) allBadge.textContent = this.documents.length;

    const favCount = this.userFavorites.length;
    const favBadge = document.getElementById("fab-badge-MYPAGE");
    if (favBadge) favBadge.textContent = favCount;

    const fabPill = document.getElementById("fabBadgePill");
    if (fabPill) {
      fabPill.textContent = favCount;
      fabPill.style.display = favCount > 0 ? "flex" : "none";
    }

    const myPageBadge = document.getElementById("headerMyPageBadge");
    if (myPageBadge) {
      myPageBadge.textContent = favCount;
      myPageBadge.style.display = favCount > 0 ? "inline-flex" : "none";
    }

    const subnavBadge = document.getElementById("subnavMyPageBadge");
    if (subnavBadge) {
      subnavBadge.textContent = favCount;
      subnavBadge.style.display = favCount > 0 ? "inline-flex" : "none";
    }

    this.categories.forEach((cat) => {
      const count = this.documents.filter((d) => d.category === cat.id).length;
      const b = document.getElementById(`badge-count-${cat.id}`);
      if (b) b.textContent = count;
    });
  }

  switchCategory(categoryId) {
    this.closeFabMenu();
    this.activeCategory = categoryId;
    this.pageSearchQuery = "";
    this.selectedTag = null;

    if (categoryId !== "MY_PAGE" && categoryId !== "FAVORITES") {
      this.myPageSearchQuery = "";
      this.myPageCategoryFilter = "ALL";
    }

    // Uppdatera aktiv klass i toppens kliniska subnav-list
    const subnav = document.getElementById("clinicalSubnavStrip");
    if (subnav) {
      subnav.querySelectorAll(".subnav-pill-btn").forEach((btn) => {
        const cat = btn.getAttribute("data-category");
        let isActive = cat === categoryId;
        // Om användaren klickar på en specifik medicinsk kategori (t.ex. Respiration, Circulation, etc.)
        if (cat === "Respiration" && !["HOME", "STARTSIDA", "PAIN_SEDATION", "DISEASES", "ACID_BASE", "FLUID_BALANCE", "NUTRITION_CALC", "DRUGS", "EQUIPMENT", "MY_PAGE", "FAVORITES"].includes(categoryId)) {
          isActive = true;
        }
        btn.classList.toggle("active", isActive);
      });
    }

    // Uppdatera aktiv klass i FAB-menyn
    const container = document.getElementById("floatingMenuContainer");
    if (container) {
      container.querySelectorAll(".fab-cat-btn").forEach((btn) => {
        const cat = btn.getAttribute("data-category");
        btn.classList.toggle("active", cat === categoryId);
      });
      const myPageCard = container.querySelector(".fab-mypage-card");
      if (myPageCard) {
        myPageCard.classList.toggle("active", categoryId === "MY_PAGE" || categoryId === "FAVORITES");
      }
    }

    this.renderCategoryPage(categoryId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  openDocumentByTitle(titleQuery) {
    if (!titleQuery) return;
    const q = titleQuery.toLowerCase().trim();
    const doc = this.documents.find((d) => d.title.toLowerCase().includes(q) || d.id.toLowerCase() === q);
    if (doc) {
      if (doc.category) this.switchCategory(doc.category);
      this.openDocumentViewer(doc.id);
    } else {
      this.showToast(`Hittade inte PM: "${titleQuery}"`);
    }
  }

  openGeminiChat() {
    if (window.geminiIVA) window.geminiIVA.openChat();
  }

  closeGeminiChat() {
    if (window.geminiIVA) window.geminiIVA.closeChat();
  }

  toggleGeminiChat() {
    if (window.geminiIVA) window.geminiIVA.toggleChat();
  }

  handleHomeSearch(query) {
    if (!query || !query.trim()) return;
    const q = query.trim();
    this.openGlobalSearchModal();
    const input = document.getElementById("globalSearchInput");
    if (input) {
      input.value = q;
      this.handleGlobalSearch(q);
      input.focus();
    }
  }

  askGeminiQuick(prompt) {
    if (!prompt) return;
    if (window.geminiIVA) {
      window.geminiIVA.openChat();
      setTimeout(() => {
        const inputEl = document.getElementById("geminiChatInput");
        if (inputEl) {
          inputEl.value = prompt;
          inputEl.focus();
        }
      }, 100);
    }
  }

  // =========================================================================
  // MODUL 0: STARTSIDA (HOME PAGE) - INTENSIVVÅRDSENHETEN ÖSTRA
  // =========================================================================

  // =========================================================================
  // MODUL 0: STARTSIDA (HOME PAGE) - MATERIAL 3 EXPRESSIVE & ÖSTRA IVA
  // =========================================================================

  renderHomePage() {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    mainEl.style.setProperty("--theme-color", "#0284c7");
    mainEl.style.setProperty("--theme-bg", "#e0f2fe");
    mainEl.style.setProperty("--theme-border", "#bae6fd");

    const totalDocs = this.documents.length;
    const currentDateStr = new Date().toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const shiftChecked = (this.shiftChecklist || []).filter(x => x.checked).length;
    const shiftTotal = (this.shiftChecklist || []).length;
    const shiftPercent = shiftTotal > 0 ? Math.round((shiftChecked / shiftTotal) * 100) : 0;

    let html = `
      <!-- 1. MATERIAL 3 EXPRESSIVE HERO -->
      <section class="home-hero-card">
        <div class="home-hero-content">
          <div class="home-hero-badge-row">
            <span class="home-hero-pill">
              <span class="pulse-dot"></span> IVA Östra Sjukhuset • Sahlgrenska Universitetssjukhuset
            </span>
            <span class="home-hero-date">${currentDateStr}</span>
          </div>
          <h1 class="home-hero-title">
            Intensivvårdsenheten Östra
          </h1>
          <p class="home-hero-subtitle">
            Kliniskt beslutsstöd, interaktiva kalkylatorer, läkemedelsspädningar, styrande rutiner och evidensbaserade PM för IVA-läkare och intensivvårdssjuksköterskor.
          </p>

          <!-- FRAMHÄVD KNAPP: START AV ARBETSPASS (12 PUNKTER) -->
          <div class="shift-start-hero-card">
            <div class="shift-hero-left">
              <div class="shift-hero-badge">📋 Skiftöverlämning & Patientstatus</div>
              <h2 class="shift-hero-title">Start av arbetspass</h2>
              <p class="shift-hero-desc">
                Strukturerad checklista i 12 punkter: RLS, pupiller/reflexer, auskultation, buk/thorax/stomi, hudkostym, drän/infarter, KAD & urinfärg, V-sond, ventilatorinställningar, infusionspumpar (när tar de slut?), medicintider samt RASS.
              </p>
              <div class="shift-hero-status-row">
                <span class="shift-status-pill ${shiftChecked === shiftTotal && shiftTotal > 0 ? 'complete' : ''}">
                  ${shiftChecked} av ${shiftTotal} punkter avbockade (${shiftPercent}%)
                </span>
                <span style="font-size:0.78rem; color:#bae6fd;">Sparas lokalt under passet</span>
              </div>
            </div>
            <div class="shift-hero-right">
              <button class="btn-shift-start-cta" onclick="app.openShiftChecklistModal()" title="Öppna checklistan för start av arbetspass">
                <span style="font-size:1.4rem;">📋</span>
                <span>Start av arbetspass</span>
                <span style="font-size:0.75rem; opacity:0.85; font-weight:600;">(12 punkter)</span>
              </button>
            </div>
          </div>

          <!-- Sökruta i Hero -->
          <div class="home-hero-search-box" style="margin-top:1.25rem;">
            <div class="home-search-input-wrapper">
              <span class="home-search-icon">${ICONS.search}</span>
              <input type="text" 
                     class="home-search-input" 
                     id="homeHeroSearchInput" 
                     placeholder="Sök bland PM, kalkylatorer, doser (t.ex. Befuktare 950, Noradrenalin, ARDS, CPOT)..." 
                     onkeydown="if(event.key==='Enter') app.handleHomeSearch(this.value);" />
              <button class="home-search-submit-btn" onclick="app.handleHomeSearch(document.getElementById('homeHeroSearchInput').value)">
                Sök i hubben
              </button>
            </div>
            <div class="home-quick-tags">
              <span class="home-quick-label">Snabbval:</span>
              <button class="home-tag-btn" onclick="app.switchCategory('PAIN_SEDATION')">#CPOT & RASS</button>
              <button class="home-tag-btn" onclick="app.switchCategory('Respiration')">#F&P 950 Befuktare</button>
              <button class="home-tag-btn" onclick="app.switchCategory('ACID_BASE')">#Blodgas & Ventilator</button>
              <button class="home-tag-btn" onclick="app.switchCategory('FLUID_BALANCE')">#Excel-Vätskebalans</button>
              <button class="home-tag-btn" onclick="app.switchCategory('FLUID_BALANCE')">#Dropptakt</button>
              <button class="home-tag-btn" onclick="app.switchCategory('NUTRITION_CALC')">#Kaloritabell IVA 343</button>
              <button class="home-tag-btn" onclick="app.switchCategory('DISEASES')">#Chock & ARDS</button>
              <button class="home-tag-btn" onclick="app.switchCategory('DRUGS')">#Noradrenalin</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. IVA POCKETGUIDE FRAMHÄVD KORT -->
      <section class="home-pocketguide-section">
        <div class="pocketguide-card">
          <div class="pocketguide-card-header">
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <span style="font-size:1.6rem;">📖</span>
              <div>
                <h3 class="pocketguide-card-title">IVA Pocketguide</h3>
                <p class="pocketguide-card-sub">
                  Kompakt snabbreferens: Sedering, Vasopressor/Inotropi, Dialys/CRRT, Nutrition, Blodtryck & Antiarytmika
                </p>
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="btn-pocketguide-action primary" onclick="app.openPocketguideModal()">
                🔍 Öppna & Zooma i Helskärm
              </button>
              <a href="IVA_pocketguide.pdf" download="IVA_pocketguide.pdf" class="btn-pocketguide-action secondary">
                📥 Ladda ner PDF (564 KB)
              </a>
            </div>
          </div>

          <div class="pocketguide-preview-wrap" onclick="app.openPocketguideModal()" title="Klicka för att zooma och navigera i helskärm">
            <img src="iva_pocketguide.png" alt="IVA Pocketguide Förhandsvisning" class="pocketguide-preview-img" />
            <div class="pocketguide-overlay-hint">
              <span>🔍 Klicka för att öppna i helskärm & zooma</span>
            </div>
          </div>

          <div class="pocketguide-tags-row">
            <span class="pocket-tag" onclick="app.switchCategory('PAIN_SEDATION')">1. Sedering (RASS, Propofol, Dexdor)</span>
            <span class="pocket-tag" onclick="app.switchCategory('DRUGS')">2. Vasopressor / Inotropi (Noradrenalin, Milrinon)</span>
            <span class="pocket-tag" onclick="app.switchCategory('FLUID_BALANCE')">3. Dialys & CRRT (Citrat, Prismaflex)</span>
            <span class="pocket-tag" onclick="app.switchCategory('NUTRITION_CALC')">4. Nutrition & Kalorier (ESPEN, Fresubin)</span>
            <span class="pocket-tag" onclick="app.switchCategory('DISEASES')">5. Blodtryck & Arytmier (Amiodaron, Esmolol)</span>
          </div>
        </div>
      </section>

      <!-- 3. KLINISKA MODULER & INTERAKTIVA VERKTYG (MATERIAL 3 GRID) -->
      <section class="home-modules-section">
        <div class="home-section-header">
          <div class="home-section-title-wrap">
            <span class="home-section-dot blue"></span>
            <h2 class="home-section-title">Kliniska Moduler & Interaktiva Verktyg</h2>
          </div>
          <span class="home-section-hint">Välj modul för att starta</span>
        </div>

        <div class="home-modules-grid">
          <!-- Modul 1: Smärta & Sedering -->
          <div class="home-module-card" onclick="app.switchCategory('PAIN_SEDATION')">
            <div class="module-card-icon" style="background:#fae8ff; color:#d946ef; border-color:#f5d0fe;">
              ${ICONS.activity || ICONS.heart}
            </div>
            <div class="module-card-content">
              <h3 class="module-card-title">Smärta & Sedering (CPOT & RASS)</h3>
              <p class="module-card-desc">Validerad smärtskattning med CPOT (0–8 poäng) och sederingsbedömning med RASS (+4 till -5). Interaktiva poängkalkylatorer och titreringsråd.</p>
              <div class="module-card-footer">
                <span class="module-pill purple">CPOT 0–8 • RASS</span>
                <span class="module-arrow">→</span>
              </div>
            </div>
          </div>

          <!-- Modul 2: Sjukdomstillstånd -->
          <div class="home-module-card" onclick="app.switchCategory('DISEASES')">
            <div class="module-card-icon" style="background:#ffe4e6; color:#e11d48; border-color:#fecdd3;">
              ${ICONS.stethoscope}
            </div>
            <div class="module-card-content">
              <h3 class="module-card-title">Sjukdomstillstånd på IVA (15 tillstånd)</h3>
              <p class="module-card-desc">Cirkulationschock (septisk, kardiogen, obstruktiv, hypovolem), ARDS typ 1 & 2, Status Asthmaticus, AKI & CRRT, Akut leversvikt, m.fl.</p>
              <div class="module-card-footer">
                <span class="module-pill red">15 IVA-tillstånd</span>
                <span class="module-arrow">→</span>
              </div>
            </div>
          </div>

          <!-- Modul 3: Syra-Bas & Blodgas -->
          <div class="home-module-card" onclick="app.switchCategory('ACID_BASE')">
            <div class="module-card-icon" style="background:#f3e8ff; color:#7c3aed; border-color:#e9d5ff;">
              ${ICONS.flask}
            </div>
            <div class="module-card-content">
              <h3 class="module-card-title">Syra-Bas & Ventilator-blodgas</h3>
              <p class="module-card-desc">Komplett ABL-analys med värden från Bild 1. Ventilatorinställningar (FiO2, PEEP, AF, Vt), konkreta ventilatorförslag (nytt AF) och patofysiologisk förklaring.</p>
              <div class="module-card-footer">
                <span class="module-pill purple">Radiometer ABL • AF-formel</span>
                <span class="module-arrow">→</span>
              </div>
            </div>
          </div>

          <!-- Modul 4: Vätskebalans & Dropptakt -->
          <div class="home-module-card" onclick="app.switchCategory('FLUID_BALANCE')">
            <div class="module-card-icon" style="background:#ecfdf5; color:#059669; border-color:#a7f3d0;">
              ${ICONS.droplets}
            </div>
            <div class="module-card-content">
              <h3 class="module-card-title">Vätskebalans, Excel-ark & Dropptakt</h3>
              <p class="module-card-desc">Östra sjukhusets Excel-modell för vätskebalans (Bild 2), ny Dropptaktskalkylator (dr/min), infusionsvätskor (Glukos 10% & kcal) och kumulativ % FO.</p>
              <div class="module-card-footer">
                <span class="module-pill green">Excel-ark • Dropptakt</span>
                <span class="module-arrow">→</span>
              </div>
            </div>
          </div>

          <!-- Modul 5: Nutrition & Kaloritabell -->
          <div class="home-module-card" onclick="app.switchCategory('NUTRITION_CALC')">
            <div class="module-card-icon" style="background:#fef3c7; color:#d97706; border-color:#fde68a;">
              ${ICONS.scale}
            </div>
            <div class="module-card-content">
              <h3 class="module-card-title">Nutrition & Kaloritabell IVA 343</h3>
              <p class="module-card-desc">ESPEN energimål, Propofol-kalorier samt komplett interaktiv Kaloritabell från IVA 343 Östra sjukhuset (19 produkter & live-kalkylator).</p>
              <div class="module-card-footer">
                <span class="module-pill amber">Kaloritabell IVA 343</span>
                <span class="module-arrow">→</span>
              </div>
            </div>
          </div>

          <!-- Modul 6: Dos & CVK-blandbarhet -->
          <div class="home-module-card" onclick="app.switchCategory('DRUGS')">
            <div class="module-card-icon" style="background:#e0f2fe; color:#0284c7; border-color:#bae6fd;">
              ${ICONS.pill}
            </div>
            <div class="module-card-content">
              <h3 class="module-card-title">Doskalkylator & Blandbarhet i CVK</h3>
              <p class="module-card-desc">Viktjusterade pumpberäkningar (Noradrenalin, Dobutamin, Propofol), spädningsprotokoll och interaktiv Y-grensmatris för tvåvägsblandbarhet.</p>
              <div class="module-card-footer">
                <span class="module-pill blue">Dos & CVK-matris</span>
                <span class="module-arrow">→</span>
              </div>
            </div>
          </div>

          <!-- Modul 7: Medicinteknisk Apparatur -->
          <div class="home-module-card" onclick="app.switchCategory('EQUIPMENT')">
            <div class="module-card-icon" style="background:#ecfeff; color:#0891b2; border-color:#a5f3fc;">
              ${ICONS.monitor}
            </div>
            <div class="module-card-content">
              <h3 class="module-card-title">Medicinteknisk Apparatur (Servo-U)</h3>
              <p class="module-card-desc">Ventilatormoder (PRVC, PC, PS, NAVA), larmguide, lungmekanikmätningar (Cstat, Drivtryck ΔP) och inställningsstöd.</p>
              <div class="module-card-footer">
                <span class="module-pill cyan">Servo-U & MedTech</span>
                <span class="module-arrow">→</span>
              </div>
            </div>
          </div>

          <!-- Modul 8: Rutiner & PM -->
          <div class="home-module-card" onclick="app.switchCategory('Respiration')">
            <div class="module-card-icon" style="background:#f1f5f9; color:#475569; border-color:#cbd5e1;">
              ${ICONS.fileText}
            </div>
            <div class="module-card-content">
              <h3 class="module-card-title">Avdelningens PM & Rutiner</h3>
              <p class="module-card-desc">Fisher & Paykel 950™ Befuktare under Respiration samt avdelningens egna styrande PM i professionellt läsläge.</p>
              <div class="module-card-footer">
                <span class="module-pill slate">F&P 950 Befuktare</span>
                <span class="module-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    mainEl.innerHTML = html;
  }

  // =========================================================================
  // MODUL 0B: SMÄRTA OCH SEDERING (CPOT & RASS)
  // =========================================================================

  renderPainSedationPage() {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    mainEl.style.setProperty("--theme-color", "#d946ef");
    mainEl.style.setProperty("--theme-bg", "#fae8ff");
    mainEl.style.setProperty("--theme-border", "#f5d0fe");

    const cpotTotal = (this.cpotScores.facial || 0) + (this.cpotScores.movements || 0) + (this.cpotScores.muscle_tone || 0) + (this.cpotScores.vent_or_vocal || 0);

    let html = `
      <section class="page-hero">
        <div class="hero-main">
          <div class="hero-info">
            <div class="hero-icon-bubble" style="background:#fae8ff; color:#d946ef; border-color:#f5d0fe;">
              ${ICONS.activity || ICONS.heart}
            </div>
            <div class="hero-text">
              <h2>
                Smärta och Sedering på IVA
                <span class="hero-count-pill" style="background:#fae8ff; color:#a21caf;">CPOT & RASS</span>
              </h2>
              <p>Evidensbaserade bedömningsinstrument för icke-kommunikativa, sederade och intuberade patienter. Mät smärta och anpassa sederingsgrad individuellt.</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-upload-primary" onclick="app.switchCategory('Respiration')">
              Tillbaka till Rutiner
            </button>
          </div>
        </div>

        <!-- Flikväljare för Smärta & Sedering -->
        <div class="page-toolbar">
          <div class="drug-tab-nav horizontal-scroll-tabs" style="border-bottom:none; padding-bottom:0;">
            <button class="drug-tab-btn ${this.painSedationTab === 'cpot' ? 'active' : ''}" onclick="app.switchPainSedationTab('cpot')">
              ⚡ CPOT (Smärtskattning 0–8)
            </button>
            <button class="drug-tab-btn ${this.painSedationTab === 'rass' ? 'active' : ''}" onclick="app.switchPainSedationTab('rass')">
              💤 RASS (Sederingsgrad +4 till -5)
            </button>
          </div>
        </div>
      </section>

      <div id="painSedationContentContainer">
        ${this.painSedationTab === 'cpot' ? this.renderCpotTabHtml(cpotTotal) : this.renderRassTabHtml()}
      </div>
    `;

    mainEl.innerHTML = html;
  }

  switchPainSedationTab(tab) {
    this.painSedationTab = tab;
    this.renderPainSedationPage();
  }

  setCpotDomainScore(domainId, score) {
    this.cpotScores[domainId] = parseInt(score, 10);
    this.renderPainSedationPage();
  }

  selectRassScore(score) {
    this.selectedRassScore = parseInt(score, 10);
    this.renderPainSedationPage();
  }

  renderCpotTabHtml(total) {
    const scale = typeof CPOT_SCALE !== "undefined" ? CPOT_SCALE : { domains: [] };
    
    let statusClass = "good";
    let statusTitle = "Minimal / Ingen smärta (CPOT 0–2)";
    let statusColor = "#16a34a";
    let statusBg = "#dcfce7";
    let statusDesc = "Patienten är väl smärtlindrad. Fortsätt basanalgesi (Paracetamol) och regelbunden omvärdering.";

    if (total >= 5) {
      statusClass = "severe";
      statusTitle = "Svår till extrem smärta (CPOT 5–8)";
      statusColor = "#dc2626";
      statusBg = "#fee2e2";
      statusDesc = "Kraftigt förhöjd smärtrespons! Kräver omedelbar analgetikatitrering (Fentanylekvivalenter), kontroll av tubläge/kufftryck, urinstämma eller kirurgisk komplikation.";
    } else if (total >= 3) {
      statusClass = "moderate";
      statusTitle = "Betydande smärta (CPOT 3–4)";
      statusColor = "#ea580c";
      statusBg = "#ffedd5";
      statusDesc = "Signifikant smärta föreligger (mål på IVA är CPOT ≤ 2). Överväg bolusdos opioid (Fentanyl 25–50 µg iv eller Morfin) och utvärdera effekt inom 15–30 min.";
    }

    return `
      <div class="bloodgas-layout-grid">
        <!-- Vänster: Interaktiv CPOT Skattning -->
        <div class="calc-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem;">
            <div>
              <h3 style="margin:0; font-size:1.15rem; color:#0f172a; font-weight:800;">CPOT Skattningsformulär</h3>
              <p style="margin:0.25rem 0 0; font-size:0.8rem; color:#64748b;">Klicka på det alternativ som bäst beskriver patienten</p>
            </div>
            <div class="cpot-total-badge" style="background:${statusBg}; color:${statusColor}; border:1.5px solid ${statusColor};">
              <span style="font-size:0.75rem; text-transform:uppercase; font-weight:700;">Totalt</span>
              <span style="font-size:1.6rem; font-weight:900; line-height:1;">${total} / 8</span>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            ${(scale.domains || []).map((dom) => `
              <div class="cpot-domain-group">
                <div style="font-weight:700; font-size:0.9rem; color:#1e293b; margin-bottom:0.5rem;">
                  ${this.escapeHtml(dom.name)}
                </div>
                <div class="cpot-options-grid">
                  ${dom.options.map(opt => `
                    <div class="cpot-option-card ${this.cpotScores[dom.id] === opt.score ? 'selected' : ''}"
                         onclick="app.setCpotDomainScore('${dom.id}', ${opt.score})">
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:700; font-size:0.88rem;">${this.escapeHtml(opt.label)}</span>
                        <span class="cpot-score-pill">${opt.score} p</span>
                      </div>
                      <p style="margin:0.35rem 0 0; font-size:0.75rem; color:#64748b; line-height:1.35;">
                        ${this.escapeHtml(opt.desc)}
                      </p>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Höger: Tolkning & Analgesi-vägledning -->
        <div class="calc-panel">
          <div class="diagnosis-hero-box" style="background:${statusBg}; border:1.5px solid ${statusColor}; margin-bottom:1.25rem;">
            <div class="diagnosis-badge-large" style="color:${statusColor};">
              ${total >= 3 ? '⚠️ï¸' : '✓'} ${statusTitle}
            </div>
            <div class="diagnosis-subtext" style="color:#1e293b;">
              ${statusDesc}
            </div>
          </div>

          <!-- Klinisk handläggning -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.25rem;">
            <h4 style="margin:0 0 0.75rem; font-size:0.92rem; color:#0f172a; display:flex; align-items:center; gap:0.4rem;">
              ${ICONS.stethoscope} Analgetikarekommendationer (Östra Sjukhuset)
            </h4>
            <div style="font-size:0.82rem; line-height:1.6; color:#334155; display:flex; flex-direction:column; gap:0.6rem;">
              <div>
                <strong>1. Fentanyl (Förstahandsval vid ventilator/intubation):</strong><br>
                Bolus: 25–50 µg iv vid procedursmärta (vårdhygien, vändning, sugning). Snabb tillslag (1–2 min), kort duration (30–60 min). Kontinuerlig infusion 1–3 µg/kg/h vid refraktär smärta.
              </div>
              <div>
                <strong>2. Morfin (Spontanandande / Stabil hemodynamik):</strong><br>
                Bolus: 2.5–5 mg iv titreras långsamt. Duration 3–4 timmar. OBS: aktiv metabolit (M6G) ackumuleras vid njursvikt (GFR &lt; 30).
              </div>
              <div>
                <strong>3. Ketamin (Ketanest) vid opioidtolerans / hyperalgesi:</strong><br>
                Lågdosinfusion 0.05–0.15 mg/kg/h ger utmärkt analgetisk tilläggseffekt via NMDA-receptorblockad utan andningsdepression.
              </div>
              <div>
                <strong>4. Icke-farmakologiska åtgärder:</strong><br>
                Kontrollera att inte smärtan orsakas av urinvägsretention (bladderscan), felplacerad tub, förband som stramar, för hårt fixerad artärnål eller trycksår.
              </div>
            </div>
          </div>

          <button class="btn-header-secondary" onclick="app.cpotScores = {facial:0, movements:0, muscle_tone:0, vent_or_vocal:0}; app.renderPainSedationPage();" style="width:100%;">
            🔄 Nollställ CPOT-formulär
          </button>
        </div>
      </div>
    `;
  }

  renderRassTabHtml() {
    const scale = typeof RASS_SCALE !== "undefined" ? RASS_SCALE : { levels: [] };
    const current = scale.levels.find(x => x.score === this.selectedRassScore) || scale.levels[4];

    return `
      <div class="bloodgas-layout-grid">
        <!-- Vänster: RASS Skalan (+4 till -5) -->
        <div class="calc-panel">
          <div style="margin-bottom:1.1rem;">
            <h3 style="margin:0; font-size:1.15rem; color:#0f172a; font-weight:800;">RASS (Richmond Agitation-Sedation Scale)</h3>
            <p style="margin:0.25rem 0 0; font-size:0.8rem; color:#64748b;">Klicka på patientens aktuella tillstånd på skalan</p>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.45rem;">
            ${scale.levels.map(lvl => `
              <div class="rass-level-row ${this.selectedRassScore === lvl.score ? 'selected' : ''}"
                   style="border-left: 5px solid ${lvl.color}; background:${this.selectedRassScore === lvl.score ? lvl.bg : '#ffffff'};"
                   onclick="app.selectRassScore(${lvl.score})">
                <div style="display:flex; align-items:center; gap:0.75rem;">
                  <span class="rass-score-chip" style="background:${lvl.color}; color:#ffffff;">
                    ${lvl.score > 0 ? '+' : ''}${lvl.score}
                  </span>
                  <div>
                    <span style="font-weight:700; font-size:0.9rem; color:#0f172a;">${this.escapeHtml(lvl.name)}</span>
                    <p style="margin:0.2rem 0 0; font-size:0.78rem; color:#475569; line-height:1.35;">
                      ${this.escapeHtml(lvl.desc)}
                    </p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Höger: Sederingsmål & Titreringsguide -->
        <div class="calc-panel">
          <div class="diagnosis-hero-box" style="background:${current.bg}; border:1.5px solid ${current.color}; margin-bottom:1.25rem;">
            <div class="diagnosis-badge-large" style="color:${current.color};">
              RASS ${current.score > 0 ? '+' : ''}${current.score}: ${current.name}
            </div>
            <div class="diagnosis-subtext" style="color:#1e293b;">
              ${current.desc}
            </div>
          </div>

          <!-- Målsederingszoner -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1.25rem; margin-bottom:1.25rem;">
            <h4 style="margin:0 0 0.75rem; font-size:0.92rem; color:#0f172a; display:flex; align-items:center; gap:0.4rem;">
              🎯 Sederingsmål på IVA Östra
            </h4>
            <div style="font-size:0.82rem; line-height:1.55; color:#334155; display:flex; flex-direction:column; gap:0.65rem;">
              <div style="background:#ecfdf5; border:1px solid #a7f3d0; padding:0.6rem; border-radius:6px;">
                <strong style="color:#065f46;">Standardmål: RASS 0 till -1 (Lätt sedering)</strong><br>
                Mål för de flesta intuberade patienter under urträning och stabil fas. Patienten kan kommunicera, delta i mobilisering och har signifikant lägre risk för IVA-delirium och lång vårdtid.
              </div>
              <div style="background:#fef3c7; border:1px solid #fde68a; padding:0.6rem; border-radius:6px;">
                <strong style="color:#92400e;">Övergångsmål: RASS -2 till -3 (Måttlig sedering)</strong><br>
                Används vid tidig intubation, postoperativ stabilisering eller måttlig asynkroni i ventilatorn.
              </div>
              <div style="background:#fee2e2; border:1px solid #fecaca; padding:0.6rem; border-radius:6px;">
                <strong style="color:#991b1b;">Djup sedering: RASS -4 till -5 (Endast specifika indikationer)</strong><br>
                Reserverat för: Svår ARDS med bukläge (proning), intrakraniell hypertension / hotande herniering, status epilepticus eller neuromuskulär blockad.
              </div>
            </div>
          </div>

          <!-- Sederingsläkemedel -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1rem;">
            <h4 style="margin:0 0 0.5rem; font-size:0.88rem; color:#0f172a;">
              💊 Läkemedelsval för sedering
            </h4>
            <div style="font-size:0.8rem; line-height:1.5; color:#475569;">
              • <strong>Propofol:</strong> Snabb styrbarhet (1–4 mg/kg/h). OBS: risk för PRIS vid dos &gt; 4–5 mg/kg/h &gt; 48h. Ger 1.1 kcal/ml från lipider.<br>
              • <strong>Dexmedetomidin (Dexdor):</strong> Alfa-2-agonist. Behåller spontanandning, minskar delirium, möjliggör kontakt. Dos: 0.2–1.4 µg/kg/h. OBS: bradykardi.<br>
              • <strong>Midazolam:</strong> Långverkande bensodiazepin. Ackumuleras vid njur-/leversvikt. Används främst vid status epilepticus eller refraktär agitation.
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // MODUL 1: SJUKDOMSTILLSTÅND PÅ IVA
  // =========================================================================

  renderDiseasesPage() {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    mainEl.style.setProperty("--theme-color", "#e11d48");
    mainEl.style.setProperty("--theme-bg", "#ffe4e6");
    mainEl.style.setProperty("--theme-border", "#fecdd3");

    const states = typeof IVA_DISEASE_STATES !== "undefined" ? IVA_DISEASE_STATES : [];
    const query = (this.diseaseSearchQuery || "").toLowerCase().trim();

    // Filtrera vid sökning
    let filteredStates = states;
    if (query) {
      filteredStates = states.filter((st) => {
        const inTitle = st.title.toLowerCase().includes(query);
        const inSummary = st.shortSummary.toLowerCase().includes(query);
        const inSubtypes = st.subtypes.some(sub => 
          sub.name.toLowerCase().includes(query) || 
          sub.physio.toLowerCase().includes(query) || 
          sub.signs.toLowerCase().includes(query) || 
          sub.actions.toLowerCase().includes(query)
        );
        return inTitle || inSummary || inSubtypes;
      });
    }

    // Vald sjukdom
    const activeState = states.find(s => s.id === this.selectedDiseaseId) || states[0];

    let html = `
      <section class="page-hero">
        <div class="hero-main">
          <div class="hero-info">
            <div class="hero-icon-bubble" style="background:#ffe4e6; color:#e11d48; border-color:#fecdd3;">
              ${ICONS.stethoscope}
            </div>
            <div class="hero-text">
              <h2>
                Sjukdomstillstånd på IVA
                <span class="hero-count-pill" style="background:#ffe4e6; color:#9f1239;">${states.length} centrala tillstånd</span>
              </h2>
              <p>Evidensbaserade handläggningsprogram, patofysiologi, hemodynamisk monitorering och akuta IVA-åtgärder.</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-upload-primary" onclick="app.switchCategory('Respiration')">
              Tillbaka till Rutiner
            </button>
          </div>
        </div>

        <!-- SÖKNING PÅ SJUKDOMSSIDAN -->
        <div class="page-toolbar">
          <div class="page-search-wrapper" style="max-width: 520px;">
            <span class="page-search-icon">${ICONS.search}</span>
            <input type="text" 
                   class="page-search-input" 
                   id="diseaseSearchInput"
                   placeholder="Sök bland sjukdomstillstånd, chocktyper, tecken, läkemedel..."
                   value="${this.escapeHtml(this.diseaseSearchQuery)}" />
            <button class="page-search-clear" id="diseaseSearchClear" style="${this.diseaseSearchQuery ? 'display:block' : ''}">
              ${ICONS.x}
            </button>
          </div>
        </div>
      </section>

      <!-- Snabbnavigering mellan sjukdomar (Pills) -->
      <div class="disease-nav-strip">
        <button class="disease-pill-btn ${this.selectedDiseaseId === 'ALL' ? 'active' : ''}" onclick="app.selectDiseaseState('ALL')">
          <span>📑 Visa alla (${states.length})</span>
        </button>
        ${states.map(st => `
          <button class="disease-pill-btn ${this.selectedDiseaseId === st.id ? 'active' : ''}" onclick="app.selectDiseaseState('${st.id}')">
            <span>${ICONS[st.icon] || ICONS.stethoscope}</span>
            <span>${st.title}</span>
          </button>
        `).join('')}
      </div>

      <!-- Sjukdomskort & Subtyper -->
      <div id="diseaseCardsContainer">
        ${this.renderDiseaseCardsListHtml(query ? filteredStates : (this.selectedDiseaseId === 'ALL' ? states : [activeState]))}
      </div>
    `;

    mainEl.innerHTML = html;
    this.setupDiseasesPageEvents();
  }

  selectDiseaseState(id) {
    this.selectedDiseaseId = id;
    this.diseaseSearchQuery = "";
    this.renderDiseasesPage();
  }

  renderDiseaseCardsListHtml(statesList) {
    if (!statesList || statesList.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">${ICONS.search}</div>
          <h3>Inga matchande sjukdomstillstånd hittades</h3>
          <p>Försök söka på chock, ARDS, AKI, leversvikt, ICP eller sepsis.</p>
        </div>
      `;
    }

    return statesList.map(st => `
      <div class="disease-card">
        <div class="disease-card-header">
          <div class="disease-header-title">
            <div class="disease-icon-bubble" style="background:${st.colorLight}; color:${st.color};">
              ${ICONS[st.icon] || ICONS.stethoscope}
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                <h3 style="margin:0; font-size:1.25rem; font-weight:800; color:#0f172a;">${st.title}</h3>
                <span class="disease-badge" style="background:${st.colorLight}; color:${st.color};">${st.badge}</span>
              </div>
              <p style="margin:0.25rem 0 0; font-size:0.86rem; color:#475569;">${st.shortSummary}</p>
            </div>
          </div>
          <button class="btn-header-secondary" onclick="app.switchCategory('${st.category}')" style="font-size:0.75rem; white-space:nowrap;">
            Öppna ${st.category} PM →
          </button>
        </div>

        <div class="disease-subtype-grid">
          ${st.subtypes.map(sub => `
            <div class="disease-subtype-card">
              <div class="disease-subtype-title">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${st.color};"></span>
                <span>${sub.name}</span>
              </div>

              <div class="clinical-section-block">
                <div class="clinical-section-label">⚡ Patofysiologi & Mekanism</div>
                <div>${this.escapeHtml(sub.physio)}</div>
              </div>

              <div class="clinical-section-block">
                <div class="clinical-section-label">📋 Kliniska Tecken & Fynd</div>
                <div>${this.escapeHtml(sub.signs)}</div>
              </div>

              <div class="clinical-section-block">
                <div class="clinical-section-label">📊 Monitorering & Målvärden</div>
                <div>${this.escapeHtml(sub.monitoring)}</div>
              </div>

              <div class="clinical-section-block">
                <div class="clinical-section-label" style="color:#0369a1;">🎯 Akuta IVA-Åtgärder</div>
                <div class="action-steps-box">${this.escapeHtml(sub.actions)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  setupDiseasesPageEvents() {
    const input = document.getElementById("diseaseSearchInput");
    const clearBtn = document.getElementById("diseaseSearchClear");
    if (input) {
      input.addEventListener("input", (e) => {
        this.diseaseSearchQuery = e.target.value;
        if (clearBtn) clearBtn.style.display = this.diseaseSearchQuery ? "block" : "none";
        const container = document.getElementById("diseaseCardsContainer");
        if (container) {
          const states = typeof IVA_DISEASE_STATES !== "undefined" ? IVA_DISEASE_STATES : [];
          const q = this.diseaseSearchQuery.toLowerCase().trim();
          const filtered = q ? states.filter(st => 
            st.title.toLowerCase().includes(q) || 
            st.shortSummary.toLowerCase().includes(q) ||
            st.subtypes.some(sub => sub.name.toLowerCase().includes(q) || sub.physio.toLowerCase().includes(q) || sub.actions.toLowerCase().includes(q))
          ) : states;
          container.innerHTML = this.renderDiseaseCardsListHtml(filtered);
        }
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.diseaseSearchQuery = "";
        this.renderDiseasesPage();
      });
    }
  }

  // =========================================================================
  // MODUL 2: SYRA-BAS BALANS & BLODGASKALKYLATOR
  // =========================================================================

  // =========================================================================
  // MODUL 2: SYRA-BAS BALANS & BLODGASKALKYLATOR (RADIOMETER ABL + VENTILATOR)
  // =========================================================================

  renderAcidBasePage() {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    mainEl.style.setProperty("--theme-color", "#7c3aed");
    mainEl.style.setProperty("--theme-bg", "#f3e8ff");
    mainEl.style.setProperty("--theme-border", "#ddd6fe");

    const analysis = this.computeAcidBaseStatus();
    const presets = typeof BLOODGAS_PRESETS !== "undefined" ? BLOODGAS_PRESETS : [];

    let html = `
      <section class="page-hero">
        <div class="hero-main">
          <div class="hero-info">
            <div class="hero-icon-bubble" style="background:#f3e8ff; color:#7c3aed; border-color:#ddd6fe;">
              ${ICONS.flask}
            </div>
            <div class="hero-text">
              <h2>
                Syra-Bas Balans & Blodgaskalkylator
                <span class="hero-count-pill" style="background:#f3e8ff; color:#6b21a8;">Radiometer ABL + Ventilator</span>
              </h2>
              <p>Realtidstolkning av arteriell blodgas (alla parametrar från Bild 1) kopplat till ventilatorinställningar (FiO2, PEEP, AF, Tidalvolym). Konkreta förslag på ventilatorändringar och patofysiologisk förklaring.</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-upload-primary" onclick="app.switchCategory('Respiration')">
              Tillbaka till Rutiner
            </button>
          </div>
        </div>

        <!-- Snabbval med typiska kliniska fall & Bild 1 Slip -->
        <div style="margin-top: 1rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.5rem;">
            <span style="font-size:0.78rem; font-weight:800; text-transform:uppercase; color:#64748b;">
              Snabbval & Kliniska Fall:
            </span>
            <button class="btn-header-secondary" onclick="app.applyRadiometerSlipPreset()" style="background:#f5f3ff; border-color:#8b5cf6; color:#6d28d9; font-weight:700; font-size:0.82rem; padding:4px 12px;">
              📋 Ladda Bild 1 (Referensblodgas från Radiometer-remsa)
            </button>
          </div>
          <div class="preset-chips-row horizontal-scroll-tabs">
            <button class="preset-chip-btn" style="background:#6d28d9; color:#ffffff; font-weight:700;" onclick="app.applyRadiometerSlipPreset()" title="Värden exakt från den bifogade Radiometer ABL-lappen">
              📸 Bild 1: Radiometer-remsa
            </button>
            ${presets.map(p => `
              <button class="preset-chip-btn" onclick="app.applyBloodgasPreset('${p.name}')" title="${p.description}">
                ${p.name}
              </button>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Kalkylator Layout: Inmatning & Analyspanel -->
      <div class="bloodgas-layout-grid">
        <!-- Vänster: Inmatning av Blodgasvärden & Ventilator -->
        <div class="calc-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 style="font-size:1.1rem; color:#0f172a; margin:0; display:flex; align-items:center; gap:0.5rem;">
              ${ICONS.calculator} Ange Värden från Blodgas & Ventilator
            </h3>
            <button class="btn-text-link" onclick="app.resetAcidBaseValues()" style="font-size:0.8rem; color:#7c3aed;">
              Återställ
            </button>
          </div>

          <!-- SEKTION 1: GAS- & SYRA-BASVÄRDEN -->
          <div class="calc-section-label" style="font-weight:800; font-size:0.8rem; text-transform:uppercase; color:#7c3aed; margin:0.8rem 0 0.4rem; padding-bottom:3px; border-bottom:1px solid #ede9fe;">
            1. Arteriella Gasvärden & Syra-Bas
          </div>
          <div class="calc-inputs-grid">
            <div class="calc-field-group">
              <label class="calc-field-label">pH <span class="calc-field-unit">(7.35–7.45)</span></label>
              <input type="number" step="0.001" class="calc-field-input" id="inputAbpH" value="${this.abpH}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">pCO2 <span class="calc-field-unit">kPa (4.7–6.0)</span></label>
              <input type="number" step="0.01" class="calc-field-input" id="inputAbpCO2" value="${this.abpCO2}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">pO2 <span class="calc-field-unit">kPa (10.0–14.0)</span></label>
              <input type="number" step="0.1" class="calc-field-input" id="inputAbpO2" value="${this.abpO2}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">cHCO3⁻ <span class="calc-field-unit">mmol/L (22–27)</span></label>
              <input type="number" step="0.1" class="calc-field-input" id="inputAbHCO3" value="${this.abHCO3}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">cBase / BE <span class="calc-field-unit">mmol/L (-3 till +3)</span></label>
              <input type="number" step="0.1" class="calc-field-input" id="inputAbBE" value="${this.abBE}" />
            </div>
          </div>

          <!-- SEKTION 2: OXIMETRI & HEMOGLOBIN (FRÅN RADIOMETER BILD 1) -->
          <div class="calc-section-label" style="font-weight:800; font-size:0.8rem; text-transform:uppercase; color:#0284c7; margin:1rem 0 0.4rem; padding-bottom:3px; border-bottom:1px solid #e0f2fe;">
            2. Oximetri & Hemoglobin
          </div>
          <div class="calc-inputs-grid">
            <div class="calc-field-group">
              <label class="calc-field-label">ctHb <span class="calc-field-unit">g/L (120–160)</span></label>
              <input type="number" step="1" class="calc-field-input" id="inputAbctHb" value="${this.abctHb || 111}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Hct <span class="calc-field-unit">decimal / % (0.35–0.50)</span></label>
              <input type="number" step="0.001" class="calc-field-input" id="inputAbHct" value="${this.abHct || 0.339}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">sO2 <span class="calc-field-unit">% (95–99)</span></label>
              <input type="number" step="0.1" class="calc-field-input" id="inputAbsO2" value="${this.absO2 || 97.8}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">FCOHb <span class="calc-field-unit">% (&lt; 1.5–2)</span></label>
              <input type="number" step="0.1" class="calc-field-input" id="inputAbFCOHb" value="${this.abFCOHb || 1.2}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">FMetHb <span class="calc-field-unit">% (&lt; 1.0–1.5)</span></label>
              <input type="number" step="0.1" class="calc-field-input" id="inputAbFMetHb" value="${this.abFMetHb || 0.2}" />
            </div>
          </div>

          <!-- SEKTION 3: ELEKTROLYTER & METABOLITER (FRÅN RADIOMETER BILD 1) -->
          <div class="calc-section-label" style="font-weight:800; font-size:0.8rem; text-transform:uppercase; color:#059669; margin:1rem 0 0.4rem; padding-bottom:3px; border-bottom:1px solid #d1fae5;">
            3. Elektrolyter & Metaboliter
          </div>
          <div class="calc-inputs-grid">
            <div class="calc-field-group">
              <label class="calc-field-label">cNa⁺ <span class="calc-field-unit">mmol/L (137–145)</span></label>
              <input type="number" step="1" class="calc-field-input" id="inputAbNa" value="${this.abNa || 140}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">cK⁺ <span class="calc-field-unit">mmol/L (3.5–5.0)</span></label>
              <input type="number" step="0.1" class="calc-field-input" id="inputAbK" value="${this.abK || 4.4}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">cCa²⁺ <span class="calc-field-unit">mmol/L (1.15–1.33)</span></label>
              <input type="number" step="0.01" class="calc-field-input" id="inputAbCa" value="${this.abCa || 1.11}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">cCl⁻ <span class="calc-field-unit">mmol/L (98–107)</span></label>
              <input type="number" step="1" class="calc-field-input" id="inputAbCl" value="${this.abCl || 108}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">cGlu <span class="calc-field-unit">mmol/L (4.0–6.0)</span></label>
              <input type="number" step="0.1" class="calc-field-input" id="inputAbGlu" value="${this.abGlu || 7.0}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">cLac (Laktat) <span class="calc-field-unit">mmol/L (0.5–1.6)</span></label>
              <input type="number" step="0.1" class="calc-field-input" id="inputAbLactate" value="${this.abLactate || 0.5}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">S-Albumin <span class="calc-field-unit">g/L (36–45)</span></label>
              <input type="number" step="1" class="calc-field-input" id="inputAbAlbumin" value="${this.abAlbumin || 40}" />
            </div>
          </div>

          <!-- SEKTION 4: VENTILATORINSTÄLLNINGAR -->
          <div class="calc-section-label" style="font-weight:800; font-size:0.8rem; text-transform:uppercase; color:#e11d48; margin:1rem 0 0.4rem; padding-bottom:3px; border-bottom:1px solid #ffe4e6;">
            4. Ventilatorinställningar (Kopplat till blodgas)
          </div>
          <div class="calc-inputs-grid">
            <div class="calc-field-group">
              <label class="calc-field-label">FiO2 <span class="calc-field-unit">% (21–100)</span></label>
              <input type="number" step="1" min="21" max="100" class="calc-field-input" id="inputAbFiO2" value="${this.abFiO2 || 40}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">PEEP <span class="calc-field-unit">cmH2O (5–24)</span></label>
              <input type="number" step="1" class="calc-field-input" id="inputAbVentPEEP" value="${this.abVentPEEP || 8}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">AF (Andningsfrekvens) <span class="calc-field-unit">/min (8–40)</span></label>
              <input type="number" step="1" class="calc-field-input" id="inputAbVentAF" value="${this.abVentAF || 16}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Tidalvolym (Vt) <span class="calc-field-unit">ml (200–800)</span></label>
              <input type="number" step="10" class="calc-field-input" id="inputAbVentVt" value="${this.abVentVt || 450}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Idealvikt (PBW) <span class="calc-field-unit">kg (40–120)</span></label>
              <input type="number" step="1" class="calc-field-input" id="inputAbVentPBW" value="${this.abVentPBW || 70}" />
            </div>
          </div>

          <div style="margin-top:1.25rem; font-size:0.75rem; color:#64748b; text-align:right;">
            ⚡ Alla uträkningar och ventilatorförslag uppdateras i realtid
          </div>
        </div>

        <!-- Höger: Realtidsanalys, Ventilatorförslag & Patofysiologi -->
        <div class="calc-panel" id="acidBaseResultContainer">
          ${this.renderAcidBaseResultHtml(analysis)}
        </div>
      </div>
    `;

    mainEl.innerHTML = html;
    this.setupAcidBaseEvents();
  }

  applyRadiometerSlipPreset() {
    this.abpH = 7.433;
    this.abpCO2 = 5.03;
    this.abpO2 = 11.5;
    this.abHCO3 = 25.2;
    this.abBE = 0.9;
    this.abHct = 0.339;
    this.abctHb = 111;
    this.absO2 = 97.8;
    this.abFCOHb = 1.2;
    this.abFMetHb = 0.2;
    this.abNa = 140;
    this.abK = 4.4;
    this.abCa = 1.11;
    this.abCl = 108;
    this.abGlu = 7.0;
    this.abLactate = 0.5;
    this.abAlbumin = 40;
    this.abFiO2 = 40;
    this.abVentPEEP = 8;
    this.abVentAF = 16;
    this.abVentVt = 450;
    this.abVentPBW = 70;

    this.renderAcidBasePage();
    this.showToast("Laddade Bild 1: Radiometer ABL referensblodgas");
  }

  applyBloodgasPreset(name) {
    const presets = typeof BLOODGAS_PRESETS !== "undefined" ? BLOODGAS_PRESETS : [];
    const p = presets.find(x => x.name === name);
    if (!p) return;

    this.abpH = p.values.pH;
    this.abpCO2 = p.values.pCO2;
    this.abpO2 = p.values.pO2;
    this.abHCO3 = p.values.hco3;
    this.abBE = p.values.be;
    this.abNa = p.values.na;
    this.abCl = p.values.cl;
    this.abAlbumin = p.values.albumin;
    this.abLactate = p.values.lactate;
    this.abFiO2 = (p.values.fio2 || 0.40) <= 1.0 ? Math.round((p.values.fio2 || 0.40) * 100) : p.values.fio2;

    this.renderAcidBasePage();
    this.showToast(`Blodgas laddad: ${name}`);
  }

  resetAcidBaseValues() {
    this.abpH = 7.40;
    this.abpCO2 = 5.3;
    this.abpO2 = 12.0;
    this.abHCO3 = 24.0;
    this.abBE = 0.0;
    this.abHct = 0.40;
    this.abctHb = 130;
    this.absO2 = 98.0;
    this.abFCOHb = 1.0;
    this.abFMetHb = 0.3;
    this.abNa = 140;
    this.abK = 4.0;
    this.abCa = 1.20;
    this.abCl = 102;
    this.abGlu = 5.5;
    this.abLactate = 1.0;
    this.abAlbumin = 40;
    this.abFiO2 = 30;
    this.abVentPEEP = 6;
    this.abVentAF = 14;
    this.abVentVt = 450;
    this.abVentPBW = 70;

    this.renderAcidBasePage();
    this.showToast("Återställt till standardvärden");
  }

  computeAcidBaseStatus() {
    const pH = parseFloat(this.abpH) || 7.40;
    const pCO2 = parseFloat(this.abpCO2) || 5.3;
    const pO2 = parseFloat(this.abpO2) || 12.0;
    const HCO3 = parseFloat(this.abHCO3) || 24.0;
    const BE = parseFloat(this.abBE) || 0.0;
    const ctHb = parseFloat(this.abctHb) || 120;
    const Hct = parseFloat(this.abHct) || 0.38;
    const sO2 = parseFloat(this.absO2) || 98.0;
    const FCOHb = parseFloat(this.abFCOHb) || 1.0;
    const FMetHb = parseFloat(this.abFMetHb) || 0.2;
    const Na = parseFloat(this.abNa) || 140;
    const K = parseFloat(this.abK) || 4.0;
    const Ca = parseFloat(this.abCa) || 1.20;
    const Cl = parseFloat(this.abCl) || 102;
    const Glu = parseFloat(this.abGlu) || 5.5;
    const Lactate = parseFloat(this.abLactate) || 1.0;
    const Albumin = parseFloat(this.abAlbumin) || 40;
    const FiO2Percent = parseFloat(this.abFiO2) || 40;
    const FiO2Decimal = FiO2Percent > 1.0 ? FiO2Percent / 100 : FiO2Percent;
    const PEEP = parseFloat(this.abVentPEEP) || 8;
    const AF = parseFloat(this.abVentAF) || 16;
    const Vt = parseFloat(this.abVentVt) || 450;
    const PBW = parseFloat(this.abVentPBW) || 70;

    // 1. pH Status
    let phStatus = "Normalt pH (7.35–7.45)";
    let phClass = "normal";
    let phColor = "#16a34a";
    let phBg = "#dcfce7";
    let phMarkerPercent = Math.min(100, Math.max(0, ((pH - 6.9) / (7.7 - 6.9)) * 100));

    if (pH < 7.20) {
      phStatus = "Svår / Grav Acidemi (Livshotande)";
      phClass = "severe-acid";
      phColor = "#dc2626";
      phBg = "#fee2e2";
    } else if (pH < 7.35) {
      phStatus = "Acidemi (pH < 7.35)";
      phClass = "acid";
      phColor = "#ea580c";
      phBg = "#ffedd5";
    } else if (pH > 7.55) {
      phStatus = "Svår Alkalemi (pH > 7.55)";
      phClass = "severe-alk";
      phColor = "#7c3aed";
      phBg = "#f3e8ff";
    } else if (pH > 7.45) {
      phStatus = "Alkalemi (pH > 7.45)";
      phClass = "alk";
      phColor = "#0284c7";
      phBg = "#e0f2fe";
    }

    // 2. Respiratorisk & Metabol komponent
    const isRespAcid = pCO2 > 6.0;
    const isRespAlk = pCO2 < 4.7;
    const isMetAcid = HCO3 < 22.0 || BE < -3.0;
    const isMetAlk = HCO3 > 26.0 || BE > 3.0;

    let primaryDiagnosis = "Normal Syra-Bas Balans";
    let compDetails = "Ingen primär syra-bas rubbning identifierad.";

    if (pH < 7.35) {
      if (isMetAcid && isRespAcid) {
        primaryDiagnosis = "Kombinerad Svår Acidos (Metabol OCH Respiratorisk)";
        compDetails = "Både ventilation och metabola systemet sviktar samtidigt. Extrem risk för kardiovaskulär kollaps.";
      } else if (isMetAcid) {
        primaryDiagnosis = "Metabol Acidos";
        if (isRespAlk) {
          compDetails = "Partiell respiratorisk kompensation (patienten hyperventilerar för att vädra ut CO2).";
        } else if (pCO2 <= 6.0) {
          compDetails = "Okompenserad metabol acidos (pCO2 ännu ej sänkt).";
        } else {
          compDetails = "Samtidig otillräcklig ventilation (pCO2 är förhöjt istället för kompensatoriskt sänkt).";
        }
      } else if (isRespAcid) {
        primaryDiagnosis = "Respiratorisk Acidos (Hypoventilation)";
        if (isMetAlk) {
          compDetails = "Partiell metabol kompensation (njurarna retinerar bikarbonat). Typiskt vid subakut/kronisk lungsjukdom.";
        } else {
          compDetails = "Akut okompenserad respiratorisk acidos (njurarna har inte hunnit retinera bikarbonat).";
        }
      } else {
        primaryDiagnosis = "Ospecificerad Acidemi";
      }
    } else if (pH > 7.45) {
      if (isMetAlk && isRespAlk) {
        primaryDiagnosis = "Kombinerad Svår Alkalos (Metabol OCH Respiratorisk)";
        compDetails = "Både hyperventilation och metabola bikarbonatöverskott föreligger samtidigt.";
      } else if (isRespAlk) {
        primaryDiagnosis = "Respiratorisk Alkalos (Hyperventilation)";
        if (isMetAcid) {
          compDetails = "Partiell metabol kompensation (minskad bikarbonat).";
        } else {
          compDetails = "Akut okompenserad respiratorisk alkalos (smärta, ångest, tidig sepsis, PE eller iatrogen hyperventilation).";
        }
      } else if (isMetAlk) {
        primaryDiagnosis = "Metabol Alkalos";
        if (isRespAcid) {
          compDetails = "Partiell respiratorisk kompensation (hypoventilation för att spara CO2).";
        } else {
          compDetails = "Okompenserad metabol alkalos (t.ex. ventrikelretentionsförluster eller diuretikaterapi).";
        }
      } else {
        primaryDiagnosis = "Ospecificerad Alkalemi";
      }
    } else {
      if (isMetAcid && isRespAlk) {
        primaryDiagnosis = "Fullt Kompenserad Metabol Acidos (Normalt pH)";
        compDetails = "Kronisk eller välkompenserad metabol acidos med respiratorisk utvädring av CO2.";
      } else if (isRespAcid && isMetAlk) {
        primaryDiagnosis = "Fullt Kompenserad Respiratorisk Acidos (KOL-mönster)";
        compDetails = "Kronisk koldioxidretention där njurarna har kompenserat genom att höja bikarbonat.";
      } else if (isMetAcid || isRespAcid || isMetAlk || isRespAlk) {
        primaryDiagnosis = "Kompenserad / Mild blandad syra-bas rubbning";
        compDetails = "pH ligger inom referensintervallet (7.35–7.45) trots avvikande enskilda parametrar.";
      }
    }

    // 3. Anjongap (Klassiskt och med Kalium)
    const rawAnionGap = Na - (Cl + HCO3);
    const anionGapWithK = (Na + K) - (Cl + HCO3);
    const normalAlbumin = 40;
    const correctedAnionGap = rawAnionGap + 0.25 * (normalAlbumin - Albumin);

    const isHagma = correctedAnionGap > 14.0;
    let anionGapText = isHagma ? "Förhöjt (HAGMA)" : "Normalt (8–12 mmol/L)";

    // 4. Delta-Ratio (vid HAGMA)
    let deltaRatio = null;
    let deltaRatioText = "";
    if (isHagma && HCO3 < 24) {
      const deltaAG = correctedAnionGap - 12;
      const deltaHCO3 = 24 - HCO3;
      deltaRatio = deltaHCO3 > 0 ? deltaAG / deltaHCO3 : 1;
      if (deltaRatio < 0.4) {
        deltaRatioText = "Delta-kvot < 0.4: Ren NAGMA (hyperkloremisk acidos).";
      } else if (deltaRatio < 0.8) {
        deltaRatioText = "Delta-kvot 0.4–0.8: Blandad HAGMA och NAGMA samtidigt.";
      } else if (deltaRatio <= 2.0) {
        deltaRatioText = "Delta-kvot 0.8–2.0: Ren HAGMA (typisk DKA eller laktatacidos).";
      } else {
        deltaRatioText = "Delta-kvot > 2.0: HAGMA kombinerad med metabol alkalos eller kronisk CO2-retention.";
      }
    }

    // 5. Syresättning & Horovitz (PaO2/FiO2)
    const pfKpa = pO2 / FiO2Decimal;
    const pfMmhg = pfKpa * 7.5006;
    let ardsGrade = "Normal syresättning (P/F > 40 kPa / > 300 mmHg)";
    let ardsColor = "#16a34a";
    if (pfKpa < 13.3) {
      ardsGrade = "Svår ARDS (PaO2/FiO2 < 13.3 kPa / < 100 mmHg)";
      ardsColor = "#dc2626";
    } else if (pfKpa < 26.7) {
      ardsGrade = "Måttlig ARDS (PaO2/FiO2 13.3–26.7 kPa / 100–200 mmHg)";
      ardsColor = "#ea580c";
    } else if (pfKpa < 40.0) {
      ardsGrade = "Mild ARDS / Nedsatt syresättning (26.7–40 kPa)";
      ardsColor = "#eab308";
    }

    // 6. Ventilatorberäkningar
    const vtPerPbw = PBW > 0 ? Vt / PBW : 6.0;
    const minuteVentilation = (AF * Vt) / 1000; // L/min
    // Rekommenderat AF för målvärde pCO2 5.3 kPa: AF_ny = AF_nu * (pCO2_nu / 5.3)
    const recommendedAF = AF > 0 && pCO2 > 0 ? (AF * (pCO2 / 5.3)) : AF;

    // 7. Laktat
    let lactateGrade = "Normalt (< 1.6 mmol/L)";
    let lactateColor = "#16a34a";
    if (Lactate >= 4.0) {
      lactateGrade = "Svår Laktatacidos (≥ 4.0 mmol/L, Chock/Hypoperfusion)";
      lactateColor = "#dc2626";
    } else if (Lactate >= 2.0) {
      lactateGrade = "Måttligt förhöjt (2.0–3.9 mmol/L, Vävnadshypoperfusion)";
      lactateColor = "#ea580c";
    }

    return {
      pH, pCO2, pO2, HCO3, BE, ctHb, Hct, sO2, FCOHb, FMetHb,
      Na, K, Ca, Cl, Glu, Lactate, Albumin,
      FiO2Percent, FiO2Decimal, PEEP, AF, Vt, PBW,
      phStatus, phColor, phBg, phMarkerPercent,
      primaryDiagnosis, compDetails,
      rawAnionGap, anionGapWithK, correctedAnionGap, isHagma, anionGapText,
      deltaRatio, deltaRatioText,
      pfKpa, pfMmhg, ardsGrade, ardsColor,
      vtPerPbw, minuteVentilation, recommendedAF,
      lactateGrade, lactateColor
    };
  }

  renderAcidBaseResultHtml(res) {
    return `
      <!-- Diagnos Hero -->
      <div class="diagnosis-hero-box" style="background:${res.phBg}; border:1.5px solid ${res.phColor};">
        <div class="diagnosis-badge-large" style="color:${res.phColor};">
          ${res.pH < 7.35 ? '⚠️ï¸' : res.pH > 7.45 ? '⚡' : '✓'} ${res.primaryDiagnosis}
        </div>
        <div class="diagnosis-subtext" style="color:#1e293b;">
          <strong>Kompensation:</strong> ${res.compDetails}
        </div>
      </div>

      <!-- pH Mätare -->
      <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#64748b; font-weight:700;">
        <span>Acidemi (6.90)</span>
        <span style="color:#16a34a;">Normal (7.35–7.45)</span>
        <span>Alkalemi (7.70)</span>
      </div>
      <div class="ph-gauge-bar">
        <div class="ph-gauge-marker" style="left:${res.phMarkerPercent}%;"></div>
      </div>

      <!-- Kritiska Beräknade Parametrar Grid -->
      <div class="calc-metric-cards-grid">
        <div class="metric-card-mini">
          <div class="metric-mini-title">Horovitz PaO2/FiO2</div>
          <div class="metric-mini-val" style="color:${res.ardsColor};">
            ${res.pfKpa.toFixed(1)} <span style="font-size:0.8rem; font-weight:600;">kPa</span>
            <span style="font-size:0.82rem; font-weight:600; color:#64748b;">(${Math.round(res.pfMmhg)} mmHg)</span>
          </div>
          <div class="metric-mini-sub" style="color:${res.ardsColor}; font-weight:600;">${res.ardsGrade}</div>
        </div>

        <div class="metric-card-mini">
          <div class="metric-mini-title">Anjongap (med K⁺ / utan K⁺)</div>
          <div class="metric-mini-val" style="color:${res.isHagma ? '#dc2626' : '#16a34a'};">
            ${res.anionGapWithK.toFixed(1)} <span style="font-size:0.75rem; font-weight:600;">(med K⁺)</span>
            <span style="font-size:0.85rem; font-weight:600; color:#475569;">/ ${res.correctedAnionGap.toFixed(1)} korr</span>
          </div>
          <div class="metric-mini-sub">${res.anionGapText}</div>
        </div>

        <div class="metric-card-mini">
          <div class="metric-mini-title">Ventilator Tidalvolym (Vt/PBW)</div>
          <div class="metric-mini-val" style="color:${res.vtPerPbw > 6.5 ? '#dc2626' : '#16a34a'};">
            ${res.vtPerPbw.toFixed(1)} <span style="font-size:0.8rem; font-weight:600;">ml/kg PBW</span>
          </div>
          <div class="metric-mini-sub">${res.vtPerPbw > 6.5 ? '⚠️ï¸ Över ARDSNet-mål (4–6 ml/kg)' : '✓ Lungprotektiv volym'}</div>
        </div>

        <div class="metric-card-mini">
          <div class="metric-mini-title">Minutventilation (MV)</div>
          <div class="metric-mini-val" style="color:#0f172a;">
            ${res.minuteVentilation.toFixed(1)} <span style="font-size:0.8rem; font-weight:600;">L/min</span>
          </div>
          <div class="metric-mini-sub">AF ${res.AF} /min × Vt ${res.Vt} ml</div>
        </div>
      </div>

      <!-- SEKTION: FÖRSLAG PÅ ÄNDRINGAR I VENTILATORINSTÄLLNINGAR -->
      <div style="background:#eff6ff; border:1.5px solid #3b82f6; border-radius:var(--radius-md); padding:1.1rem; margin-top:1.1rem;">
        <h4 style="margin:0 0 0.6rem; font-size:0.95rem; color:#1e40af; display:flex; align-items:center; gap:0.45rem;">
          🫁 Konkreta Förslag på Ändringar i Ventilatorinställningar
        </h4>
        <div style="font-size:0.84rem; line-height:1.6; color:#1e3a8a;">
          ${this.getVentilatorAdviceHtml(res)}
        </div>
      </div>

      <!-- SEKTION: PATOFYSIOLOGISK FÖRKLARING ("VARFÖR SER BLODGASEN UT SOM DEN GÖR?") -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1.1rem; margin-top:1rem;">
        <h4 style="margin:0 0 0.6rem; font-size:0.95rem; color:#0f172a; display:flex; align-items:center; gap:0.45rem;">
          🔬 Varför ser blodgasen ut som den gör? (Patofysiologisk analys)
        </h4>
        <div style="font-size:0.82rem; line-height:1.6; color:#334155;">
          ${this.getPathophysiologyHtml(res)}
        </div>
      </div>
    `;
  }

  getVentilatorAdviceHtml(res) {
    let advice = [];

    // 1. Andningsfrekvens (AF) beräkning för målvärde pCO2 5.3 kPa
    const targetPCO2 = 5.3;
    const recAF = Math.round(res.recommendedAF);

    if (res.pCO2 > 6.0) {
      advice.push(`
        <strong>1. Koldioxidretention / Hyperkapni (pCO2 ${res.pCO2} kPa):</strong><br>
        För att normalisera pCO2 mot 5.3 kPa rekommenderas att öka andningsfrekvensen från <strong>${res.AF} till ca ${recAF} andetag/minut</strong> (formel: <em>AF_ny = ${res.AF} × (${res.pCO2} / 5.3)</em>).<br>
        <span style="color:#b91c1c;">OBS:</span> Kontrollera flödeskurvan på ventilatorn så att exspirationen hinner avslutas före nästa andetag för att undvika <strong>auto-PEEP / dynamisk hyperinflation</strong>. Vid svår ARDS eller KOL accepteras permissiv hyperkapni så länge pH ≥ 7.20.
      `);
    } else if (res.pCO2 < 4.7) {
      advice.push(`
        <strong>1. Hyperventilation / Hypokapni (pCO2 ${res.pCO2} kPa):</strong><br>
        Patienten vädrar ut för mycket koldioxid (respiratorisk alkalos). Rekommenderar att sänka andningsfrekvensen från <strong>${res.AF} till ca ${Math.max(10, recAF)} andetag/minut</strong> för att undvika cerebral vasokonstriktion, nedsatt cerebralt blodflöde och vänsterförskjuten oxyhemoglobindissociationskurva.
      `);
    } else {
      advice.push(`
        <strong>1. Andningsfrekvens (AF ${res.AF} /min):</strong><br>
        pCO2 (${res.pCO2} kPa) ligger inom normalintervallet (4.7–6.0 kPa). Den inställda minutventilationen (${res.minuteVentilation.toFixed(1)} L/min) är adekvat anpassad till patientens koldioxidproduktion.
      `);
    }

    // 2. Tidalvolym och ARDSNet-lungprotektion
    if (res.vtPerPbw > 6.5) {
      const recVt = Math.round(res.PBW * 6);
      advice.push(`
        <strong>2. Tidalvolym (Vt ${res.Vt} ml = ${res.vtPerPbw.toFixed(1)} ml/kg PBW):</strong><br>
        ⚠️ï¸ Den aktuella tidalvolymen överskrider ARDSNet-riktlinjen för lungprotektiv ventilation (4–6 ml/kg PBW).<br>
        Rekommendation: <strong>Sänk tidalvolymen till ${recVt} ml</strong> (${6} ml/kg PBW) för att minimera volutrauma, skjuvkrafter och sänka drivtrycket (ΔP = Pplat - PEEP &lt; 14 cmH2O).
      `);
    } else {
      advice.push(`
        <strong>2. Tidalvolym (Vt ${res.Vt} ml = ${res.vtPerPbw.toFixed(1)} ml/kg PBW):</strong><br>
        ✓ Uppfyller kriterierna för lungprotektiv ventilation (4–6 ml/kg PBW). Kontrollera att platåtrycket understiger 30 cmH2O och drivtrycket är &lt; 14 cmH2O.
      `);
    }

    // 3. PEEP och FiO2 (Syresättning och ARDS)
    if (res.pfKpa < 13.3) {
      advice.push(`
        <strong>3. Svår ARDS & Refraktär Hypoxemi (PaO2/FiO2 ${res.pfKpa.toFixed(1)} kPa / ${Math.round(res.pfMmhg)} mmHg):</strong><br>
        🔴 <strong>Hög PEEP-strategi:</strong> Öka PEEP stegvis till <strong>14–18 cmH2O</strong> och titrera FiO2 mot målsaturation SpO2 88–92% (PaO2 7.5–9.5 kPa).<br>
        🔴 <strong>Bukläge (Proning):</strong> Vänd patienten i bukläge <strong>≥ 16 timmar/dygn</strong> om PaO2/FiO2 &lt; 20 kPa trots PEEP ≥ 10 cmH2O (stark evidens för sänkt mortalitet).<br>
        🔴 Överväg kontinuerlig neuromuskulär blockad (Cisatrakurium) under de första 48 timmarna vid svår asynkroni.
      `);
    } else if (res.pfKpa < 26.7) {
      advice.push(`
        <strong>3. Måttlig ARDS (PaO2/FiO2 ${res.pfKpa.toFixed(1)} kPa / ${Math.round(res.pfMmhg)} mmHg):</strong><br>
        🟡 Optimera PEEP till <strong>10–14 cmH2O</strong> enligt ARDSNet PEEP/FiO2-titreringstabellen. Titrera FiO2 mot målsaturation 92–96%. Om PaO2/FiO2 förblir &lt; 20 kPa trots PEEP ≥ 10, ordinera bukläge.
      `);
    } else if (res.FiO2Percent >= 40) {
      advice.push(`
        <strong>3. God syresättning med syrgasreserver (PaO2/FiO2 ${res.pfKpa.toFixed(1)} kPa):</strong><br>
        🟢 Eftersom patienten syresätter väl på FiO2 ${res.FiO2Percent}%, prova att stegvis trappa ner FiO2 med 5–10% mot målsaturation 92–96% (PaO2 10–12 kPa) för att undvika hyperoxisk lungskada och absorptionsatelektaser.
      `);
    }

    return advice.join("<br><br>");
  }

  getPathophysiologyHtml(res) {
    let explanations = [];

    // 1. Respiration & Ventilation
    if (res.pCO2 > 6.0) {
      explanations.push(`
        <strong>Respiration (CO2-retention):</strong> Det förhöjda pCO2 (${res.pCO2} kPa) beror på en obalans mellan koldioxidproduktion och alveolär minutventilation: <em>pCO2 â∝ VCO2 / (VE × (1 - VD/VT))</em>. Antingen är minutventilationen för låg för patientens metabola behov, eller så är det fysiologiska dödrummet (VD/VT) kraftigt ökat till följd av atelektaser, överdistension av lungparenkym eller nedsatt lungperfusion (t.ex. vid mikroembolier).
      `);
    } else if (res.pCO2 < 4.7) {
      explanations.push(`
        <strong>Respiration (Hypokapni):</strong> Det låga pCO2 (${res.pCO2} kPa) orsakas av alveolär hyperventilation. På IVA beror detta typiskt på smärta/agitation, hypoxisk kemoreceptorstimulering, centralnervös skada, tidig sepsis, eller iatrogen överventilation med ventilatorn.
      `);
    } else {
      explanations.push(`
        <strong>Respiration:</strong> Koldioxidutvädringen är välbalanserad mot patientens endogena CO2-produktion med aktuellt pCO2 på ${res.pCO2} kPa.
      `);
    }

    // 2. Oxygenation & Shunt
    if (res.pfKpa < 40.0) {
      explanations.push(`
        <strong>Oxygenation & Shunt:</strong> Nedsatt Horovitz-kvot (${res.pfKpa.toFixed(1)} kPa) indikerar intrapulmonell shuntning och ventilations-perfusions-mismatch (V/Q &lt; 1). Blod passerar icke-ventilerade alveoler (atelektaser, exsudat vid pneumoni/ARDS, lungödem) utan att syresättas, vilket leder till arteriell hypoxemi trots ökad FiO2.
      `);
    }

    // 3. Syra-Bas & Elektrolyter
    if (res.isHagma) {
      explanations.push(`
        <strong>Metabol profil (HAGMA):</strong> Förhöjt albuminkorrigerat anjongap (${res.correctedAnionGap.toFixed(1)} mmol/L) påvisar närvaro av icke-mätta anjoner i plasma: laktat (${res.Lactate} mmol/L), ketonkroppar, uremiska toxiner (sulfat/fosfat) eller toxiner (metanol, etylenglykol, salicylat).
      `);
    } else if (res.Cl > 107 && res.HCO3 < 22) {
      explanations.push(`
        <strong>Metabol profil (Hyperkloremisk NAGMA):</strong> Högt klorid (${res.Cl} mmol/L) i relation till natrium (${res.Na} mmol/L) tränger undan bikarbonat buffertkapacitet i njurtubuli, typiskt orsakat av stora volymer o-balanserade kristalloider (NaCl 0.9%).
      `);
    }

    // 4. Oximetri & Hemoglobin
    if (res.ctHb < 100) {
      explanations.push(`
        <strong>Syrebärande förmåga:</strong> Hemoglobin ctHb är sänkt till ${res.ctHb} g/L. Arteriellt syreinnehåll (CaO2) är reducerat, vilket innebär att hjärtminutvolymen (CO) måste öka kompensatoriskt för att upprätthålla adekvat global syrgastillförsel (DO2 = CO × CaO2).
      `);
    }

    return explanations.join("<br><br>");
  }

  setupAcidBaseEvents() {
    const bindField = (id, prop) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", (e) => {
        this[prop] = parseFloat(e.target.value) || 0;
        const res = this.computeAcidBaseStatus();
        const container = document.getElementById("acidBaseResultContainer");
        if (container) {
          container.innerHTML = this.renderAcidBaseResultHtml(res);
        }
      });
    };

    bindField("inputAbpH", "abpH");
    bindField("inputAbpCO2", "abpCO2");
    bindField("inputAbpO2", "abpO2");
    bindField("inputAbHCO3", "abHCO3");
    bindField("inputAbBE", "abBE");
    bindField("inputAbctHb", "abctHb");
    bindField("inputAbHct", "abHct");
    bindField("inputAbsO2", "absO2");
    bindField("inputAbFCOHb", "abFCOHb");
    bindField("inputAbFMetHb", "abFMetHb");
    bindField("inputAbNa", "abNa");
    bindField("inputAbK", "abK");
    bindField("inputAbCa", "abCa");
    bindField("inputAbCl", "abCl");
    bindField("inputAbGlu", "abGlu");
    bindField("inputAbLactate", "abLactate");
    bindField("inputAbAlbumin", "abAlbumin");
    bindField("inputAbFiO2", "abFiO2");
    bindField("inputAbVentPEEP", "abVentPEEP");
    bindField("inputAbVentAF", "abVentAF");
    bindField("inputAbVentVt", "abVentVt");
    bindField("inputAbVentPBW", "abVentPBW");
  }

  // =========================================================================
  // MODUL 3: VÄTSKEBALANS & VÄTSKETYPER (ROSE)
  // =========================================================================
  // MODUL 3: VÄTSKEBALANS, VÄTSKETYPER & BLODPRODUKTER
  // =========================================================================

  // =========================================================================
  // MODUL 3: VÄTSKEBALANS, EXCEL-ARK (BILD 2), DROPPTAKT & ROSE
  // =========================================================================

  renderFluidBalancePage() {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    mainEl.style.setProperty("--theme-color", "#059669");
    mainEl.style.setProperty("--theme-bg", "#d1fae5");
    mainEl.style.setProperty("--theme-border", "#a7f3d0");

    let html = `
      <section class="page-hero">
        <div class="hero-main">
          <div class="hero-info">
            <div class="hero-icon-bubble" style="background:#d1fae5; color:#059669; border-color:#a7f3d0;">
              ${ICONS.droplets}
            </div>
            <div class="hero-text">
              <h2>
                Vätsketerapi, Vätskebalans & Dropptakt
                <span class="hero-count-pill" style="background:#d1fae5; color:#065f46;">IVA Östra</span>
              </h2>
              <p>Östra sjukhusets kompletta Excel-modell för dygnsbalans (Bild 2), ny Dropptaktskalkylator (dr/min & ml/h), diuresmål, infusionsvätskor (inkl. Glukos 10% & kcal), blodprodukter samt ROSE-konceptet.</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-upload-primary" onclick="app.switchCategory('Respiration')">
              Tillbaka till Rutiner
            </button>
          </div>
        </div>

        <!-- Fliknavigering med horisontell scrollning -->
        <div class="page-toolbar">
          <div class="drug-tab-nav horizontal-scroll-tabs" style="border-bottom:none; padding-bottom:0;">
            <button class="drug-tab-btn ${this.fluidCurrentTab === 'excel' ? 'active' : ''}" onclick="app.switchFluidTab('excel')">
              📋 Östra Excel-Vätskebalans (Bild 2)
            </button>
            <button class="drug-tab-btn ${this.fluidCurrentTab === 'drip' ? 'active' : ''}" onclick="app.switchFluidTab('drip')">
              💧 Dropptaktskalkylator (dr/min)
            </button>
            <button class="drug-tab-btn ${this.fluidCurrentTab === 'calc' ? 'active' : ''}" onclick="app.switchFluidTab('calc')">
              ⚖️ï¸ Diuresmål & Kalkylator (24h)
            </button>
            <button class="drug-tab-btn ${this.fluidCurrentTab === 'types' ? 'active' : ''}" onclick="app.switchFluidTab('types')">
              🧪 Infusionsvätskor (Glukos 10% & kcal)
            </button>
            <button class="drug-tab-btn ${this.fluidCurrentTab === 'blood' ? 'active' : ''}" onclick="app.switchFluidTab('blood')">
              🩸 Blodprodukter & Transfusion
            </button>
            <button class="drug-tab-btn ${this.fluidCurrentTab === 'rose' ? 'active' : ''}" onclick="app.switchFluidTab('rose')">
              🌹 ROSE-Konceptet & Fysiologi
            </button>
            <button class="drug-tab-btn ${this.fluidCurrentTab === 'fo' ? 'active' : ''}" onclick="app.switchFluidTab('fo')">
              📊 Kumulativ % FO
            </button>
          </div>
        </div>
      </section>

      <!-- Flikinnehåll -->
      <div id="fluidTabContentContainer">
        ${this.renderActiveFluidTabHtml()}
      </div>
    `;

    mainEl.innerHTML = html;
    this.setupFluidBalanceEvents();
  }

  switchFluidTab(tab) {
    this.fluidCurrentTab = tab;
    const container = document.getElementById("fluidTabContentContainer");
    if (container) {
      container.innerHTML = this.renderActiveFluidTabHtml();
      this.setupFluidBalanceEvents();
    }
    document.querySelectorAll(".page-toolbar .drug-tab-btn").forEach((b) => {
      const onclickAttr = b.getAttribute("onclick") || "";
      b.classList.toggle("active", onclickAttr.includes(`'${tab}'`));
    });
  }

  setFluidTargetBalance(val) {
    this.fluidCalcTargetBalance = val;
    const input = document.getElementById("inputTargetBal");
    if (input) input.value = val;
    const container = document.getElementById("fluidTabContentContainer");
    if (container) {
      container.innerHTML = this.renderActiveFluidTabHtml();
      this.setupFluidBalanceEvents();
    }
  }

  setQuickDrip(vol, hours, mins, factor = 20) {
    this.dripVolume = vol;
    this.dripTimeHours = hours;
    this.dripTimeMinutes = mins;
    this.dripSelectedFactor = factor;
    const vEl = document.getElementById("inputDripVol");
    const hEl = document.getElementById("inputDripHours");
    const mEl = document.getElementById("inputDripMins");
    const fEl = document.getElementById("selectDripFactor");
    if (vEl) vEl.value = vol;
    if (hEl) hEl.value = hours;
    if (mEl) mEl.value = mins;
    if (fEl) fEl.value = factor;

    const totalMinutes = (hours * 60) + mins;
    const dripRate = totalMinutes > 0 ? Math.round((vol * factor) / totalMinutes) : 0;
    const secPerDrop = dripRate > 0 ? (60 / dripRate).toFixed(1) : 0;
    const mlPerHour = totalMinutes > 0 ? Math.round((vol / totalMinutes) * 60) : 0;

    const rateEl = document.getElementById("dripRateDisplay");
    if (rateEl) rateEl.innerHTML = `${dripRate} <span style="font-size:1.3rem; font-weight:700;">droppar / minut</span>`;

    const secEl = document.getElementById("dripSecDisplay");
    if (secEl) secEl.textContent = `1 droppe var ${secPerDrop} sekund`;

    const mlhEl = document.getElementById("dripMlhDisplay");
    if (mlhEl) mlhEl.textContent = `${mlPerHour} ml / timme`;
  }

  getClinicalAdviceHtml(res) {
    let advice = [];
    if (!res) return advice.join("");
    if (res.Lactate >= 4.0) {
      advice.push("<strong>Akut laktatchock:</strong> Ge 30 ml/kg kristalloid, säkra adekvat MAP ≥ 65 med Noradrenalin, optimera syrgastillförsel och uteslut tarmischemi, sepsis och grav hypoxemi.");
    }
    if (res.isHagma) {
      advice.push("<strong>HAGMA identifierad:</strong> Kontrollera ketoner (P-B-hydroxibutyrat), s-kreatinin/ureum, laktat och toxikologisk screening vid oklarhet.");
    }
    if (res.Cl > 112 && res.HCO3 < 22) {
      advice.push("<strong>Hyperkloremisk acidos (NAGMA):</strong> Byt ut eventuell NaCl 0.9% mot balanserad kristalloid (Ringer-Acetat eller Plasmalyte).");
    }
    if (res.pfKpa < 20.0) {
      advice.push("<strong>Måttlig till svår ARDS:</strong> Tillämpa lungprotektiv ventilation (Vt 4-6 ml/kg PBW, Platåtryck < 30 cmH2O, Drivtryck < 14 cmH2O). Överväg bukläge ≥ 16h/dygn.");
    }
    if (res.pCO2 > 7.5 && res.pH < 7.25) {
      advice.push("<strong>Svår koldioxidretention:</strong> Överväg ökad minutventilation om ej obstruktivitet; vid svår KOL acceptera permissiv hyperkapni så länge pH > 7.20 om intrakraniellt tryck är normalt.");
    }
    if (advice.length === 0) {
      advice.push("Normal syra-bas och metabol profil. Fortsätt standard IVA-övervakning.");
    }
    return advice.join("<br><br>");
  }


  renderActiveFluidTabHtml() {
    const fluids = typeof IVA_FLUIDS_DATA !== "undefined" ? IVA_FLUIDS_DATA : [];
    const bloodProducts = typeof IVA_BLOOD_PRODUCTS_DATA !== "undefined" ? IVA_BLOOD_PRODUCTS_DATA : [];
    const dripFactors = typeof IVA_DRIP_FACTORS !== "undefined" ? IVA_DRIP_FACTORS : [];

    // =========================================================================
    // TAB 1: 📋 ÖSTRA EXCEL-VÄTSKEBALANS (BILD 2)
    // =========================================================================
    if (this.fluidCurrentTab === "excel") {
      const d = this.excelFluidData || this.loadExcelFluidData();
      const weight = parseFloat(d.weight) || 75;
      const hours = parseFloat(d.periodHours) || 24;
      const targetBal = parseFloat(d.targetBalance) || 0;

      // Beräkna tillfört
      const totalIn = (parseFloat(d.inCrystalloids) || 0) +
                      (parseFloat(d.inGlucose5) || 0) +
                      (parseFloat(d.inGlucose10) || 0) +
                      (parseFloat(d.inDrugs) || 0) +
                      (parseFloat(d.inEnteral) || 0) +
                      (parseFloat(d.inTPN) || 0) +
                      (parseFloat(d.inBlood) || 0) +
                      (parseFloat(d.inOther) || 0);

      // Beräkna förluster
      const perspAuto = Math.round((weight * 10 * hours) / 24);
      const totalOut = (parseFloat(d.outUrine) || 0) +
                       (parseFloat(d.outStomach) || 0) +
                       (parseFloat(d.outDrains) || 0) +
                       (parseFloat(d.outStoma) || 0) +
                       (parseFloat(d.outCRRT) || 0) +
                       (parseFloat(d.outPerspiratio || perspAuto) || 0) +
                       (parseFloat(d.outOther) || 0);

      const netBalance = totalIn - totalOut;
      const balancePerKg = weight > 0 ? (netBalance / weight).toFixed(1) : 0;
      const diuresMlH = hours > 0 ? ((parseFloat(d.outUrine) || 0) / hours).toFixed(1) : 0;
      const diuresMlKgH = (weight > 0 && hours > 0) ? ((parseFloat(d.outUrine) || 0) / (weight * hours)).toFixed(2) : 0;
      const foPercent = weight > 0 ? ((netBalance / 1000) / weight * 100).toFixed(1) : 0;

      let diuresColor = "#16a34a";
      let diuresStatus = "Adekvat diures (0.5–1.5 ml/kg/h)";
      if (parseFloat(diuresMlKgH) < 0.5) {
        diuresColor = "#dc2626";
        diuresStatus = "⚠️ï¸ Oliguri (< 0.5 ml/kg/h) – Risk för AKI!";
      } else if (parseFloat(diuresMlKgH) > 1.5) {
        diuresColor = "#0284c7";
        diuresStatus = "Polyuri (> 1.5 ml/kg/h)";
      }

      return `
        <div style="background:#ffffff; border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:1.25rem; box-shadow:var(--shadow-sm); margin-bottom:1.5rem;">
          <!-- Rubrik & Patientparametrar -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; border-bottom:1px solid #f1f5f9; padding-bottom:1rem; margin-bottom:1.25rem;">
            <div>
              <h3 style="margin:0; font-size:1.2rem; color:#0f172a; font-weight:800; display:flex; align-items:center; gap:0.5rem;">
                📋 Vätskebalanskalkylator – Östra sjukhusets IVA-modell
              </h3>
              <p style="margin:0.25rem 0 0; font-size:0.8rem; color:#64748b;">
                Fyll i tillfört och förluster nedan. Alla summor, timdiures, nettot och % FO räknas om direkt utan fördröjning.
              </p>
            </div>
            <div style="display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;">
              <div class="calc-field-group" style="margin:0;">
                <label class="calc-field-label" style="font-size:0.75rem;">Patientvikt (kg)</label>
                <input type="number" step="0.5" class="calc-field-input" id="exWeight" value="${weight}" style="width:100px; padding:0.35rem 0.6rem;" />
              </div>
              <div class="calc-field-group" style="margin:0;">
                <label class="calc-field-label" style="font-size:0.75rem;">Tidsperiod (h)</label>
                <input type="number" step="1" class="calc-field-input" id="exHours" value="${hours}" style="width:85px; padding:0.35rem 0.6rem;" />
              </div>
              <div class="calc-field-group" style="margin:0;">
                <label class="calc-field-label" style="font-size:0.75rem;">Målbalans (ml)</label>
                <input type="number" step="100" class="calc-field-input" id="exTarget" value="${targetBal}" style="width:105px; padding:0.35rem 0.6rem;" />
              </div>
            </div>
          </div>

          <!-- Tvåkolumnslayout: TILLFÖRT vs FÖRLUSTER -->
          <div class="excel-fluid-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
            
            <!-- VÄNSTER: TILLFÖRT (IN) -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1.1rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; border-bottom:2px solid #059669; padding-bottom:0.4rem;">
                <span style="font-weight:800; font-size:0.95rem; color:#065f46;">📥 TILLFÖRT (IN)</span>
                <span style="font-size:0.8rem; font-weight:700; color:#059669;">Volym (ml)</span>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.6rem;">
                <div class="excel-input-row">
                  <label class="excel-row-label">Kristalloider (Ringer, Plasmalyte, NaCl)</label>
                  <input type="number" class="excel-field-num" id="exInCryst" value="${d.inCrystalloids}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Glukos 5%</label>
                  <input type="number" class="excel-field-num" id="exInG5" value="${d.inGlucose5}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Glukos 10% (400 kcal/L)</label>
                  <input type="number" class="excel-field-num" id="exInG10" value="${d.inGlucose10}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Läkemedelsinfusioner (Noradrenalin, Sedering m.fl.)</label>
                  <input type="number" class="excel-field-num" id="exInDrugs" value="${d.inDrugs}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Enteral nutrition (Sondmat & Vatten)</label>
                  <input type="number" class="excel-field-num" id="exInEnt" value="${d.inEnteral}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Parenteral nutrition (TPN / Kabiven)</label>
                  <input type="number" class="excel-field-num" id="exInTPN" value="${d.inTPN}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Blodprodukter (SAG, Plasma, Trombocyter, Albumin)</label>
                  <input type="number" class="excel-field-num" id="exInBlood" value="${d.inBlood}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Sköljningar, bolusdoser & övrigt</label>
                  <input type="number" class="excel-field-num" id="exInOther" value="${d.inOther}" />
                </div>
              </div>

              <div class="excel-total-strip" style="background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; margin-top:1rem; padding:0.6rem 0.85rem; border-radius:6px; display:flex; justify-content:space-between; align-items:center; font-weight:800;">
                <span>SUMMA TILLFÖRT:</span>
                <span id="exSumInDisplay" style="font-size:1.15rem;">${totalIn} ml</span>
              </div>
            </div>

            <!-- HÖGER: FÖRLUSTER (UT) -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1.1rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; border-bottom:2px solid #e11d48; padding-bottom:0.4rem;">
                <span style="font-weight:800; font-size:0.95rem; color:#9f1239;">📤 FÖRLUSTER (UT)</span>
                <span style="font-size:0.8rem; font-weight:700; color:#e11d48;">Volym (ml)</span>
              </div>

              <div style="display:flex; flex-direction:column; gap:0.6rem;">
                <div class="excel-input-row">
                  <label class="excel-row-label">Urin / Diures (KAD)</label>
                  <input type="number" class="excel-field-num" id="exOutUrine" value="${d.outUrine}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Ventrikelretention (V-sond aspiration)</label>
                  <input type="number" class="excel-field-num" id="exOutStomach" value="${d.outStomach}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Dränage (Thoraxdrän, bukdrän, sårdrän)</label>
                  <input type="number" class="excel-field-num" id="exOutDrains" value="${d.outDrains}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Stomi / Diarré / Avföring</label>
                  <input type="number" class="excel-field-num" id="exOutStoma" value="${d.outStoma}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Dialys / CRRT (Netto Ultrafiltration)</label>
                  <input type="number" class="excel-field-num" id="exOutCRRT" value="${d.outCRRT}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Perspiratio insensibilis (hud & luftvägar)</label>
                  <input type="number" class="excel-field-num" id="exOutPersp" value="${d.outPerspiratio || perspAuto}" />
                </div>
                <div class="excel-input-row">
                  <label class="excel-row-label">Övriga förluster (blödning, kräkning)</label>
                  <input type="number" class="excel-field-num" id="exOutOther" value="${d.outOther}" />
                </div>
              </div>

              <div class="excel-total-strip" style="background:#ffe4e6; border:1px solid #fecdd3; color:#9f1239; margin-top:1rem; padding:0.6rem 0.85rem; border-radius:6px; display:flex; justify-content:space-between; align-items:center; font-weight:800;">
                <span>SUMMA FÖRLUSTER:</span>
                <span id="exSumOutDisplay" style="font-size:1.15rem;">${totalOut} ml</span>
              </div>
            </div>
          </div>

          <!-- RESULTATPANEL MED NYCKELTAL -->
          <div style="margin-top:1.5rem; padding:1.25rem; background:#f1f5f9; border-radius:var(--radius-md); border:1px solid #cbd5e1;">
            <div style="font-weight:800; font-size:0.95rem; color:#0f172a; margin-bottom:0.75rem;">
              📊 Balansanalys & Timdiures
            </div>

            <div class="calc-metric-cards-grid">
              <div class="metric-card-mini">
                <div class="metric-mini-title">Nettobalans (${hours}h)</div>
                <div class="metric-mini-val" id="exNetBalDisplay" style="color:${netBalance >= 0 ? '#0284c7' : '#ea580c'};">
                  ${netBalance > 0 ? '+' : ''}${netBalance} <span style="font-size:0.8rem; font-weight:600;">ml</span>
                </div>
                <div class="metric-mini-sub" id="exNetBalSub">${balancePerKg} ml/kg (${hours}h)</div>
              </div>

              <div class="metric-card-mini">
                <div class="metric-mini-title">Timdiures (Snitt)</div>
                <div class="metric-mini-val" id="exDiuresValDisplay" style="color:${diuresColor};">
                  ${diuresMlKgH} <span style="font-size:0.8rem; font-weight:600;">ml/kg/h</span>
                </div>
                <div class="metric-mini-sub" id="exDiuresSubDisplay" style="color:${diuresColor}; font-weight:600;">
                  ${diuresMlH} ml/h • ${diuresStatus}
                </div>
              </div>

              <div class="metric-card-mini">
                <div class="metric-mini-title">Målavvikelse</div>
                <div class="metric-mini-val" id="exTargetDiffDisplay">
                  ${(netBalance - targetBal) > 0 ? '+' : ''}${netBalance - targetBal} <span style="font-size:0.8rem; font-weight:600;">ml</span>
                </div>
                <div class="metric-mini-sub">Mål: ${targetBal} ml</div>
              </div>

              <div class="metric-card-mini">
                <div class="metric-mini-title">Vätskeöverbelastning (% FO)</div>
                <div class="metric-mini-val" id="exFoPercentDisplay" style="color:${parseFloat(foPercent) >= 10 ? '#dc2626' : '#16a34a'};">
                  ${foPercent}%
                </div>
                <div class="metric-mini-sub">${parseFloat(foPercent) >= 10 ? '⚠️ï¸ Signifikant FO (> 10%)' : '✓ Acceptabel nivå'}</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // TAB 2: 💧 DROPPTAKTSKALKYLATOR
    // =========================================================================
    if (this.fluidCurrentTab === "drip" || this.fluidCurrentTab === "dropp") {
      const vol = parseFloat(this.dripVolume) || 1000;
      const hours = parseFloat(this.dripTimeHours) || 8;
      const mins = parseFloat(this.dripTimeMinutes) || 0;
      const factor = parseFloat(this.dripSelectedFactor) || 20;

      const totalMinutes = (hours * 60) + mins;
      const dripRate = totalMinutes > 0 ? Math.round((vol * factor) / totalMinutes) : 0;
      const secPerDrop = dripRate > 0 ? (60 / dripRate).toFixed(1) : 0;
      const mlPerHour = totalMinutes > 0 ? Math.round((vol / totalMinutes) * 60) : 0;

      return `
        <div style="background:#ffffff; border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:1.5rem; box-shadow:var(--shadow-sm); max-width:850px; margin:0 auto 1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.75rem;">
            <div>
              <h3 style="margin:0; font-size:1.2rem; color:#0f172a; font-weight:800; display:flex; align-items:center; gap:0.5rem;">
                💧 Dropptaktskalkylator (dr/min & ml/h)
              </h3>
              <p style="margin:0.25rem 0 0; font-size:0.82rem; color:#64748b;">
                Beräkna dropphastighet för manuella infusionsaggregat eller kontrollera pumpinställningar.
              </p>
            </div>
            <span style="background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; padding:4px 10px; border-radius:9999px; font-size:0.75rem; font-weight:700;">
              Standardformel: (Volym × Faktor) / Minuter
            </span>
          </div>

          <!-- Snabbknappar för standardordinationer -->
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.25rem; align-items:center;">
            <span style="font-size:0.75rem; font-weight:700; color:#64748b;">Snabbval:</span>
            <button type="button" class="home-tag-btn" onclick="app.setQuickDrip(1000, 8, 0, 20)">1000 ml / 8h</button>
            <button type="button" class="home-tag-btn" onclick="app.setQuickDrip(1000, 12, 0, 20)">1000 ml / 12h</button>
            <button type="button" class="home-tag-btn" onclick="app.setQuickDrip(1000, 24, 0, 20)">1000 ml / 24h</button>
            <button type="button" class="home-tag-btn" onclick="app.setQuickDrip(500, 2, 0, 20)">500 ml / 2h</button>
            <button type="button" class="home-tag-btn" onclick="app.setQuickDrip(500, 4, 0, 20)">500 ml / 4h</button>
            <button type="button" class="home-tag-btn" onclick="app.setQuickDrip(500, 0, 30, 20)">Bolus 500 ml / 30 min</button>
          </div>

          <div class="calc-inputs-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
            <div class="calc-field-group">
              <label class="calc-field-label">Infusionsvolym <span class="calc-field-unit">ml</span></label>
              <input type="number" step="50" class="calc-field-input" id="inputDripVol" value="${vol}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Infusionstid: Timmar <span class="calc-field-unit">h</span></label>
              <input type="number" step="1" min="0" class="calc-field-input" id="inputDripHours" value="${hours}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Infusionstid: Minuter <span class="calc-field-unit">min</span></label>
              <input type="number" step="5" min="0" max="59" class="calc-field-input" id="inputDripMins" value="${mins}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Droppaggregat / Droppfaktor</label>
              <select class="calc-field-input" id="selectDripFactor" style="cursor:pointer;">
                ${dripFactors.map(f => `
                  <option value="${f.dropsPerMl}" ${f.dropsPerMl === factor ? 'selected' : ''}>
                    ${f.name} (${f.dropsPerMl} dr/ml)
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Resultatbox för dropptakt -->
          <div style="background:linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border:1.5px solid #10b981; border-radius:var(--radius-lg); padding:1.5rem; text-align:center;">
            <div style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:#065f46; letter-spacing:0.5px; margin-bottom:0.4rem;">
              Rekommenderad Dropptakt
            </div>
            <div id="dripRateDisplay" style="font-size:3.2rem; font-weight:900; color:#065f46; line-height:1; margin-bottom:0.5rem;">
              ${dripRate} <span style="font-size:1.3rem; font-weight:700;">droppar / minut</span>
            </div>

            <div style="display:flex; justify-content:center; gap:2rem; flex-wrap:wrap; margin-top:1rem; padding-top:1rem; border-top:1px solid #a7f3d0;">
              <div>
                <div style="font-size:0.75rem; color:#065f46; font-weight:600;">Intervall mellan droppar:</div>
                <div id="dripSecDisplay" style="font-size:1.25rem; font-weight:800; color:#065f46;">
                  1 droppe var ${secPerDrop} sekund
                </div>
              </div>
              <div>
                <div style="font-size:0.75rem; color:#065f46; font-weight:600;">Infusionshastighet:</div>
                <div id="dripMlhDisplay" style="font-size:1.25rem; font-weight:800; color:#065f46;">
                  ${mlPerHour} ml / timme
                </div>
              </div>
            </div>
          </div>

          <!-- Lathund för vanliga volymer -->
          <div style="margin-top:1.5rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1rem;">
            <div style="font-weight:700; font-size:0.85rem; color:#0f172a; margin-bottom:0.5rem;">
              📋 Snabb-lathund (Standardaggregat 20 droppar/ml):
            </div>
            <div style="font-size:0.8rem; color:#475569; display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.5rem;">
              <div>• 1000 ml på 8h = <strong>42 dr/min</strong> (125 ml/h)</div>
              <div>• 1000 ml på 12h = <strong>28 dr/min</strong> (83 ml/h)</div>
              <div>• 1000 ml på 24h = <strong>14 dr/min</strong> (42 ml/h)</div>
              <div>• 500 ml på 4h = <strong>42 dr/min</strong> (125 ml/h)</div>
              <div>• 500 ml på 2h = <strong>83 dr/min</strong> (250 ml/h)</div>
              <div>• 100 ml på 30 min = <strong>67 dr/min</strong> (200 ml/h)</div>
            </div>
          </div>
        </div>
      `;
    }

    // TAB 3: ⚖️ï¸ DIURESMÅL & 24H SNABBKALKYLATOR (BEHÅLLEN MED IN-PLACE UPPDATERING)
    if (this.fluidCurrentTab === "calc") {
      const weight = parseFloat(this.fluidCalcWeight) || 75;
      const targetBal = parseFloat(this.fluidCalcTargetBalance) || 0;
      const inCryst = parseFloat(this.fluidInCrystalloids) || 0;
      const inG5 = parseFloat(this.fluidInGlucose5) || 0;
      const inG10 = parseFloat(this.fluidInGlucose10) || 0;
      const inDrugs = parseFloat(this.fluidInDrugs) || 0;
      const inEnt = parseFloat(this.fluidInEnteral) || 0;
      const inTPN = parseFloat(this.fluidInTPN) || 0;
      const inBlood = parseFloat(this.fluidInBlood) || 0;
      const inOther = parseFloat(this.fluidInOther) || 0;

      const outStomach = parseFloat(this.fluidOutStomach) || 0;
      const outDrains = parseFloat(this.fluidOutDrains) || 0;
      const outStoma = parseFloat(this.fluidOutStoma) || 0;
      const outCRRT = parseFloat(this.fluidOutCRRT) || 0;
      const outPersp = parseFloat(this.fluidOutPerspiratio) || 750;

      const totalIn = inCryst + inG5 + inG10 + inDrugs + inEnt + inTPN + inBlood + inOther;
      const nonRenalOut = outStomach + outDrains + outStoma + outCRRT + outPersp;
      const targetUrine24h = Math.max(0, totalIn - nonRenalOut - targetBal);
      const targetUrinePerHour = Math.round(targetUrine24h / 24);
      const targetUrineMlKgH = (targetUrinePerHour / weight).toFixed(2);

      return `
        <div class="bloodgas-layout-grid">
          <div class="calc-panel">
            <h3 style="font-size:1.1rem; color:#0f172a; margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
              ${ICONS.calculator} Ange Planerad Tillförsel & Extrarenala Förluster
            </h3>

            <div class="calc-inputs-grid" style="grid-template-columns: 1fr 1fr; gap:0.75rem; margin-bottom:1rem;">
              <div class="calc-field-group">
                <label class="calc-field-label">Patientvikt <span class="calc-field-unit">kg</span></label>
                <input type="number" step="1" class="calc-field-input" id="inputCalcWeight" value="${weight}" />
              </div>

              <div class="calc-field-group">
                <label class="calc-field-label">Önskad Målbalans (24h) <span class="calc-field-unit">ml</span></label>
                <input type="number" step="100" class="calc-field-input" id="inputTargetBal" value="${targetBal}" />
              </div>
            </div>

            <div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; color:#059669; margin:0.75rem 0 0.35rem;">Planerad Tillförsel (ml/24h)</div>
            <div class="calc-inputs-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem;">
              <div class="calc-field-group"><label class="calc-field-label">Kristalloider</label><input type="number" class="calc-field-input" id="inputInCryst" value="${inCryst}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">Glukos 5%</label><input type="number" class="calc-field-input" id="inputInG5" value="${inG5}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">Glukos 10%</label><input type="number" class="calc-field-input" id="inputInG10" value="${inG10}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">Läkemedel</label><input type="number" class="calc-field-input" id="inputInDrugs" value="${inDrugs}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">Enteralt</label><input type="number" class="calc-field-input" id="inputInEnt" value="${inEnt}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">TPN</label><input type="number" class="calc-field-input" id="inputInTPN" value="${inTPN}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">Blodprod.</label><input type="number" class="calc-field-input" id="inputInBlood" value="${inBlood}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">Övrigt</label><input type="number" class="calc-field-input" id="inputInOther" value="${inOther}" /></div>
            </div>

            <div style="font-weight:700; font-size:0.8rem; text-transform:uppercase; color:#dc2626; margin:1rem 0 0.35rem;">Extrarenala Förluster (ml/24h)</div>
            <div class="calc-inputs-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem;">
              <div class="calc-field-group"><label class="calc-field-label">V-sond</label><input type="number" class="calc-field-input" id="inputOutStomach" value="${outStomach}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">Dränage</label><input type="number" class="calc-field-input" id="inputOutDrains" value="${outDrains}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">Stomi</label><input type="number" class="calc-field-input" id="inputOutStoma" value="${outStoma}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">CRRT UF</label><input type="number" class="calc-field-input" id="inputOutCRRT" value="${outCRRT}" /></div>
              <div class="calc-field-group"><label class="calc-field-label">Perspiratio</label><input type="number" class="calc-field-input" id="inputOutPersp" value="${outPersp}" /></div>
            </div>
          </div>

          <div class="calc-panel">
            <div class="diagnosis-hero-box" style="background:#ecfdf5; border:1.5px solid #10b981;">
              <div class="diagnosis-badge-large" style="color:#065f46;">
                Nödvändig 24h Diures: <span id="resTarget24h">${targetUrine24h}</span> ml
              </div>
              <div class="diagnosis-subtext" style="color:#065f46;">
                För att uppnå målbalansen på ${targetBal} ml krävs denna diures.
              </div>
            </div>

            <div class="calc-metric-cards-grid" style="margin-top:1.25rem;">
              <div class="metric-card-mini">
                <div class="metric-mini-title">Mål-Timdiures (ml/h)</div>
                <div class="metric-mini-val" id="resTargetH" style="color:#059669;">${targetUrinePerHour} ml/h</div>
                <div class="metric-mini-sub">Snitt över dygnet</div>
              </div>
              <div class="metric-card-mini">
                <div class="metric-mini-title">Mål-Timdiures per kg</div>
                <div class="metric-mini-val" id="resTargetKgH" style="color:#059669;">${targetUrineMlKgH} ml/kg/h</div>
                <div class="metric-mini-sub">Referens: 0.5–1.0 ml/kg/h</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // TAB 4: 🧪 INFUSIONSVÄTSKOR (BEHÅLLEN)
    if (this.fluidCurrentTab === "types") {
      return `
        <div class="fluids-cards-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
          ${fluids.map(f => {
            const borderCol = f.category.includes('Balanserad') ? '#10b981' : f.category.includes('Glukos') ? '#3b82f6' : f.category.includes('Kolloid') ? '#8b5cf6' : '#64748b';
            return `
            <div class="fluid-card" style="background:#ffffff; border:1px solid #e2e8f0; border-top: 4px solid ${borderCol}; border-radius:var(--radius-lg); padding:1.25rem; display:flex; flex-direction:column; gap:0.65rem; box-shadow:var(--shadow-sm);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
                <div>
                  <h4 style="margin:0; font-size:1.1rem; color:#0f172a; font-weight:800;">${f.name}</h4>
                  <span class="fluid-cat-pill" style="display:inline-block; font-size:0.75rem; font-weight:700; background:#f1f5f9; color:#334155; padding:0.15rem 0.5rem; border-radius:4px; margin-top:0.25rem;">${f.category}</span>
                </div>
                <span class="fluid-osm-pill" style="font-size:0.75rem; font-weight:700; background:#f8fafc; border:1px solid #cbd5e1; color:#0f172a; padding:0.2rem 0.55rem; border-radius:6px;">${f.osmolarity}</span>
              </div>

              <div style="font-size:0.82rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.55rem 0.75rem;">
                <div style="font-weight:700; color:#0369a1; margin-bottom:0.2rem;">âš¡ ElektrolytinnehÃ¥ll:</div>
                <div style="color:#1e293b; font-family:monospace; font-size:0.8rem; line-height:1.4;">${f.electrolytes}</div>
              </div>

              <div style="font-size:0.82rem; display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
                <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:0.45rem 0.6rem;">
                  <span style="font-size:0.7rem; font-weight:700; color:#166534; text-transform:uppercase; display:block;">Volymexpansion:</span>
                  <span style="font-weight:700; color:#14532d; font-size:0.8rem;">${f.expansionFactor}</span>
                </div>
                <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:0.45rem 0.6rem;">
                  <span style="font-size:0.7rem; font-weight:700; color:#b45309; text-transform:uppercase; display:block;">EnergiinnehÃ¥ll:</span>
                  <span style="font-weight:700; color:#78350f; font-size:0.8rem;">${f.caloriesNote || (f.caloriesPerLiter + ' kcal/L')}</span>
                </div>
              </div>

              ${f.pros && f.pros.length > 0 ? `
                <div style="font-size:0.8rem;">
                  <div style="font-weight:700; color:#166534; margin-bottom:0.2rem;">âœ“ FÃ¶rdelar & Indikationer:</div>
                  <ul style="margin:0; padding-left:1.2rem; color:#334155; line-height:1.35;">
                    ${f.pros.map(p => `<li>${p}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${f.cons && f.cons.length > 0 ? `
                <div style="font-size:0.8rem;">
                  <div style="font-weight:700; color:#b91c1c; margin-bottom:0.2rem;">âœ• BegrÃ¤nsningar & Risker:</div>
                  <ul style="margin:0; padding-left:1.2rem; color:#475569; line-height:1.35;">
                    ${f.cons.map(c => `<li>${c}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              <div style="margin-top:auto; padding-top:0.6rem; border-top:1px solid #f1f5f9; font-size:0.82rem; color:#0f172a;">
                <div><strong>BÃ¤sta anvÃ¤ndning pÃ¥ IVA:</strong> ${f.primaryUse}</div>
                ${f.caution ? `<div style="margin-top:0.35rem; color:#dc2626; font-weight:700; background:#fef2f2; border:1px solid #fecaca; border-radius:6px; padding:0.35rem 0.55rem;">âš ï¸ CAVE: ${f.caution}</div>` : ''}
              </div>
            </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // TAB 5: ðŸ©¸ BLODPRODUKTER
    if (this.fluidCurrentTab === "blood") {
      return `
        <!-- Snabb-box: MTP 4:4:1 (Massiv Transfusionsprotokoll) -->
        <div style="background:linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border:2px solid #ef4444; border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin-bottom:1.5rem; box-shadow:var(--shadow-sm);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <span style="font-size:1.6rem;">ðŸš¨</span>
              <div>
                <h3 style="margin:0; font-size:1.15rem; color:#991b1b; font-weight:900;">Massiv Transfusionsprotokoll (MTP) â€“ IVA Ã–stra</h3>
                <span style="font-size:0.8rem; color:#7f1d1d; font-weight:600;">Paketblodtransfusion vid livshotande chockblÃ¶dning: FÃ¶rhÃ¥llande 4 : 4 : 1</span>
              </div>
            </div>
            <span style="background:#dc2626; color:#ffffff; font-size:0.75rem; font-weight:800; padding:0.25rem 0.65rem; border-radius:9999px;">STAT-bestÃ¤llning</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; font-size:0.83rem; color:#450a0a;">
            <div style="background:rgba(255,255,255,0.7); border-radius:6px; padding:0.6rem 0.8rem; border-left:4px solid #b91c1c;">
              <strong>4 enheter SAGMAN</strong><br>
              (RÃ¶da blodkroppar) â€“ Ã¥terstÃ¤ller syrgasbÃ¤rare.
            </div>
            <div style="background:rgba(255,255,255,0.7); border-radius:6px; padding:0.6rem 0.8rem; border-left:4px solid #0284c7;">
              <strong>4 enheter Plasma</strong><br>
              (Octaplas/FFP) â€“ koagulationsfaktorer & volym.
            </div>
            <div style="background:rgba(255,255,255,0.7); border-radius:6px; padding:0.6rem 0.8rem; border-left:4px solid #d97706;">
              <strong>1 enhet Trombocyter</strong><br>
              (TPK-koncentrat) â€“ trombocytplugg & primÃ¤r hemostas.
            </div>
          </div>
          <div style="margin-top:0.75rem; font-size:0.8rem; color:#7f1d1d; line-height:1.4;">
            <strong>MÃ¥lparametrar:</strong> Hb 70â€“90 g/L, TPK > 50 (vid CNS-blÃ¶dning > 100), PK(INR) < 1.5, Fibrinogen > 2.0 g/L (ge Fibrinogenkoncentrat 2g om < 2.0), Joniserat Ca > 1.0 mmol/L (ge Ca-glukonat vid citratbelastning), temp > 36.0 Â°C.
          </div>
        </div>

        <div class="fluids-cards-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;">
          ${bloodProducts.map(b => `
            <div class="fluid-card" style="background:#ffffff; border:1px solid #e2e8f0; border-top: 4px solid #dc2626; border-radius:var(--radius-lg); padding:1.25rem; display:flex; flex-direction:column; gap:0.65rem; box-shadow:var(--shadow-sm);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem;">
                <div>
                  <h4 style="margin:0; font-size:1.1rem; color:#0f172a; font-weight:800;">${b.name}</h4>
                  <span class="fluid-cat-pill" style="display:inline-block; font-size:0.75rem; font-weight:700; background:#fee2e2; color:#991b1b; padding:0.15rem 0.5rem; border-radius:4px; margin-top:0.25rem;">${b.category}</span>
                </div>
              </div>

              <div style="font-size:0.82rem; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:0.6rem 0.75rem; display:flex; flex-direction:column; gap:0.35rem;">
                <div><strong>Enhetsvolym:</strong> <span style="color:#0f172a; font-weight:700;">${b.volumePerUnit}</span></div>
                <div><strong>FÃ¶rvÃ¤ntad effekt per enhet:</strong> <span style="color:#166534; font-weight:700;">${b.effectPerUnit}</span></div>
                <div><strong>Transfusionstid:</strong> <span style="color:#0284c7; font-weight:600;">${b.time}</span></div>
              </div>

              ${b.indications && b.indications.length > 0 ? `
                <div style="font-size:0.8rem;">
                  <div style="font-weight:700; color:#166534; margin-bottom:0.2rem;">ðŸ“‹ Transfusionsindikationer (IVA):</div>
                  <ul style="margin:0; padding-left:1.2rem; color:#334155; line-height:1.35;">
                    ${b.indications.map(ind => `<li>${ind}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              ${b.risks && b.risks.length > 0 ? `
                <div style="font-size:0.8rem;">
                  <div style="font-weight:700; color:#b91c1c; margin-bottom:0.2rem;">âš ï¸ Risker & Biverkningar:</div>
                  <ul style="margin:0; padding-left:1.2rem; color:#475569; line-height:1.35;">
                    ${b.risks.map(r => `<li>${r}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}

              <div style="margin-top:auto; padding-top:0.6rem; border-top:1px solid #f1f5f9; font-size:0.82rem;">
                <div style="color:#b91c1c; font-weight:700; background:#fff1f2; border:1px solid #fecdd3; border-radius:6px; padding:0.4rem 0.6rem;">
                  âš ï¸ Viktig klinisk notering: ${b.caution}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // TAB 6: 🌹 ROSE-KONCEPTET (BEHÅLLEN)
    if (this.fluidCurrentTab === "rose") {
      const rose = typeof ROSE_PHASES !== "undefined" ? ROSE_PHASES : [];
      return `
        <div class="rose-phases-timeline">
          ${rose.map(r => `
            <div class="rose-phase-card" style="border-left: 5px solid ${r.color};">
              <div class="rose-phase-header">
                <span class="rose-phase-letter" style="background:${r.color};">${r.letter}</span>
                <div>
                  <h4 class="rose-phase-title">${r.name} (${r.subname})</h4>
                  <span class="rose-phase-timing">${r.timing}</span>
                </div>
              </div>
              <p class="rose-phase-goal">${r.goal}</p>
              <div class="rose-phase-strategy"><strong>Vätskestrategi:</strong> ${r.fluidStrategy}</div>
              <div class="rose-phase-monitoring"><strong>Monitorering:</strong> ${r.monitoring}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // TAB 7: 📊 KUMULATIV % FO (BEHÅLLEN)
    if (this.fluidCurrentTab === "fo") {
      const w = parseFloat(this.fluidAdmissionWeight) || 75;
      const b = parseFloat(this.fluidCumulativeBalance) || 4.2;
      const fo = ((b / w) * 100).toFixed(1);
      return `
        <div style="max-width:700px; margin:0 auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:var(--radius-lg); padding:1.5rem;">
          <h3 style="margin:0 0 1rem; font-size:1.15rem; color:#0f172a; font-weight:800;">Beräkna Kumulativ % Fluid Overload</h3>
          <div style="display:flex; gap:1rem; margin-bottom:1.25rem;">
            <div class="calc-field-group" style="flex:1;"><label class="calc-field-label">Inläggningsvikt (kg)</label><input type="number" class="calc-field-input" id="inputFluidWeight" value="${w}" /></div>
            <div class="calc-field-group" style="flex:1;"><label class="calc-field-label">Kumulativ balans (L)</label><input type="number" step="0.1" class="calc-field-input" id="inputFluidBalance" value="${b}" /></div>
          </div>
          <div style="background:#f8fafc; border:1.5px solid ${fo >= 10 ? '#dc2626' : '#10b981'}; border-radius:var(--radius-md); padding:1.25rem; text-align:center;">
            <div style="font-size:0.85rem; font-weight:700; color:#475569;">Kumulativ Vätskeöverbelastning:</div>
            <div id="foResultDisplay" style="font-size:2.8rem; font-weight:900; color:${fo >= 10 ? '#dc2626' : '#10b981'};">${fo}%</div>
            <div style="font-size:0.85rem; color:#64748b; margin-top:0.35rem;">${fo >= 10 ? '⚠️ï¸ Signifikant övervätskning (> 10%) – Ökad morbiditet och mortalitet!' : '✓ Acceptabel ackumulerad vätskebalans'}</div>
          </div>
        </div>
      `;
    }

    return "";
  }

  // =========================================================================
  // HÄNDELSELYSSNARE & LIVE-UPPDATERING FÖR VÄTSKOR (UTAN ATT RENSA INPUTS)
  // =========================================================================

  setupFluidBalanceEvents() {
    // 1. ÖSTRA EXCEL-ARK EVENT LISTENERS
    if (this.fluidCurrentTab === "excel") {
      const updateExcelTotals = () => {
        const d = this.excelFluidData || {};
        d.weight = parseFloat(document.getElementById("exWeight")?.value) || 75;
        d.periodHours = parseFloat(document.getElementById("exHours")?.value) || 24;
        d.targetBalance = parseFloat(document.getElementById("exTarget")?.value) || 0;

        d.inCrystalloids = parseFloat(document.getElementById("exInCryst")?.value) || 0;
        d.inGlucose5 = parseFloat(document.getElementById("exInG5")?.value) || 0;
        d.inGlucose10 = parseFloat(document.getElementById("exInG10")?.value) || 0;
        d.inDrugs = parseFloat(document.getElementById("exInDrugs")?.value) || 0;
        d.inEnteral = parseFloat(document.getElementById("exInEnt")?.value) || 0;
        d.inTPN = parseFloat(document.getElementById("exInTPN")?.value) || 0;
        d.inBlood = parseFloat(document.getElementById("exInBlood")?.value) || 0;
        d.inOther = parseFloat(document.getElementById("exInOther")?.value) || 0;

        d.outUrine = parseFloat(document.getElementById("exOutUrine")?.value) || 0;
        d.outStomach = parseFloat(document.getElementById("exOutStomach")?.value) || 0;
        d.outDrains = parseFloat(document.getElementById("exOutDrains")?.value) || 0;
        d.outStoma = parseFloat(document.getElementById("exOutStoma")?.value) || 0;
        d.outCRRT = parseFloat(document.getElementById("exOutCRRT")?.value) || 0;
        d.outPerspiratio = parseFloat(document.getElementById("exOutPersp")?.value) || 0;
        d.outOther = parseFloat(document.getElementById("exOutOther")?.value) || 0;

        this.excelFluidData = d;
        this.saveExcelFluidData();

        const totalIn = d.inCrystalloids + d.inGlucose5 + d.inGlucose10 + d.inDrugs + d.inEnteral + d.inTPN + d.inBlood + d.inOther;
        const totalOut = d.outUrine + d.outStomach + d.outDrains + d.outStoma + d.outCRRT + d.outPerspiratio + d.outOther;
        const netBal = totalIn - totalOut;
        const perKg = d.weight > 0 ? (netBal / d.weight).toFixed(1) : 0;
        const diuresMlH = d.periodHours > 0 ? (d.outUrine / d.periodHours).toFixed(1) : 0;
        const diuresMlKgH = (d.weight > 0 && d.periodHours > 0) ? (d.outUrine / (d.weight * d.periodHours)).toFixed(2) : 0;
        const fo = d.weight > 0 ? ((netBal / 1000) / d.weight * 100).toFixed(1) : 0;

        const sumInEl = document.getElementById("exSumInDisplay");
        if (sumInEl) sumInEl.textContent = `${totalIn} ml`;

        const sumOutEl = document.getElementById("exSumOutDisplay");
        if (sumOutEl) sumOutEl.textContent = `${totalOut} ml`;

        const netBalEl = document.getElementById("exNetBalDisplay");
        if (netBalEl) {
          netBalEl.innerHTML = `${netBal > 0 ? '+' : ''}${netBal} <span style="font-size:0.8rem; font-weight:600;">ml</span>`;
          netBalEl.style.color = netBal >= 0 ? '#0284c7' : '#ea580c';
        }

        const netBalSubEl = document.getElementById("exNetBalSub");
        if (netBalSubEl) netBalSubEl.textContent = `${perKg} ml/kg (${d.periodHours}h)`;

        let diuresColor = "#16a34a";
        let diuresStatus = "Adekvat diures (0.5–1.5 ml/kg/h)";
        if (parseFloat(diuresMlKgH) < 0.5) {
          diuresColor = "#dc2626";
          diuresStatus = "⚠️ï¸ Oliguri (< 0.5 ml/kg/h) – Risk för AKI!";
        } else if (parseFloat(diuresMlKgH) > 1.5) {
          diuresColor = "#0284c7";
          diuresStatus = "Polyuri (> 1.5 ml/kg/h)";
        }

        const diuresValEl = document.getElementById("exDiuresValDisplay");
        if (diuresValEl) {
          diuresValEl.innerHTML = `${diuresMlKgH} <span style="font-size:0.8rem; font-weight:600;">ml/kg/h</span>`;
          diuresValEl.style.color = diuresColor;
        }

        const diuresSubEl = document.getElementById("exDiuresSubDisplay");
        if (diuresSubEl) {
          diuresSubEl.textContent = `${diuresMlH} ml/h • ${diuresStatus}`;
          diuresSubEl.style.color = diuresColor;
        }

        const diffEl = document.getElementById("exTargetDiffDisplay");
        if (diffEl) {
          diffEl.innerHTML = `${(netBal - d.targetBalance) > 0 ? '+' : ''}${netBal - d.targetBalance} <span style="font-size:0.8rem; font-weight:600;">ml</span>`;
        }

        const foEl = document.getElementById("exFoPercentDisplay");
        if (foEl) {
          foEl.textContent = `${fo}%`;
          foEl.style.color = parseFloat(fo) >= 10 ? '#dc2626' : '#16a34a';
        }
      };

      const ids = [
        "exWeight", "exHours", "exTarget",
        "exInCryst", "exInG5", "exInG10", "exInDrugs", "exInEnt", "exInTPN", "exInBlood", "exInOther",
        "exOutUrine", "exOutStomach", "exOutDrains", "exOutStoma", "exOutCRRT", "exOutPersp", "exOutOther"
      ];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updateExcelTotals);
      });
    }

    // 2. DROPPTAKTSKALKYLATOR EVENT LISTENERS
    if (this.fluidCurrentTab === "drip") {
      const updateDripTotals = () => {
        const vol = parseFloat(document.getElementById("inputDripVol")?.value) || 0;
        const hours = parseFloat(document.getElementById("inputDripHours")?.value) || 0;
        const mins = parseFloat(document.getElementById("inputDripMins")?.value) || 0;
        const factor = parseFloat(document.getElementById("selectDripFactor")?.value) || 20;

        this.dripVolume = vol;
        this.dripTimeHours = hours;
        this.dripTimeMinutes = mins;
        this.dripSelectedFactor = factor;

        const totalMinutes = (hours * 60) + mins;
        const dripRate = totalMinutes > 0 ? Math.round((vol * factor) / totalMinutes) : 0;
        const secPerDrop = dripRate > 0 ? (60 / dripRate).toFixed(1) : 0;
        const mlPerHour = totalMinutes > 0 ? Math.round((vol / totalMinutes) * 60) : 0;

        const rateEl = document.getElementById("dripRateDisplay");
        if (rateEl) rateEl.innerHTML = `${dripRate} <span style="font-size:1.3rem; font-weight:700;">droppar / minut</span>`;

        const secEl = document.getElementById("dripSecDisplay");
        if (secEl) secEl.textContent = `1 droppe var ${secPerDrop} sekund`;

        const mlhEl = document.getElementById("dripMlhDisplay");
        if (mlhEl) mlhEl.textContent = `${mlPerHour} ml / timme`;
      };

      ["inputDripVol", "inputDripHours", "inputDripMins"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updateDripTotals);
      });
      const sel = document.getElementById("selectDripFactor");
      if (sel) sel.addEventListener("change", updateDripTotals);
    }

    // 3. DIURESMÅL 24H (calc) EVENT LISTENERS
    if (this.fluidCurrentTab === "calc") {
      const updateCalcTotals = () => {
        const w = parseFloat(document.getElementById("inputCalcWeight")?.value) || 75;
        const target = parseFloat(document.getElementById("inputTargetBal")?.value) || 0;
        const inCryst = parseFloat(document.getElementById("inputInCryst")?.value) || 0;
        const inG5 = parseFloat(document.getElementById("inputInG5")?.value) || 0;
        const inG10 = parseFloat(document.getElementById("inputInG10")?.value) || 0;
        const inDrugs = parseFloat(document.getElementById("inputInDrugs")?.value) || 0;
        const inEnt = parseFloat(document.getElementById("inputInEnt")?.value) || 0;
        const inTPN = parseFloat(document.getElementById("inputInTPN")?.value) || 0;
        const inBlood = parseFloat(document.getElementById("inputInBlood")?.value) || 0;
        const inOther = parseFloat(document.getElementById("inputInOther")?.value) || 0;

        const outStomach = parseFloat(document.getElementById("inputOutStomach")?.value) || 0;
        const outDrains = parseFloat(document.getElementById("inputOutDrains")?.value) || 0;
        const outStoma = parseFloat(document.getElementById("inputOutStoma")?.value) || 0;
        const outCRRT = parseFloat(document.getElementById("inputOutCRRT")?.value) || 0;
        const outPersp = parseFloat(document.getElementById("inputOutPersp")?.value) || 750;

        const totalIn = inCryst + inG5 + inG10 + inDrugs + inEnt + inTPN + inBlood + inOther;
        const nonRenalOut = outStomach + outDrains + outStoma + outCRRT + outPersp;
        const targetUrine24h = Math.max(0, totalIn - nonRenalOut - target);
        const targetUrinePerHour = Math.round(targetUrine24h / 24);
        const targetUrineMlKgH = (targetUrinePerHour / w).toFixed(2);

        const r24 = document.getElementById("resTarget24h");
        if (r24) r24.textContent = targetUrine24h;

        const rH = document.getElementById("resTargetH");
        if (rH) rH.textContent = `${targetUrinePerHour} ml/h`;

        const rKgH = document.getElementById("resTargetKgH");
        if (rKgH) rKgH.textContent = `${targetUrineMlKgH} ml/kg/h`;
      };

      const ids = [
        "inputCalcWeight", "inputTargetBal",
        "inputInCryst", "inputInG5", "inputInG10", "inputInDrugs", "inputInEnt", "inputInTPN", "inputInBlood", "inputInOther",
        "inputOutStomach", "inputOutDrains", "inputOutStoma", "inputOutCRRT", "inputOutPersp"
      ];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("input", updateCalcTotals);
      });
    }

    // 4. FO FLIK EVENT LISTENERS
    if (this.fluidCurrentTab === "fo") {
      const wEl = document.getElementById("inputFluidWeight");
      const bEl = document.getElementById("inputFluidBalance");
      if (wEl && bEl) {
        const handler = () => {
          const w = parseFloat(wEl.value) || 75;
          const b = parseFloat(bEl.value) || 0;
          this.fluidAdmissionWeight = w;
          this.fluidCumulativeBalance = b;
          const fo = ((b / w) * 100).toFixed(1);
          const disp = document.getElementById("foResultDisplay");
          if (disp) {
            disp.textContent = `${fo}%`;
            disp.style.color = parseFloat(fo) >= 10 ? '#dc2626' : '#10b981';
          }
        };
        wEl.addEventListener("input", handler);
        bEl.addEventListener("input", handler);
      }
    }
  }

  // =========================================================================
  // MODUL: APPARATUR & SERVO-U VENTILATOR (MEDTECH)
  // =========================================================================

  renderEquipmentPage() {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    mainEl.style.setProperty("--theme-color", "#0891b2");
    mainEl.style.setProperty("--theme-bg", "#cffafe");
    mainEl.style.setProperty("--theme-border", "#a5f3fc");

    let html = `
      <section class="page-hero">
        <div class="hero-main">
          <div class="hero-info">
            <div class="hero-icon-bubble" style="background:#cffafe; color:#0891b2; border-color:#a5f3fc;">
              ${ICONS.ventilator || ICONS.gauge}
            </div>
            <div class="hero-text">
              <h2>
                Apparatur: Getinge Servo-U Ventilator
                <span class="hero-count-pill" style="background:#cffafe; color:#0e7490;">MedTech & Klinik</span>
              </h2>
              <p>Komplett guide för Servo-U på IVA Östra: Förfunktionskontroll, ventilationslägen (PRVC, PC, PS, NAVA), diagnostiska pauser (Pplat, ΔP, Auto-PEEP) samt bedside kalkylator.</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-upload-primary" onclick="app.switchCategory('Respiration')">
              Respirationsrutiner & PM
            </button>
          </div>
        </div>

        <!-- Fliknavigering -->
        <div class="page-toolbar">
          <div class="drug-tab-nav horizontal-scroll-tabs" style="border-bottom:none; padding-bottom:0;">
            <button class="drug-tab-btn ${this.equipCurrentTab === 'overview' ? 'active' : ''}" onclick="app.switchEquipTab('overview')">
              ⚙️ Hårdvara & Förfunktionskontroll
            </button>
            <button class="drug-tab-btn ${this.equipCurrentTab === 'modes' ? 'active' : ''}" onclick="app.switchEquipTab('modes')">
              🌬️ Ventilationslägen (PRVC, PC, PS, NAVA)
            </button>
            <button class="drug-tab-btn ${this.equipCurrentTab === 'diagnostics' ? 'active' : ''}" onclick="app.switchEquipTab('diagnostics')">
              🩺 Diagnostiska Pauser & Mätningar
            </button>
            <button class="drug-tab-btn ${this.equipCurrentTab === 'alarms' ? 'active' : ''}" onclick="app.switchEquipTab('alarms')">
              🚨 Akut Larmhantering & DOPES
            </button>
            <button class="drug-tab-btn ${this.equipCurrentTab === 'calc' ? 'active' : ''}" onclick="app.switchEquipTab('calc')">
              🧮 Ventilatorberäknare Bedside
            </button>
          </div>
        </div>
      </section>

      <!-- Flikinnehåll -->
      <div id="equipmentTabContentContainer">
        ${this.renderActiveEquipTabHtml()}
      </div>
    `;

    mainEl.innerHTML = html;
    this.setupEquipmentEvents();
  }

  switchEquipTab(tab) {
    this.equipCurrentTab = tab;
    const container = document.getElementById("equipmentTabContentContainer");
    if (container) {
      container.innerHTML = this.renderActiveEquipTabHtml();
      this.setupEquipmentEvents();
    }
    document.querySelectorAll(".page-toolbar .drug-tab-btn").forEach((b) => {
      const onclickAttr = b.getAttribute("onclick") || "";
      b.classList.toggle("active", onclickAttr.includes(`'${tab}'`));
    });
  }

  renderActiveEquipTabHtml() {
    const equip = typeof IVA_EQUIPMENT_DATA !== "undefined" ? IVA_EQUIPMENT_DATA : null;
    const modes = equip ? equip.ventilationModes : [];
    const diagTools = equip ? equip.diagnosticTools : [];
    const alarms = equip ? equip.alarmsTroubleshooting : [];

    // FLIK 1: HÅRDVARA & FÖRFUNKTIONSKONTROLL (OVERVIEW)
    if (this.equipCurrentTab === "overview") {
      return `
        <div class="disease-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h3 style="margin:0; font-size:1.25rem; color:#0f172a; display:flex; align-items:center; gap:0.5rem;">
                ⚙️ Getinge Servo-U: Hårdvaruöversikt & Förfunktionskontroll
              </h3>
              <p style="font-size:0.86rem; color:#475569; margin:0.35rem 0 0;">
                Standardventilator på Intensivvårdsenheten Östra sjukhuset. Kan användas för invasiv ventilation, icke-invasiv ventilation (NIV), högflödessyrgas (Optiflow) och NAVA.
              </p>
            </div>
            <span class="user-role-tag editor" style="background:#cffafe; color:#0e7490; border:1px solid #a5f3fc;">
              Certifierad IVA-Standard
            </span>
          </div>

          <!-- Teknisk hårdvara kort -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1rem;">
              <strong style="color:#0891b2; font-size:0.95rem; display:block; margin-bottom:0.4rem;">🖥️ 15.6" Ergonomisk Pekskärm</strong>
              <div style="font-size:0.82rem; color:#334155; line-height:1.45;">
                • Vridbar och lutningsbar skärm med multitouch-gester.<br>
                • Visar kurvor (tryck, flöde, volym) och loopar (tryck-volym, flöde-volym) i realtid.<br>
                • Snabbknappar på panel: 100% O2-boost (2 minuter), Insp. paus, Exp. paus.
              </div>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1rem;">
              <strong style="color:#0891b2; font-size:0.95rem; display:block; margin-bottom:0.4rem;">🔄 Expirationskassett & Filter</strong>
              <div style="font-size:0.82rem; color:#334155; line-height:1.45;">
                • Sluten magnetventil och ultraljudsflödesmätare i ett stycke.<br>
                • Hel, ren och autoklaverad kassett (tål upp till 100 autoklaveringar).<br>
                • Expirationsfilter (Servo Guard) skyddar maskinen från fukt och patogener.
              </div>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1rem;">
              <strong style="color:#0891b2; font-size:0.95rem; display:block; margin-bottom:0.4rem;">🔋 Strömförsörjning & Batteridrift</strong>
              <div style="font-size:0.82rem; color:#334155; line-height:1.45;">
                • Nätanslutning 230V via säkerhetsuttag.<br>
                • Utrustad med upp till 6 litiumjonbatterier (standard 2 st på IVA Östra).<br>
                • Garanterar minst 60–180 minuters säker drift vid intern transport till röntgen/OP.
              </div>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1rem;">
              <strong style="color:#0891b2; font-size:0.95rem; display:block; margin-bottom:0.4rem;">💨 Gasförsörjning & Befuktning</strong>
              <div style="font-size:0.82rem; color:#334155; line-height:1.45;">
                • Centralgaser: Medicinsk Syrgas (O2) och Tryckluft (Air) 4–6 bar.<br>
                • Aktiv befuktare (Fisher & Paykel MR850 med uppvärmda slangar) eller mekanisk HME-fuktvärmeväxlare.<br>
                • Aerogen Solo nätförneblare ansluts direkt på inspirationsslang.
              </div>
            </div>
          </div>

          <!-- Interaktiv Förfunktionskontroll Steg-för-steg Checklista -->
          <div style="background:#ffffff; border:1.5px solid #0891b2; border-radius:var(--radius-lg); padding:1.25rem 1.5rem; box-shadow:var(--shadow-sm);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
              <div>
                <h4 style="margin:0; font-size:1.05rem; color:#0e7490; font-weight:800;">
                  📋 Förfunktionskontroll (Pre-Use Check): 11 Steg Bedside
                </h4>
                <p style="margin:0.25rem 0 0; font-size:0.8rem; color:#64748b;">
                  Måste genomföras före VARJE ny patientanslutning eller efter slangbyte.
                </p>
              </div>
              <span style="font-size:0.75rem; font-weight:700; background:#cffafe; color:#0e7490; padding:0.2rem 0.6rem; border-radius:9999px;">
                Tidsåtgång: Ca 3–4 minuter
              </span>
            </div>

            <div style="display:flex; flex-direction:column; gap:0.6rem;">
              ${[
                "1. Kontrollera att nätkabeln (230V) är ansluten och batterilampan lyser grönt.",
                "2. Anslut gasslangarna (vit O2 och svart/vit Luft) till vägguttag med 4–6 bars tryck.",
                "3. Kontrollera att expirationskassetten är torr, oskadad och att spärrhandtaget knäpper fast ordentligt.",
                "4. Montera godkänt vuxenslangset (22 mm dual-limb) och anslut testlunga på Y-stycket.",
                "5. Slå på huvudströmbrytaren på ventilatorns baksida.",
                "6. Tryck på 'Förfunktionskontroll' på skärmen när startmenyn visas.",
                "7. Följ skärmens animerade instruktioner: täpp till Y-stycket med testproppen när systemet uppmanar till detta.",
                "8. Ventilatorn genomför automatisk kalibrering: mäter internläckage, tryckgivare, flödesgivare och säkerhetsventil.",
                "9. Kontrollera att larmtonstestet piper och godkänn ljudet.",
                "10. Utför 'Kretskontroll' (Patient circuit test) för att kompensera för slangsetets kompressibilitet och motstånd.",
                "11. Kontrollen godkänd -> Systemet övergår i Vänteläge. Ställ in patientkategori (Vuxen), längd och PBW."
              ].map(st => `
                <label style="display:flex; align-items:flex-start; gap:0.65rem; font-size:0.84rem; color:#1e293b; background:#f8fafc; padding:0.5rem 0.75rem; border-radius:6px; cursor:pointer; border:1px solid #f1f5f9;">
                  <input type="checkbox" style="margin-top:0.2rem; cursor:pointer; accent-color:#0891b2;" />
                  <span>${st}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // FLIK 2: VENTILATIONSLÄGEN (MODES)
    if (this.equipCurrentTab === "modes") {
      return `
        <div class="disease-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h3 style="margin:0; font-size:1.25rem; color:#0f172a; display:flex; align-items:center; gap:0.5rem;">
                🌬️ Ventilationslägen på Getinge Servo-U
              </h3>
              <p style="font-size:0.86rem; color:#475569; margin:0.35rem 0 0;">
                Djupgående genomgång av kontrollmoder, spontanmoder och avancerade funktioner (PRVC, PC, PS, VC, Bi-Vent och NAVA).
              </p>
            </div>
          </div>

          <div class="fluids-card-grid">
            ${modes.map(m => `
              <div class="fluid-detail-card" style="border-top:3.5px solid ${m.isPrimary ? '#0891b2' : '#64748b'};">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <div>
                    <h4 style="margin:0; font-size:1.1rem; color:#0f172a;">${m.name}</h4>
                    <span style="font-size:0.75rem; color:#0891b2; font-weight:700;">${m.type}</span>
                  </div>
                  ${m.isPrimary ? '<span class="disease-badge" style="background:#cffafe; color:#0e7490;">Standard på IVA</span>' : ''}
                </div>

                <p style="font-size:0.83rem; color:#334155; margin:0.4rem 0 0; line-height:1.45;">
                  ${m.description}
                </p>

                <div style="font-size:0.8rem; background:#f8fafc; border-radius:6px; padding:0.5rem 0.65rem; color:#1e293b; line-height:1.45;">
                  <strong>Mekanism:</strong> ${m.mechanism}
                </div>

                <div style="font-size:0.8rem; background:#ecfeff; border-radius:6px; padding:0.4rem 0.65rem; color:#0e7490;">
                  <strong>Viktiga Inställningar:</strong> ${m.keySettings}
                </div>

                <div>
                  <div style="font-size:0.75rem; font-weight:700; color:#166534; text-transform:uppercase; margin-bottom:0.25rem;">
                    ✓ Fördelar
                  </div>
                  <ul class="fluid-pros-list">
                    ${m.advantages.map(a => `<li><span>✓</span><span>${a}</span></li>`).join('')}
                  </ul>
                </div>

                <div>
                  <div style="font-size:0.75rem; font-weight:700; color:#991b1b; text-transform:uppercase; margin-bottom:0.25rem;">
                    ✕ Fallgropar & Begränsningar
                  </div>
                  <ul class="fluid-cons-list">
                    ${m.pitfalls.map(p => `<li><span>✕</span><span>${p}</span></li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // FLIK 3: DIAGNOSTISKA PAUSER & MÄTNINGAR (DIAGNOSTICS)
    if (this.equipCurrentTab === "diagnostics") {
      return `
        <div class="disease-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h3 style="margin:0; font-size:1.25rem; color:#0f172a; display:flex; align-items:center; gap:0.5rem;">
                🩺 Diagnostiska Pauser, Lungmekanik & Open Lung Tool
              </h3>
              <p style="font-size:0.86rem; color:#475569; margin:0.35rem 0 0;">
                Mätning av Platåtryck, Drivtryck, Auto-PEEP, Statisk Compliance och Resistans direkt vid sängkanten med Servo-U specialfunktioner.
              </p>
            </div>
          </div>

          <!-- Mätkorten -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem; margin-bottom:1.5rem;">
            ${diagTools.map(dt => `
              <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:var(--radius-lg); padding:1.25rem; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; gap:0.6rem;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <h4 style="margin:0; font-size:1.05rem; color:#0e7490; font-weight:800;">${dt.name}</h4>
                  <span style="font-size:0.72rem; font-weight:700; background:#f1f5f9; color:#475569; padding:0.15rem 0.5rem; border-radius:4px;">
                    ${dt.shortcut}
                  </span>
                </div>

                <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; padding:0.45rem 0.65rem; font-size:0.82rem; color:#166534; font-weight:700;">
                  Målvärde: ${dt.normalValue}
                </div>

                <div style="font-size:0.8rem; background:#f8fafc; border-radius:6px; padding:0.45rem 0.65rem; color:#334155;">
                  <strong>Formel:</strong> <code>${dt.formula}</code>
                </div>

                <div style="font-size:0.82rem; color:#1e293b; line-height:1.45;">
                  <strong>Klinisk tolkning:</strong> ${dt.clinicalMeaning}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Open Lung Tool & PEEP titrering detalj -->
          <div style="background:linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border:1.5px solid #0891b2; border-radius:var(--radius-lg); padding:1.25rem 1.5rem;">
            <h4 style="margin:0 0 0.5rem; font-size:1rem; color:#0e7490; font-weight:800;">
              📈 PEEP-Titrering med Open Lung Tool (OLT) på Servo-U
            </h4>
            <div style="font-size:0.84rem; color:#164e63; line-height:1.5;">
              1. <strong>Syfte:</strong> Att identifiera patientens 'Optimala PEEP' – punkten med maximal alveolarrekrytering och compliance utan hemodynamisk kompression eller överdistension.<br>
              2. <strong>Stegvis rekrytering:</strong> Öka PEEP med 2 cmH2O var 2:a minut upp till 20–24 cmH2O under kontinuerlig monitorering av Tidalvolym och Drivtryck.<br>
              3. <strong>Dekrementell PEEP-titrering:</strong> Sänk därefter PEEP stegvis med 2 cmH2O var 3:e minut. Punkten där Statisk Compliance plötsligt börjar <em>falla</em> motsvarar lungans stängningstryck (derecruitment). Sätt PEEP 2 cmH2O över denna punkt!
            </div>
          </div>
        </div>
      `;
    }

    // FLIK 4: AKUT LARMHANTERING & DOPES (ALARMS)
    if (this.equipCurrentTab === "alarms") {
      return `
        <div class="disease-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h3 style="margin:0; font-size:1.25rem; color:#0f172a; display:flex; align-items:center; gap:0.5rem;">
                🚨 Akut Larmhantering, Felsökning & DOPES-Algoritm
              </h3>
              <p style="font-size:0.86rem; color:#475569; margin:0.35rem 0 0;">
                Prioriterade larm på Servo-U och omedelbara åtgärder vid akut desaturation eller tryckstegring.
              </p>
            </div>
          </div>

          <!-- DOPES Snabbkort -->
          <div style="background:#fee2e2; border:2px solid #ef4444; border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin-bottom:1.5rem;">
            <strong style="color:#b91c1c; font-size:1.05rem; display:block; margin-bottom:0.5rem;">
              🆘 Akut Desaturation eller Ventilationshaveri: Minnesregeln DOPES
            </strong>
            <div style="font-size:0.84rem; color:#7f1d1d; line-height:1.5;">
              Om patienten plötsligt sjunker i SpO2 eller larmar för högt tryck och är cirkulatoriskt påverkad:<br>
              <strong>KOPPLA OMEDELBART BORT FRÅN VENTILATORN OCH HANDVENTILERA MED RUBENBLÅSA + 100% O2!</strong><br><br>
              • <strong>D – Dislodgement:</strong> Tuben har glidit ut (oavsiktlig extubation) eller åkt ner i höger huvudbronk.<br>
              • <strong>O – Obstruction:</strong> Slempropp, tubknick, patienten biter på tuben, sekret i filtret.<br>
              • <strong>P – Pneumothorax:</strong> Akut tryckpneumothorax (ensidigt nedsatta andningsljud, halsvensstas, hypotoni -> omedelbar nåldekompression!).<br>
              • <strong>E – Equipment:</strong> Ventilatorfel, gasslang lossnat, strömavbrott, läckage på slangar.<br>
              • <strong>S – Stacking (Auto-PEEP):</strong> Svår air-trapping vid KOL/astma. Koppla loss tuben i 5–10 sekunder och pressa lätt på bröstkorgen för att tömma lungorna!
            </div>
          </div>

          <!-- Servo-U Specifika Larm -->
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${alarms.map(al => `
              <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:var(--radius-md); padding:1.25rem; box-shadow:var(--shadow-sm);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.4rem;">
                  <h4 style="margin:0; font-size:1rem; color:#0f172a; font-weight:800;">${al.alarm}</h4>
                  <span style="font-size:0.75rem; font-weight:800; background:#fee2e2; color:#dc2626; padding:0.15rem 0.55rem; border-radius:9999px;">
                    ${al.priority}
                  </span>
                </div>

                <div style="background:#fef2f2; border-left:3px solid #dc2626; padding:0.5rem 0.75rem; font-size:0.82rem; color:#991b1b; font-weight:700; margin-bottom:0.75rem;">
                  Omedelbar kontroll: ${al.immediateCheck}
                </div>

                <div style="font-size:0.82rem; color:#334155; line-height:1.45;">
                  <strong>Vanliga orsaker & Handläggning:</strong>
                  <ul style="margin:0.35rem 0 0 1.25rem; padding:0;">
                    ${al.causes.map(c => `<li>${c}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // FLIK 5: VENTILATORBERÄKNARE BEDSIDE (CALC)
    const gender = this.equipPatientGender || "male";
    const height = parseFloat(this.equipPatientHeight) || 178;
    const pplat = parseFloat(this.equipMeasuredPplat) || 22;
    const peep = parseFloat(this.equipMeasuredPEEP) || 10;
    const vt = parseFloat(this.equipMeasuredVt) || 440;
    const rr = parseFloat(this.equipMeasuredRR) || 18;

    // Predicted Body Weight (PBW)
    const pbw = gender === "male"
      ? 50 + 0.91 * (height - 152.4)
      : 45.5 + 0.91 * (height - 152.4);

    const safePbw = Math.max(30, pbw);
    const vt4 = Math.round(safePbw * 4);
    const vt6 = Math.round(safePbw * 6);
    const vt8 = Math.round(safePbw * 8);

    // Driving Pressure (ΔP) & Compliance
    const deltaP = pplat - peep;
    const compliance = deltaP > 0 ? vt / deltaP : 0;
    const minVent = (vt * rr) / 1000;

    let dpColor = "#16a34a";
    let dpBg = "#dcfce7";
    let dpTitle = "Optimalt Drivtryck (ΔP ≤ 12 cmH2O)";
    let dpDesc = "Utmärkt lungprotektiv ventilation med låg mekanisk stress på lungvävnaden.";

    if (deltaP > 14) {
      dpColor = "#dc2626";
      dpBg = "#fee2e2";
      dpTitle = "⚠️ HÖGT DRIVTRYCK (ΔP > 14 cmH2O)";
      dpDesc = "Drivtryck över 14 cmH2O är den starkaste oberoende prediktorn för ökad dödlighet och ventilatorassocierad lungskada (VILI)! Minska Tidalvolymen (mot 4–5 ml/kg PBW) eller optimera PEEP.";
    } else if (deltaP > 12) {
      dpColor = "#d97706";
      dpBg = "#fef3c7";
      dpTitle = "Acceptabelt Drivtryck (ΔP 13–14 cmH2O)";
      dpDesc = "Nära övre säkerhetsgränsen. Övervaka noggrant och undvik ökningar i tidalvolym.";
    }

    return `
      <div class="calc-panel" style="max-width:880px; margin:0 auto;">
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:var(--radius-lg); padding:1.25rem 1.5rem; margin-bottom:1.5rem; box-shadow:var(--shadow-sm);">
          <h3 style="margin:0 0 0.25rem; font-size:1.15rem; color:#0f172a; display:flex; align-items:center; gap:0.5rem;">
            🧮 Interaktiv Ventilatorberäknare Bedside
          </h3>
          <p style="margin:0 0 1.25rem; font-size:0.83rem; color:#64748b;">
            Beräkna ideal kroppsvikt (PBW), rekommenderad lungprotektiv tidalvolym samt Drivtryck (ΔP) och Statisk Compliance.
          </p>

          <!-- Rad 1: Patientdata för PBW -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.25rem; padding-bottom:1.25rem; border-bottom:1px solid #f1f5f9;">
            <div>
              <label style="font-size:0.8rem; font-weight:700; color:#334155; text-transform:uppercase; display:block; margin-bottom:0.35rem;">Kön</label>
              <div style="display:flex; gap:0.5rem;">
                <button type="button" class="btn-preset-pill ${gender === 'male' ? 'active' : ''}" onclick="app.setEquipGender('male')" style="flex:1; padding:0.4rem; font-size:0.85rem; border-radius:6px; border:1.5px solid #0891b2; background:${gender === 'male' ? '#0891b2' : '#ffffff'}; color:${gender === 'male' ? '#ffffff' : '#0891b2'}; font-weight:700; cursor:pointer;">Man</button>
                <button type="button" class="btn-preset-pill ${gender === 'female' ? 'active' : ''}" onclick="app.setEquipGender('female')" style="flex:1; padding:0.4rem; font-size:0.85rem; border-radius:6px; border:1.5px solid #0891b2; background:${gender === 'female' ? '#0891b2' : '#ffffff'}; color:${gender === 'female' ? '#ffffff' : '#0891b2'}; font-weight:700; cursor:pointer;">Kvinna</button>
              </div>
            </div>

            <div>
              <label style="font-size:0.8rem; font-weight:700; color:#334155; text-transform:uppercase; display:block; margin-bottom:0.35rem;">Kroppslängd (cm)</label>
              <div style="display:flex; align-items:center; gap:0.4rem;">
                <input type="number" step="1" min="130" max="220" id="inputEquipHeight" value="${height}" class="calc-field-input" style="width:100px; padding:0.4rem; font-weight:700; font-size:1rem; text-align:center;" />
                <span style="font-weight:600; color:#475569;">cm</span>
              </div>
            </div>

            <div style="background:#ecfeff; border:1.5px solid #a5f3fc; border-radius:8px; padding:0.75rem 1rem; text-align:center;">
              <span style="font-size:0.72rem; text-transform:uppercase; font-weight:800; color:#0e7490;">Beräknad Idealvikt (PBW)</span>
              <div style="font-size:1.85rem; font-weight:900; color:#0891b2; line-height:1.1;">
                ${safePbw.toFixed(1)} <span style="font-size:1rem; font-weight:600;">kg</span>
              </div>
            </div>
          </div>

          <!-- Mål Tidalvolymer -->
          <div style="margin-bottom:1.5rem;">
            <label style="font-size:0.8rem; font-weight:700; color:#334155; text-transform:uppercase; display:block; margin-bottom:0.5rem;">
              🎯 Rekommenderade Tidalvolymer enligt ARDSNet:
            </label>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:0.75rem; text-align:center;">
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.65rem;">
                <span style="font-size:0.72rem; color:#64748b; font-weight:700;">4 ml/kg PBW (Svår ARDS)</span>
                <div style="font-size:1.3rem; font-weight:900; color:#0f172a;">${vt4} ml</div>
              </div>
              <div style="background:#ecfdf5; border:1.5px solid #86efac; border-radius:8px; padding:0.65rem;">
                <span style="font-size:0.72rem; color:#166534; font-weight:800;">6 ml/kg PBW (Standard)</span>
                <div style="font-size:1.35rem; font-weight:900; color:#166534;">${vt6} ml</div>
              </div>
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.65rem;">
                <span style="font-size:0.72rem; color:#64748b; font-weight:700;">8 ml/kg PBW (Normal lunga)</span>
                <div style="font-size:1.3rem; font-weight:900; color:#0f172a;">${vt8} ml</div>
              </div>
            </div>
          </div>

          <!-- Rad 2: Mätdata för Drivtryck & Compliance -->
          <div style="margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid #f1f5f9;">
            <h4 style="margin:0 0 0.85rem; font-size:0.95rem; color:#0f172a; text-transform:uppercase; font-weight:800;">
              Mätdata från Servo-U (Inspiratorisk Paus)
            </h4>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:1rem; margin-bottom:1.25rem;">
              <div>
                <label style="font-size:0.78rem; font-weight:700; color:#475569; display:block; margin-bottom:0.25rem;">Platåtryck Pplat (cmH2O)</label>
                <input type="number" step="1" min="5" max="60" id="inputEquipPplat" value="${pplat}" class="calc-field-input" style="font-weight:700; text-align:center;" />
              </div>
              <div>
                <label style="font-size:0.78rem; font-weight:700; color:#475569; display:block; margin-bottom:0.25rem;">Inställt PEEP (cmH2O)</label>
                <input type="number" step="1" min="0" max="30" id="inputEquipPEEP" value="${peep}" class="calc-field-input" style="font-weight:700; text-align:center;" />
              </div>
              <div>
                <label style="font-size:0.78rem; font-weight:700; color:#475569; display:block; margin-bottom:0.25rem;">Faktisk Tidalvolym Vt (ml)</label>
                <input type="number" step="10" min="100" max="1200" id="inputEquipVt" value="${vt}" class="calc-field-input" style="font-weight:700; text-align:center;" />
              </div>
              <div>
                <label style="font-size:0.78rem; font-weight:700; color:#475569; display:block; margin-bottom:0.25rem;">Andningsfrekvens RR (/min)</label>
                <input type="number" step="1" min="5" max="50" id="inputEquipRR" value="${rr}" class="calc-field-input" style="font-weight:700; text-align:center;" />
              </div>
            </div>

            <!-- Stort Drivtryck & Compliance Resultat -->
            <div style="background:${dpBg}; border:2px solid ${dpColor}; border-radius:var(--radius-lg); padding:1.25rem; text-align:center;">
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:1rem; margin-bottom:0.75rem;">
                <div>
                  <span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; color:${dpColor};">DRIVTRYCK (ΔP = Pplat - PEEP)</span>
                  <div style="font-size:2.8rem; font-weight:900; color:${dpColor}; line-height:1.1; margin:0.2rem 0;">
                    ${deltaP > 0 ? deltaP : 0} <span style="font-size:1.1rem; font-weight:700;">cmH2O</span>
                  </div>
                </div>

                <div>
                  <span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; color:#0e7490;">STATISK COMPLIANCE (Cstat)</span>
                  <div style="font-size:2.8rem; font-weight:900; color:#0891b2; line-height:1.1; margin:0.2rem 0;">
                    ${compliance > 0 ? compliance.toFixed(1) : 0} <span style="font-size:1.1rem; font-weight:700;">ml/cmH2O</span>
                  </div>
                </div>

                <div>
                  <span style="font-size:0.75rem; text-transform:uppercase; font-weight:800; color:#475569;">MINUTVENTILATION (MV)</span>
                  <div style="font-size:2.8rem; font-weight:900; color:#1e293b; line-height:1.1; margin:0.2rem 0;">
                    ${minVent.toFixed(1)} <span style="font-size:1.1rem; font-weight:700;">L/min</span>
                  </div>
                </div>
              </div>

              <div style="background:#ffffff; border-radius:8px; padding:0.75rem 1rem; max-width:650px; margin:0 auto; text-align:left;">
                <strong style="color:${dpColor}; font-size:0.92rem; display:block; margin-bottom:0.2rem;">
                  ${dpTitle}
                </strong>
                <p style="margin:0; font-size:0.82rem; color:#334155; line-height:1.4;">
                  ${dpDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setEquipGender(g) {
    this.equipPatientGender = g;
    const container = document.getElementById("equipmentTabContentContainer");
    if (container) {
      container.innerHTML = this.renderActiveEquipTabHtml();
      this.setupEquipmentEvents();
    }
  }

  setupEquipmentEvents() {
    const bindEquipField = (id, prop) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", (e) => {
          this[prop] = parseFloat(e.target.value) || 0;
          const container = document.getElementById("equipmentTabContentContainer");
          if (container) {
            container.innerHTML = this.renderActiveEquipTabHtml();
            this.setupEquipmentEvents();
          }
        });
      }
    };

    bindEquipField("inputEquipHeight", "equipPatientHeight");
    bindEquipField("inputEquipPplat", "equipMeasuredPplat");
    bindEquipField("inputEquipPEEP", "equipMeasuredPEEP");
    bindEquipField("inputEquipVt", "equipMeasuredVt");
    bindEquipField("inputEquipRR", "equipMeasuredRR");
  }


  // =========================================================================
  // MODUL: NUTRITION, ESPEN-KALKYLATOR & KALORITABELL IVA 343 (ÖSTRA)
  // =========================================================================

  renderNutritionCalculatorPage() {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    mainEl.style.setProperty("--theme-color", "#d97706");
    mainEl.style.setProperty("--theme-bg", "#fef3c7");
    mainEl.style.setProperty("--theme-border", "#fde68a");

    const result = this.computeNutritionValues();
    const formulas = typeof NUTRITION_FORMULAS !== "undefined" ? NUTRITION_FORMULAS : [];
    const calorieItems = typeof IVA_CALORIE_TABLE !== "undefined" ? IVA_CALORIE_TABLE : [];

    let html = `
      <section class="page-hero">
        <div class="hero-main">
          <div class="hero-info">
            <div class="hero-icon-bubble" style="background:#fef3c7; color:#d97706; border-color:#fde68a;">
              ${ICONS.scale}
            </div>
            <div class="hero-text">
              <h2>
                Nutritionskalkylator & Kaloritabell IVA 343
                <span class="hero-count-pill" style="background:#fef3c7; color:#92400e;">Östra Sjukhuset</span>
              </h2>
              <p>ESPEN-riktlinjer för energibehov (kcal/dygn) med automatiskt avdrag för propofol, samt Östra sjukhusets kompletta Kaloritabell för IVA 343 med live-beräkning.</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-upload-primary" onclick="app.switchCategory('Nutrition')">
              Tillbaka till Nutrition PM
            </button>
          </div>
        </div>

        <!-- Fliknavigering -->
        <div class="page-toolbar">
          <div class="drug-tab-nav horizontal-scroll-tabs" style="border-bottom:none; padding-bottom:0;">
            <button class="drug-tab-btn ${this.nutrCurrentTab === 'calc' ? 'active' : ''}" onclick="app.switchNutritionTab('calc')">
              ⚖️ï¸ ESPEN Energimål & Propofol
            </button>
            <button class="drug-tab-btn ${this.nutrCurrentTab === 'calories' ? 'active' : ''}" onclick="app.switchNutritionTab('calories')">
              📊 Kaloritabell IVA 343 (Östra)
            </button>
            <button class="drug-tab-btn ${this.nutrCurrentTab === 'formulas' ? 'active' : ''}" onclick="app.switchNutritionTab('formulas')">
              🍼 Sondnäringspreparat
            </button>
          </div>
        </div>
      </section>

      <div id="nutritionTabContentContainer">
        ${this.renderActiveNutritionTabHtml(result, formulas, calorieItems)}
      </div>
    `;

    mainEl.innerHTML = html;
    this.setupNutritionEvents();
  }

  switchNutritionTab(tab) {
    this.nutrCurrentTab = tab;
    const container = document.getElementById("nutritionTabContentContainer");
    if (container) {
      const result = this.computeNutritionValues();
      const formulas = typeof NUTRITION_FORMULAS !== "undefined" ? NUTRITION_FORMULAS : [];
      const calorieItems = typeof IVA_CALORIE_TABLE !== "undefined" ? IVA_CALORIE_TABLE : [];
      container.innerHTML = this.renderActiveNutritionTabHtml(result, formulas, calorieItems);
      this.setupNutritionEvents();
    }
    document.querySelectorAll(".page-toolbar .drug-tab-btn").forEach((b) => {
      const onclickAttr = b.getAttribute("onclick") || "";
      b.classList.toggle("active", onclickAttr.includes(`'${tab}'`));
    });
  }

  renderActiveNutritionTabHtml(result, formulas, calorieItems) {
    // FLIK 2: 📊 KALORITABELL IVA 343, ÖSTRA SJUKHUSET
    if (this.nutrCurrentTab === "calories") {
      let filteredItems = calorieItems;
      if (this.calorieSearchQuery && this.calorieSearchQuery.trim()) {
        const q = this.calorieSearchQuery.toLowerCase().trim();
        filteredItems = calorieItems.filter(item => 
          item.name.toLowerCase().includes(q) || 
          (item.category || "").toLowerCase().includes(q)
        );
      }

      // Beräkna totalt intag från tabellen
      let totalCalories = 0;
      Object.keys(this.nutrSelectedCalorieAmounts || {}).forEach(id => {
        const amt = parseFloat(this.nutrSelectedCalorieAmounts[id]) || 0;
        const item = calorieItems.find(x => x.id === id);
        if (item && amt > 0) {
          totalCalories += (amt / (item.amount || 100)) * item.kcal;
        }
      });
      totalCalories = Math.round(totalCalories);

      return `
        <div style="background:#ffffff; border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:1.25rem; box-shadow:var(--shadow-sm); margin-bottom:1.5rem;">
          <!-- Header med PDF-nedladdning & bildvy -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; border-bottom:1px solid #f1f5f9; padding-bottom:1rem; margin-bottom:1.25rem;">
            <div>
              <h3 style="margin:0; font-size:1.2rem; color:#0f172a; font-weight:800; display:flex; align-items:center; gap:0.5rem;">
                📊 Kaloritabell IVA 343, Östra Sjukhuset
              </h3>
              <p style="margin:0.25rem 0 0; font-size:0.8rem; color:#64748b;">
                Originalreferens för näringsdrycker, soppor, mejeriprodukter och mat på intensivvårdsavdelningen.
              </p>
            </div>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <a href="Kaloritabell_IVA_343.pdf" download="Kaloritabell_IVA_343.pdf" class="btn-header-secondary" style="font-size:0.8rem; text-decoration:none; display:inline-flex; align-items:center; gap:0.4rem;">
                📥 Ladda ner PDF (74 KB)
              </a>
            </div>
          </div>

          <!-- Sökruta & Live-summering -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.25rem; background:#fffbeb; padding:0.85rem 1.1rem; border-radius:var(--radius-md); border:1px solid #fde68a;">
            <div style="flex:1; min-width:240px;">
              <input type="text"
                     class="calc-field-input"
                     id="inputCalorieSearch"
                     placeholder="Sök livsmedel (t.ex. Fresubin, Yoggi, Proviva, Katrinplommon)..."
                     value="${this.escapeHtml(this.calorieSearchQuery || '')}"
                     style="background:#ffffff;" />
            </div>
            <div style="display:flex; align-items:center; gap:1.25rem;">
              <div>
                <div style="font-size:0.75rem; color:#92400e; font-weight:700; text-transform:uppercase;">Totalt Beräknat Intag:</div>
                <div id="liveTotalCalDisplay" style="font-size:1.6rem; font-weight:900; color:#b45309; line-height:1;">
                  ${totalCalories} <span style="font-size:0.9rem; font-weight:700;">kcal</span>
                </div>
              </div>
              <button class="btn-header-secondary" onclick="app.nutrSelectedCalorieAmounts = {}; app.switchNutritionTab('calories');" style="font-size:0.78rem; padding:0.35rem 0.75rem;">
                Nollställ
              </button>
            </div>
          </div>

          <!-- Interaktiv tabell med livsmedel -->
          <div style="overflow-x:auto;">
            <table class="reader-table" style="margin:0;">
              <thead>
                <tr>
                  <th style="min-width:220px;">Livsmedel / Preparat</th>
                  <th style="min-width:140px;">Kategori</th>
                  <th style="min-width:100px;">Referensmängd</th>
                  <th style="min-width:90px;">Kalorier</th>
                  <th style="min-width:120px;">Intagen Mängd</th>
                  <th style="min-width:90px; text-align:right;">Delsumma</th>
                </tr>
              </thead>
              <tbody>
                ${filteredItems.map(item => {
                  const amt = parseFloat(this.nutrSelectedCalorieAmounts[item.id]) || 0;
                  const itemKcal = Math.round((amt / (item.amount || 100)) * item.kcal);
                  return `
                    <tr>
                      <td style="font-weight:700; color:#0f172a;">${this.escapeHtml(item.name)}</td>
                      <td><span class="fluid-cat-pill" style="background:#fef3c7; color:#92400e;">${this.escapeHtml(item.category)}</span></td>
                      <td style="color:#64748b;">${item.unit}</td>
                      <td style="font-weight:700; color:#b45309;">${item.kcal} kcal</td>
                      <td>
                        <input type="number" 
                               min="0" 
                               step="${item.amount >= 100 ? 50 : 1}" 
                               class="calc-field-input calorie-qty-input" 
                               data-item-id="${item.id}"
                               data-unit-amt="${item.amount || 100}"
                               data-kcal="${item.kcal}"
                               value="${amt > 0 ? amt : ''}" 
                               placeholder="0"
                               style="width:90px; padding:0.25rem 0.5rem; font-size:0.85rem;" />
                      </td>
                      <td style="text-align:right; font-weight:800; color:${itemKcal > 0 ? '#b45309' : '#94a3b8'};" id="subKcal_${item.id}">
                        ${itemKcal > 0 ? itemKcal + ' kcal' : '—'}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Originalbild Förhandsvisning -->
          <div style="margin-top:2rem; padding-top:1.5rem; border-top:1px solid #f1f5f9;">
            <div style="font-weight:800; font-size:0.95rem; color:#0f172a; margin-bottom:0.75rem;">
              📷 Originaldokument: Kaloritabell IVA 343 Östra
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-md); padding:1rem; display:flex; justify-content:center;">
              <img src="kaloritabell_iva_343.png" alt="Kaloritabell IVA 343 Östra sjukhuset" style="max-width:100%; height:auto; border-radius:6px; box-shadow:0 4px 15px rgba(0,0,0,0.1);" />
            </div>
          </div>
        </div>
      `;
    }

    // FLIK 3: 🍼 SONDNÄRINGSPREPARAT
    if (this.nutrCurrentTab === "formulas") {
      return `
        <div class="fluids-cards-grid">
          ${formulas.map(f => `
            <div class="fluid-card" style="border-top: 4px solid #d97706;">
              <h4 style="margin:0 0 0.35rem; font-size:1.05rem; color:#0f172a; font-weight:800;">${f.name}</h4>
              <div style="font-size:0.8rem; color:#b45309; font-weight:700; margin-bottom:0.5rem;">${f.energyDensity} kcal/ml • ${f.proteinDensity} g protein/100ml</div>
              <p style="font-size:0.8rem; color:#475569; margin:0 0 0.75rem; line-height:1.4;">${f.description}</p>
              <div style="font-size:0.78rem; color:#0f172a; background:#f8fafc; padding:0.5rem; border-radius:6px; border:1px solid #f1f5f9;">
                <div><strong>Indikation:</strong> ${f.indication}</div>
                ${f.caution ? `<div style="color:#dc2626; margin-top:0.25rem;"><strong>OBS:</strong> ${f.caution}</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // FLIK 1: ⚖️ï¸ ESPEN ENERGIMÅL & PROPOFOL
    const weight = result.actualWeight;
    const isObese = result.bmi >= 30;

    return `
      <div class="bloodgas-layout-grid">
        <!-- Vänster: Inmatning -->
        <div class="calc-panel">
          <h3 style="font-size:1.1rem; color:#0f172a; margin-bottom:1.1rem; display:flex; align-items:center; gap:0.5rem;">
            ${ICONS.calculator} Patientdata & Tillstånd
          </h3>

          <div class="calc-inputs-grid">
            <div class="calc-field-group">
              <label class="calc-field-label">Kön</label>
              <select class="form-select" id="nutrGenderSelect">
                <option value="male" ${this.nutrGender === 'male' ? 'selected' : ''}>Man</option>
                <option value="female" ${this.nutrGender === 'female' ? 'selected' : ''}>Kvinna</option>
              </select>
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Ålder <span class="calc-field-unit">år</span></label>
              <input type="number" step="1" class="calc-field-input" id="nutrAgeInput" value="${this.nutrAge}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Vikt <span class="calc-field-unit">kg</span></label>
              <input type="number" step="0.5" class="calc-field-input" id="nutrWeightInput" value="${this.nutrWeight}" />
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Längd <span class="calc-field-unit">cm</span></label>
              <input type="number" step="1" class="calc-field-input" id="nutrHeightInput" value="${this.nutrHeight}" />
            </div>
          </div>

          <div class="calc-section-label" style="font-weight:700; font-size:0.8rem; text-transform:uppercase; color:#d97706; margin:1rem 0 0.4rem;">
            IVA-Fas & Kliniskt Tillstånd
          </div>
          <div class="calc-inputs-grid" style="grid-template-columns: 1fr 1fr; gap:0.75rem;">
            <div class="calc-field-group">
              <label class="calc-field-label">IVA-Fas</label>
              <select class="form-select" id="nutrPhaseSelect">
                <option value="early" ${this.nutrPhase === 'early' ? 'selected' : ''}>Akut tidig fas (Dag 1–2: 70% mål)</option>
                <option value="stable" ${this.nutrPhase === 'stable' ? 'selected' : ''}>Stabiliseringsfas (Dag 3–7: 100% mål)</option>
                <option value="recovery" ${this.nutrPhase === 'recovery' ? 'selected' : ''}>Återhämtningsfas (Dag >7: 100–120%)</option>
              </select>
            </div>

            <div class="calc-field-group">
              <label class="calc-field-label">Kliniskt Tillstånd</label>
              <select class="form-select" id="nutrConditionSelect">
                <option value="standard" ${this.nutrCondition === 'standard' ? 'selected' : ''}>Standard IVA-patient</option>
                <option value="crrt" ${this.nutrCondition === 'crrt' ? 'selected' : ''}>CRRT / Dialys (högre proteinförlust)</option>
                <option value="burn" ${this.nutrCondition === 'burn' ? 'selected' : ''}>Brännskada / Gravt hyperkatabol</option>
                <option value="obesity" ${this.nutrCondition === 'obesity' ? 'selected' : ''}>Adipositas (BMI ≥ 30)</option>
              </select>
            </div>
          </div>

          <div class="calc-section-label" style="font-weight:700; font-size:0.8rem; text-transform:uppercase; color:#b45309; margin:1rem 0 0.4rem;">
            Icke-Nutritionella Kalorier (Lipider & Glukos)
          </div>
          <div class="calc-inputs-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:0.5rem;">
            <div class="calc-field-group">
              <label class="calc-field-label">Propofol (ml/h, 1%)</label>
              <input type="number" class="calc-field-input" id="nutrPropofolInput" value="${this.nutrPropofolRate}" />
            </div>
            <div class="calc-field-group">
              <label class="calc-field-label">Glukos 5% (ml/dygn)</label>
              <input type="number" class="calc-field-input" id="nutrGlucoseVolInput" value="${this.nutrGlucoseVol}" />
            </div>
            <div class="calc-field-group">
              <label class="calc-field-label">Citratdialys (kcal/dygn)</label>
              <input type="number" class="calc-field-input" id="nutrCitrateInput" value="${this.nutrCitrateCcal}" />
            </div>
          </div>
        </div>

        <!-- Höger: Beräknade Mål & Pumptakt -->
        <div class="calc-panel">
          <div class="diagnosis-hero-box" style="background:#fef3c7; border:1.5px solid #d97706; margin-bottom:1.25rem;">
            <div class="diagnosis-badge-large" style="color:#b45309;">
              Nettomål Nutrition: ${result.netCaloriesTarget} kcal/dygn
            </div>
            <div class="diagnosis-subtext" style="color:#78350f;">
              Bruttobehov ${result.totalCaloriesTarget} kcal minus ${result.nonNutritionalCalories} kcal från propofol/glukos.
            </div>
          </div>

          <div class="calc-metric-cards-grid">
            <div class="metric-card-mini">
              <div class="metric-mini-title">Proteinmål (dygn)</div>
              <div class="metric-mini-val" style="color:#0284c7;">
                ${result.proteinTargetGrams} <span style="font-size:0.8rem; font-weight:600;">gram</span>
              </div>
              <div class="metric-mini-sub">${result.proteinPerKg} g/kg (${result.weightUsedLabel})</div>
            </div>

            <div class="metric-card-mini">
              <div class="metric-mini-title">Propofol-kalorier</div>
              <div class="metric-mini-val" style="color:#ea580c;">
                ${result.propofolCalories} <span style="font-size:0.8rem; font-weight:600;">kcal/dygn</span>
              </div>
              <div class="metric-mini-sub">${this.nutrPropofolRate} ml/h (1.1 kcal/ml)</div>
            </div>

            <div class="metric-card-mini">
              <div class="metric-mini-title">BMI & Viktklass</div>
              <div class="metric-mini-val" style="color:#0f172a;">
                ${result.bmi} <span style="font-size:0.8rem; font-weight:600;">kg/m²</span>
              </div>
              <div class="metric-mini-sub">${result.bmiClass} (IBW: ${result.ibw} kg)</div>
            </div>

            <div class="metric-card-mini">
              <div class="metric-mini-title">Sondmat Pumptakt (ml/h)</div>
              <div class="metric-mini-val" style="color:#059669;">
                ${result.enteralRateMlPerHour} <span style="font-size:0.8rem; font-weight:600;">ml/h</span>
              </div>
              <div class="metric-mini-sub">${result.selectedFormulaName}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setupNutritionEvents() {
    // 1. ESPEN input listeners
    const bindNutr = (id, prop, isFloat = true) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", (e) => {
        this[prop] = isFloat ? (parseFloat(e.target.value) || 0) : e.target.value;
        const container = document.getElementById("nutritionTabContentContainer");
        if (container && this.nutrCurrentTab === "calc") {
          const result = this.computeNutritionValues();
          const formulas = typeof NUTRITION_FORMULAS !== "undefined" ? NUTRITION_FORMULAS : [];
          const calorieItems = typeof IVA_CALORIE_TABLE !== "undefined" ? IVA_CALORIE_TABLE : [];
          container.innerHTML = this.renderActiveNutritionTabHtml(result, formulas, calorieItems);
          this.setupNutritionEvents();
        }
      });
      el.addEventListener("change", (e) => {
        this[prop] = isFloat ? (parseFloat(e.target.value) || 0) : e.target.value;
        if (this.nutrCurrentTab === "calc") {
          this.switchNutritionTab("calc");
        }
      });
    };

    bindNutr("nutrAgeInput", "nutrAge");
    bindNutr("nutrWeightInput", "nutrWeight");
    bindNutr("nutrHeightInput", "nutrHeight");
    bindNutr("nutrPropofolInput", "nutrPropofolRate");
    bindNutr("nutrGlucoseVolInput", "nutrGlucoseVol");
    bindNutr("nutrCitrateInput", "nutrCitrateCcal");
    bindNutr("nutrGenderSelect", "nutrGender", false);
    bindNutr("nutrPhaseSelect", "nutrPhase", false);
    bindNutr("nutrConditionSelect", "nutrCondition", false);

    // 2. Kaloritabell live quantity listeners (uppdaterar utan att rita om hela DOM)
    if (this.nutrCurrentTab === "calories") {
      const searchEl = document.getElementById("inputCalorieSearch");
      if (searchEl) {
        searchEl.addEventListener("input", (e) => {
          this.calorieSearchQuery = e.target.value;
          this.switchNutritionTab("calories");
          const s = document.getElementById("inputCalorieSearch");
          if (s) {
            s.focus();
            s.setSelectionRange(s.value.length, s.value.length);
          }
        });
      }

      const qtyInputs = document.querySelectorAll(".calorie-qty-input");
      qtyInputs.forEach(input => {
        input.addEventListener("input", (e) => {
          const id = e.target.getAttribute("data-item-id");
          const unitAmt = parseFloat(e.target.getAttribute("data-unit-amt")) || 100;
          const kcal = parseFloat(e.target.getAttribute("data-kcal")) || 100;
          const val = parseFloat(e.target.value) || 0;

          if (!this.nutrSelectedCalorieAmounts) this.nutrSelectedCalorieAmounts = {};
          this.nutrSelectedCalorieAmounts[id] = val;

          // Uppdatera delsumma i raden
          const subEl = document.getElementById(`subKcal_${id}`);
          const rowKcal = Math.round((val / unitAmt) * kcal);
          if (subEl) {
            subEl.textContent = rowKcal > 0 ? `${rowKcal} kcal` : '—';
            subEl.style.color = rowKcal > 0 ? '#b45309' : '#94a3b8';
          }

          // Uppdatera totalen
          const calorieItems = typeof IVA_CALORIE_TABLE !== "undefined" ? IVA_CALORIE_TABLE : [];
          let grandTotal = 0;
          Object.keys(this.nutrSelectedCalorieAmounts).forEach(k => {
            const a = parseFloat(this.nutrSelectedCalorieAmounts[k]) || 0;
            const item = calorieItems.find(x => x.id === k);
            if (item && a > 0) {
              grandTotal += (a / (item.amount || 100)) * item.kcal;
            }
          });
          const totEl = document.getElementById("liveTotalCalDisplay");
          if (totEl) {
            totEl.innerHTML = `${Math.round(grandTotal)} <span style="font-size:0.9rem; font-weight:700;">kcal</span>`;
          }
        });
      });
    }
  }

  // =========================================================================
  // Läkemedel, Doskalkylator & Blandbarhet i CVK (IVA Modul)
  // =========================================================================

  
  computeNutritionValues() {
    const weight = parseFloat(this.nutrWeight) || 75;
    const height = parseFloat(this.nutrHeight) || 178;
    const age = parseFloat(this.nutrAge) || 60;
    const gender = this.nutrGender || "male";
    const phase = this.nutrPhase || "early";
    const cond = this.nutrCondition || "standard";
    const propofolRate = parseFloat(this.nutrPropofolRate) || 0;
    const glucoseVol = parseFloat(this.nutrGlucoseVol) || 0;
    const citrateCcal = parseFloat(this.nutrCitrateCcal) || 0;

    // 1. BMI & Ideal Kroppsvikt (IBW)
    const heightM = height / 100;
    const bmi = heightM > 0 ? parseFloat((weight / (heightM * heightM)).toFixed(1)) : 23;
    const ibw = Math.round(gender === "male"
      ? 50 + 0.91 * (height - 152.4)
      : 45.5 + 0.91 * (height - 152.4));

    let bmiClass = "Normalvikt";
    if (bmi < 18.5) bmiClass = "Undervikt";
    else if (bmi >= 25 && bmi < 30) bmiClass = "Övervikt";
    else if (bmi >= 30 && bmi < 35) bmiClass = "Fetma klass 1";
    else if (bmi >= 35 && bmi < 40) bmiClass = "Fetma klass 2";
    else if (bmi >= 40) bmiClass = "Fetma klass 3";

    // Justerad kroppsvikt vid obesitas (ABW)
    const abw = bmi >= 30 ? Math.round(ibw + 0.4 * (weight - ibw)) : weight;
    const weightUsed = bmi >= 30 ? (cond === "obesity" ? ibw : abw) : weight;
    const weightUsedLabel = bmi >= 30 ? (cond === "obesity" ? "IBW" : "Justerad vikt ABW") : "Faktisk vikt";

    // 2. Energimål (kcal/dygn) enligt ESPEN
    let kcalPerKg = 25;
    if (phase === "early") {
      kcalPerKg = 20; // 70% måluppfyllelse i tidig akutfas
    } else if (phase === "recovery") {
      kcalPerKg = 28;
    }
    if (cond === "obesity") {
      kcalPerKg = 22; // Beräknat på IBW
    }

    const totalCaloriesTarget = Math.round(weightUsed * kcalPerKg);

    // 3. Icke-nutritionella kalorier
    // Propofol 10 mg/ml (1%): 1.1 kcal per ml (lipidemulsion)
    const propofolCalories = Math.round(propofolRate * 24 * 1.1);
    // Glukos 5%: 200 kcal/L (0.2 kcal/ml)
    const glucoseCalories = Math.round((glucoseVol / 1000) * 200);
    const nonNutritionalCalories = propofolCalories + glucoseCalories + Math.round(citrateCcal);

    // Netto enteralt mål
    const netCaloriesTarget = Math.max(0, totalCaloriesTarget - nonNutritionalCalories);

    // 4. Proteinmål (g/dygn)
    let proteinPerKg = 1.3;
    if (cond === "crrt") proteinPerKg = 1.6;
    if (cond === "burn") proteinPerKg = 1.8;
    if (cond === "obesity") proteinPerKg = 2.0;

    const proteinTargetGrams = Math.round((bmi >= 30 && cond === "obesity" ? ibw : weightUsed) * proteinPerKg);

    // 5. Sondmatspump hastighet (ml/h)
    const formulas = typeof NUTRITION_FORMULAS !== "undefined" ? NUTRITION_FORMULAS : [];
    const selectedFormula = formulas.find(f => f.id === this.nutrSelectedFormula) || formulas[0] || { name: "Standard 1.5 kcal/ml", energyDensity: 1.5, proteinDensity: 5.6 };
    const energyPerMl = selectedFormula.energyDensity || 1.5;
    const neededFormulaVol = energyPerMl > 0 ? (netCaloriesTarget / energyPerMl) : 0;
    const enteralRateMlPerHour = Math.round(neededFormulaVol / 24);
    const selectedFormulaName = selectedFormula.name || "Standard";

    return {
      actualWeight: weight,
      weight, height, age, gender, phase, cond,
      bmi, bmiClass, ibw, abw, weightUsed, weightUsedLabel,
      totalCaloriesTarget,
      totalEnergyTarget: totalCaloriesTarget,
      propofolCalories, propofolKcal: propofolCalories,
      glucoseCalories, glucoseKcal: glucoseCalories,
      nonNutritionalCalories, nonNutritionalKcal: nonNutritionalCalories,
      netCaloriesTarget, netEnteralKcal: netCaloriesTarget,
      proteinPerKg, proteinTargetGrams, totalProteinTarget: proteinTargetGrams,
      enteralRateMlPerHour, pumpRateMlH: enteralRateMlPerHour,
      selectedFormula, selectedFormulaName,
      neededFormulaVol: Math.round(neededFormulaVol)
    };
  }

  renderDrugsAndCalculatorPage() {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    mainEl.style.setProperty("--theme-color", "#0284c7");
    mainEl.style.setProperty("--theme-bg", "#e0f2fe");
    mainEl.style.setProperty("--theme-border", "#bae6fd");

    const totalDrugs = typeof IVA_DRUGS !== "undefined" ? IVA_DRUGS.length : 12;

    let html = `
      <section class="page-hero">
        <div class="hero-main">
          <div class="hero-info">
            <div class="hero-icon-bubble" style="background:#e0f2fe; color:#0284c7; border-color:#bae6fd;">
              ${ICONS.pill}
            </div>
            <div class="hero-text">
              <h2>
                Doskalkylator & Läkemedel IVA
                <span class="hero-count-pill" style="background:#e0f2fe; color:#0369a1;">${totalDrugs} standardpreparat</span>
              </h2>
              <p>Interaktiv beräkning av infusionshastighet (ml/h), spädningsrecept och kontroll av blandbarhet i CVK / Y-koppling.</p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-upload-primary" onclick="app.switchCategory('Respiration')">
              Tillbaka till Rutiner
            </button>
          </div>
        </div>

        <!-- SÖKNING PÅ LÄKEMEDELSSIDAN -->
        <div class="page-toolbar">
          <div class="page-search-wrapper" style="max-width: 520px;">
            <span class="page-search-icon">${ICONS.search}</span>
            <input type="text" 
                   class="page-search-input" 
                   id="drugSearchInput"
                   placeholder="Sök bland läkemedel, spädningar, doser eller blandbarhet..."
                   value="${this.escapeHtml(this.drugSearchQuery)}" />
            <button class="page-search-clear" id="drugSearchClear" style="${this.drugSearchQuery ? 'display:block' : ''}">
              ${ICONS.x}
            </button>
          </div>

          <!-- Fliknavigering -->
          <div class="drug-tab-nav horizontal-scroll-tabs" style="border-bottom:none; padding-bottom:0;">
            <button class="drug-tab-btn ${this.currentDrugTab === 'calc' ? 'active' : ''}" id="tabBtnCalc" onclick="app.switchDrugTab('calc')">
              ${ICONS.calculator} Doskalkylator
            </button>
            <button class="drug-tab-btn ${this.currentDrugTab === 'recipes' ? 'active' : ''}" id="tabBtnRecipes" onclick="app.switchDrugTab('recipes')">
              ${ICONS.pill} Spädningsregister
            </button>
            <button class="drug-tab-btn ${this.currentDrugTab === 'compat' ? 'active' : ''}" id="tabBtnCompat" onclick="app.switchDrugTab('compat')">
              ${ICONS.filter} CVK Blandbarhet
            </button>
          </div>
        </div>
      </section>

      <!-- Flikinnehåll -->
      <div id="drugTabContentContainer">
        ${this.renderActiveDrugTabHtml()}
      </div>
    `;

    mainEl.innerHTML = html;
    this.setupDrugPageEvents();
  }

  switchDrugTab(tab) {
    this.currentDrugTab = tab;
    const container = document.getElementById("drugTabContentContainer");
    if (container) {
      container.innerHTML = this.renderActiveDrugTabHtml();
      this.setupDrugTabContentEvents();
    }
    const btnCalc = document.getElementById("tabBtnCalc");
    const btnRec = document.getElementById("tabBtnRecipes");
    const btnComp = document.getElementById("tabBtnCompat");
    if (btnCalc) btnCalc.classList.toggle("active", tab === "calc");
    if (btnRec) btnRec.classList.toggle("active", tab === "recipes");
    if (btnComp) btnComp.classList.toggle("active", tab === "compat");
  }

  renderActiveDrugTabHtml() {
    if (this.currentDrugTab === "recipes") {
      return this.renderDrugRecipesTabHtml();
    } else if (this.currentDrugTab === "compat") {
      return this.renderDrugCompatibilityTabHtml();
    }
    return this.renderDrugCalculatorTabHtml();
  }

  renderDrugCalculatorTabHtml() {
    const drugs = typeof IVA_DRUGS !== "undefined" ? IVA_DRUGS : [];
    const activeDrug = drugs.find((d) => d.id === this.calcDrugId) || drugs[0] || {};
    const rate = activeDrug.infusionFormula ? activeDrug.infusionFormula(this.calcWeight, this.calcDose).toFixed(1) : "0.0";

    return `
      <div class="calc-grid">
        <div class="calc-card">
          <h3>${ICONS.calculator} Patientdata & Läkemedelsval</h3>

          <!-- Patientvikt -->
          <div class="form-group">
            <label class="form-label" for="calcWeightInput">
              Patientens Vikt (kg): <strong id="weightDisplayVal">${this.calcWeight} kg</strong>
            </label>
            <input type="number" 
                   class="form-input" 
                   id="calcWeightInput" 
                   value="${this.calcWeight}" 
                   min="30" 
                   max="250" 
                   step="1" />
            <div class="weight-quick-row">
              ${[50, 60, 70, 80, 90, 100].map(w => `
                <button class="quick-weight-btn ${this.calcWeight === w ? 'active' : ''}" 
                        onclick="app.setCalcWeight(${w})">${w} kg</button>
              `).join('')}
            </div>
          </div>

          <!-- Läkemedel -->
          <div class="form-group">
            <label class="form-label" for="calcDrugSelect">Välj Läkemedel för beräkning</label>
            <select class="form-select" id="calcDrugSelect">
              ${drugs.map(d => `
                <option value="${d.id}" ${d.id === this.calcDrugId ? 'selected' : ''}>
                  ${d.name} (${d.standardConc}) - ${d.doseUnit}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Önskad dos -->
          <div class="form-group">
            <label class="form-label" for="calcDoseInput">
              Önskad Dosering (<span style="color:#0284c7; font-weight:700;">${activeDrug.doseUnit || 'dos'}</span>)
            </label>
            <input type="number" 
                   class="form-input" 
                   id="calcDoseInput" 
                   value="${this.calcDose}" 
                   step="0.01" 
                   min="0" />
            <div style="font-size:0.8rem; color:#64748b; margin-top:0.35rem;">
              Rekommenderat intervall: <strong>${activeDrug.standardDoseRange || ''}</strong>
            </div>
          </div>

          <!-- Alternativt beräkna från pumphastighet -->
          <div class="form-group" style="padding-top:0.75rem; border-top:1px dashed #e2e8f0;">
            <label class="form-label" for="calcPumpRateInput">
              Eller ange aktuell pumpsättning (ml/timme):
            </label>
            <input type="number" 
                   class="form-input" 
                   id="calcPumpRateInput" 
                   value="${rate}" 
                   step="0.1" 
                   min="0" />
            <span style="font-size:0.75rem; color:#94a3b8;">Ändra ml/h för att räkna ut aktuell dos i ${activeDrug.doseUnit}</span>
          </div>
        </div>

        <!-- Resultatkort -->
        <div class="calc-result-box">
          <div>
            <div class="calc-result-header">Rekommenderad Infusionshastighet</div>
            <div class="calc-big-value">
              <span id="calcBigRateVal">${rate}</span>
              <span class="calc-big-unit">ml/timme</span>
            </div>

            <div style="font-size:0.95rem; font-weight:600; color:#e2e8f0; margin-bottom:0.75rem;">
              ${activeDrug.name} (${activeDrug.standardConc})
            </div>

            <div style="display:flex; flex-direction:column; gap:0.4rem; font-size:0.85rem; color:#cbd5e1;">
              <div><strong>Spädning:</strong> ${activeDrug.dilutionGuide || ''}</div>
              <div><strong>Spädningsvätska:</strong> ${activeDrug.approvedDiluents || ''}</div>
              <div><strong>Infart:</strong> ${activeDrug.administrationRoute || 'CVK'}</div>
            </div>
          </div>

          <div class="calc-info-pill">
            ⚠️ <strong>Klinisk obs:</strong> ${activeDrug.clinicalNotes || 'Följ enhetens ordination och monitorera hemodynamik noggrant.'}
          </div>
        </div>
      </div>
    `;
  }

  renderDrugRecipesTabHtml() {
    let drugs = typeof IVA_DRUGS !== "undefined" ? IVA_DRUGS : [];
    const q = this.drugSearchQuery.toLowerCase().trim();

    if (q) {
      drugs = drugs.filter(d => 
        (d.name || "").toLowerCase().includes(q) ||
        (d.tradeNames || "").toLowerCase().includes(q) ||
        (d.class || "").toLowerCase().includes(q) ||
        (d.dilutionGuide || "").toLowerCase().includes(q) ||
        (d.approvedDiluents || "").toLowerCase().includes(q) ||
        (d.clinicalNotes || "").toLowerCase().includes(q)
      );
    }

    if (drugs.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">${ICONS.pill}</div>
          <h3>Inga läkemedel matchade "${this.escapeHtml(this.drugSearchQuery)}"</h3>
          <p>Testa att söka på substansnamn som Noradrenalin, Propofol, Cordarone eller spädningsvätska som Glukos 5%.</p>
        </div>
      `;
    }

    return `
      <div class="drug-cards-grid">
        ${drugs.map(drug => `
          <div class="drug-card">
            <div class="drug-card-header">
              <div>
                <div class="drug-card-name">${this.escapeHtml(drug.name)}</div>
                <div class="drug-card-trade">${this.escapeHtml(drug.tradeNames)} • ${this.escapeHtml(drug.class)}</div>
              </div>
              <span class="badge-priority Riktlinje">${this.escapeHtml(drug.standardConc)}</span>
            </div>

            <div class="drug-recipe-box">
              <strong>Beredning / Spädning:</strong><br />
              ${this.escapeHtml(drug.dilutionGuide)}
            </div>

            <div class="drug-spec-row">
              <div class="drug-spec-item">
                <span class="drug-spec-label">Godkända vätskor:</span>
                <span class="drug-spec-value">${this.escapeHtml(drug.approvedDiluents)}</span>
              </div>
              <div class="drug-spec-item">
                <span class="drug-spec-label">Standarddosering:</span>
                <span class="drug-spec-value">${this.escapeHtml(drug.standardDoseRange)}</span>
              </div>
              <div class="drug-spec-item">
                <span class="drug-spec-label">Infartskrav:</span>
                <span class="drug-spec-value">${this.escapeHtml(drug.administrationRoute)}</span>
              </div>
              <div class="drug-spec-item">
                <span class="drug-spec-label">Hållbarhet:</span>
                <span class="drug-spec-value">${this.escapeHtml(drug.stability)}</span>
              </div>
            </div>

            <div style="font-size:0.8rem; color:#64748b; line-height:1.4;">
              💡 <strong>Klinisk not:</strong> ${this.escapeHtml(drug.clinicalNotes)}
            </div>

            <div style="margin-top:auto; padding-top:0.5rem; display:flex; justify-content:flex-end;">
              <button class="btn-open-doc" onclick="app.setCalcDrug('${drug.id}')">
                ${ICONS.calculator} Öppna i kalkylator
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderDrugCompatibilityTabHtml() {
    const drugs = typeof IVA_DRUGS !== "undefined" ? IVA_DRUGS : [];
    const drugA = drugs.find(d => d.id === this.compatDrugA) || drugs[0] || {};
    const drugB = drugs.find(d => d.id === this.compatDrugB) || drugs[1] || {};

    const compat = typeof getDrugCompatibility === "function" 
      ? getDrugCompatibility(drugA.id, drugB.id) 
      : { status: "CAUTION", text: "Kontrollera blandbarhet", details: "" };

    const statusBadge = compat.status === "YES" 
      ? `<span class="compat-badge YES">✓ BLANDBART (Kompatibel i Y-koppling)</span>`
      : compat.status === "NO"
      ? `<span class="compat-badge NO">✕ EJ BLANDBART (Inkompatibel - Fällningsrisk!)</span>`
      : `<span class="compat-badge CAUTION">⚠️ FÖRSIKTIGHET / BEGRÄNSAD DATA</span>`;

    return `
      <div class="drug-module-container">
        <!-- Interaktiv Blandbarhetstestare -->
        <div class="compat-tester-card">
          <h3>${ICONS.filter} Interaktiv Blandbarhetskontroll (Y-koppling / Samma skänkel)</h3>
          <p style="color:#64748b; font-size:0.9rem;">
            Välj två infusioner för att omedelbart se om de kan gå i samma trevägskran/skänkel i en CVK.
          </p>

          <div class="compat-selects-row">
            <div>
              <label class="form-label">Läkemedel 1</label>
              <select class="form-select" id="compatSelectA" onchange="app.handleCompatChange()">
                ${drugs.map(d => `
                  <option value="${d.id}" ${d.id === this.compatDrugA ? 'selected' : ''}>${d.name} (${d.standardConc})</option>
                `).join('')}
              </select>
            </div>

            <div style="font-size:1.5rem; font-weight:700; color:#94a3b8; text-align:center;">+</div>

            <div>
              <label class="form-label">Läkemedel 2</label>
              <select class="form-select" id="compatSelectB" onchange="app.handleCompatChange()">
                ${drugs.map(d => `
                  <option value="${d.id}" ${d.id === this.compatDrugB ? 'selected' : ''}>${d.name} (${d.standardConc})</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Statusresultat -->
          <div class="compat-result-card ${compat.status}">
            <div style="margin-bottom:0.75rem;">${statusBadge}</div>
            <div style="font-weight:700; font-size:1.05rem; margin-bottom:0.35rem; color:#0f172a;">
              ${this.escapeHtml(compat.text)}
            </div>
            <div style="font-size:0.9rem; color:#334155; line-height:1.5;">
              ${this.escapeHtml(compat.details)}
            </div>
          </div>
        </div>

        <!-- CVC Skänkelguide -->
        <div class="calc-card">
          <h3>🩺 Rekommenderad CVK-Skänkelallokering (3-lumen kateter)</h3>
          <div class="cvc-lumina-guide">
            <div class="cvc-lumen-card distal">
              <div style="font-weight:700; color:#854d0e; font-size:0.95rem; margin-bottom:0.35rem;">
                DISTAL Skänkel (Brun, 16G - Störst lumen)
              </div>
              <ul style="padding-left:1.2rem; font-size:0.85rem; color:#334155; line-height:1.5;">
                <li>CVP-mätning / Tryckgivare</li>
                <li>Blodtransfusion & Kolloider</li>
                <li>Volymresuscitering & Vätskebolustillförsel</li>
                <li>Viskösa antibiotikainfusioner</li>
              </ul>
            </div>

            <div class="cvc-lumen-card medial">
              <div style="font-weight:700; color:#0284c7; font-size:0.95rem; margin-bottom:0.35rem;">
                MEDIAL Skänkel (Blå, 18G)
              </div>
              <ul style="padding-left:1.2rem; font-size:0.85rem; color:#334155; line-height:1.5;">
                <li>Parenteral nutrition (TPN / TreKammarpåsar)</li>
                <li>Lipidemulsioner</li>
                <li><em>Bör helst hållas dedikerad för nutrition för att minimera katetersepsis!</em></li>
              </ul>
            </div>

            <div class="cvc-lumen-card proximal">
              <div style="font-weight:700; color:#475569; font-size:0.95rem; margin-bottom:0.35rem;">
                PROXIMAL Skänkel (Vit, 18G)
              </div>
              <ul style="padding-left:1.2rem; font-size:0.85rem; color:#334155; line-height:1.5;">
                <li>Vasoaktiva läkemedel: Noradrenalin, Vasopressin, Adrenalin</li>
                <li>Sedering: Propofol, Remifentanil, Dexdor</li>
                <li><strong>Gyllene regel:</strong> Spola ALDRIG denna skänkel! (Risk för akut noradrenalin-bolus)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setCalcWeight(w) {
    this.calcWeight = w;
    const input = document.getElementById("calcWeightInput");
    const display = document.getElementById("weightDisplayVal");
    if (input) input.value = w;
    if (display) display.textContent = `${w} kg`;
    document.querySelectorAll(".quick-weight-btn").forEach(btn => {
      btn.classList.toggle("active", btn.textContent.trim() === `${w} kg`);
    });
    this.updateCalcResults();
  }

  setCalcDrug(drugId) {
    this.calcDrugId = drugId;
    const drugs = typeof IVA_DRUGS !== "undefined" ? IVA_DRUGS : [];
    const drug = drugs.find(d => d.id === drugId);
    if (drug) {
      this.calcDose = drug.defaultDose;
    }
    this.switchDrugTab("calc");
    this.updateCalcResults();
  }

  updateCalcResults() {
    const drugs = typeof IVA_DRUGS !== "undefined" ? IVA_DRUGS : [];
    const activeDrug = drugs.find(d => d.id === this.calcDrugId) || drugs[0];
    if (!activeDrug) return;

    const rate = activeDrug.infusionFormula ? activeDrug.infusionFormula(this.calcWeight, this.calcDose).toFixed(1) : "0.0";
    this.calcRate = parseFloat(rate);

    const bigVal = document.getElementById("calcBigRateVal");
    if (bigVal) bigVal.textContent = rate;

    const pumpInput = document.getElementById("calcPumpRateInput");
    if (pumpInput && document.activeElement !== pumpInput) {
      pumpInput.value = rate;
    }
  }

  setupDrugPageEvents() {
    const searchInput = document.getElementById("drugSearchInput");
    const clearBtn = document.getElementById("drugSearchClear");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.drugSearchQuery = e.target.value;
        if (clearBtn) clearBtn.style.display = this.drugSearchQuery ? "block" : "none";
        const container = document.getElementById("drugTabContentContainer");
        if (container) {
          container.innerHTML = this.renderActiveDrugTabHtml();
          this.setupDrugTabContentEvents();
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.drugSearchQuery = "";
        if (searchInput) searchInput.value = "";
        clearBtn.style.display = "none";
        const container = document.getElementById("drugTabContentContainer");
        if (container) {
          container.innerHTML = this.renderActiveDrugTabHtml();
          this.setupDrugTabContentEvents();
        }
      });
    }

    this.setupDrugTabContentEvents();
  }

  setupDrugTabContentEvents() {
    const weightInput = document.getElementById("calcWeightInput");
    if (weightInput) {
      weightInput.addEventListener("input", (e) => {
        const val = parseFloat(e.target.value) || 70;
        this.calcWeight = val;
        const display = document.getElementById("weightDisplayVal");
        if (display) display.textContent = `${val} kg`;
        this.updateCalcResults();
      });
    }

    const drugSelect = document.getElementById("calcDrugSelect");
    if (drugSelect) {
      drugSelect.addEventListener("change", (e) => {
        this.setCalcDrug(e.target.value);
      });
    }

    const doseInput = document.getElementById("calcDoseInput");
    if (doseInput) {
      doseInput.addEventListener("input", (e) => {
        this.calcDose = parseFloat(e.target.value) || 0;
        this.updateCalcResults();
      });
    }

    const pumpInput = document.getElementById("calcPumpRateInput");
    if (pumpInput) {
      pumpInput.addEventListener("input", (e) => {
        const rateVal = parseFloat(e.target.value) || 0;
        this.calcRate = rateVal;
        const drugs = typeof IVA_DRUGS !== "undefined" ? IVA_DRUGS : [];
        const activeDrug = drugs.find(d => d.id === this.calcDrugId);
        if (activeDrug && activeDrug.doseFromRate) {
          this.calcDose = parseFloat(activeDrug.doseFromRate(this.calcWeight, rateVal).toFixed(3));
          if (doseInput && document.activeElement !== doseInput) {
            doseInput.value = this.calcDose;
          }
          const bigVal = document.getElementById("calcBigRateVal");
          if (bigVal) bigVal.textContent = rateVal.toFixed(1);
        }
      });
    }
  }

  handleCompatChange() {
    const selA = document.getElementById("compatSelectA");
    const selB = document.getElementById("compatSelectB");
    if (selA) this.compatDrugA = selA.value;
    if (selB) this.compatDrugB = selB.value;

    const container = document.getElementById("drugTabContentContainer");
    if (container) {
      container.innerHTML = this.renderActiveDrugTabHtml();
      this.setupDrugTabContentEvents();
    }
  }

  // =========================================================================
  // Hjälpmetoder för Sortering & Dokumentfiltrering
  // =========================================================================

  sortDocuments(docs, sortKey = this.currentSort) {
    return [...docs].sort((a, b) => {
      // Pinned prioritet
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      switch (sortKey) {
        case "title-asc":
          return a.title.localeCompare(b.title, "sv");
        case "priority": {
          const weights = { Akut: 1, Riktlinje: 2, Rutin: 3 };
          const wA = weights[a.priority] || 4;
          const wB = weights[b.priority] || 4;
          if (wA !== wB) return wA - wB;
          return a.title.localeCompare(b.title, "sv");
        }
        case "size-desc":
          return (b.size || 0) - (a.size || 0);
        case "date-desc":
        default:
          return new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0);
      }
    });
  }

  // =========================================================================
  // MIN SIDA & SPARADE FAVORITER (Personlig Dashboard)
  // =========================================================================

  renderMyPage() {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    mainEl.style.setProperty("--theme-color", "#ca8a04");
    mainEl.style.setProperty("--theme-bg", "#fefce8");
    mainEl.style.setProperty("--theme-border", "#fef08a");

    const allFavDocs = this.documents.filter((d) => this.userFavorites.includes(d.id));
    
    // Unika kategorier bland användarens favoriter
    const categoriesWithFavs = this.categories.filter((cat) => 
      allFavDocs.some((d) => d.category === cat.id)
    );

    // Filtrera favoriter
    let docs = allFavDocs;
    if (this.myPageCategoryFilter && this.myPageCategoryFilter !== "ALL") {
      docs = docs.filter((d) => d.category === this.myPageCategoryFilter);
    }

    // Sökning inom favoriter
    if (this.myPageSearchQuery && this.myPageSearchQuery.trim()) {
      const q = this.myPageSearchQuery.toLowerCase().trim();
      docs = docs.filter((d) => {
        const titleMatch = (d.title || "").toLowerCase().includes(q);
        const descMatch = (d.description || "").toLowerCase().includes(q);
        const fileMatch = (d.filename || "").toLowerCase().includes(q);
        const catMatch = (d.category || "").toLowerCase().includes(q);
        const contentMatch = (d.content || "").toLowerCase().includes(q);
        const tagMatch = (d.tags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || fileMatch || catMatch || contentMatch || tagMatch;
      });
    }

    // Sortera
    docs = this.sortDocuments(docs, this.currentSort);

    const userName = this.currentUser ? this.currentUser.name : "Gäst";
    const userEmail = this.currentUser ? this.currentUser.email : "Ej synkad med Google";
    const initial = (userName || "U").charAt(0).toUpperCase();

    let html = `
      <!-- Profil & Favoritöversikt Hero -->
      <section class="mypage-hero-card">
        <div class="mypage-profile-row">
          <div class="mypage-user-identity">
            <div class="mypage-avatar-large">
              ${this.currentUser ? initial : `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`}
            </div>
            <div class="mypage-user-details">
              <h2>
                Min Sida
                ${this.currentUser ? `<span class="mypage-sync-badge">● Google Sync Aktiv</span>` : `<span class="mypage-sync-badge" style="background:#fee2e2; color:#991b1b;">● Lokalt Gästläge</span>`}
              </h2>
              <div class="mypage-user-email">
                <span><strong>${this.escapeHtml(userName)}</strong> (${this.escapeHtml(userEmail)})</span>
                ${this.currentUser ? `
                  <button class="btn-header-secondary" onclick="app.openGoogleLoginModal()" style="padding:0.2rem 0.5rem; font-size:0.75rem;">Byt konto</button>
                  <button class="btn-header-secondary" onclick="app.logoutUser()" style="padding:0.2rem 0.5rem; font-size:0.75rem; color:#dc2626;">Logga ut</button>
                ` : `
                  <button class="btn-google-login" onclick="app.openGoogleLoginModal()" style="padding:0.25rem 0.6rem; font-size:0.78rem;">${ICONS.google} Logga in med Google</button>
                `}
              </div>
            </div>
          </div>

          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn-upload-primary" onclick="app.openUploadModal()">
              ${ICONS.plus} Nytt dokument
            </button>
            <button class="btn-header-secondary" onclick="app.switchCategory('Respiration')">
              Bläddra i rutiner →
            </button>
          </div>
        </div>

        <!-- Statistikremsa -->
        <div class="mypage-stats-strip">
          <div class="mypage-stat-card">
            <div class="mypage-stat-icon">⭐</div>
            <div>
              <div class="mypage-stat-num">${allFavDocs.length}</div>
              <div class="mypage-stat-label">Sparade favoriter</div>
            </div>
          </div>
          <div class="mypage-stat-card">
            <div class="mypage-stat-icon" style="background:#e0f2fe; color:#0284c7;">📁</div>
            <div>
              <div class="mypage-stat-num">${categoriesWithFavs.length}</div>
              <div class="mypage-stat-label">IVA-kategorier representerade</div>
            </div>
          </div>
          <div class="mypage-stat-card">
            <div class="mypage-stat-icon" style="background:#f1f5f9; color:#475569;">📑</div>
            <div>
              <div class="mypage-stat-num">${this.documents.length}</div>
              <div class="mypage-stat-label">Totalt antal rutiner på IVA</div>
            </div>
          </div>
        </div>
      </section>

      <!-- SÖKNING PÅ MIN SIDA & VERKTYG -->
      <section class="mypage-toolbar">
        <div class="page-search-wrapper" style="max-width: 100%;">
          <span class="page-search-icon">${ICONS.search}</span>
          <input type="text" 
                 class="page-search-input" 
                 id="myPageSearchInput"
                 placeholder="Sök bland dina sparade favoriter (titel, PM, doser, sökord)..."
                 value="${this.escapeHtml(this.myPageSearchQuery)}" />
          <button class="page-search-clear" id="myPageSearchClear" style="${this.myPageSearchQuery ? 'display:block' : ''}">
            ${ICONS.x}
          </button>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
          <!-- Kategorifilter för favoriter -->
          <div class="mypage-filter-pills">
            <button class="mypage-pill-btn ${this.myPageCategoryFilter === 'ALL' ? 'active' : ''}" 
                    onclick="app.setMyPageCategoryFilter('ALL')">
              Alla mina favoriter (${allFavDocs.length})
            </button>
            ${this.categories.map((cat) => {
              const count = allFavDocs.filter((d) => d.category === cat.id).length;
              if (count === 0) return "";
              const isActive = this.myPageCategoryFilter === cat.id;
              return `
                <button class="mypage-pill-btn ${isActive ? 'active' : ''}" 
                        onclick="app.setMyPageCategoryFilter('${cat.id}')">
                  <span>${ICONS[cat.icon] || ''}</span>
                  <span>${cat.name}</span>
                  <span style="font-size:0.75rem; opacity:0.8;">(${count})</span>
                </button>
              `;
            }).join("")}
          </div>

          <!-- Sortering & Vy -->
          <div class="toolbar-controls">
            <select class="sort-select" id="myPageSortSelect">
              <option value="date-desc" ${this.currentSort === 'date-desc' ? 'selected' : ''}>Senast tillagd</option>
              <option value="title-asc" ${this.currentSort === 'title-asc' ? 'selected' : ''}>Namn (A–Ö)</option>
              <option value="priority" ${this.currentSort === 'priority' ? 'selected' : ''}>Prioritet (Akut först)</option>
            </select>

            <div class="view-toggle">
              <button class="view-btn ${this.currentViewMode === 'grid' ? 'active' : ''}" id="myPageViewGrid" title="Rutnätsvy">
                ${ICONS.grid}
              </button>
              <button class="view-btn ${this.currentViewMode === 'list' ? 'active' : ''}" id="myPageViewList" title="Kompakt listvy">
                ${ICONS.list}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Dokumentlista / Rutnät -->
      <section id="myPageDocumentsContainer">
        ${this.renderMyPageDocumentsHtml(docs, allFavDocs.length)}
      </section>
    `;

    mainEl.innerHTML = html;
    this.setupMyPageEvents();
  }

  setMyPageCategoryFilter(category) {
    this.myPageCategoryFilter = category;
    this.renderMyPage();
  }

  renderMyPageDocumentsHtml(docs, totalFavsCount) {
    if (totalFavsCount === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon" style="color:#ca8a04; background:#fef9c3;">${ICONS.starFilled}</div>
          <h3>Inga sparade favoriter än</h3>
          <p>${this.currentUser ? 'Klicka på stjärnikonen ⭐ på valfritt PM eller rutin (t.ex. under Respiration eller Circulation) för att spara det här på Min Sida.' : 'Logga in med ditt Google-konto och klicka på stjärnikonen ⭐ på dokument för att hålla dina viktigaste PM samlade här.'}</p>
          ${!this.currentUser ? `
            <button class="btn-google-login" onclick="app.openGoogleLoginModal()" style="display:inline-flex; margin: 0 auto;">
              ${ICONS.google} Logga in med Google
            </button>
          ` : `
            <button class="btn-upload-primary" onclick="app.switchCategory('Respiration')" style="display:inline-flex; margin: 0 auto;">
              Utforska Respiration & Rutiner
            </button>
          `}
        </div>
      `;
    }

    if (docs.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-icon">${ICONS.search}</div>
          <h3>Inga sparade favoriter matchade sökningen</h3>
          <p>Hittade inga sparade favoriter som matchade "${this.escapeHtml(this.myPageSearchQuery)}".</p>
          <button class="btn-header-secondary" onclick="app.clearMyPageSearch()" style="display:inline-flex; margin: 0 auto;">
            Rensa sökfilter
          </button>
        </div>
      `;
    }

    if (this.currentViewMode === "list") {
      return `
        <div class="documents-list-view">
          ${docs.map((doc) => this.renderListItemHtml(doc)).join("")}
        </div>
      `;
    }

    return `
      <div class="documents-grid">
        ${docs.map((doc) => this.renderCardHtml(doc)).join("")}
      </div>
    `;
  }

  updateMyPageDocumentDisplay() {
    const container = document.getElementById("myPageDocumentsContainer");
    if (!container) {
      this.renderMyPage();
      return;
    }

    const allFavDocs = this.documents.filter((d) => this.userFavorites.includes(d.id));
    let docs = allFavDocs;
    if (this.myPageCategoryFilter && this.myPageCategoryFilter !== "ALL") {
      docs = docs.filter((d) => d.category === this.myPageCategoryFilter);
    }
    if (this.myPageSearchQuery && this.myPageSearchQuery.trim()) {
      const q = this.myPageSearchQuery.toLowerCase().trim();
      docs = docs.filter((d) => {
        const titleMatch = (d.title || "").toLowerCase().includes(q);
        const descMatch = (d.description || "").toLowerCase().includes(q);
        const fileMatch = (d.filename || "").toLowerCase().includes(q);
        const catMatch = (d.category || "").toLowerCase().includes(q);
        const contentMatch = (d.content || "").toLowerCase().includes(q);
        const tagMatch = (d.tags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || descMatch || fileMatch || catMatch || contentMatch || tagMatch;
      });
    }
    docs = this.sortDocuments(docs, this.currentSort);

    container.innerHTML = this.renderMyPageDocumentsHtml(docs, allFavDocs.length);
  }

  clearMyPageSearch() {
    this.myPageSearchQuery = "";
    this.myPageCategoryFilter = "ALL";
    const input = document.getElementById("myPageSearchInput");
    if (input) input.value = "";
    const clearBtn = document.getElementById("myPageSearchClear");
    if (clearBtn) clearBtn.style.display = "none";
    this.renderMyPage();
  }

  setupMyPageEvents() {
    const searchInput = document.getElementById("myPageSearchInput");
    const clearBtn = document.getElementById("myPageSearchClear");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.myPageSearchQuery = e.target.value;
        if (clearBtn) {
          clearBtn.style.display = this.myPageSearchQuery ? "block" : "none";
        }
        this.updateMyPageDocumentDisplay();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearMyPageSearch();
      });
    }

    const sortSelect = document.getElementById("myPageSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.updateMyPageDocumentDisplay();
      });
    }

    const btnGrid = document.getElementById("myPageViewGrid");
    const btnList = document.getElementById("myPageViewList");

    if (btnGrid && btnList) {
      btnGrid.addEventListener("click", () => {
        this.currentViewMode = "grid";
        btnGrid.classList.add("active");
        btnList.classList.remove("active");
        this.updateMyPageDocumentDisplay();
      });

      btnList.addEventListener("click", () => {
        this.currentViewMode = "list";
        btnList.classList.add("active");
        btnGrid.classList.remove("active");
        this.updateMyPageDocumentDisplay();
      });
    }
  }

  // =========================================================================
  // Sidvyer & Rutnätsvy (Grid View)
  // =========================================================================

  renderCategoryPage(categoryId) {
    const mainEl = document.getElementById("pageMainContent");
    if (!mainEl) return;

    if (categoryId === "HOME" || categoryId === "STARTSIDA") {
      this.renderHomePage();
      return;
    }

    if (categoryId === "PAIN_SEDATION") {
      this.renderPainSedationPage();
      return;
    }

    if (categoryId === "DRUGS") {
      this.renderDrugsAndCalculatorPage();
      return;
    }

    if (categoryId === "MY_PAGE" || categoryId === "FAVORITES") {
      this.renderMyPage();
      return;
    }

    if (categoryId === "DISEASES") {
      this.renderDiseasesPage();
      return;
    }

    if (categoryId === "ACID_BASE") {
      this.renderAcidBasePage();
      return;
    }

    if (categoryId === "FLUID_BALANCE") {
      this.renderFluidBalancePage();
      return;
    }

    if (categoryId === "NUTRITION_CALC") {
      this.renderNutritionCalculatorPage();
      return;
    }

    if (categoryId === "EQUIPMENT") {
      this.renderEquipmentPage();
      return;
    }

    let catMeta = this.categories.find((c) => c.id === categoryId);
    let title = categoryId;
    let subtitle = "Alla dokument på IVA";
    let desc = "Översikt över samtliga rutiner, PM, checklistor och riktlinjer fördelade på IVA:s moduler.";
    let color = "#0284c7";
    let colorBg = "#e0f2fe";
    let colorBorder = "#bae6fd";
    let iconSvg = ICONS.layers;

    if (categoryId === "FAVORITES") {
      title = "Mina Favoriter";
      subtitle = this.currentUser ? `Sparade för ${this.currentUser.name}` : "Logga in med Google för att spara";
      desc = this.currentUser 
        ? "Dina stjärnmärkta rutiner, PM och protokoll sparade på ditt Google-konto." 
        : "Klicka på stjärnikonen på något dokument och logga in med Google för att hålla dina snabbprotokoll samlade här.";
      color = "#ca8a04";
      colorBg = "#fef9c3";
      colorBorder = "#fde047";
      iconSvg = ICONS.starFilled;
    } else if (catMeta) {
      title = catMeta.name;
      subtitle = catMeta.subtitle;
      desc = catMeta.description || "Kliniska rutiner och styrande PM fÃ¶r IntensivvÃ¥rdsenheten Ã–stra.";
      color = catMeta.color;
      colorBg = catMeta.colorLight;
      colorBorder = catMeta.colorBorder;
      iconSvg = ICONS[catMeta.icon] || (catMeta.icon && ICONS[catMeta.icon.toLowerCase()]) || ICONS[catMeta.id.toLowerCase()] || ICONS.filePdf;
    } else if (categoryId === "ALL") {
      title = "Alla Dokument";
      subtitle = "Samlad översikt över hela Intensivvårdsavdelningen";
    }

    // Filtrera dokument
    let docs = this.getFilteredDocuments();

    // Sätt CSS-variabler för färgtema på sidan
    mainEl.style.setProperty("--theme-color", color);
    mainEl.style.setProperty("--theme-bg", colorBg);
    mainEl.style.setProperty("--theme-border", colorBorder);

    // Rendera Hero-banner & Sök-/Verktygsfält (utan plottrigt taggfilter)
    let html = `
      <section class="page-hero">
        <div class="hero-main">
          <div class="hero-info">
            <div class="hero-icon-bubble">
              ${iconSvg}
            </div>
            <div class="hero-text">
              <h2>
                ${title}
                <span class="hero-count-pill" id="pageDocCountPill">${docs.length} ${docs.length === 1 ? 'dokument' : 'dokument'}</span>
              </h2>
              <p>${desc}</p>
            </div>
          </div>
          <div>
            <button class="btn-upload-primary" id="btnHeroUpload">
              ${ICONS.plus} Nytt dokument
            </button>
          </div>
        </div>

        <!-- SÖKNING PÅ DENNA SIDA & VERKTYGSFÄLT -->
        <div class="page-toolbar">
          <div class="page-search-wrapper">
            <span class="page-search-icon">${ICONS.search}</span>
            <input type="text" 
                   class="page-search-input" 
                   id="pageSearchInput"
                   placeholder="Sök inom ${title}... (titel, innehåll, doser)"
                   value="${this.escapeHtml(this.pageSearchQuery)}" />
            <button class="page-search-clear" id="pageSearchClear" style="${this.pageSearchQuery ? 'display:block' : ''}">
              ${ICONS.x}
            </button>
          </div>

          <div class="toolbar-controls">
            <!-- Sortering -->
            <select class="sort-select" id="pageSortSelect">
              <option value="date-desc" ${this.currentSort === 'date-desc' ? 'selected' : ''}>Senast tillagd</option>
              <option value="title-asc" ${this.currentSort === 'title-asc' ? 'selected' : ''}>Namn (A–Ö)</option>
              <option value="priority" ${this.currentSort === 'priority' ? 'selected' : ''}>Prioritet (Akut först)</option>
              <option value="size-desc" ${this.currentSort === 'size-desc' ? 'selected' : ''}>Filstorlek</option>
            </select>

            <!-- Vyväljare: Rutnät / Lista -->
            <div class="view-toggle">
              <button class="view-btn ${this.currentViewMode === 'grid' ? 'active' : ''}" 
                      id="viewBtnGrid" title="Rutnätsvy (Grid)">
                ${ICONS.grid}
              </button>
              <button class="view-btn ${this.currentViewMode === 'list' ? 'active' : ''}" 
                      id="viewBtnList" title="Listvy (Kompakt)">
                ${ICONS.list}
              </button>
            </div>
          </div>
        </div>
      </section>
    `;

    // Dokumentvy (Rutnät eller Lista)
    html += `<div id="documentsContainer">`;
    html += this.renderDocumentsListOrGrid(docs);
    html += `</div>`;

    mainEl.innerHTML = html;

    // Koppla lokala händelser för sidan
    this.setupPageToolbarEvents();
  }

  getFilteredDocuments() {
    let docs = this.documents;

    // 1. Filtrera på kategori eller favoriter
    if (this.activeCategory === "FAVORITES" || this.activeCategory === "MY_PAGE") {
      docs = docs.filter((d) => this.userFavorites.includes(d.id));
    } else if (this.activeCategory !== "ALL") {
      docs = docs.filter((d) => d.category === this.activeCategory);
    }

    // 2. Filtrera på vald tagg
    if (this.selectedTag && this.selectedTag !== "ALL") {
      docs = docs.filter((d) => (d.tags || []).includes(this.selectedTag));
    }

    // 3. Filtrera på sökfras för denna sida
    if (this.pageSearchQuery.trim()) {
      const q = this.pageSearchQuery.toLowerCase().trim();
      docs = docs.filter((d) => {
        const titleMatch = (d.title || "").toLowerCase().includes(q);
        const descMatch = (d.description || "").toLowerCase().includes(q);
        const fileMatch = (d.filename || "").toLowerCase().includes(q);
        const tagMatch = (d.tags || []).some((t) => t.toLowerCase().includes(q));
        const contentMatch = (d.content || "").toLowerCase().includes(q);
        return titleMatch || descMatch || fileMatch || tagMatch || contentMatch;
      });
    }

    // 4. Sortering (nålat alltid först)
    return this.sortDocuments(docs, this.currentSort);
  }

  renderDocumentsListOrGrid(docs) {
    if (docs.length === 0) {
      if (this.activeCategory === "FAVORITES") {
        return `
          <div class="empty-state">
            <div class="empty-icon" style="color:#ca8a04; background:#fef9c3;">${ICONS.starFilled}</div>
            <h3>Inga sparade favoriter än</h3>
            <p>${this.currentUser ? 'Klicka på stjärnikonen på något PM eller dokument för att spara det som din personliga favorit.' : 'Logga in med ditt Google-konto för att börja favoritmarkera och spara dina viktigaste PM.'}</p>
            ${!this.currentUser ? `
              <button class="btn-google-login" onclick="app.openGoogleLoginModal()" style="display:inline-flex; margin: 0 auto;">
                ${ICONS.google} Logga in med Google
              </button>
            ` : `
              <button class="btn-upload-primary" onclick="app.switchCategory('Respiration')" style="display:inline-flex; margin: 0 auto;">
                Bläddra bland rutiner
              </button>
            `}
          </div>
        `;
      }

      return `
        <div class="empty-state">
          <div class="empty-icon">${ICONS.filePdf}</div>
          <h3>Inga dokument matchade</h3>
          <p>Hittade inga dokument med vald sökning.${this.canUserEdit() ? ' Ladda upp ett nytt dokument eller ändra din sökfras.' : ' Ändra din sökfras eller välj en annan kategori.'}</p>
          ${this.canUserEdit() ? `
            <button class="btn-upload-primary" onclick="app.openUploadModal()" style="display:inline-flex; margin: 0 auto;">
              ${ICONS.plus} Ladda upp nytt dokument
            </button>
          ` : ''}
        </div>
      `;
    }

    if (this.currentViewMode === "list") {
      return `
        <div class="documents-list">
          ${docs.map((doc) => this.renderListItemHtml(doc)).join('')}
        </div>
      `;
    }

    // Grid View
    return `
      <div class="documents-grid">
        ${docs.map((doc) => this.renderCardHtml(doc)).join('')}
      </div>
    `;
  }

  renderCardHtml(doc) {
    const cat = this.categories.find((c) => c.id === doc.category) || {};
    const formattedDate = doc.dateAdded ? new Date(doc.dateAdded).toLocaleDateString("sv-SE") : "";
    const sizeStr = this.formatFileSize(doc.size);
    const isFav = this.isDocumentFavorited(doc.id);

    return `
      <div class="doc-card ${doc.isPinned ? 'is-pinned' : ''}" data-id="${doc.id}">
        <div class="doc-card-header">
          <div class="doc-type-icon ${doc.type && doc.type.includes('pdf') ? '' : 'is-doc'}">
            ${ICONS.filePdf}
          </div>
          <div class="doc-badges-row">
            ${isFav ? `<span style="color:#eab308; display:flex;" title="Sparad favorit">${ICONS.starFilled}</span>` : ''}
            ${doc.isPinned ? `<span class="pin-indicator" title="Fastnålat dokument">${ICONS.pinFilled}</span>` : ''}
            <span class="badge-priority ${doc.priority || 'Rutin'}">${doc.priority || 'Rutin'}</span>
            <span class="badge-category" 
                  style="--cat-bg:${cat.colorLight || '#f1f5f9'}; --cat-color:${cat.color || '#475569'}; --cat-border:${cat.colorBorder || '#e2e8f0'}">
              ${doc.category}
            </span>
          </div>
        </div>

        <h3 class="doc-title" onclick="app.openDocumentViewer('${doc.id}')">${this.escapeHtml(doc.title)}</h3>
        <p class="doc-description">${this.escapeHtml(doc.description || 'Ingen ytterligare beskrivning angiven.')}</p>

        <div class="doc-tags-list">
          ${(doc.tags || []).map((t) => `<span class="doc-tag-item">#${this.escapeHtml(t)}</span>`).join('')}
        </div>

        <div class="doc-card-footer">
          <div class="doc-meta">
            <span>${this.escapeHtml(doc.filename || 'dokument.pdf')}</span>
            <span>${sizeStr} • ${formattedDate}</span>
          </div>
          <div class="doc-actions-group">
            <button class="btn-card-action favorite ${isFav ? 'is-active' : ''}" 
                    onclick="app.toggleFavoriteDocument('${doc.id}')" 
                    title="${isFav ? 'Ta bort favorit' : 'Favoritmarkera (Google-konto)'}">
              ${isFav ? ICONS.starFilled : ICONS.star}
            </button>
            <button class="btn-card-action" onclick="app.togglePinDocument('${doc.id}')" title="${doc.isPinned ? 'Lossa nål' : 'Nåla fast överst'}">
              ${doc.isPinned ? ICONS.pinFilled : ICONS.pin}
            </button>
            <button class="btn-card-action" onclick="app.downloadDocument('${doc.id}')" title="Ladda ner fil">
              ${ICONS.download}
            </button>
            <button class="btn-open-doc" onclick="app.openDocumentViewer('${doc.id}')" title="Öppna och läs dokument">
              ${ICONS.eye} Visa
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderListItemHtml(doc) {
    const formattedDate = doc.dateAdded ? new Date(doc.dateAdded).toLocaleDateString("sv-SE") : "";
    const sizeStr = this.formatFileSize(doc.size);
    const isFav = this.isDocumentFavorited(doc.id);

    return `
      <div class="doc-list-item" data-id="${doc.id}">
        <div class="doc-list-left">
          <div class="doc-type-icon ${doc.type && doc.type.includes('pdf') ? '' : 'is-doc'}" style="width:34px;height:34px;">
            ${ICONS.filePdf}
          </div>
          <div class="doc-list-title-wrap">
            <div class="doc-list-title" onclick="app.openDocumentViewer('${doc.id}')">
              ${this.escapeHtml(doc.title)}
            </div>
            <div class="doc-list-sub">
              <span>${doc.category}</span>
              <span>•</span>
              <span class="badge-priority ${doc.priority || 'Rutin'}">${doc.priority || 'Rutin'}</span>
              <span>•</span>
              <span>${sizeStr}</span>
              <span>•</span>
              <span>${formattedDate}</span>
            </div>
          </div>
        </div>
        <div class="doc-actions-group">
          <button class="btn-card-action favorite ${isFav ? 'is-active' : ''}" 
                  onclick="app.toggleFavoriteDocument('${doc.id}')" 
                  title="${isFav ? 'Ta bort favorit' : 'Favoritmarkera (Google-konto)'}">
            ${isFav ? ICONS.starFilled : ICONS.star}
          </button>
          <button class="btn-card-action" onclick="app.togglePinDocument('${doc.id}')" title="Nåla">
            ${doc.isPinned ? ICONS.pinFilled : ICONS.pin}
          </button>
          <button class="btn-card-action" onclick="app.downloadDocument('${doc.id}')" title="Ladda ner">
            ${ICONS.download}
          </button>
          <button class="btn-open-doc" onclick="app.openDocumentViewer('${doc.id}')" title="Öppna och läs dokument">
            ${ICONS.eye} Visa
          </button>
        </div>
      </div>
    `;
  }

  setupPageToolbarEvents() {
    // Sökfält för aktuell sida
    const searchInput = document.getElementById("pageSearchInput");
    const clearBtn = document.getElementById("pageSearchClear");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.pageSearchQuery = e.target.value;
        if (clearBtn) clearBtn.style.display = this.pageSearchQuery ? "block" : "none";
        this.updateDocumentDisplay();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.pageSearchQuery = "";
        if (searchInput) searchInput.value = "";
        clearBtn.style.display = "none";
        this.updateDocumentDisplay();
      });
    }

    // Sortering
    const sortSelect = document.getElementById("pageSortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.updateDocumentDisplay();
      });
    }

    // Vyknappar
    const btnGrid = document.getElementById("viewBtnGrid");
    const btnList = document.getElementById("viewBtnList");
    if (btnGrid && btnList) {
      btnGrid.addEventListener("click", () => {
        this.currentViewMode = "grid";
        btnGrid.classList.add("active");
        btnList.classList.remove("active");
        this.updateDocumentDisplay();
      });
      btnList.addEventListener("click", () => {
        this.currentViewMode = "list";
        btnList.classList.add("active");
        btnGrid.classList.remove("active");
        this.updateDocumentDisplay();
      });
    }

    // Ladda upp knapp i Hero
    const btnHeroUpload = document.getElementById("btnHeroUpload");
    if (btnHeroUpload) {
      btnHeroUpload.addEventListener("click", () => this.openUploadModal());
    }
  }

  updateDocumentDisplay() {
    if (this.activeCategory === "MY_PAGE" || this.activeCategory === "FAVORITES") {
      this.updateMyPageDocumentDisplay();
      return;
    }
    if (this.activeCategory === "DRUGS") {
      return;
    }

    const container = document.getElementById("documentsContainer");
    const pill = document.getElementById("pageDocCountPill");
    const docs = this.getFilteredDocuments();
    if (container) {
      container.innerHTML = this.renderDocumentsListOrGrid(docs);
    }
    if (pill) {
      pill.textContent = `${docs.length} ${docs.length === 1 ? 'dokument' : 'dokument'}`;
    }
    this.updatePermissionsUI();
  }

  // =========================================================================
  // Global Sökning (Sök i Hela Appen / Alla sidor)
  // =========================================================================

  openGlobalSearchModal() {
    const modal = document.getElementById("globalSearchModal");
    const input = document.getElementById("globalSearchModalInput");
    if (!modal || !input) return;

    modal.classList.add("is-open");
    input.value = this.globalSearchQuery;
    input.focus();
    input.select();
    this.executeGlobalSearch(this.globalSearchQuery);
  }

  closeGlobalSearchModal() {
    const modal = document.getElementById("globalSearchModal");
    if (modal) modal.classList.remove("is-open");
  }

  executeGlobalSearch(query) {
    this.globalSearchQuery = query;
    const resultsContainer = document.getElementById("globalSearchResultsList");
    const countLabel = document.getElementById("globalSearchCountLabel");
    if (!resultsContainer) return;

    const q = query.toLowerCase().trim();

    let matches = this.documents;
    if (q) {
      matches = this.documents.filter((d) => {
        const titleMatch = (d.title || "").toLowerCase().includes(q);
        const descMatch = (d.description || "").toLowerCase().includes(q);
        const catMatch = (d.category || "").toLowerCase().includes(q);
        const tagMatch = (d.tags || []).some((t) => t.toLowerCase().includes(q));
        const fileMatch = (d.filename || "").toLowerCase().includes(q);
        const contentMatch = (d.content || "").toLowerCase().includes(q);
        return titleMatch || descMatch || catMatch || tagMatch || fileMatch || contentMatch;
      });
    }

    if (countLabel) {
      countLabel.textContent = `Hittade ${matches.length} träffar i hela IVA-hubben`;
    }

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align:center; padding: 2.5rem 1rem; color: #64748b;">
          ${ICONS.search}
          <p style="margin-top:0.5rem; font-weight:600;">Inga matchande dokument hittades</p>
          <p style="font-size:0.85rem;">Testa att söka på t.ex. "ARDS", "Noradrenalin", "Citrat", "RASS" eller "Besökstider"</p>
        </div>
      `;
      return;
    }

    let html = matches.map((doc) => {
      const cat = this.categories.find((c) => c.id === doc.category) || {};
      return `
        <div class="search-result-item" onclick="app.handleGlobalResultClick('${doc.id}', '${doc.category}')">
          <div class="search-result-main">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
              <span class="badge-category" 
                    style="--cat-bg:${cat.colorLight || '#f1f5f9'}; --cat-color:${cat.color || '#475569'}; --cat-border:${cat.colorBorder || '#e2e8f0'}">
                ${doc.category}
              </span>
              <span class="badge-priority ${doc.priority || 'Rutin'}">${doc.priority || 'Rutin'}</span>
              <span style="font-size:0.75rem; color:#94a3b8;">${doc.filename || ''}</span>
            </div>
            <div class="search-result-title">${this.escapeHtml(doc.title)}</div>
            <div class="search-result-desc">${this.escapeHtml(doc.description || '')}</div>
          </div>
          <button class="btn-card-action" title="Visa">
            ${ICONS.eye}
          </button>
        </div>
      `;
    }).join('');

    resultsContainer.innerHTML = html;
  }

  handleGlobalResultClick(docId, category) {
    this.closeGlobalSearchModal();
    // Navigera till den specifika kategorisidan
    this.switchCategory(category);
    // Öppna direkt dokumentet för läsning
    this.openDocumentViewer(docId);
  }

  // =========================================================================
  // Dokumentvisare (Viewer Modal)
  // =========================================================================

  // =========================================================================
  // DOKUMENTVISARE & CHROME READER MODE FÖR PM
  // =========================================================================

  openDocumentViewer(docId) {
    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return;
    this.currentViewingDoc = doc;

    const modal = document.getElementById("documentViewerModal");
    const dialog = document.getElementById("readerDialog");
    const titleEl = document.getElementById("viewerDocTitle");
    const metaEl = document.getElementById("viewerDocMeta");
    const contentEl = document.getElementById("viewerDocBody");

    if (!modal) return;

    if (dialog) {
      dialog.classList.remove("theme-light", "theme-sepia", "theme-dark");
      dialog.classList.add(`theme-${this.readerTheme || 'light'}`);
    }

    if (titleEl) titleEl.textContent = doc.title;
    if (metaEl) {
      metaEl.innerHTML = `
        <span class="badge-category">${doc.category || 'Respiration'}</span>
        <span class="badge-priority ${doc.priority || 'P1'}">${doc.priority || 'P1'}</span>
        <span>Fil: ${this.escapeHtml(doc.filename || 'dokument.pdf')}</span>
        <span>• Storlek: ${this.formatFileSize(doc.size || 45000)}</span>
      `;
    }

    if (contentEl) {
      contentEl.style.fontSize = `${this.readerFontSize || 18}px`;
      contentEl.style.lineHeight = String(this.readerLineHeight || 1.8);

      if (doc.fileDataUrl) {
        contentEl.innerHTML = `
          <iframe src="${doc.fileDataUrl}" class="viewer-content-frame" title="${this.escapeHtml(doc.title)}"></iframe>
        `;
      } else {
        contentEl.innerHTML = `
          <div class="reader-article">
            ${this.renderMarkdownToHtml(doc.content || `# ${doc.title}\n\n${doc.description || ''}`)}
          </div>
        `;
      }
    }

    this.updatePermissionsUI();
    modal.classList.add("is-open");
  }

  closeDocumentViewer() {
    const modal = document.getElementById("documentViewerModal");
    if (modal) modal.classList.remove("is-open");
    this.currentViewingDoc = null;
  }

  adjustReaderFontSize(delta) {
    this.readerFontSize = Math.min(28, Math.max(14, (this.readerFontSize || 18) + delta * 2));
    const body = document.getElementById("viewerDocBody");
    if (body) {
      body.style.fontSize = `${this.readerFontSize}px`;
    }
  }

  setReaderTheme(theme) {
    this.readerTheme = theme;
    const dialog = document.getElementById("readerDialog");
    if (dialog) {
      dialog.classList.remove("theme-light", "theme-sepia", "theme-dark");
      dialog.classList.add(`theme-${theme}`);
    }
  }

  cycleReaderLineHeight() {
    const steps = [1.6, 1.8, 2.0];
    const curr = this.readerLineHeight || 1.8;
    const nextIdx = (steps.indexOf(curr) + 1) % steps.length;
    this.readerLineHeight = steps[nextIdx];
    const body = document.getElementById("viewerDocBody");
    if (body) {
      body.style.lineHeight = String(this.readerLineHeight);
    }
    const btn = document.getElementById("btnLineHeightToggle");
    if (btn) {
      btn.title = `Radavstånd: ${this.readerLineHeight}`;
    }
  }

  // =========================================================================
  // START AV ARBETSPASS - CHECKLISTA (12 PUNKTER)
  // =========================================================================

  openShiftChecklistModal() {
    const modal = document.getElementById("shiftChecklistModal");
    if (!modal) return;
    this.renderShiftChecklistModal();
    modal.classList.add("is-open");
  }

  closeShiftChecklistModal() {
    const modal = document.getElementById("shiftChecklistModal");
    if (modal) modal.classList.remove("is-open");
  }

  renderShiftChecklistModal() {
    const container = document.getElementById("shiftChecklistItemsContainer");
    if (!container) return;

    const items = this.shiftChecklist || [];
    const checkedCount = items.filter(x => x.checked).length;
    const totalCount = items.length;
    const percent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

    const fillEl = document.getElementById("shiftProgressFill");
    if (fillEl) fillEl.style.width = `${percent}%`;

    const labelEl = document.getElementById("shiftProgressLabel");
    if (labelEl) labelEl.textContent = `${checkedCount} av ${totalCount} avbockade (${percent}%)`;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:0.75rem;">
        ${items.map((item, idx) => `
          <div class="shift-checklist-card ${item.checked ? 'is-checked' : ''}" id="shiftCard_${item.id}">
            <div style="display:flex; align-items:flex-start; gap:0.85rem;">
              <input type="checkbox" 
                     class="shift-checklist-checkbox" 
                     id="shiftCheck_${item.id}" 
                     ${item.checked ? 'checked' : ''} 
                     onchange="app.toggleShiftChecklistItem('${item.id}')" />
              <div style="flex:1;">
                <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.4rem;">
                  <label for="shiftCheck_${item.id}" class="shift-item-title ${item.checked ? 'checked-strike' : ''}" style="cursor:pointer; font-weight:700; font-size:0.95rem; color:#0f172a;">
                    <span class="shift-item-num">${item.number || (idx + 1)}.</span> ${this.escapeHtml(item.title)}
                  </label>
                  <span class="shift-item-badge">${this.escapeHtml(item.badge || item.category || 'Status')}</span>
                </div>
                <p style="margin:0.35rem 0 0.5rem; font-size:0.82rem; color:#475569; line-height:1.45;">
                  ${this.escapeHtml(item.description)}
                </p>
                <div style="margin-top:0.4rem;">
                  <input type="text" 
                         class="shift-item-note-input" 
                         placeholder="Egna anteckningar / värden för denna punkt..." 
                         value="${this.escapeHtml(item.notes || '')}" 
                         onchange="app.setShiftChecklistNote('${item.id}', this.value)" />
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  toggleShiftChecklistItem(id) {
    const item = (this.shiftChecklist || []).find(x => x.id === id);
    if (!item) return;
    item.checked = !item.checked;
    this.saveShiftChecklist();
    this.renderShiftChecklistModal();
  }

  setShiftChecklistNote(id, note) {
    const item = (this.shiftChecklist || []).find(x => x.id === id);
    if (!item) return;
    item.notes = note;
    this.saveShiftChecklist();
  }

  resetShiftChecklist() {
    if (!confirm("Vill du nollställa hela checklistan inför ett nytt arbetspass?")) return;
    const template = typeof SHIFT_CHECKLIST_TEMPLATE !== "undefined" ? SHIFT_CHECKLIST_TEMPLATE : [];
    this.shiftChecklist = template.map(item => ({
      ...item,
      checked: false,
      notes: ""
    }));
    this.saveShiftChecklist();
    this.renderShiftChecklistModal();
    this.showToast("Checklistan är nollställd för nytt pass");
  }

  copyShiftReportToClipboard() {
    const items = this.shiftChecklist || [];
    const dateStr = new Date().toLocaleString('sv-SE');
    let text = `📋 IVA ÖSTRA - ÖVERLÄMNINGSRAPPORT (Start av arbetspass)\nDatum & Tid: ${dateStr}\n\n`;

    items.forEach(it => {
      const statusMark = it.checked ? "[X]" : "[ ]";
      text += `${statusMark} ${it.number}. ${it.title}\n`;
      if (it.notes && it.notes.trim()) {
        text += `    Anteckning: ${it.notes.trim()}\n`;
      }
    });

    const checkedCount = items.filter(x => x.checked).length;
    text += `\nStatus: ${checkedCount} av ${items.length} punkter genomgångna.`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        this.showToast("Skiftrapport kopierad till urklipp!");
      }).catch(() => {
        this.fallbackCopyText(text);
      });
    } else {
      this.fallbackCopyText(text);
    }
  }

  fallbackCopyText(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    this.showToast("Skiftrapport kopierad!");
  }

  // =========================================================================
  // IVA POCKETGUIDE HELSKÄRMSVISARE
  // =========================================================================

  openPocketguideModal() {
    const modal = document.getElementById("pocketguideModal");
    if (!modal) return;
    const body = modal.querySelector(".modal-dialog");
    if (body && !document.getElementById("pocketguideImg")) {
      body.innerHTML = `
        <div style="display:flex; flex-direction:column; height:100%; overflow:hidden;">
          <div style="padding:0.75rem 1.25rem; background:#0f172a; color:#f8fafc; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-bottom:1px solid #334155;">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <span style="font-size:1.1rem;">📖</span>
              <span style="font-weight:800; font-size:1.05rem;">IVA Pocketguide</span>
              <span style="font-size:0.75rem; background:#334155; padding:2px 8px; border-radius:12px; color:#94a3b8;">Högupplöst vy</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <button class="reader-control-btn" onclick="app.zoomPocketguide(0.8)" title="Zooma ut" style="color:#ffffff; background:#1e293b; border:1px solid #475569; padding:4px 10px; font-weight:700;">- Zooma</button>
              <button class="reader-control-btn" onclick="app.zoomPocketguide(1.2)" title="Zooma in" style="color:#ffffff; background:#1e293b; border:1px solid #475569; padding:4px 10px; font-weight:700;">+ Zooma</button>
              <button class="reader-control-btn" onclick="app.zoomPocketguide('fit')" title="Anpassa till skärm" style="color:#ffffff; background:#1e293b; border:1px solid #475569; padding:4px 10px; font-size:0.75rem;">Anpassa</button>
              <a href="IVA_pocketguide.pdf" download="IVA_pocketguide.pdf" class="btn-header-secondary" style="color:#ffffff; border-color:#475569; font-size:0.8rem; text-decoration:none; display:inline-flex; align-items:center; gap:0.35rem; padding:4px 10px;">
                📥 Ladda ner PDF
              </a>
              <button class="modal-close-btn" data-close-modal title="Stäng" style="color:#ffffff; margin-left:0.5rem;">✖</button>
            </div>
          </div>
          <div id="pocketguideScrollWrap" style="flex:1; overflow:auto; background:#1e293b; display:flex; justify-content:center; align-items:flex-start; padding:1.5rem;">
            <img id="pocketguideImg" src="iva_pocketguide.png" alt="IVA Pocketguide" style="max-width:100%; height:auto; border-radius:8px; box-shadow:0 15px 35px rgba(0,0,0,0.6); transition:transform 0.15s ease;" />
          </div>
        </div>
      `;
      const closeBtn = body.querySelector(".modal-close-btn");
      if (closeBtn) closeBtn.onclick = () => this.closePocketguideModal();
    }
    modal.classList.add("is-open");
  }

  closePocketguideModal() {
    const modal = document.getElementById("pocketguideModal");
    if (modal) modal.classList.remove("is-open");
  }

  zoomPocketguide(factor) {
    const img = document.getElementById("pocketguideImg");
    if (!img) return;
    if (factor === 'fit') {
      img.style.maxWidth = '100%';
      img.style.width = 'auto';
      return;
    }
    img.style.maxWidth = 'none';
    const currW = img.offsetWidth || 1200;
    img.style.width = `${Math.round(currW * factor)}px`;
  }

  printCurrentDocument() {
    window.print();
  }

  downloadDocument(docId) {
    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return;

    if (doc.fileDataUrl) {
      const a = document.createElement("a");
      a.href = doc.fileDataUrl;
      a.download = doc.filename || `${doc.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      this.showToast(`Laddar ner ${doc.filename}`);
      return;
    }

    // Generera nedladdningsbar text/html-fil för PM
    const blob = new Blob([doc.content || doc.description], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(doc.title || "dokument").replace(/[^a-zA-Z0-9åäöÅÄÖ_-]/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast(`Laddar ner dokument`);
  }

  togglePinDocument(docId) {
    if (!this.canUserEdit()) {
      this.showToast("Endast behöriga redaktörer kan nåla dokument 🔒");
      return;
    }

    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return;

    doc.isPinned = !doc.isPinned;
    this.saveDocumentToDb(doc).then(() => {
      this.updateDocumentDisplay();
      this.showToast(doc.isPinned ? "Dokument fastnålat överst" : "Dokument lösgjort");
    });
  }

  // =========================================================================
  // Ladda Upp Nytt Dokument (Upload Modal)
  // =========================================================================

  openUploadModal() {
    if (!this.canUserEdit()) {
      this.showToast("Kräver administratörs- eller redaktörsbehörighet 🔒");
      return;
    }

    const modal = document.getElementById("uploadModal");
    if (!modal) return;

    this.pendingUploadFile = null;
    document.getElementById("uploadForm").reset();

    // Förvälj aktuell kategori om användaren är inne på en specifik sida
    const catSelect = document.getElementById("uploadCategory");
    if (catSelect) {
      catSelect.value = this.activeCategory !== "ALL" ? this.activeCategory : "Respiration";
    }

    const pill = document.getElementById("fileSelectedPill");
    if (pill) pill.style.display = "none";

    modal.classList.add("is-open");
  }

  closeUploadModal() {
    const modal = document.getElementById("uploadModal");
    if (modal) modal.classList.remove("is-open");
    this.pendingUploadFile = null;
  }

  handleFileSelection(file) {
    if (!file) return;
    this.pendingUploadFile = file;

    const titleInput = document.getElementById("uploadTitle");
    if (titleInput && !titleInput.value.trim()) {
      // Ta bort filändelse och skapa en ren titel
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
      titleInput.value = cleanName;
    }

    const pill = document.getElementById("fileSelectedPill");
    const nameEl = document.getElementById("fileSelectedName");
    if (pill && nameEl) {
      nameEl.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
      pill.style.display = "inline-flex";
    }
  }

  async handleUploadSubmit(e) {
    e.preventDefault();

    if (!this.canUserEdit()) {
      alert("Åtgärd nekad: Du saknar behörighet att ladda upp dokument.");
      return;
    }

    const title = document.getElementById("uploadTitle").value.trim();
    const category = document.getElementById("uploadCategory").value;
    const priority = document.getElementById("uploadPriority").value;
    const tagsStr = document.getElementById("uploadTags").value;
    const description = document.getElementById("uploadDesc").value.trim();

    if (!title) {
      alert("Vänligen ange en titel för dokumentet.");
      return;
    }

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    let fileDataUrl = null;
    let filename = "protokoll.pdf";
    let size = 150000;
    let type = "application/pdf";

    if (this.pendingUploadFile) {
      filename = this.pendingUploadFile.name;
      size = this.pendingUploadFile.size;
      type = this.pendingUploadFile.type || "application/pdf";
      fileDataUrl = await this.readFileAsDataUrl(this.pendingUploadFile);
    }

    const newDoc = {
      id: "doc-user-" + Date.now(),
      title,
      category,
      priority,
      filename,
      type,
      size,
      tags,
      description,
      fileDataUrl,
      isPinned: false,
      dateAdded: new Date().toISOString(),
      content: `# ${title}\n\n**Kategori:** ${category}\n**Prioritet:** ${priority}\n\n${description}`
    };

    await this.saveDocumentToDb(newDoc);

    // Registrera och skicka notis om nytt dokument
    this.addNotification({
      type: "upload",
      docTitle: title,
      category,
      docId: newDoc.id
    });

    this.closeUploadModal();
    this.showToast(`Dokumentet har sparats till ${category}!`);

    // Navigera till kategorin och uppdatera vyn
    if (this.activeCategory !== category && this.activeCategory !== "ALL") {
      this.switchCategory(category);
    } else {
      this.updateDocumentDisplay();
    }
  }

  // =========================================================================
  // Redigera Dokument (Edit Modal)
  // =========================================================================

  openEditModal(docId) {
    if (!this.canUserEdit()) {
      this.showToast("Kräver administratörs- eller redaktörsbehörighet 🔒");
      return;
    }

    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return;
    this.currentEditingDoc = doc;

    const modal = document.getElementById("editModal");
    if (!modal) return;

    document.getElementById("editTitle").value = doc.title || "";
    document.getElementById("editCategory").value = doc.category || "Respiration";
    document.getElementById("editPriority").value = doc.priority || "Rutin";
    document.getElementById("editTags").value = (doc.tags || []).join(", ");
    document.getElementById("editDesc").value = doc.description || "";

    modal.classList.add("is-open");
  }

  closeEditModal() {
    const modal = document.getElementById("editModal");
    if (modal) modal.classList.remove("is-open");
    this.currentEditingDoc = null;
  }

  async handleEditSubmit(e) {
    e.preventDefault();
    if (!this.canUserEdit() || !this.currentEditingDoc) {
      alert("Åtgärd nekad: Du saknar behörighet att redigera detta dokument.");
      return;
    }

    const title = document.getElementById("editTitle").value.trim();
    const category = document.getElementById("editCategory").value;
    const priority = document.getElementById("editPriority").value;
    const tagsStr = document.getElementById("editTags").value;
    const description = document.getElementById("editDesc").value.trim();

    if (!title) {
      alert("Titel kan inte vara tom.");
      return;
    }

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    const updated = {
      ...this.currentEditingDoc,
      title,
      category,
      priority,
      tags,
      description
    };

    await this.saveDocumentToDb(updated);

    // Registrera och skicka notis om uppdaterat dokument
    this.addNotification({
      type: "edit",
      docTitle: title,
      category,
      docId: updated.id
    });

    this.closeEditModal();
    this.showToast("Dokumentet har uppdaterats!");
    this.updateDocumentDisplay();
  }

  confirmDeleteDocument(docId) {
    if (!this.canUserEdit()) {
      alert("Åtgärd nekad: Du saknar behörighet att ta bort dokument.");
      return;
    }

    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) return;

    if (confirm(`Är du säker på att du vill ta bort "${doc.title}"?`)) {
      this.deleteDocumentFromDb(docId).then(() => {
        this.updateDocumentDisplay();
        this.showToast("Dokumentet har tagits bort");
      });
    }
  }

  // =========================================================================
  // Säkerhetskopiering & Återställning
  // =========================================================================

  exportAllData() {
    const dataStr = JSON.stringify(this.documents, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IVA_Dokumenthub_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast("Säkerhetskopia har laddats ner!");
  }

  importDataFromFile(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedDocs = JSON.parse(e.target.result);
        if (Array.isArray(importedDocs)) {
          for (const doc of importedDocs) {
            await this.saveDocumentToDb(doc);
          }
          await this.loadDocuments();
          this.updateDocumentDisplay();
          this.showToast(`Återställde ${importedDocs.length} dokument framgångsrikt!`);
        } else {
          alert("Ogiltig backupfil.");
        }
      } catch (err) {
        alert("Kunde inte läsa backupfilen: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  // =========================================================================
  // Hjälpmetoder & Händelselyssnare
  // =========================================================================

  setupEventListeners() {
    // Global sök-knapp i topphuvud
    const btnTopSearch = document.getElementById("btnTopGlobalSearch");
    if (btnTopSearch) {
      btnTopSearch.addEventListener("click", () => this.openGlobalSearchModal());
    }

    // Inputfält i Global Sök-modal
    const globalInput = document.getElementById("globalSearchModalInput");
    if (globalInput) {
      globalInput.addEventListener("input", (e) => {
        this.executeGlobalSearch(e.target.value);
      });
    }

    // Modal stängningsknappar
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetModal = btn.closest(".modal-backdrop");
        if (targetModal) targetModal.classList.remove("is-open");
      });
    });

    // Stäng med klick utanför modal-dialog
    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove("is-open");
        }
      });
    });

    // Upload formulär
    const uploadForm = document.getElementById("uploadForm");
    if (uploadForm) {
      uploadForm.addEventListener("submit", (e) => this.handleUploadSubmit(e));
    }

    // Edit formulär
    const editForm = document.getElementById("editForm");
    if (editForm) {
      editForm.addEventListener("submit", (e) => this.handleEditSubmit(e));
    }

    // Drag and Drop zon i Upload modal
    const dropzone = document.getElementById("uploadDropzone");
    const fileInput = document.getElementById("uploadFileInput");

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          this.handleFileSelection(e.target.files[0]);
        }
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.add("dragover");
        });
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.remove("dragover");
        });
      });

      dropzone.addEventListener("drop", (e) => {
        if (e.dataTransfer.files.length > 0) {
          this.handleFileSelection(e.dataTransfer.files[0]);
        }
      });
    }

    // Backup-knapp
    const btnBackup = document.getElementById("btnBackupData");
    if (btnBackup) {
      btnBackup.addEventListener("click", () => this.exportAllData());
    }

    const backupFileInput = document.getElementById("backupFileInput");
    if (backupFileInput) {
      backupFileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
          this.importDataFromFile(e.target.files[0]);
        }
      });
    }

    // Google Inloggningsformulär
    const customGoogleForm = document.getElementById("customGoogleLoginForm");
    if (customGoogleForm) {
      customGoogleForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("customGoogleName").value.trim();
        const email = document.getElementById("customGoogleEmail").value.trim();
        if (name && email) {
          this.promptAccountLogin(name, email);
          customGoogleForm.reset();
        }
      });
    }

    // Enter-tangent för admin-lösenordsfält
    const adminPasswordInput = document.getElementById("adminPasswordInput");
    if (adminPasswordInput) {
      adminPasswordInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.submitAdminLogin();
        }
      });
    }

    // Inbjudningsformulär för nya redaktörer
    const inviteForm = document.getElementById("inviteEditorForm");
    if (inviteForm) {
      inviteForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleInviteEditorSubmit();
      });
    }

    // Klick utanför notis-dropdown stänger panelen
    document.addEventListener("click", (e) => {
      if (this.notificationDropdownOpen) {
        const wrapper = document.getElementById("notificationCenterWrapper");
        if (wrapper && !wrapper.contains(e.target)) {
          this.closeNotificationDropdown();
        }
      }
    });
  }

  setupGlobalKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      // Ctrl+K eller Cmd+K öppnar Global Sök
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        this.openGlobalSearchModal();
      }
      // Escape stänger öppna modaler, notis-dropdown och FAB-menyn
      if (e.key === "Escape") {
        if (this.notificationDropdownOpen) {
          this.closeNotificationDropdown();
        }
        document.querySelectorAll(".modal-backdrop.is-open").forEach((m) => {
          m.classList.remove("is-open");
        });
        if (this.fabMenuOpen) {
          this.closeFabMenu();
        }
      }
    });

    // Klick utanför stänger FAB-menyn
    document.addEventListener("click", (e) => {
      if (!this.fabMenuOpen) return;
      if (e.target && e.target.closest && e.target.closest("#floatingMenuContainer")) {
        return;
      }
      this.closeFabMenu();
    });
  }

  readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  }

  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1000) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>✓</span><span>${this.escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      toast.style.transition = "all 0.25s";
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }

  renderMarkdownToHtml(md) {
    if (!md) return "";

    const lines = md.split(/\r?\n/);
    let htmlParts = [];
    let inTable = false;
    let tableHeaders = [];
    let tableRows = [];
    let inAlert = false;
    let alertType = "";
    let alertLines = [];
    let inList = false;

    const flushTable = () => {
      if (!inTable) return;
      let tblHtml = '<div class="reader-table-wrap"><table class="reader-table">';
      if (tableHeaders.length > 0) {
        tblHtml += '<thead><tr>' + tableHeaders.map(h => `<th>${h}</th>`).join('') + '</tr></thead>';
      }
      tblHtml += '<tbody>';
      for (const row of tableRows) {
        tblHtml += '<tr>' + row.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
      tblHtml += '</tbody></table></div>';
      htmlParts.push(tblHtml);
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    };

    const flushAlert = () => {
      if (!inAlert) return;
      const alertHtml = `<div class="reader-alert ${alertType}"><div class="reader-alert-content">${alertLines.join('<br>')}</div></div>`;
      htmlParts.push(alertHtml);
      inAlert = false;
      alertType = "";
      alertLines = [];
    };

    const flushList = () => {
      if (!inList) return;
      htmlParts.push('</ul>');
      inList = false;
    };

    const formatInline = (text) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
    };

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Check for table row
      if (line.startsWith('|') && line.endsWith('|')) {
        flushList();
        flushAlert();
        const cells = line.split('|').slice(1, -1).map(c => formatInline(c.trim()));
        if (cells.every(c => /^:?-+:?$/.test(c))) {
          continue; // separator line |---|---|
        }
        if (!inTable) {
          inTable = true;
          tableHeaders = cells;
        } else {
          tableRows.push(cells);
        }
        continue;
      } else if (inTable) {
        flushTable();
      }

      // Check for GitHub alert callout
      const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
      if (alertMatch) {
        flushList();
        flushAlert();
        inAlert = true;
        alertType = alertMatch[1].toLowerCase();
        continue;
      } else if (inAlert && line.startsWith('>')) {
        alertLines.push(formatInline(line.replace(/^>\s*/, '')));
        continue;
      } else if (inAlert) {
        flushAlert();
      }

      // Lists
      if (/^[-*]\s+/.test(line)) {
        if (!inList) {
          inList = true;
          htmlParts.push('<ul class="reader-list">');
        }
        htmlParts.push(`<li>${formatInline(line.replace(/^[-*]\s+/, ''))}</li>`);
        continue;
      } else if (inList) {
        flushList();
      }

      // Headings
      if (line.startsWith('#### ')) {
        htmlParts.push(`<h4>${formatInline(line.substring(5))}</h4>`);
        continue;
      }
      if (line.startsWith('### ')) {
        htmlParts.push(`<h3>${formatInline(line.substring(4))}</h3>`);
        continue;
      }
      if (line.startsWith('## ')) {
        htmlParts.push(`<h2>${formatInline(line.substring(3))}</h2>`);
        continue;
      }
      if (line.startsWith('# ')) {
        htmlParts.push(`<h1>${formatInline(line.substring(2))}</h1>`);
        continue;
      }

      // Horizontal rule
      if (/^---+$|^===+$/.test(line)) {
        htmlParts.push('<hr class="reader-divider" />');
        continue;
      }

      if (!line) continue;

      htmlParts.push(`<p>${formatInline(line)}</p>`);
    }

    flushTable();
    flushAlert();
    flushList();

    return htmlParts.join('\n');
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Skapa global instans
const app = new IvaDocApp();
window.app = app;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    app.init();
  });
} else {
  app.init();
}
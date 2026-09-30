/* =========================================================
   APPLICATION CONTROLLER
========================================================= */


/* =========================================================
   INPUT OLEH TERAKHIR
========================================================= */

const LAST_INPUT_BY_KEY =
  "kas_rt_last_input_by";


function loadLastInputBy() {

  return (
    localStorage.getItem(
      LAST_INPUT_BY_KEY
    ) || ""
  );
}


function saveLastInputBy(
  value
) {

  const nama =
    String(
      value || ""
    ).trim();


  if (nama) {

    localStorage.setItem(
      LAST_INPUT_BY_KEY,
      nama
    );
  }
}


function setupLastInputBy() {

  const inputOleh =
    document.getElementById(
      "pOleh"
    );


  if (!inputOleh) {
    return;
  }


  const lastInputBy =
    loadLastInputBy();


  if (
    lastInputBy &&
    !inputOleh.value.trim()
  ) {

    inputOleh.value =
      lastInputBy;
  }
}


/* =========================================================
   LOAD DATA
========================================================= */

async function load() {

  if (loadingData) {
    return;
  }


  loadingData = true;


  try {

    const data =
      await api(
        "/api/data"
      );


    state =
      data;


    refresh();

  } finally {

    loadingData = false;
  }
}


/* =========================================================
   REFRESH APPLICATION
========================================================= */

function refresh() {

  const pemasukan =
    state.kas.reduce(
      (total, item) =>
        total +
        Number(
          item.total || 0
        ),
      0
    );


  const pengeluaran =
    state.pengeluaran.reduce(
      (total, item) =>
        total +
        Number(
          item.jumlah || 0
        ),
      0
    );




  /* =========================
     TABEL WARGA
  ========================== */

  wTable.innerHTML =
    state.warga
      .map(
        (x, i) => `

          <tr>

            <td>
              ${esc(x.nama)}
            </td>

            <td>
              ${esc(x.blok)}
            </td>

            <td>
              ${esc(x.hp)}
            </td>

            <td>
              ${esc(x.status)}
            </td>

            <td>

              <button
                class="danger"
                onclick="delWarga(${i})"
              >
                Hapus
              </button>

            </td>

          </tr>

        `
      )
      .join("");


  /* =========================
     PILIHAN WARGA
  ========================== */

  kNama.innerHTML =
    state.warga
      .map(
        x =>
          `<option>${esc(
            x.nama
          )}</option>`
      )
      .join("");


  renderSearch();

  renderRekap();
}


/* =========================================================
   DATA LOADING STATE
========================================================= */

function showDataLoading() {

  let overlay =
    document.getElementById(
      "dataLoadingOverlay"
    );


  if (overlay) {
    return;
  }


  overlay =
    document.createElement(
      "div"
    );


  overlay.id =
    "dataLoadingOverlay";


  overlay.className =
    "data-loading-overlay";


  overlay.innerHTML = `
    <div class="data-loading-box">

      <div class="data-loading-spinner"></div>

      <h3 class="data-loading-title">
        Memuat data...
      </h3>

      <p class="data-loading-text">
        Mengambil data terbaru dari server.<br>
        Mohon tunggu sebentar.
      </p>

    </div>
  `;


  document.body.appendChild(
    overlay
  );
}


function hideDataLoading() {

  const overlay =
    document.getElementById(
      "dataLoadingOverlay"
    );


  if (overlay) {

    overlay.remove();
  }
}


function showDataLoadingError(
  error
) {

  let overlay =
    document.getElementById(
      "dataLoadingOverlay"
    );


  if (!overlay) {

    showDataLoading();

    overlay =
      document.getElementById(
        "dataLoadingOverlay"
      );
  }


  const box =
    overlay.querySelector(
      ".data-loading-box"
    );


  if (!box) {
    return;
  }


  box.innerHTML = `
    <h3 class="data-loading-title">
      Data belum dapat dimuat
    </h3>

    <p class="data-loading-text">
      Data dari server belum berhasil diambil.
      Login tetap dipertahankan.
    </p>

    <div class="data-loading-error">
      ${
        error?.message ||
        "Terjadi gangguan saat mengambil data."
      }
    </div>

    <button
      type="button"
      class="data-loading-retry"
      onclick="retryLoadData()"
    >
      Coba Lagi
    </button>
  `;
}


async function retryLoadData() {

  showDataLoading();


  try {

    await load();

    hideDataLoading();

  } catch (error) {

    console.error(
      "Retry load data gagal:",
      error
    );


    showDataLoadingError(
      error
    );
  }
}


/* =========================================================
   NAVIGASI TAB
========================================================= */

document
  .querySelectorAll(
     ".nav-menu button"
  )
  .forEach(
    button => {

      button.onclick = () => {

        document
          .querySelectorAll(
            "nav button"
          )
          .forEach(
            x =>
              x.classList.remove(
                "active"
              )
          );


        button.classList.add(
          "active"
        );


        document
          .querySelectorAll(
            ".section"
          )
          .forEach(
            x =>
              x.classList.remove(
                "active"
              )
          );


       const targetSection =
           document.getElementById(
             button.dataset.tab
           );
         
         targetSection.classList.add(
           "active"
         );
         
         focusFirstField(
           targetSection
         );
      };

    }
  );

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const mobileNavToggle =
  document.querySelector(
    ".mobile-nav-toggle"
  );

const navMenu =
  document.getElementById(
    "adminNavMenu"
  );


if (
  mobileNavToggle &&
  navMenu
) {

  mobileNavToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        navMenu.classList.toggle(
          "open"
        );

      mobileNavToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

    }
  );


  navMenu
    .querySelectorAll("button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          navMenu.classList.remove(
            "open"
          );

          mobileNavToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });

}

/* =========================================================
   TEMA TAMPILAN
========================================================= */

const THEME_KEY =
  "kas_rt_admin_theme";

const AVAILABLE_THEMES = [
  "blue",
  "dark",
  "green"
];


function applyTheme(theme) {

  const selectedTheme =
    AVAILABLE_THEMES.includes(theme)
      ? theme
      : "blue";

  document.body.dataset.theme =
    selectedTheme;

  localStorage.setItem(
    THEME_KEY,
    selectedTheme
  );

  document
    .querySelectorAll(
      "[data-theme-option]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.themeOption ===
          selectedTheme
      );

    });
}


function setupTheme() {

  const savedTheme =
    localStorage.getItem(
      THEME_KEY
    ) || "blue";

  applyTheme(savedTheme);

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-theme-option]"
        );

      if (!button) {
        return;
      }

      applyTheme(
        button.dataset.themeOption
      );

    }
  );
}
/* =========================================================
   INISIALISASI
========================================================= */

const today =
  getTodayLocal();


kTanggal.value =
  today;


pTanggal.value =
  today;


pJumlah.addEventListener(
  "input",
  () => {

    pJumlah.value =
      formatNominalInput(
        pJumlah.value
      );

  }
);


setupLastInputBy();

setupPeriodeKas();

setupTheme();


/*
 * Jika token login masih ada,
 * tampilkan aplikasi dan ambil data.
 */

if (DEV_MODE || token) {

  show();

  if (!DEV_MODE) {

    setupAutoLogout();

  }

  showDataLoading();

  load()
    .then(() => {

      hideDataLoading();

    })
    .catch(
      error => {

        console.error(
          "Gagal memuat data:",
          error
        );

        showDataLoadingError(
          error
        );

      }
    );

}

/* =========================================================
   NAVIGASI FORM DENGAN ENTER
========================================================= */

document.addEventListener("keydown", event => {

  if (event.key !== "Enter") {
    return;
  }

  const active = document.activeElement;

  if (
    !active ||
    !active.matches("input, select, textarea")
  ) {
    return;
  }

  const section = active.closest(".section");

  if (!section) {
    return;
  }

  const fields = Array.from(
    section.querySelectorAll(
      "input:not([type='hidden']), select, textarea"
    )
  ).filter(
    field =>
      !field.disabled &&
      field.offsetParent !== null
  );

  const currentIndex = fields.indexOf(active);

  if (currentIndex === -1) {
    return;
  }

  const nextField = fields[currentIndex + 1];

  if (!nextField) {
    return;
  }

  event.preventDefault();
  nextField.focus();

});

/* =========================================================
   AUTO FOCUS KOLOM PERTAMA
========================================================= */

function focusFirstField(section) {

  if (!section) {
    return;
  }

  const firstField =
    section.querySelector(
      "input:not([type='hidden']), select, textarea"
    );

  if (
    firstField &&
    !firstField.disabled &&
    firstField.offsetParent !== null
  ) {
    firstField.focus();
  }
}

/* =========================================================
   REKAP TRANSAKSI
========================================================= */

let rekapArusKasChart = null;
let rekapKategoriChart = null;

function getMonthKey(tanggal) {

  const value = String(tanggal || "").trim();

  // Format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value.slice(0, 7);
  }

  // Format DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {

    const [day, month, year] =
      value.split("/");

    return `${year}-${month}`;
  }

  return "";
}

/* =========================================================
   RENDER REKAP
========================================================= */

function renderRekap() {

  const totalPemasukan =
    state.kas.reduce(
      (total, item) =>
        total +
        Number(
          item.total || 0
        ),
      0
    );


  const totalPengeluaran =
    state.pengeluaran.reduce(
      (total, item) =>
        total +
        Number(
          item.jumlah || 0
        ),
      0
    );


  const sisaKas =
    totalPemasukan -
    totalPengeluaran;


  /* =========================
     SUMMARY
  ========================== */

  const rekapPemasukan =
    document.getElementById(
      "rekapPemasukan"
    );

  const rekapPengeluaran =
    document.getElementById(
      "rekapPengeluaran"
    );

  const rekapSaldo =
    document.getElementById(
      "rekapSaldo"
    );


  if (rekapPemasukan) {
    rekapPemasukan.textContent =
      rp(totalPemasukan);
  }


  if (rekapPengeluaran) {
    rekapPengeluaran.textContent =
      rp(totalPengeluaran);
  }


  if (rekapSaldo) {
    rekapSaldo.textContent =
      rp(sisaKas);
  }


  /* =========================
     INSIGHT
  ========================== */

  const jumlahTransaksi =
    state.kas.length +
    state.pengeluaran.length;


  const rataPemasukan =
    state.kas.length
      ? totalPemasukan /
        state.kas.length
      : 0;


  const rataPengeluaran =
    state.pengeluaran.length
      ? totalPengeluaran /
        state.pengeluaran.length
      : 0;

   /* =========================
   RASIO PENGELUARAN
========================== */

const rasioPengeluaran =
  totalPemasukan > 0
    ? (totalPengeluaran /
        totalPemasukan) * 100
    : 0;


  const kategoriTotal = {};


  state.pengeluaran.forEach(
    item => {

      const kategori =
        String(
          item.kategori ||
          "Lain-lain"
        ).trim();


      if (!kategoriTotal[kategori]) {
        kategoriTotal[kategori] = 0;
      }


      kategoriTotal[kategori] +=
        Number(
          item.jumlah || 0
        );

    }
  );


  const kategoriTerbesar =
    Object.entries(
      kategoriTotal
    )
      .sort(
        (a, b) =>
          b[1] - a[1]
      )[0];


  const elTransaksi =
    document.getElementById(
      "rekapTransaksi"
    );

  const elRataPemasukan =
    document.getElementById(
      "rekapRataPemasukan"
    );

  const elRataPengeluaran =
    document.getElementById(
      "rekapRataPengeluaran"
    );

  const elKategoriTerbesar =
    document.getElementById(
      "rekapKategoriTerbesar"
    );


  if (elTransaksi) {
    elTransaksi.textContent =
      jumlahTransaksi;
  }


  if (elRataPemasukan) {
    elRataPemasukan.textContent =
      rp(rataPemasukan);
  }


  if (elRataPengeluaran) {
    elRataPengeluaran.textContent =
      rp(rataPengeluaran);
  }

   const elRasioPengeluaran =
  document.getElementById(
    "rekapRasioPengeluaran"
  );

if (elRasioPengeluaran) {

  elRasioPengeluaran.textContent =
    rasioPengeluaran
      .toFixed(1) + "%";

}

  if (elKategoriTerbesar) {

    elKategoriTerbesar.textContent =
      kategoriTerbesar
        ? `${kategoriTerbesar[0]} — ${rp(kategoriTerbesar[1])}`
        : "-";

  }

/* =========================
   RINGKASAN BULANAN
========================== */

const semuaTransaksi = [

  ...state.kas.map(item => ({
    tanggal: item.tanggal
  })),

  ...state.pengeluaran.map(item => ({
    tanggal: item.tanggal
  }))

].sort(
  (a, b) =>
    b.tanggal.localeCompare(
      a.tanggal
    )
);


const bulanAktif =
  semuaTransaksi.length
    ? String(
        semuaTransaksi[0].tanggal
      ).slice(0, 7)
    : "";


let bulanPemasukan = 0;
let bulanPengeluaran = 0;

let bulanTransaksi = 0;


/* Pemasukan bulan aktif */

state.kas.forEach(item => {

  if (
    String(item.tanggal)
      .slice(0, 7) === bulanAktif
  ) {

    bulanPemasukan +=
      Number(item.total || 0);

    bulanTransaksi++;

  }

});


/* Pengeluaran bulan aktif */

state.pengeluaran.forEach(item => {

  if (
    String(item.tanggal)
      .slice(0, 7) === bulanAktif
  ) {

    bulanPengeluaran +=
      Number(item.jumlah || 0);

    bulanTransaksi++;

  }

});


const bulanSaldo =
  bulanPemasukan -
  bulanPengeluaran;


/* Format nama bulan */

const namaBulan = [

  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"

];


let namaBulanAktif = "-";


if (bulanAktif) {

  const bagian =
    bulanAktif.split("-");

  const tahun =
    bagian[0];

  const nomorBulan =
    Number(bagian[1]);

  namaBulanAktif =
    `${namaBulan[nomorBulan - 1]} ${tahun}`;

}


/* Masukkan ke HTML */

const elBulan =
  document.getElementById(
    "rekapBulan"
  );

const elBulanPemasukan =
  document.getElementById(
    "rekapBulanPemasukan"
  );

const elBulanPengeluaran =
  document.getElementById(
    "rekapBulanPengeluaran"
  );

const elBulanSaldo =
  document.getElementById(
    "rekapBulanSaldo"
  );

const elBulanTransaksi =
  document.getElementById(
    "rekapBulanTransaksi"
  );


if (elBulan) {
  elBulan.textContent =
    namaBulanAktif;
}


if (elBulanPemasukan) {
  elBulanPemasukan.textContent =
    rp(bulanPemasukan);
}


if (elBulanPengeluaran) {
  elBulanPengeluaran.textContent =
    rp(bulanPengeluaran);
}


if (elBulanSaldo) {
  elBulanSaldo.textContent =
    rp(bulanSaldo);
}


if (elBulanTransaksi) {
  elBulanTransaksi.textContent =
    bulanTransaksi;
}
  /* =========================
     TABEL
  ========================== */

  const rekap = [

    ...state.kas.map(
      x => ({

        id:
          x.id,

        tanggal:
          x.tanggal,

        jenis:
          "Kas",

        nama:
          x.nama,

        jumlah:
          x.total,

        ket:
          x.keterangan

      })
    ),


    ...state.pengeluaran.map(
      x => ({

        id:
          x.id,

        tanggal:
          x.tanggal,

        jenis:
          "Pengeluaran",

        nama:
          x.kategori,

        jumlah:
          x.jumlah,

        ket:
          x.keterangan

      })
    )

  ].sort(
    (a, b) =>
      b.tanggal.localeCompare(
        a.tanggal
      )
  );


  rTable.innerHTML =
    rekap
      .map(
        x => `

          <tr>

            <td>
              ${formatTanggal(x.tanggal)}
            </td>

            <td>
              ${x.jenis}
            </td>

            <td>
              ${esc(x.nama)}
            </td>

            <td>
              ${rp(x.jumlah)}
            </td>

            <td>
              ${esc(x.ket)}
            </td>

            <td>

              <button
                type="button"
                class="danger"
                onclick="${
                  x.jenis === "Kas"
                    ? `delKas('${esc(x.id)}')`
                    : `delPengeluaran('${esc(x.id)}')`
                }"
              >
                Hapus
              </button>

            </td>

          </tr>

        `
      )
      .join("");


  /* =========================
     GRAFIK
  ========================== */

  renderRekapCharts(
    state.kas,
    state.pengeluaran
  );

}


/* =========================================================
   GRAFIK REKAP
========================================================= */

function renderRekapCharts(
  kas,
  pengeluaran
) {

  if (
    typeof Chart ===
    "undefined"
  ) {
    return;
  }


  /* =========================
     DATA BULANAN
  ========================== */

  const monthly = {};


  kas.forEach(
    item => {

      const bulan =
        String(
          item.tanggal || ""
        ).slice(0, 7);


      if (!bulan) {
        return;
      }


      if (!monthly[bulan]) {

        monthly[bulan] = {
          pemasukan: 0,
          pengeluaran: 0
        };

      }


      monthly[bulan].pemasukan +=
        Number(
          item.total || 0
        );

    }
  );


  pengeluaran.forEach(
    item => {

      const bulan =
        String(
          item.tanggal || ""
        ).slice(0, 7);


      if (!bulan) {
        return;
      }


      if (!monthly[bulan]) {

        monthly[bulan] = {
          pemasukan: 0,
          pengeluaran: 0
        };

      }


      monthly[bulan].pengeluaran +=
        Number(
          item.jumlah || 0
        );

    }
  );


  const months =
    Object.keys(monthly)
      .sort();


  const labels =
    months.map(
      month => {

        const [year, monthNumber] =
          month.split("-");

        const names = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des"
        ];

        return (
          names[
            Number(monthNumber) - 1
          ] +
          " " +
          year
        );

      }
    );


  /* =========================
     ARUS KAS
  ========================== */

  const arusKasCanvas =
    document.getElementById(
      "rekapArusKasChart"
    );


  if (arusKasCanvas) {

    if (rekapArusKasChart) {
      rekapArusKasChart.destroy();
    }


    rekapArusKasChart =
      new Chart(
        arusKasCanvas,
        {

          type: "bar",

          data: {

            labels,

            datasets: [

              {
                label:
                  "Pemasukan",

                data:
                  months.map(
                    m =>
                      monthly[m]
                        .pemasukan
                  ),

                backgroundColor:
                  "#22c55e",

                borderRadius: 6
              },

              {
                label:
                  "Pengeluaran",

                data:
                  months.map(
                    m =>
                      monthly[m]
                        .pengeluaran
                  ),

                backgroundColor:
                  "#ef4444",

                borderRadius: 6
              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio:
              false,

            plugins: {

              tooltip: {

                callbacks: {

                  label:
                    context =>
                      `${context.dataset.label}: ${rp(context.raw)}`

                }

              }

            },

            scales: {

              y: {

                beginAtZero: true,

                ticks: {

                  callback:
                    value =>
                      rp(value)

                }

              }

            }

          }

        }
      );

  }


  /* =========================
     KATEGORI PENGELUARAN
  ========================== */

  const kategoriTotal = {};


  pengeluaran.forEach(
    item => {

      const kategori =
        String(
          item.kategori ||
          "Lain-lain"
        ).trim();


      if (!kategoriTotal[kategori]) {
        kategoriTotal[kategori] = 0;
      }


      kategoriTotal[kategori] +=
        Number(
          item.jumlah || 0
        );

    }
  );


  const kategoriSorted =
    Object.entries(
      kategoriTotal
    )
      .sort(
        (a, b) =>
          b[1] - a[1]
      );


  const kategoriLabels =
    kategoriSorted.map(
      x => x[0]
    );


  const kategoriValues =
    kategoriSorted.map(
      x => x[1]
    );


  const kategoriCanvas =
    document.getElementById(
      "rekapKategoriChart"
    );


  if (kategoriCanvas) {

    if (rekapKategoriChart) {
      rekapKategoriChart.destroy();
    }


    rekapKategoriChart =
      new Chart(
        kategoriCanvas,
        {

          type: "bar",

          data: {

            labels:
              kategoriLabels,

            datasets: [

              {
                label:
                  "Pengeluaran",

                data:
                  kategoriValues,

                backgroundColor:
                  "#ef4444",

                borderRadius: 6
              }

            ]

          },

          options: {

            indexAxis: "y",

            responsive: true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {
                display: false
              },

              tooltip: {

                callbacks: {

                  label:
                    context =>
                      rp(context.raw)

                }

              }

            },

            scales: {

              x: {

                beginAtZero: true,

                ticks: {

                  callback:
                    value =>
                      rp(value)

                }

              }

            }

          }

        }
      );

  }

}

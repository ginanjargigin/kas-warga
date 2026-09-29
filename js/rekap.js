/* =========================================================
   REKAP TRANSAKSI
========================================================= */

let rekapArusKasChart = null;
let rekapKategoriChart = null;


/* =========================================================
   NORMALISASI TANGGAL
========================================================= */

function getDateKey(tanggal) {

  const value =
    String(tanggal || "").trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {

    const [day, month, year] =
      value.split("/");

    return `${year}-${month}-${day}`;
  }

  return "";
}


function getMonthKey(tanggal) {

  const dateKey =
    getDateKey(tanggal);

  return dateKey
    ? dateKey.slice(0, 7)
    : "";
}


/* =========================================================
   RENDER REKAP
========================================================= */

function renderRekap() {

  const totalPemasukan =
    state.kas.reduce(
      (total, item) =>
        total +
        Number(item.total || 0),
      0
    );


  const totalPengeluaran =
    state.pengeluaran.reduce(
      (total, item) =>
        total +
        Number(item.jumlah || 0),
      0
    );


  const sisaKas =
    totalPemasukan -
    totalPengeluaran;


  /* =========================
     SUMMARY UTAMA
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
     BULAN AKTIF
  ========================== */

  const semuaTanggal = [

    ...state.kas.map(
      item =>
        getDateKey(item.tanggal)
    ),

    ...state.pengeluaran.map(
      item =>
        getDateKey(item.tanggal)
    )

  ]
    .filter(Boolean)
    .sort()
    .reverse();


  const bulanAktif =
    semuaTanggal.length
      ? semuaTanggal[0].slice(0, 7)
      : "";


  /* =========================
     DATA BULAN AKTIF
  ========================== */

  const kasBulanIni =
    state.kas.filter(
      item =>
        getMonthKey(item.tanggal)
        === bulanAktif
    );


  const pengeluaranBulanIni =
    state.pengeluaran.filter(
      item =>
        getMonthKey(item.tanggal)
        === bulanAktif
    );


  const bulanPemasukan =
    kasBulanIni.reduce(
      (total, item) =>
        total +
        Number(item.total || 0),
      0
    );


  const bulanPengeluaran =
    pengeluaranBulanIni.reduce(
      (total, item) =>
        total +
        Number(item.jumlah || 0),
      0
    );


  const bulanArusBersih =
    bulanPemasukan -
    bulanPengeluaran;


  /* =========================
     STATUS PEMBAYARAN WARGA
  ========================== */

  const jumlahWarga =
    state.warga.length;


  const wargaSudahBayar =
    new Set(
      kasBulanIni
        .map(
          item =>
            String(
              item.nama || ""
            ).trim()
        )
        .filter(Boolean)
    );


  const jumlahSudahBayar =
    wargaSudahBayar.size;


  const jumlahBelumBayar =
    Math.max(
      jumlahWarga -
      jumlahSudahBayar,
      0
    );


  /* =========================
     RASIO PENGELUARAN
  ========================== */

  const rasioPengeluaran =
    totalPemasukan > 0
      ? (
          totalPengeluaran /
          totalPemasukan
        ) * 100
      : 0;


  /* =========================
     KATEGORI TERBESAR
     BULAN AKTIF
  ========================== */

  const kategoriTotal = {};


  pengeluaranBulanIni.forEach(
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


  /* =========================
     INSIGHT
  ========================== */

  const elTransaksi =
    document.getElementById(
      "rekapTransaksi"
    );

  const elSudahBayar =
    document.getElementById(
      "rekapSudahBayar"
    );

  const elBelumBayar =
    document.getElementById(
      "rekapBelumBayar"
    );

  const elRasioPengeluaran =
    document.getElementById(
      "rekapRasioPengeluaran"
    );

  const elKategoriTerbesar =
    document.getElementById(
      "rekapKategoriTerbesar"
    );


  if (elTransaksi) {

    elTransaksi.textContent =
      state.kas.length +
      state.pengeluaran.length;

  }


  if (elSudahBayar) {

    elSudahBayar.textContent =
      `${jumlahSudahBayar} / ${jumlahWarga}`;

  }


  if (elBelumBayar) {

    elBelumBayar.textContent =
      `${jumlahBelumBayar} warga`;

  }


  if (elRasioPengeluaran) {

    elRasioPengeluaran.textContent =
      rasioPengeluaran.toFixed(1) +
      "%";

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

  const elBulan =
    document.getElementById(
      "rekapBulan"
    );

   const elPeriode =
  document.getElementById(
    "rekapPeriode"
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

    const [
      tahun,
      bulan
    ] =
      bulanAktif.split("-");


    namaBulanAktif =
      `${namaBulan[
        Number(bulan) - 1
      ]} ${tahun}`;

  }


  if (elBulan) {

    elBulan.textContent =
      namaBulanAktif;

  }

   if (elPeriode) {

  if (bulanAktif) {

    const [
      tahun,
      bulan
    ] =
      bulanAktif.split("-");

    const jumlahHari =
      new Date(
        Number(tahun),
        Number(bulan),
        0
      ).getDate();

    elPeriode.textContent =
      `Periode data: 1–${jumlahHari} ${namaBulan[Number(bulan) - 1]} ${tahun}`;

  } else {

    elPeriode.textContent =
      "Periode data: -";

  }

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
      rp(bulanArusBersih);

  }


  if (elBulanTransaksi) {

    elBulanTransaksi.textContent =
      `${jumlahSudahBayar} / ${jumlahWarga}`;

  }


  /* =========================
     TABEL
  ========================== */

  const rekap = [

    ...state.kas.map(
      x => ({

        id: x.id,

        tanggal: x.tanggal,

        jenis: "Kas",

        nama: x.nama,

        jumlah: x.total,

        ket: x.keterangan

      })
    ),


    ...state.pengeluaran.map(
      x => ({

        id: x.id,

        tanggal: x.tanggal,

        jenis: "Pengeluaran",

        nama: x.kategori,

        jumlah: x.jumlah,

        ket: x.keterangan

      })
    )

  ].sort(
    (a, b) =>
      getDateKey(b.tanggal)
        .localeCompare(
          getDateKey(a.tanggal)
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


  renderRekapCharts(
    state.kas,
    state.pengeluaran,
    bulanAktif
  );

}


/* =========================================================
   GRAFIK REKAP
========================================================= */

function renderRekapCharts(
  kas,
  pengeluaran,
  bulanAktif
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
        getMonthKey(
          item.tanggal
        );


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
        getMonthKey(
          item.tanggal
        );


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

        const [
          year,
          monthNumber
        ] =
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
     BULAN AKTIF
  ========================== */

  const kategoriTotal = {};


  pengeluaran

    .filter(
      item =>
        getMonthKey(item.tanggal)
        === bulanAktif
    )

    .forEach(
      item => {

        const kategori =
          String(
            item.kategori ||
            "Lain-lain"
          ).trim();


        if (!kategoriTotal[kategori]) {

          kategoriTotal[kategori] =
            0;

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
              kategoriSorted.map(
                x => x[0]
              ),

            datasets: [

              {

                label:
                  "Pengeluaran",

                data:
                  kategoriSorted.map(
                    x => x[1]
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

}

function prosesTransaksi(dataMentah) {
  let nama = dataMentah.namaSantri.trim().split(/\s+/);

  nama = nama
    .map((kata) => kata.charAt(0).toUpperCase() + kata.slice(1).toLowerCase())
    .join(" ");

  const totalSebelum = parseFloat(dataMentah.totalBelanja);

  let diskonPersen = 0;
  const kupon = (dataMentah.kodeKupon || "").toLowerCase();

  if (kupon.includes("diskon")) {
    const ekstrakAngka = kupon.match(/\d+/);
    if (ekstrakAngka) {
      diskonPersen = parseInt(ekstrakAngka[0], 10);
    }
  }

  const potongan = (diskonPersen / 100) * totalSebelum;
  const totalAkhir = totalSebelum - potongan;

  return {
    nama: nama,
    totalSebelumDiskon: totalSebelum,
    diskonPersen: diskonPersen,
    totalAkhir: totalAkhir.toFixed(2),
  };
}

function buatTabunganSantri(namaSantri, saldoAwal) {
  let saldo = saldoAwal;

  return {
    setor: function (jumlah) {
      const nominal = parseFloat(jumlah);
      if (nominal > 0) {
        saldo += nominal;
        console.log(
          `[Setor] ${namaSantri} berhasil menyetor. Saldo terbaru: Rp ${saldo.toFixed(2)}`,
        );
      } else {
        console.log(`[Setor Gagal] ${namaSantri}: Jumlah tidak valid.`);
      }
    },
    tarik: function (jumlah) {
      const nominal = parseFloat(jumlah);
      if (nominal > 0) {
        if (saldo >= nominal) {
          saldo -= nominal;
          console.log(
            `[Tarik] ${namaSantri} berhasil menarik. Saldo terbaru: Rp ${saldo.toFixed(2)}`,
          );
        } else {
          console.log(`[Tarik Gagal] ${namaSantri}: Saldo tidak mencukupi.`);
        }
      } else {
        console.log(`[Tarik Gagal] ${namaSantri}: Jumlah tidak valid.`);
      }
    },
    cekSaldo: function () {
      console.log(
        `[Info] Saldo ${namaSantri} saat ini: Rp ${saldo.toFixed(2)}`,
      );
      return saldo;
    },
  };
}

function catatTransaksi(namaSantri, nominal) {
  const sekarang = new Date();

  const tanggal = String(sekarang.getDate()).padStart(2, "0");
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const tahun = sekarang.getFullYear();

  const daftarHari = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const namaHari = daftarHari[sekarang.getDay()];

  return {
    nama: namaSantri,
    nominal: nominal,
    tanggal: `${tanggal}/${bulan}/${tahun}`,
    hari: namaHari,
  };
}

function hariMenujuJatuhTempo(tanggalJatuhTempo) {
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);
  const target = new Date(tanggalJatuhTempo);
  target.setHours(0, 0, 0, 0);

  const selisihWaktu = target.getTime() - hariIni.getTime();
  const selisihHari = Math.round(selisihWaktu / (1000 * 3600 * 24));

  if (selisihHari > 0) {
    return `${selisihHari} hari lagi`;
  } else if (selisihHari === 0) {
    return "Jatuh tempo hari ini!";
  } else {
    return `Sudah lewat ${Math.abs(selisihHari)} hari`;
  }
}

console.log("=== UJI CLOSURE & INDEPENDENSI ===");
const tabunganAhmad = buatTabunganSantri("Ahmad Fauzi", 50000);
const tabunganUsman = buatTabunganSantri("Usman Ali", 25000);
const tabunganUmar = buatTabunganSantri("Umar Bin Khattab", 10000);

console.log("Akses langsung properti saldo Ahmad:", tabunganAhmad.saldo);

tabunganAhmad.setor(15000);
tabunganUsman.cekSaldo();

tabunganAhmad.setor(-5000);
console.log("\n");

console.log("=== SIMULASI TRANSAKSI KOPERASI ===");
const data1 = {
  namaSantri: "  ahmad fauzi  ",
  kodeKupon: "diskon15",
  totalBelanja: "45000.75",
};
const data2 = {
  namaSantri: "usman ali",
  kodeKupon: "DISKON10",
  totalBelanja: "60000",
};
const data3 = {
  namaSantri: " umar bin khattab",
  kodeKupon: "biasa",
  totalBelanja: "20000.5",
}; // Tanpa diskon

const struk1 = prosesTransaksi(data1);
const struk2 = prosesTransaksi(data2);
const struk3 = prosesTransaksi(data3);

tabunganAhmad.setor(struk1.totalAkhir);
tabunganUsman.setor(struk2.totalAkhir);
tabunganUmar.setor(struk3.totalAkhir);

const log1 = catatTransaksi(struk1.nama, struk1.totalAkhir);
const log2 = catatTransaksi(struk2.nama, struk2.totalAkhir);
const log3 = catatTransaksi(struk3.nama, struk3.totalAkhir);
console.log("\n");

console.log("=== Riwayat Transaksi Koperasi ===");
const riwayatTransaksi = [log1, log2, log3];
riwayatTransaksi.forEach((log, index) => {
  console.log(
    `${index + 1}. ${log.nama.padEnd(16, " ")} | Rp ${log.nominal.padStart(8, " ")} | ${log.tanggal} (${log.hari})`,
  );
});
console.log("\n");

console.log("=== Laporan Jatuh Tempo Iuran ===");
console.log(
  "Status iuran (Deadline 2026-09-01):",
  hariMenujuJatuhTempo("2026-09-01"),
);

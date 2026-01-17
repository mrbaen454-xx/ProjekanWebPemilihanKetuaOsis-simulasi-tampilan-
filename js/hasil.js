// Variabel global untuk chart
let voteChart = null;
let barChart = null;

// Fungsi untuk menampilkan statistik overview
function displayStatsOverview() {
  const totalVoters = getVoters().length;
  const totalVotes = getTotalVotes();
  const hasVoted = getVotingStatus();
  const votedCount = Object.keys(hasVoted).length;
  const participationRate =
    totalVoters > 0 ? ((votedCount / totalVoters) * 100).toFixed(1) : 0;

  // Update elemen statistik
  const totalVotersEl = document.getElementById("totalVoters");
  const totalVotesEl = document.getElementById("totalVotes");
  const participationRateEl = document.getElementById("participationRate");

  if (totalVotersEl) totalVotersEl.textContent = totalVoters;
  if (totalVotesEl) totalVotesEl.textContent = totalVotes;
  if (participationRateEl)
    participationRateEl.textContent = `${participationRate}%`;
}

// Fungsi untuk menampilkan detail hasil voting dalam tabel
function displayResultsTable() {
  const resultsTableBody = document.getElementById("resultsTableBody");
  const candidates = getCandidates();
  const totalVotes = getTotalVotes();

  if (resultsTableBody) {
    resultsTableBody.innerHTML = "";

    // Urutkan kandidat berdasarkan jumlah suara (tertinggi ke terendah)
    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

    sortedCandidates.forEach((candidate, index) => {
      const percentage =
        totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;
      const isLeading = index === 0 && candidate.votes > 0;

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${candidate.id}</td>
                <td>
                    <strong>${candidate.ketua}</strong> & <strong>${
        candidate.wakil
      }</strong>
                </td>
                <td><strong>${candidate.votes}</strong> suara</td>
                <td>
                    <div class="percentage-bar-container">
                        <div class="percentage-bar" style="width: ${percentage}%; background-color: ${
        candidate.warna
      }"></div>
                        <span class="percentage-text">${percentage}%</span>
                    </div>
                </td>
                <td>
                    ${
                      isLeading
                        ? '<span class="badge winner"><i class="fas fa-trophy"></i> Pemenang</span>'
                        : '<span class="badge">-</span>'
                    }
                </td>
            `;

      resultsTableBody.appendChild(row);
    });
  }
}

// Fungsi untuk menampilkan informasi pemenang
function displayWinner() {
  const winnerSection = document.getElementById("winnerSection");
  const candidates = getCandidates();
  const totalVotes = getTotalVotes();

  // Cari kandidat dengan suara terbanyak
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const winner = sortedCandidates[0];
  const secondPlace = sortedCandidates[1];

  // Cek apakah ada seri
  const isTie =
    winner &&
    secondPlace &&
    winner.votes > 0 &&
    winner.votes === secondPlace.votes;

  if (winnerSection) {
    if (totalVotes === 0) {
      winnerSection.innerHTML = `
                <div class="no-results">
                    <h2><i class="fas fa-chart-line"></i> Belum Ada Hasil Voting</h2>
                    <p>Belum ada suara yang masuk. Jadilah yang pertama untuk memilih!</p>
                    <a href="voting.html" class="btn-primary">
                        <i class="fas fa-vote-yea"></i> Pergi ke Halaman Voting
                    </a>
                </div>
            `;
    } else if (isTie) {
      winnerSection.innerHTML = `
                <h2><i class="fas fa-balance-scale"></i> HASIL SEMENTARA: SERI!</h2>
                <p>Dua kandidat memiliki jumlah suara yang sama:</p>
                <div class="tie-candidates">
                    <div class="tie-candidate">
                        <h3>Pasangan Calon ${winner.id}</h3>
                        <p><strong>${winner.ketua}</strong> & <strong>${winner.wakil}</strong></p>
                        <div class="tie-votes">${winner.votes} suara</div>
                    </div>
                    <div class="tie-vs">VS</div>
                    <div class="tie-candidate">
                        <h3>Pasangan Calon ${secondPlace.id}</h3>
                        <p><strong>${secondPlace.ketua}</strong> & <strong>${secondPlace.wakil}</strong></p>
                        <div class="tie-votes">${secondPlace.votes} suara</div>
                    </div>
                </div>
                <p class="tie-note"><i class="fas fa-info-circle"></i> Voting masih dapat dilanjutkan hingga ada pemenang yang jelas.</p>
            `;
    } else if (winner) {
      const percentage =
        totalVotes > 0 ? ((winner.votes / totalVotes) * 100).toFixed(1) : 0;

      winnerSection.innerHTML = `
                <h2><i class="fas fa-trophy"></i> PEMENANG PEMILIHAN</h2>
                <div class="winner-card">
                    <div class="winner-number">${winner.id}</div>
                    <h3>${winner.ketua} & ${winner.wakil}</h3>
                    <p>Pasangan Calon ${winner.id}</p>
                    <div class="winner-votes">${winner.votes} suara</div>
                    <div class="winner-percentage">${percentage}% dari total suara</div>
                    <div class="winner-details">
                        <h4><i class="fas fa-bullseye"></i> Visi Pemenang:</h4>
                        <p class="winner-visi">"${winner.visi}"</p>
                    </div>
                    <div class="winner-celebration">
                        <i class="fas fa-medal"></i> SELAMAT KEPADA PASANGAN CALON ${winner.id}!
                    </div>
                </div>
            `;
    }
  }
}

// Fungsi untuk membuat chart hasil voting
function createCharts() {
  const candidates = getCandidates();
  const totalVotes = getTotalVotes();

  // Data untuk chart
  const labels = candidates.map((c) => `Paslon ${c.id}`);
  const votes = candidates.map((c) => c.votes);
  const colors = candidates.map((c) => c.warna);

  // Konteks canvas
  const voteChartCtx = document.getElementById("voteChart")?.getContext("2d");
  const barChartCtx = document.getElementById("barChart")?.getContext("2d");

  // Hancurkan chart sebelumnya jika ada
  if (voteChart) {
    voteChart.destroy();
  }

  if (barChart) {
    barChart.destroy();
  }

  // Buat pie chart (jika ada canvas dan ada data)
  if (voteChartCtx && totalVotes > 0) {
    try {
      voteChart = new Chart(voteChartCtx, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [
            {
              data: votes,
              backgroundColor: colors,
              borderColor: colors.map((color) => adjustColor(color, -30)),
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || "";
                  const value = context.raw || 0;
                  const percentage =
                    totalVotes > 0
                      ? ((value / totalVotes) * 100).toFixed(1)
                      : 0;
                  return `${label}: ${value} suara (${percentage}%)`;
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating pie chart:", error);
      // Tampilkan pesan error di canvas
      voteChartCtx.fillStyle = "#f5f5f5";
      voteChartCtx.fillRect(
        0,
        0,
        voteChartCtx.canvas.width,
        voteChartCtx.canvas.height
      );
      voteChartCtx.fillStyle = "#666";
      voteChartCtx.textAlign = "center";
      voteChartCtx.fillText(
        "Gagal memuat diagram",
        voteChartCtx.canvas.width / 2,
        voteChartCtx.canvas.height / 2
      );
    }
  } else if (voteChartCtx) {
    // Tampilkan pesan jika tidak ada data
    voteChartCtx.fillStyle = "#f5f5f5";
    voteChartCtx.fillRect(
      0,
      0,
      voteChartCtx.canvas.width,
      voteChartCtx.canvas.height
    );
    voteChartCtx.fillStyle = "#666";
    voteChartCtx.textAlign = "center";
    voteChartCtx.fillText(
      "Belum ada data voting",
      voteChartCtx.canvas.width / 2,
      voteChartCtx.canvas.height / 2
    );
  }

  // Buat bar chart (jika ada canvas dan ada data)
  if (barChartCtx && totalVotes > 0) {
    try {
      barChart = new Chart(barChartCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Jumlah Suara",
              data: votes,
              backgroundColor: colors,
              borderColor: colors.map((color) => adjustColor(color, -30)),
              borderWidth: 2,
              borderRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const value = context.raw || 0;
                  const percentage =
                    totalVotes > 0
                      ? ((value / totalVotes) * 100).toFixed(1)
                      : 0;
                  return `${value} suara (${percentage}%)`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  if (value % 1 === 0) {
                    return value;
                  }
                },
              },
              title: {
                display: true,
                text: "Jumlah Suara",
              },
            },
            x: {
              title: {
                display: true,
                text: "Pasangan Calon",
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating bar chart:", error);
      // Tampilkan pesan error di canvas
      barChartCtx.fillStyle = "#f5f5f5";
      barChartCtx.fillRect(
        0,
        0,
        barChartCtx.canvas.width,
        barChartCtx.canvas.height
      );
      barChartCtx.fillStyle = "#666";
      barChartCtx.textAlign = "center";
      barChartCtx.fillText(
        "Gagal memuat diagram",
        barChartCtx.canvas.width / 2,
        barChartCtx.canvas.height / 2
      );
    }
  } else if (barChartCtx) {
    // Tampilkan pesan jika tidak ada data
    barChartCtx.fillStyle = "#f5f5f5";
    barChartCtx.fillRect(
      0,
      0,
      barChartCtx.canvas.width,
      barChartCtx.canvas.height
    );
    barChartCtx.fillStyle = "#666";
    barChartCtx.textAlign = "center";
    barChartCtx.fillText(
      "Belum ada data voting",
      barChartCtx.canvas.width / 2,
      barChartCtx.canvas.height / 2
    );
  }
}

// Fungsi untuk menambahkan data demo (10 suara acak)
function addDemoVotes() {
  const candidates = getCandidates();

  // Reset dulu semua data
  resetAllData();

  // Tambahkan 10 pemilih dummy
  const demoVoters = [
    {
      nis: "1001",
      nama: "Ahmad Rizki",
      kelas: "XII IPA 1",
      loginTime: new Date().toISOString(),
    },
    {
      nis: "1002",
      nama: "Siti Nurhaliza",
      kelas: "XII IPA 1",
      loginTime: new Date().toISOString(),
    },
    {
      nis: "1003",
      nama: "Budi Santoso",
      kelas: "XII IPA 2",
      loginTime: new Date().toISOString(),
    },
    {
      nis: "1004",
      nama: "Maria Ulfa",
      kelas: "XII IPA 2",
      loginTime: new Date().toISOString(),
    },
    {
      nis: "1005",
      nama: "Chandra Wijaya",
      kelas: "XII IPA 3",
      loginTime: new Date().toISOString(),
    },
    {
      nis: "1006",
      nama: "Dewi Lestari",
      kelas: "XII IPA 3",
      loginTime: new Date().toISOString(),
    },
    {
      nis: "1007",
      nama: "Eko Prasetyo",
      kelas: "XII IPS 1",
      loginTime: new Date().toISOString(),
    },
    {
      nis: "1008",
      nama: "Fitriani",
      kelas: "XII IPS 1",
      loginTime: new Date().toISOString(),
    },
    {
      nis: "1009",
      nama: "Gunawan",
      kelas: "XII IPS 2",
      loginTime: new Date().toISOString(),
    },
    {
      nis: "1010",
      nama: "Hana Susanti",
      kelas: "XII IPS 2",
      loginTime: new Date().toISOString(),
    },
  ];

  // Simpan pemilih
  localStorage.setItem("voters", JSON.stringify(demoVoters));

  // Berikan suara acak (total 10 suara)
  const votes = [0, 0, 0];
  for (let i = 0; i < 10; i++) {
    const randomCandidate = Math.floor(Math.random() * 3);
    votes[randomCandidate]++;
  }

  const updatedCandidates = candidates.map((candidate, index) => ({
    ...candidate,
    votes: votes[index],
  }));

  // Simpan kandidat dengan suara
  localStorage.setItem("candidates", JSON.stringify(updatedCandidates));

  // Tandai semua sudah memilih
  const demoHasVoted = {};
  demoVoters.forEach((voter) => {
    demoHasVoted[voter.nis] = true;
  });
  localStorage.setItem("hasVoted", JSON.stringify(demoHasVoted));

  return updatedCandidates;
}

// Fungsi untuk setup tombol kontrol demo
function setupDemoControls() {
  // Tombol reset semua data
  const resetAllDataBtn = document.getElementById("resetAllDataBtn");
  if (resetAllDataBtn) {
    resetAllDataBtn.addEventListener("click", function () {
      if (
        confirm(
          "PERINGATAN: Ini akan menghapus SEMUA data voting, termasuk data pemilih dan hasil voting. Apakah Anda yakin?"
        )
      ) {
        resetAllData();
        showNotification("Semua data telah direset!", "success");

        // Refresh halaman setelah 1.5 detik
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  }

  // Tombol tambah data demo
  const addDemoVotesBtn = document.getElementById("addDemoVotesBtn");
  if (addDemoVotesBtn) {
    addDemoVotesBtn.addEventListener("click", function () {
      if (
        confirm(
          "Akan menambahkan 10 data pemilih dummy dengan suara acak. Data sebelumnya akan direset. Lanjutkan?"
        )
      ) {
        addDemoVotes();
        showNotification("Data demo telah ditambahkan!", "success");

        // Refresh halaman setelah 1.5 detik
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  }
}

// Fungsi untuk refresh data hasil voting
function refreshResults() {
  console.log("Refreshing results...");
  displayStatsOverview();
  displayResultsTable();
  displayWinner();
  createCharts();
}

// Fungsi untuk setup auto refresh
function setupAutoRefresh() {
  // Refresh data setiap 3 detik jika halaman hasil masih terbuka
  if (window.location.pathname.includes("hasil.html")) {
    setInterval(() => {
      refreshResults();
    }, 3000);
  }
}

// Fungsi untuk debugging: tampilkan semua data di console
function debugData() {
  console.log("=== DEBUG DATA ===");
  console.log("Candidates:", getCandidates());
  console.log("Voters:", getVoters());
  console.log("HasVoted:", getVotingStatus());
  console.log("Current User:", getCurrentUser());
  console.log("Total Votes:", getTotalVotes());
  console.log("==================");
}

// Inisialisasi halaman hasil
document.addEventListener("DOMContentLoaded", function () {
  console.log("Hasil page loaded");

  // Inisialisasi localStorage
  initializeLocalStorage();

  // Debug data
  debugData();

  // Tampilkan semua data
  refreshResults();

  // Setup tombol kontrol demo
  setupDemoControls();

  // Setup auto refresh
  setupAutoRefresh();

  // Tambahkan tombol debug (hanya untuk development)
  addDebugButton();
});

// Fungsi untuk menambahkan tombol debug
function addDebugButton() {
  // Hanya tambahkan di mode development
  if (
    window.location.hostname === "" ||
    window.location.hostname === "localhost"
  ) {
    const debugBtn = document.createElement("button");
    debugBtn.textContent = "🔍 Debug Data";
    debugBtn.style.position = "fixed";
    debugBtn.style.bottom = "60px";
    debugBtn.style.right = "10px";
    debugBtn.style.zIndex = "9999";
    debugBtn.style.padding = "10px 15px";
    debugBtn.style.backgroundColor = "#673ab7";
    debugBtn.style.color = "white";
    debugBtn.style.border = "none";
    debugBtn.style.borderRadius = "5px";
    debugBtn.style.cursor = "pointer";
    debugBtn.style.fontSize = "12px";
    debugBtn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    debugBtn.onclick = debugData;
    document.body.appendChild(debugBtn);
  }
}

// Fungsi bantuan untuk menyesuaikan warna
function adjustColor(color, amount) {
  try {
    if (color.startsWith("#")) {
      let r = parseInt(color.substr(1, 2), 16);
      let g = parseInt(color.substr(3, 2), 16);
      let b = parseInt(color.substr(5, 2), 16);

      r = Math.max(0, Math.min(255, r + amount));
      g = Math.max(0, Math.min(255, g + amount));
      b = Math.max(0, Math.min(255, b + amount));

      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }
    return color;
  } catch (e) {
    console.error("Error adjusting color:", e);
    return color;
  }
}

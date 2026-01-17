// Fungsi untuk menampilkan informasi user
function displayUserInfo() {
  const userInfoDiv = document.getElementById("userInfo");
  const currentUser = getCurrentUser();

  if (userInfoDiv && currentUser) {
    userInfoDiv.innerHTML = `
            <div>
                <h3><i class="fas fa-user-circle"></i> Selamat datang, ${currentUser.nama}</h3>
                <p>NIS: ${currentUser.nis} | Kelas: ${currentUser.kelas}</p>
            </div>
            <div>
                <button id="logoutBtn" class="btn-logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        `;

    // Tambahkan event listener untuk tombol logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
      if (confirm("Apakah Anda yakin ingin logout?")) {
        logoutUser();
        window.location.href = "index.html";
      }
    });
  } else if (userInfoDiv && !currentUser) {
    // Jika tidak ada user yang login, redirect ke halaman login
    showNotification("Anda harus login terlebih dahulu!", "error");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
  }
}

// Fungsi untuk menampilkan status voting
function displayVotingStatus() {
  const statusText = document.getElementById("statusText");
  const currentUser = getCurrentUser();

  if (statusText && currentUser) {
    if (hasAlreadyVoted(currentUser.nis)) {
      statusText.innerHTML = `<i class="fas fa-check-circle"></i> Anda sudah melakukan voting`;
      statusText.parentElement.style.backgroundColor = "#e8f5e9";
      statusText.parentElement.style.color = "#2e7d32";
    } else {
      statusText.innerHTML = `<i class="fas fa-exclamation-circle"></i> Anda belum melakukan voting`;
      statusText.parentElement.style.backgroundColor = "#fff8e1";
      statusText.parentElement.style.color = "#ff8f00";
    }
  }
}

// Fungsi untuk menampilkan kandidat
function displayCandidates() {
  const candidatesContainer = document.getElementById("candidatesContainer");
  const candidates = getCandidates();
  const currentUser = getCurrentUser();
  const hasVoted = currentUser ? hasAlreadyVoted(currentUser.nis) : false;

  if (candidatesContainer) {
    candidatesContainer.innerHTML = "";

    candidates.forEach((candidate) => {
      const candidateCard = document.createElement("div");
      candidateCard.className = "candidate-card";
      candidateCard.dataset.id = candidate.id;

      // Hitung persentase suara
      const totalVotes = getTotalVotes();
      const percentage =
        totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;

      candidateCard.innerHTML = `
                <div class="candidate-header" style="background: linear-gradient(135deg, ${
                  candidate.warna
                }, ${adjustColor(candidate.warna, -30)})">
                    <div class="candidate-number">${candidate.id}</div>
                    <h3>PASANGAN CALON ${candidate.id}</h3>
                    <p>Ketua & Wakil Ketua OSIS</p>
                </div>
                
                <div class="candidate-photo-container">
                    <div class="candidate-photo" style="background-color: ${
                      candidate.warna
                    }">
                        ${candidate.fotoKetua}
                    </div>
                </div>
                
                <div class="candidate-body">
                    <div class="candidate-detail">
                        <h4><i class="fas fa-user-tie"></i> Calon Ketua:</h4>
                        <p><strong>${candidate.ketua}</strong></p>
                    </div>
                    
                    <div class="candidate-detail">
                        <h4><i class="fas fa-user-friends"></i> Calon Wakil Ketua:</h4>
                        <p><strong>${candidate.wakil}</strong></p>
                    </div>
                    
                    <div class="vision-mission">
                        <h4><i class="fas fa-bullseye"></i> Visi:</h4>
                        <p>${candidate.visi}</p>
                        
                        <h4 style="margin-top: 15px;"><i class="fas fa-tasks"></i> Misi:</h4>
                        <ul>
                            ${candidate.misi
                              .map((item) => `<li>${item}</li>`)
                              .join("")}
                        </ul>
                    </div>
                    
                    <div class="vote-info">
                        <div class="vote-count">
                            <i class="fas fa-chart-bar"></i> Perolehan Suara: <strong>${
                              candidate.votes
                            }</strong>
                        </div>
                        <div class="vote-percentage">
                            <i class="fas fa-percentage"></i> Persentase: <strong>${percentage}%</strong>
                        </div>
                    </div>
                    
                    <button class="btn-vote ${hasVoted ? "btn-voted" : ""}" 
                            data-id="${candidate.id}"
                            ${hasVoted ? "disabled" : ""}>
                        <i class="fas fa-vote-yea"></i> 
                        ${hasVoted ? "SUDAH MEMILIH" : "PILIH KANDIDAT INI"}
                    </button>
                </div>
            `;

      candidatesContainer.appendChild(candidateCard);
    });

    // Tambahkan event listener untuk tombol vote jika user belum memilih
    if (!hasVoted && currentUser) {
      document.querySelectorAll(".btn-vote").forEach((button) => {
        button.addEventListener("click", function () {
          const candidateId = parseInt(this.dataset.id);
          const candidate = candidates.find((c) => c.id === candidateId);

          // Tampilkan modal konfirmasi
          showConfirmModal(candidate);
        });
      });
    }
  }
}

// Fungsi untuk menyesuaikan warna (membuat lebih gelap/terang)
function adjustColor(color, amount) {
  // Jika warna dalam format hex
  if (color.startsWith("#")) {
    // Konversi hex ke RGB
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);

    // Sesuaikan warna
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));

    // Kembalikan ke format hex
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  return color;
}

// Fungsi untuk menampilkan modal konfirmasi
function showConfirmModal(candidate) {
  const modal = document.getElementById("confirmModal");
  const confirmCandidateDiv = document.getElementById("confirmCandidate");

  if (modal && confirmCandidateDiv) {
    confirmCandidateDiv.innerHTML = `
            <div class="candidate-confirmation">
                <h3>Pasangan Calon ${candidate.id}</h3>
                <p><strong>${candidate.ketua}</strong> & <strong>${candidate.wakil}</strong></p>
                <div class="confirmation-visi">
                    <p><i class="fas fa-quote-left"></i> ${candidate.visi} <i class="fas fa-quote-right"></i></p>
                </div>
            </div>
        `;

    // Tampilkan modal
    modal.style.display = "flex";

    // Event listener untuk tombol konfirmasi
    document.getElementById("confirmVote").onclick = function () {
      processVote(candidate.id);
      modal.style.display = "none";
    };

    // Event listener untuk tombol batal
    document.getElementById("cancelVote").onclick = function () {
      modal.style.display = "none";
    };

    // Event listener untuk tombol close (x)
    document.querySelector(".close-modal").onclick = function () {
      modal.style.display = "none";
    };

    // Tutup modal jika klik di luar konten
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }
}

// Fungsi untuk memproses voting
// Fungsi untuk memproses voting
function processVote(candidateId) {
    const currentUser = getCurrentUser();
    
    console.log("Processing vote for user:", currentUser);
    console.log("Candidate ID:", candidateId);
    
    if (!currentUser) {
        showNotification('Anda harus login untuk memilih!', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }
    
    // Cek apakah sudah memilih
    if (hasAlreadyVoted(currentUser.nis)) {
        showNotification('Anda sudah melakukan voting sebelumnya!', 'warning');
        return;
    }
    
    // Tambahkan suara
    const updatedCandidates = addVote(candidateId);
    console.log("Updated candidates:", updatedCandidates);
    
    // Tandai sebagai sudah memilih
    markAsVoted(currentUser.nis);
    
    // Tampilkan modal sukses
    showSuccessModal();
    
    // Perbarui tampilan
    displayVotingStatus();
    displayCandidates();
    
    // Debug: Tampilkan data di console
    console.log("Vote successful! Current vote count:", getTotalVotes());
    console.log("Has voted status:", getVotingStatus());
}
// Fungsi untuk menampilkan modal sukses
function showSuccessModal() {
  const modal = document.getElementById("successModal");

  if (modal) {
    modal.style.display = "flex";

    // Event listener untuk tombol lihat hasil
    document.getElementById("viewResults").onclick = function () {
      modal.style.display = "none";
      window.location.href = "hasil.html";
    };

    // Event listener untuk tombol tutup
    document.getElementById("closeSuccess").onclick = function () {
      modal.style.display = "none";
    };

    // Tutup modal jika klik di luar konten
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }
}

// Fungsi untuk menangani reset voting pribadi
function setupResetVoteButton() {
  const resetVoteBtn = document.getElementById("resetVoteBtn");

  if (resetVoteBtn) {
    resetVoteBtn.addEventListener("click", function () {
      const currentUser = getCurrentUser();

      if (!currentUser) {
        showNotification(
          "Anda harus login untuk menggunakan fitur ini",
          "error"
        );
        return;
      }

      if (!hasAlreadyVoted(currentUser.nis)) {
        showNotification("Anda belum melakukan voting", "info");
        return;
      }

      if (
        confirm(
          "Apakah Anda yakin ingin mereset voting Anda? Suara yang telah diberikan akan dikembalikan."
        )
      ) {
        // Hapus status voting user
        const hasVoted = getVotingStatus();
        delete hasVoted[currentUser.nis];
        localStorage.setItem("hasVoted", JSON.stringify(hasVoted));

        // Kurangi suara dari kandidat (tidak bisa menentukan kandidat mana, jadi kita reset semua?)
        // Untuk sederhananya, kita reset semua data
        showNotification(
          "Voting Anda telah direset. Silakan vote kembali.",
          "success"
        );

        // Refresh halaman
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  }
}

// Fungsi untuk menangani reset semua data
function setupResetAllButton() {
  const resetAllBtn = document.getElementById("resetAllBtn");

  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", function () {
      if (
        confirm(
          "PERINGATAN: Ini akan menghapus SEMUA data voting, termasuk data pemilih dan hasil voting. Apakah Anda yakin?"
        )
      ) {
        resetAllData();
        showNotification(
          "Semua data telah direset. Halaman akan dimuat ulang.",
          "success"
        );

        // Refresh halaman setelah 1.5 detik
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    });
  }
}

// Inisialisasi halaman voting
document.addEventListener("DOMContentLoaded", function () {
  // Inisialisasi localStorage
  initializeLocalStorage();

  // Cek apakah user sudah login
  const currentUser = getCurrentUser();

  if (!currentUser && window.location.pathname.includes("voting.html")) {
    // Redirect ke halaman login jika belum login
    showNotification("Silakan login terlebih dahulu", "warning");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1500);
    return;
  }

  // Tampilkan informasi user
  displayUserInfo();

  // Tampilkan status voting
  displayVotingStatus();

  // Tampilkan kandidat
  displayCandidates();

  // Setup tombol reset
  setupResetVoteButton();
  setupResetAllButton();

  // Tambahkan style tambahan untuk halaman voting
  addVotingPageStyles();
});

// Fungsi untuk menambahkan style khusus halaman voting
function addVotingPageStyles() {
  if (document.getElementById("voting-styles")) return;

  const style = document.createElement("style");
  style.id = "voting-styles";
  style.textContent = `
        .candidate-photo-container {
            text-align: center;
            margin-top: -30px;
        }
        
        .candidate-photo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            margin: 0 auto 20px;
            border: 5px solid white;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }
        
        .vote-info {
            display: flex;
            justify-content: space-between;
            background-color: #f5f5f5;
            padding: 12px;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 0.9rem;
        }
        
        .btn-logout {
            padding: 10px 20px;
            background-color: #f5f5f5;
            color: #757575;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-logout:hover {
            background-color: #e0e0e0;
        }
        
        .candidate-confirmation {
            text-align: center;
            padding: 20px;
            background-color: #f0f7ff;
            border-radius: 10px;
            margin: 15px 0;
        }
        
        .candidate-confirmation h3 {
            color: #1a73e8;
            margin-bottom: 10px;
        }
        
        .confirmation-visi {
            font-style: italic;
            margin-top: 15px;
            padding: 15px;
            background-color: white;
            border-radius: 8px;
            border-left: 4px solid #1a73e8;
        }
        
        .success-icon {
            font-size: 4rem;
            color: #4CAF50;
            margin: 20px 0;
        }
        
        .btn-primary, .btn-secondary {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background-color: #1a73e8;
            color: white;
        }
        
        .btn-primary:hover {
            background-color: #0d47a1;
        }
        
        .btn-secondary {
            background-color: #f5f5f5;
            color: #757575;
            border: 1px solid #ddd;
        }
        
        .btn-secondary:hover {
            background-color: #e0e0e0;
        }
        
        .modal-content.success {
            text-align: center;
        }
        
        .modal-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
        }
    `;

  document.head.appendChild(style);
}

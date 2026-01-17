// Data kandidat default
const DEFAULT_CANDIDATES = [
  {
    id: 1,
    ketua: "Ahmad Rizki",
    wakil: "Siti Nurhaliza",
    visi: "Mewujudkan OSIS yang inovatif, kreatif, dan berintegritas tinggi",
    misi: [
      "Meningkatkan kualitas kegiatan ekstrakurikuler",
      "Mengadakan pelatihan kepemimpinan untuk siswa",
      "Memperkuat hubungan antara OSIS dan siswa melalui media sosial",
    ],
    fotoKetua: "👨‍🎓",
    fotoWakil: "👩‍🎓",
    warna: "#1a73e8",
  },
  {
    id: 2,
    ketua: "Budi Santoso",
    wakil: "Maria Ulfa",
    visi: "OSIS yang pro-aktif dalam membangun karakter siswa berlandaskan Pancasila",
    misi: [
      "Mengadakan program mentoring antar siswa",
      "Mengoptimalkan fungsi ruang kreativitas siswa",
      "Menjalin kerjasama dengan alumni untuk pengembangan karir",
    ],
    fotoKetua: "👨‍🏫",
    fotoWakil: "👩‍🏫",
    warna: "#4CAF50",
  },
  {
    id: 3,
    ketua: "Chandra Wijaya",
    wakil: "Dewi Lestari",
    visi: "OSIS sebagai wadah pengembangan potensi siswa menuju prestasi global",
    misi: [
      "Mengadakan kompetisi sains dan seni tingkat sekolah",
      "Membangun perpustakaan digital OSIS",
      "Mengembangkan program pertukaran pelajar virtual",
    ],
    fotoKetua: "👨‍💼",
    fotoWakil: "👩‍💼",
    warna: "#FF9800",
  },
];

// Inisialisasi data di localStorage jika belum ada
function initializeLocalStorage() {
  if (!localStorage.getItem("candidates")) {
    // Tambahkan properti votes ke setiap kandidat
    const candidatesWithVotes = DEFAULT_CANDIDATES.map((candidate) => ({
      ...candidate,
      votes: 0,
    }));
    localStorage.setItem("candidates", JSON.stringify(candidatesWithVotes));
  }

  if (!localStorage.getItem("voters")) {
    localStorage.setItem("voters", JSON.stringify([]));
  }

  if (!localStorage.getItem("hasVoted")) {
    localStorage.setItem("hasVoted", JSON.stringify({}));
  }
}

// Fungsi untuk mendapatkan data kandidat dari localStorage
function getCandidates() {
  const candidates = localStorage.getItem("candidates");
  return candidates ? JSON.parse(candidates) : [];
}

// Fungsi untuk menyimpan data kandidat ke localStorage
function saveCandidates(candidates) {
  localStorage.setItem("candidates", JSON.stringify(candidates));
}

// Fungsi untuk mendapatkan data pemilih dari localStorage
function getVoters() {
  const voters = localStorage.getItem("voters");
  return voters ? JSON.parse(voters) : [];
}

// Fungsi untuk menyimpan data pemilih ke localStorage
function saveVoter(voter) {
  const voters = getVoters();
  voters.push(voter);
  localStorage.setItem("voters", JSON.stringify(voters));
}

// Fungsi untuk mendapatkan status voting dari localStorage
function getVotingStatus() {
  const hasVoted = localStorage.getItem("hasVoted");
  return hasVoted ? JSON.parse(hasVoted) : {};
}

// Fungsi untuk menandai seseorang sudah memilih
function markAsVoted(nis) {
  const hasVoted = getVotingStatus();
  hasVoted[nis] = true;
  localStorage.setItem("hasVoted", JSON.stringify(hasVoted));
}

// Fungsi untuk mengecek apakah seseorang sudah memilih
function hasAlreadyVoted(nis) {
  const hasVoted = getVotingStatus();
  return hasVoted[nis] || false;
}

// Fungsi untuk menambah suara kandidat
// Fungsi untuk menambah suara kandidat
function addVote(candidateId) {
    const candidates = getCandidates();
    console.log("Before vote - Candidates:", candidates);
    
    const updatedCandidates = candidates.map(candidate => {
        if (candidate.id === candidateId) {
            const newVotes = candidate.votes + 1;
            console.log(`Adding vote to candidate ${candidateId}. Old: ${candidate.votes}, New: ${newVotes}`);
            return {
                ...candidate,
                votes: newVotes
            };
        }
        return candidate;
    });
    
    saveCandidates(updatedCandidates);
    console.log("After vote - Candidates:", updatedCandidates);
    return updatedCandidates;
}

// Fungsi untuk mendapatkan total suara
// Fungsi untuk mendapatkan total suara
function getTotalVotes() {
    const candidates = getCandidates();
    return candidates.reduce((total, candidate) => total + candidate.votes, 0);
}

// Fungsi untuk menyesuaikan warna (membuat lebih gelap/terang)
function adjustColor(color, amount) {
    try {
        if (color.startsWith('#')) {
            let r = parseInt(color.substr(1, 2), 16);
            let g = parseInt(color.substr(3, 2), 16);
            let b = parseInt(color.substr(5, 2), 16);
            
            r = Math.max(0, Math.min(255, r + amount));
            g = Math.max(0, Math.min(255, g + amount));
            b = Math.max(0, Math.min(255, b + amount));
            
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
        return color;
    } catch (e) {
        console.error("Error adjusting color:", e);
        return color;
    }
}
// Fungsi untuk mereset semua data
function resetAllData() {
  // Reset kandidat
  const candidatesWithVotes = DEFAULT_CANDIDATES.map((candidate) => ({
    ...candidate,
    votes: 0,
  }));
  localStorage.setItem("candidates", JSON.stringify(candidatesWithVotes));

  // Reset data pemilih
  localStorage.setItem("voters", JSON.stringify([]));

  // Reset status voting
  localStorage.setItem("hasVoted", JSON.stringify({}));

  // Reset user yang sedang login
  localStorage.removeItem("currentUser");

  return true;
}

// Fungsi untuk login
function loginUser(nis, nama, kelas) {
  const user = {
    nis: nis,
    nama: nama,
    kelas: kelas,
    loginTime: new Date().toISOString(),
  };

  // Simpan data user ke localStorage
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Simpan ke daftar pemilih jika belum ada
  const voters = getVoters();
  const existingVoter = voters.find((voter) => voter.nis === nis);

  if (!existingVoter) {
    saveVoter(user);
  }

  return user;
}

// Fungsi untuk mendapatkan user yang sedang login
function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

// Fungsi untuk logout
function logoutUser() {
  localStorage.removeItem("currentUser");
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = "info", duration = 3000) {
  // Hapus notifikasi sebelumnya jika ada
  const existingNotification = document.getElementById("custom-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Buat elemen notifikasi
  const notification = document.createElement("div");
  notification.id = "custom-notification";
  notification.className = `notification notification-${type}`;

  // Tentukan ikon berdasarkan tipe
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "warning") icon = "⚠️";
  if (type === "error") icon = "❌";

  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;

  // Tambahkan ke body
  document.body.appendChild(notification);

  // Tampilkan notifikasi dengan animasi
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Hapus notifikasi setelah beberapa detik
  if (duration > 0) {
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, duration);
  }

  return notification;
}

// Fungsi untuk menambahkan style notifikasi
function addNotificationStyles() {
  if (document.getElementById("notification-styles")) return;

  const style = document.createElement("style");
  style.id = "notification-styles";
  style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            transform: translateX(100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            max-width: 400px;
        }
        
        .notification.show {
            transform: translateX(0);
            opacity: 1;
        }
        
        .notification-info {
            background-color: #2196F3;
            border-left: 5px solid #0d47a1;
        }
        
        .notification-success {
            background-color: #4CAF50;
            border-left: 5px solid #2E7D32;
        }
        
        .notification-warning {
            background-color: #FF9800;
            border-left: 5px solid #F57C00;
        }
        
        .notification-error {
            background-color: #f44336;
            border-left: 5px solid #c62828;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .notification-icon {
            font-size: 1.2rem;
        }
    `;

  document.head.appendChild(style);
}

// Inisialisasi saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Inisialisasi localStorage
  initializeLocalStorage();

  // Tambahkan style untuk notifikasi
  addNotificationStyles();

  // Untuk halaman login (index.html)
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nis = document.getElementById("nis").value.trim();
      const nama = document.getElementById("nama").value.trim();
      const kelas = document.getElementById("kelas").value.trim();

      // Validasi input
      if (!nis || !nama || !kelas) {
        showNotification("Harap isi semua data dengan lengkap!", "error");
        return;
      }

      // Login user
      loginUser(nis, nama, kelas);

      // Tampilkan notifikasi
      showNotification(`Login berhasil! Selamat datang ${nama}`, "success");

      // Redirect ke halaman voting setelah 1.5 detik
      setTimeout(() => {
        window.location.href = "voting.html";
      }, 1500);
    });

    // Coba isi dengan data demo jika ada parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("demo") === "true") {
      document.getElementById("nis").value = "12345";
      document.getElementById("nama").value = "Andi Wijaya";
      document.getElementById("kelas").value = "XII IPA 1";
    }
  }

  // Untuk halaman voting (voting.html) - akan dihandle di voting.js
  // Untuk halaman hasil (hasil.html) - akan dihandle di hasil.js
});

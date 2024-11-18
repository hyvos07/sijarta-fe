'use client';

import React, { useState } from "react";

// Interface untuk data
interface ServiceSession {
  id: number;
  name: string;
  price: number;
}

interface Worker {
  id: number;
  name: string;
  profileUrl: string;
}

interface Testimonial {
  id: number;
  userName: string;
  text: string;
  date: string;
  workerName: string;
  rating: number;
}

interface SubcategoryData {
  id: number;
  name: string;
  description: string;
  category: string;
  serviceSessions: ServiceSession[];
  workers: Worker[];
  testimonials: Testimonial[];
}

// Data contoh
const subcategoryData: SubcategoryData = {
  id: 1,
  name: "Subkategori Jasa 1",
  description: "Deskripsi singkat tentang subkategori jasa ini.",
  category: "Kategori Jasa 1",
  serviceSessions: [
    { id: 1, name: "Sesi Layanan A", price: 50000 },
    { id: 2, name: "Sesi Layanan B", price: 75000 },
  ],
  workers: [
    { id: 1, name: "Nama Pekerja 1", profileUrl: "/pekerja/1" },
    { id: 2, name: "Nama Pekerja 2", profileUrl: "/pekerja/2" },
    { id: 3, name: "Nama Pekerja 3", profileUrl: "/pekerja/3" },
    { id: 4, name: "Nama Pekerja 4", profileUrl: "/pekerja/4" },
  ],
  testimonials: [
    {
      id: 1,
      userName: "Pengguna A",
      text: "Layanan sangat memuaskan!",
      date: "2024-11-01",
      workerName: "Nama Pekerja 1",
      rating: 5,
    },
    {
      id: 2,
      userName: "Pengguna B",
      text: "Pekerja sangat ramah.",
      date: "2024-11-10",
      workerName: "Nama Pekerja 2",
      rating: 4,
    },
  ],
};

const SubcategoryPage: React.FC = () => {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ServiceSession | null>(
    null
  );
  const [isJoined, setIsJoined] = useState(false); // Status apakah pekerja sudah bergabung

  // Simulate user role (this can be replaced with actual role check logic)
  const isWorker = false; // Set this to `true` if the user is a worker

  const handleWorkerClick = (url: string) => {
    alert(`Navigating to worker profile: ${url}`);
  };

  const handleBookingClick = (session: ServiceSession) => {
    setSelectedSession(session);
    setShowBookingModal(true);
  };

  const handleJoinCategory = () => {
    // Simulasi bergabung dengan kategori jasa
    alert("Anda telah bergabung dengan kategori jasa ini!");
    setIsJoined(true);
  };

  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedSession(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{subcategoryData.name}</h2>
      <p><strong>Kategori:</strong> {subcategoryData.category}</p>
      <p><strong>Deskripsi:</strong> {subcategoryData.description}</p>

      <div style={{ marginTop: "20px" }}>
        <h3>Pilihan Sesi Layanan</h3>
        {subcategoryData.serviceSessions.map((session) => (
          <div
            key={session.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #ddd",
              padding: "10px",
              margin: "5px 0",
            }}
          >
            <div>{session.name}</div>
            <div>Rp {session.price.toLocaleString()}</div>
            {!isWorker && (
              <button onClick={() => handleBookingClick(session)}>
                Pesan Jasa
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Pekerja</h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {subcategoryData.workers.map((worker) => (
            <div
              key={worker.id}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                cursor: "pointer",
                textAlign: "center",
                width: "150px",
              }}
              onClick={() => handleWorkerClick(worker.profileUrl)}
            >
              {worker.name}
            </div>
          ))}
        </div>
        {isWorker && !isJoined && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handleJoinCategory}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Bergabung
            </button>
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Testimoni</h3>
        {subcategoryData.testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              margin: "5px 0",
            }}
          >
            <p>
              <strong>{testimonial.userName}</strong> ({testimonial.date})
            </p>
            <p>{testimonial.text}</p>
            <p>
              <strong>Pekerja:</strong> {testimonial.workerName} |{" "}
              <strong>Rating:</strong> {testimonial.rating}/5
            </p>
          </div>
        ))}
      </div>

      {showBookingModal && selectedSession && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "20px",
            border: "1px solid #ddd",
            zIndex: 1000,
          }}
        >
          <h3>Pemesanan Jasa</h3>
          <p>
            <strong>Sesi Layanan:</strong> {selectedSession.name}
          </p>
          <p>
            <strong>Harga:</strong> Rp {selectedSession.price.toLocaleString()}
          </p>
          <form>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Nama:
                <input type="text" required />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Kontak:
                <input type="text" required />
              </label>
            </div>
            <button type="submit">Konfirmasi</button>
          </form>
          <button onClick={closeModal} style={{ marginTop: "10px" }}>
            Tutup
          </button>
        </div>
      )}
    </div>
  );
};

export default SubcategoryPage;

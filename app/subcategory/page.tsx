'use client';

import React, { useState } from "react";
import NavBar from "@/app/_components/NavBar";

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
    <>
      <NavBar />
      <div
        style={{
          maxWidth: "768px", // Sesuai ukuran iPad
          margin: "0 auto", // Memusatkan konten
          marginTop: "2.5%",
          padding: "20px",
          backgroundColor: "#1a1a1a", // Warna dasar agar lebih serasi
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
          height: ""
        }}
      >
        <div style={{ padding: "20px" }}>
          <h2>{subcategoryData.name}</h2>
          <p>
            <strong>Kategori:</strong> {subcategoryData.category}
          </p>
          <p>
            <strong>Deskripsi:</strong> {subcategoryData.description}
          </p>

          <div style={{ marginTop: "20px" }}>
            <h3
              style={{
                marginBottom: "20px",
                textAlign: "center",
                color: "#fff",
              }}
            >
              Pilihan Sesi Layanan
            </h3>
            {subcategoryData.serviceSessions.map((session) => (
              <div
                key={session.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  padding: "10px",
                  margin: "5px 0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Container untuk Nama dan Harga */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#fff",
                    }}
                  >
                    {session.name}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#777",
                    }}
                  >
                    Rp {session.price.toLocaleString()}
                  </div>
                </div>
                {/* Tombol Pesan */}
                {!isWorker && (
                <button
                  onClick={() => handleBookingClick(session)}
                  style={{
                    padding: "8px 15px",
                    fontSize: "14px",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2C2C2C";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#333";
                  }}
                >
                  Pesan Jasa
                </button>
              )}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#fff",
              }}
            >
              Pekerja
            </h3>
            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {subcategoryData.workers.map((worker) => (
                <div
                  key={worker.id}
                  style={{
                    padding: "15px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    textAlign: "center",
                    width: "160px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onClick={() => handleWorkerClick(worker.profileUrl)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 5px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {worker.name}
                  </p>
                </div>
              ))}
            </div>
            
            {showBookingModal && selectedSession && (
            <>
              {/* Overlay with blur effect */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
                  backdropFilter: "blur(5px)", // Blur effect
                  zIndex: 999, // Ensure it's behind the modal
                }}
                onClick={closeModal} // Close modal if the overlay is clicked
              />

              {/* Modal content */}
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  zIndex: 1000, // Ensure it's above the overlay
                  width: "300px",
                  color: "black",
                }}
              >
                <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Pemesanan Jasa</h3>
                {selectedSession && (
                  <>
                    <p style={{ marginBottom: "10px" }}>
                      <strong>Sesi Layanan:</strong> {selectedSession.name}
                    </p>
                    <p style={{ marginBottom: "20px" }}>
                      <strong>Harga:</strong> Rp {selectedSession.price.toLocaleString()}
                    </p>
                  </>
                )}
                <form>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Nama:</label>
                    <input
                      type="text"
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", marginBottom: "5px" }}>Kontak:</label>
                    <input
                      type="text"
                      required
                      style={{
                        width: "100%",
                        padding: "8px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#333",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Konfirmasi
                  </button>
                </form>
                <button
                  onClick={closeModal}
                  style={{
                    marginTop: "15px",
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "black",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Tutup
                </button>
              </div>
            </>
          )}


            {isWorker && !isJoined && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                  onClick={handleJoinCategory}
                  style={{
                    padding: "12px 25px",
                    fontSize: "16px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#218838";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#28a745";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  Bergabung
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default SubcategoryPage;

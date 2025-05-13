import { API } from "../api/config";

export const KosService = {
  getAllKos: async () => {
    try {
      // Tambahkan console.log untuk debugging
      console.log("Fetching kos data...");

      const response = await API.get("/kosans");
      console.log("API Response:", response);

      if (!response.data) {
        throw new Error("Tidak ada data yang diterima dari API");
      }

      // Log data mentah dari API
      console.log("Raw kos data:", response.data);

      // Pastikan response.data memiliki property yang benar
      const kosData = response.data.data || response.data;

      // Transform data
      return kosData.map((kos) => ({
        id: kos.id,
        name: kos.nama_kosan || kos.name,
        location: kos.alamat || kos.location,
        price: kos.harga_per_bulan || kos.price,
        type: kos.kategori?.nama || "Tidak Ada",
        facilities: Array.isArray(kos.fasilitas)
          ? kos.fasilitas
          : kos.fasilitas?.split(",") || [],
        images: Array.isArray(kos.galeri)
          ? kos.galeri
          : kos.galeri
          ? [kos.galeri]
          : [],
      }));
    } catch (error) {
      // Log error lengkap
      console.error("Error detail:", {
        message: error.message,
        response: error.response,
        request: error.request,
      });

      throw new Error(
        error.response?.data?.message ||
          "Gagal mengambil data kos, silakan coba lagi"
      );
    }
  },
};

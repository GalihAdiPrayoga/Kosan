export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // Handle different image types
  if (imagePath.startsWith("bukti_pembayaran/")) {
    return `${import.meta.env.VITE_STORAGE_URL}/${imagePath}`;
  }

  // Hapus 'kosans/' dari path jika sudah ada
  const cleanPath = imagePath.replace(/^kosans\//, "");
  return `${import.meta.env.VITE_STORAGE_URL}/kosans/${cleanPath}`;
};

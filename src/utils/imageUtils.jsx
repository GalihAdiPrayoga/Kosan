export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  // Hapus 'kosans/' dari path jika sudah ada
  const cleanPath = imagePath.replace(/^kosans\//, "");
  return `${import.meta.env.VITE_STORAGE_URL}/kosans/${cleanPath}`;
};

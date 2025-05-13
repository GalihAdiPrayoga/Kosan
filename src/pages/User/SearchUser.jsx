import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { API } from "../../api/config";
import { FaSearchMinus, FaMapMarkerAlt } from "react-icons/fa";
import { getImageUrl } from "../../utils/imageUtils";
import ImageWithFallback from "../../components/ImageWithFallback";

const ITEMS_PER_PAGE = 9;

// Tambahkan debounce untuk filter
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const SearchUser = () => {
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    type: "all",
    facilities: [],
    sortBy: "price_asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const fetchKos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/kosans/public");

      if (!response.data?.data) {
        throw new Error("Data tidak valid");
      }

      const transformedData = response.data.data.map((kos) => {
        let kosType = "Campur";

        if (kos.kategori && typeof kos.kategori === "object") {
          kosType = kos.kategori.nama_kategori;
        } else if (kos.kategori_id) {
          switch (kos.kategori_id) {
            case 1:
              kosType = "Kos Putra";
              break;
            case 2:
              kosType = "Kos Putri";
              break;
            case 3:
              kosType = "Kos Campur";
              break;
            default:
              kosType = "Campur";
          }
        } else {
          const kosName = kos.nama_kosan.toLowerCase();
          if (kosName.includes("putri")) kosType = "Kos Putri";
          else if (kosName.includes("putra")) kosType = "Kos Putra";
        }

        return {
          id: kos.id,
          name: kos.nama_kosan,
          location: kos.alamat,
          price: Number(kos.harga_per_bulan),
          type: kosType,
          facilities: Array.isArray(kos.fasilitas)
            ? kos.fasilitas.map((f) => f.nama_fasilitas)
            : [],
          images: Array.isArray(kos.galeri)
            ? kos.galeri.map((img) => getImageUrl(img))
            : [],
          available_rooms: Number(kos.jumlah_kamar) || 0,
        };
      });

      setKosList(transformedData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mengambil data kos. Silakan coba lagi nanti."
      );
    } finally {
      setLoading(false);
    }
  };

  // Gunakan useEffect untuk menerapkan debounce pada filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filters]);

  // Update filteredKos untuk menggunakan debouncedFilters
  const filteredKos = useMemo(() => {
    return kosList.filter((kos) => {
      const matchLocation = debouncedFilters.location
        ? kos.location
            .toLowerCase()
            .includes(debouncedFilters.location.toLowerCase()) ||
          kos.name
            .toLowerCase()
            .includes(debouncedFilters.location.toLowerCase())
        : true;

      const min =
        parseInt(debouncedFilters.minPrice.toString().replace(/\D/g, "")) || 0;
      const max =
        parseInt(debouncedFilters.maxPrice.toString().replace(/\D/g, "")) ||
        Infinity;

      const matchPrice = kos.price >= min && kos.price <= max;

      // Perbaikan logika untuk tipe kos
      const matchType =
        debouncedFilters.type === "all" ||
        kos.type?.toLowerCase().includes(debouncedFilters.type.toLowerCase());

      const matchFacilities =
        debouncedFilters.facilities.length === 0 ||
        debouncedFilters.facilities.every((facility) =>
          kos.facilities.some((f) => f.toLowerCase() === facility.toLowerCase())
        );

      return matchLocation && matchPrice && matchType && matchFacilities;
    });
  }, [kosList, debouncedFilters]);

  const paginatedKos = useMemo(() => {
    const sorted = [...filteredKos].sort((a, b) =>
      filters.sortBy === "price_asc" ? a.price - b.price : b.price - a.price
    );
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sorted.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredKos, filters.sortBy, currentPage]);

  useEffect(() => {
    fetchKos();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numeric = value.replace(/\D/g, "");
    setFilters((prev) => ({
      ...prev,
      [name]: numeric,
    }));
  };

  const handleFacilityChange = (facility) => {
    setFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const formatPrice = (val) =>
    new Intl.NumberFormat("id-ID").format(Number(val || 0));

  const renderPagination = () => {
    const total = Math.ceil(filteredKos.length / ITEMS_PER_PAGE);
    return (
      <nav>
        <ul className="pagination">
          {[...Array(total)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  const renderKosCard = (kos) => (
    <Card
      as={Link}
      to={`/kos/${kos.id}`}
      className="text-decoration-none h-100 shadow-sm hover-shadow"
    >
      <div style={{ position: "relative" }}>
        <ImageWithFallback
          src={kos.images[0]}
          fallbackSrc="/images/default-kos.jpg"
          alt={kos.name}
          style={{
            height: "200px",
            width: "100%",
            objectFit: "cover",
            borderTopLeftRadius: "calc(0.375rem - 1px)",
            borderTopRightRadius: "calc(0.375rem - 1px)",
          }}
        />
        <Badge
          bg={
            kos.type?.toLowerCase().includes("putra")
              ? "primary"
              : kos.type?.toLowerCase().includes("putri")
              ? "danger"
              : "success"
          }
          className="position-absolute"
          style={{ top: "10px", right: "10px", padding: "8px 12px" }}
        >
          {kos.type}
        </Badge>
      </div>
      <Card.Body>
        <Card.Title className="h5 mb-3">{kos.name}</Card.Title>
        <Card.Text className="text-muted mb-2 d-flex align-items-center">
          <FaMapMarkerAlt className="me-2" />
          {kos.location}
        </Card.Text>
        <div className="mb-2">
          {kos.facilities?.slice(0, 3).map((f, i) => (
            <Badge key={i} bg="light" text="dark" className="me-2 mb-2">
              {f}
            </Badge>
          ))}
        </div>
        <div className="mt-3">
          <span className="h5 text-primary">Rp {formatPrice(kos.price)}</span>
          <span className="text-muted">/bulan</span>
        </div>
      </Card.Body>
    </Card>
  );

  // Tambahkan fungsi untuk handle reset yang lebih smooth
  const handleReset = () => {
    setFilters({
      location: "",
      minPrice: "",
      maxPrice: "",
      type: "all",
      facilities: [],
      sortBy: "price_asc",
    });
    setCurrentPage(1);
  };

  // Update form pencarian dengan autocomplete off
  return (
    <Container className="py-5">
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col md={3}>
          <Card className="mb-4 shadow-sm sticky-top" style={{ top: "20px" }}>
            <Card.Body>
              <h5 className="mb-4">Filter Pencarian</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Lokasi</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Cari berdasarkan lokasi atau nama kos..."
                    value={filters.location}
                    onChange={handleFilterChange}
                    autoComplete="off"
                    className="search-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Range Harga</Form.Label>
                  <div className="d-flex gap-2 align-items-center">
                    <div className="flex-1 position-relative">
                      <div
                        className="position-absolute start-0 ps-2 text-muted"
                        style={{ top: "50%", transform: "translateY(-50%)" }}
                      >
                        Rp
                      </div>
                      <Form.Control
                        type="text"
                        name="minPrice"
                        placeholder="  Minimum"
                        value={
                          filters.minPrice ? formatPrice(filters.minPrice) : ""
                        }
                        onChange={handlePriceChange}
                        className="ps-4"
                      />
                    </div>
                    <span>-</span>
                    <div className="flex-1 position-relative">
                      <div
                        className="position-absolute start-0 ps-2 text-muted"
                        style={{ top: "50%", transform: "translateY(-50%)" }}
                      >
                        Rp
                      </div>
                      <Form.Control
                        type="text"
                        name="maxPrice"
                        placeholder="  Maximum"
                        value={
                          filters.maxPrice ? formatPrice(filters.maxPrice) : ""
                        }
                        onChange={handlePriceChange}
                        className="ps-4"
                      />
                    </div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipe Kos</Form.Label>
                  <Form.Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="all">Semua Tipe</option>
                    <option value="Kos Putri">Kos Putri</option>
                    <option value="Kos Putra">Kos Putra</option>
                    <option value="Kos Campur">Kos Campuran</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fasilitas</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      "AC",
                      "WiFi",
                      "Kamar Mandi Dalam",
                      "Laundry",
                      "Parkir",
                    ].map((facility) => (
                      <Form.Check
                        key={facility}
                        type="checkbox"
                        label={facility}
                        checked={filters.facilities.includes(facility)}
                        onChange={() => handleFacilityChange(facility)}
                        className="me-3"
                      />
                    ))}
                  </div>
                </Form.Group>

                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={handleReset}
                  >
                    Reset Filter
                  </button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4>Hasil Pencarian</h4>
              <p className="text-muted mb-0">
                Ditemukan {filteredKos.length} kos
                {filteredKos.length > 0 &&
                  ` (Halaman ${currentPage} dari ${Math.ceil(
                    filteredKos.length / ITEMS_PER_PAGE
                  )})`}
              </p>
            </div>
            <Form.Select
              className="w-auto"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="price_asc">Harga: Rendah ke Tinggi</option>
              <option value="price_desc">Harga: Tinggi ke Rendah</option>
            </Form.Select>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : filteredKos.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center">
                <FaSearchMinus size={64} className="text-muted" />
                <div className="mt-4">
                  <h5 className="text-muted mb-2">Data Tidak Ditemukan</h5>
                  <p className="text-muted mb-0">
                    Coba sesuaikan filter pencarian Anda
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Row>
                {paginatedKos.map((kos) => (
                  <Col md={4} key={kos.id} className="mb-4">
                    {renderKosCard(kos)}
                  </Col>
                ))}
              </Row>
              {filteredKos.length > ITEMS_PER_PAGE && (
                <div className="d-flex justify-content-center mt-4">
                  {renderPagination()}
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

// Tambahkan CSS untuk input pencarian
const styles = `
.search-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  border-color: #80bdff;
}
`;

// Tambahkan style tag ke head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default SearchUser;

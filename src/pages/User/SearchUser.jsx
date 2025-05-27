import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Alert,
  Badge,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { API } from "../../api/config";
import { FaSearchMinus } from "react-icons/fa";

const ITEMS_PER_PAGE = 9;

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

  const fetchKos = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get("/kosans");

      if (!response.data?.data) {
        throw new Error("Data tidak valid");
      }

      const transformedData = response.data.data.map((kos) => ({
        id: kos.id,
        name: kos.nama_kosan,
        location: kos.alamat,
        price: kos.harga_per_bulan,
        // Perbaikan akses data kategori
        type: kos.kategori?.nama_kategori || kos.kategori?.nama || "Tidak Ada",
        facilities: kos.fasilitas
          ? typeof kos.fasilitas === "string"
            ? kos.fasilitas.split(",").map((f) => f.trim())
            : kos.fasilitas
          : [],
        images: kos.galeri
          ? typeof kos.galeri === "string"
            ? JSON.parse(kos.galeri)
            : kos.galeri
          : [],
      }));

      console.log("Raw API Response:", response.data.data); // untuk debug
      console.log("Transformed Data:", transformedData); // untuk debug

      setKosList(transformedData);
    } catch (err) {
      console.error("Error fetching kos:", err);
      setError(err.response?.data?.message || "Gagal mengambil data kos");
    } finally {
      setLoading(false);
    }
  };

  const filteredKos = React.useMemo(() => {
    return kosList.filter((kos) => {
      const matchLocation = kos.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());

      const matchPrice =
        (!filters.minPrice || kos.price >= filters.minPrice) &&
        (!filters.maxPrice || kos.price <= filters.maxPrice);

      const matchType =
        filters.type === "all" ||
        kos.type.toLowerCase() === filters.type.toLowerCase();

      const matchFacilities =
        filters.facilities.length === 0 ||
        filters.facilities.every((facility) =>
          kos.facilities
            .map((f) => f.toLowerCase())
            .includes(facility.toLowerCase())
        );

      return matchLocation && matchPrice && matchType && matchFacilities;
    });
  }, [kosList, filters]);

  const paginatedKos = React.useMemo(() => {
    const sortedKos = [...filteredKos].sort((a, b) => {
      if (filters.sortBy === "price_asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedKos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
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

  const handleFacilityChange = (facility) => {
    setFilters((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, "");
    setFilters((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredKos.length / ITEMS_PER_PAGE);

    return (
      <nav>
        <ul className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index + 1}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  return (
    <Container className="py-5">
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {/* Filter sidebar */}
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
                    placeholder="Cari berdasarkan lokasi..."
                    value={filters.location}
                    onChange={handleFilterChange}
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
                  <div className="mt-2 text-muted small">
                    {filters.minPrice && filters.maxPrice ? (
                      <span>
                        Range: Rp {formatPrice(filters.minPrice)} - Rp{" "}
                        {formatPrice(filters.maxPrice)}
                      </span>
                    ) : (
                      <span></span>
                    )}
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
                    <option value="Putra">Kos Putra</option>
                    <option value="Putri">Kos Putri</option>
                    <option value="Campur">Kos Campur</option>
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
                    onClick={() => {
                      setFilters({
                        location: "",
                        minPrice: "",
                        maxPrice: "",
                        type: "all",
                        facilities: [],
                        sortBy: "price_asc",
                      });
                    }}
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
                Ditemukan {filteredKos.length} kos (Halaman {currentPage} dari{" "}
                {Math.ceil(filteredKos.length / ITEMS_PER_PAGE)})
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
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : filteredKos.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center">
                <FaSearchMinus size={64} className="text-muted mb-4" />
                <h5 className="text-muted mb-2">Data Tidak Ditemukan</h5>
                <p className="text-muted mb-0">
                  Coba sesuaikan filter pencarian Anda
                </p>
              </div>
            </div>
          ) : (
            <>
              <Row>
                {paginatedKos.map((kos) => (
                  <Col md={4} key={kos.id} className="mb-4">
                    <Card
                      as={Link}
                      to={`/kos/${kos.id}`}
                      className="text-decoration-none h-100 shadow-sm hover-shadow"
                    >
                      <div style={{ position: "relative" }}>
                        <Card.Img
                          variant="top"
                          src={kos.images?.[0] || "/default-kos-image.jpg"} // Tambahkan default image
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <Badge
                          bg={
                            kos.type?.toLowerCase().includes("putra")
                              ? "primary"
                              : kos.type?.toLowerCase().includes("putri")
                              ? "danger"
                              : "success"
                          }
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            padding: "8px 12px",
                          }}
                        >
                          {kos.type}
                        </Badge>
                      </div>
                      <Card.Body>
                        <Card.Title className="h5 mb-3">{kos.name}</Card.Title>
                        <Card.Text className="text-muted mb-2">
                          <i className="bi bi-geo-alt-fill me-2"></i>
                          {kos.location}
                        </Card.Text>
                        <div className="mb-2">
                          {kos.facilities.slice(0, 3).map((facility, index) => (
                            <Badge
                              bg="light"
                              text="dark"
                              className="me-2 mb-2"
                              key={index}
                            >
                              {facility}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3">
                          <span className="h5 text-primary mb-0">
                            Rp{" "}
                            {new Intl.NumberFormat("id-ID").format(kos.price)}
                          </span>
                          <span className="text-muted">/bulan</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {filteredKos.length > 0 && (
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

export default SearchUser;

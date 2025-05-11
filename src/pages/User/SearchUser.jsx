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
      const response = await API.get("/kosans"); // Menggunakan endpoint /kosans
      if (response.data?.data) {
        setKosList(response.data.data);
      } else {
        throw new Error("Data tidak valid");
      }
    } catch (err) {
      setError("Gagal mengambil data kos: " + err.message);
      setKosList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredKos = React.useMemo(() => {
    return kosList.filter((kos) => {
      // Location filter
      if (filters.location && filters.location.trim() !== "") {
        const searchTerm = filters.location.toLowerCase().trim();
        if (
          !kos?.location?.toLowerCase().includes(searchTerm) &&
          !kos?.name?.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      // Type filter
      if (filters.type !== "all" && kos?.type !== filters.type) {
        return false;
      }

      // Price range filter
      const price = parseInt(kos?.price || 0);
      if (filters.minPrice && price < parseInt(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && price > parseInt(filters.maxPrice)) {
        return false;
      }

      // Facilities filter
      if (filters.facilities.length > 0) {
        return filters.facilities.every((facility) =>
          kos?.facilities?.includes(facility)
        );
      }

      return true;
    });
  }, [kosList, filters]);

  const paginatedKos = React.useMemo(() => {
    const sorted = [...filteredKos].sort((a, b) => {
      const priceA = parseInt(a?.price || 0);
      const priceB = parseInt(b?.price || 0);

      switch (filters.sortBy) {
        case "price_asc":
          return priceA - priceB;
        case "price_desc":
          return priceB - priceA;
        default:
          return 0;
      }
    });

    // Calculate pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sorted.slice(startIndex, endIndex);
  }, [filteredKos, filters.sortBy, currentPage]);

  const totalPages = Math.ceil(filteredKos.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchKos(); // Langsung memanggil fetchKos tanpa delay
  }, []); // Hanya dipanggil sekali saat komponen dimount

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    if ((name === "minPrice" || name === "maxPrice") && value !== "") {
      const numValue = parseInt(value);
      if (numValue < 0) return;

      if (
        name === "minPrice" &&
        filters.maxPrice &&
        numValue > parseInt(filters.maxPrice)
      ) {
        return;
      }

      if (
        name === "maxPrice" &&
        filters.minPrice &&
        numValue < parseInt(filters.minPrice)
      ) {
        return;
      }
    }

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

    // Remove non-numeric characters and dots
    const numericValue = value.replace(/[^\d]/g, "");

    // Early return if empty
    if (numericValue === "") {
      setFilters((prev) => ({
        ...prev,
        [name]: "",
      }));
      return;
    }

    const numValue = parseInt(numericValue);

    // Basic validation
    if (numValue < 0) return;

    // Update the value while preserving the other price input
    setFilters((prev) => ({
      ...prev,
      [name]: numericValue,
      // Keep the other price value unchanged
      ...(name === "minPrice"
        ? { maxPrice: prev.maxPrice }
        : { minPrice: prev.minPrice }),
    }));

    // Additional validation after setting the value
    if (
      name === "maxPrice" &&
      filters.minPrice &&
      numValue < parseInt(filters.minPrice)
    ) {
      // Show optional warning or handle invalid range
      console.log("Maximum price cannot be less than minimum price");
    }

    if (
      name === "minPrice" &&
      filters.maxPrice &&
      numValue > parseInt(filters.maxPrice)
    ) {
      // Show optional warning or handle invalid range
      console.log("Minimum price cannot be greater than maximum price");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const renderPagination = () => {
    let items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    items.push(
      <Pagination.First
        key="first"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      />
    );

    if (startPage > 1) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => setCurrentPage(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      />
    );
    items.push(
      <Pagination.Last
        key="last"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(totalPages)}
      />
    );

    return <Pagination>{items}</Pagination>;
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
                {totalPages})
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
                          src={kos.image_url || kos.images?.[0]} // Sesuaikan dengan struktur API
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <Badge
                          bg={
                            kos.type === "Putra"
                              ? "primary"
                              : kos.type === "Putri"
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
                          {kos.location || kos.alamat} // Sesuaikan dengan field
                          API
                        </Card.Text>
                        <div className="mb-2">
                          {(kos.facilities || kos.fasilitas || [])
                            .slice(0, 3)
                            .map((facility, index) => (
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
                            {new Intl.NumberFormat("id-ID").format(
                              kos.price || kos.harga
                            )}
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

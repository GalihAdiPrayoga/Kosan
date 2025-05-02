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

const ITEMS_PER_PAGE = 9;

const SearchUser = () => {
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: "",
    priceRange: "",
    type: "all",
    facilities: [],
    sortBy: "price_asc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchKos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get("/db.json");
      setKosList(response.data?.kos || []);
    } catch (err) {
      setError("Failed to fetch kos data: " + err.message);
      setKosList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredKos = React.useMemo(() => {
    return kosList.filter((kos) => {
      if (filters.location && filters.location.trim() !== "") {
        const searchTerm = filters.location.toLowerCase().trim();
        if (
          !kos?.location?.toLowerCase().includes(searchTerm) &&
          !kos?.name?.toLowerCase().includes(searchTerm)
        ) {
          return false;
        }
      }

      if (filters.type !== "all" && kos?.type !== filters.type) {
        return false;
      }

      if (filters.priceRange) {
        const price = parseInt(kos?.price || 0);
        switch (filters.priceRange) {
          case "1":
            if (price >= 1000000) return false;
            break;
          case "2":
            if (price < 1000000 || price > 2000000) return false;
            break;
          case "3":
            if (price <= 2000000) return false;
            break;
          default:
            break;
        }
      }

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
    const timer = setTimeout(() => {
      fetchKos();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.location]);

  // Reset page when filters change
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
                  <Form.Select
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                  >
                    <option value="">Semua Harga</option>
                    <option value="1">&lt; Rp 1.000.000</option>
                    <option value="2">Rp 1.000.000 - Rp 2.000.000</option>
                    <option value="3">&gt; Rp 2.000.000</option>
                  </Form.Select>
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
                          src={kos.images[0]}
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

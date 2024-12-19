import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ServiceTable_css1.css";

const ServiceTable = () => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async (pageNumber) => {
        setLoading(true);
        const url = `http://20.193.149.47:2242/salons/service/?page=${pageNumber}`;
        try {
            const response = await axios.get(url);
            const data = response.data;
            setServices(data.results);
            setFilteredServices(data.results);
            setNextPageUrl(data.next);
            setPrevPageUrl(data.previous);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = services.filter((service) =>
            service.service_name.toLowerCase().includes(value)
        );
        setFilteredServices(filtered);
    };

    const handleNextPage = () => {
        if (nextPageUrl) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (prevPageUrl) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="service-table-container">
            <h1 className="title">Service List</h1>
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
            />
            <div className="table-wrapper">
                <table className="service-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Gender</th>
                            <th>Salon</th>
                            <th>City</th>
                            <th>Area</th>
                            <th>Service Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="12" className="loading-state">
                                    Loading Data...
                                </td>
                            </tr>
                        ) : filteredServices.length === 0 ? (
                            <tr>
                                <td colSpan="12" className="no-data-state">
                                    No Data Available
                                </td>
                            </tr>
                        ) : (
                            filteredServices.map((service) => (
                                <tr key={service.id}>
                                    <td>{service.id}</td>
                                    <td>{service.service_name}</td>
                                    <td dangerouslySetInnerHTML={{ __html: service.description }}></td>
                                    <td>${service.price}</td>
                                    <td>{service.discount}%</td>
                                    <td>{service.gender}</td>
                                    <td>{service.salon_name}</td>
                                    <td>{service.city}</td>
                                    <td>{service.area}</td>
                                    <td>
                                        <img
                                            src={service.service_image}
                                            alt={service.service_name}
                                            width="100"
                                            height="auto"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="pagination">
                <button
                    onClick={handlePrevPage}
                    disabled={!prevPageUrl}
                    className="pagination-btn"
                >
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={!nextPageUrl}
                    className="pagination-btn"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ServiceTable;

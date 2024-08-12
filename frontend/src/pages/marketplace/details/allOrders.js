import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './allOrders.css'; 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import OrderChart from '../../../components/charts/OrderChart';
import IncomeChart from '../../../components/charts/IncomeChart';
import OrdersByWeekChart from '../../../components/charts/OrdersByWeekChart';
import PDFContainer from '../PDF/PDFContainer';

function AllOrders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [showUpdatePopup, setShowUpdatePopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [orderStats, setOrderStats] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/order/');
            setOrders(response.data);
            setFilteredOrders(response.data); 
            prepareOrderStats(response.data); 
        } catch (err) {
            setError(err.message || 'Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    const generateCustomOrderId = (order) => {
      if (order && typeof order._id === 'string' && order._id.length >= 4) {
            return `ORD-${order._id.substr(order._id.length - 4)}`;
        } else {
            return 'Invalid Order ID';
        }
    };
    
    const handleRefresh = () => {
        fetchOrders();
    };

    const handleChangeStatus = async () => {
        try {
            await axios.put(`http://localhost:5000/api/order/updateStatus/${selectedOrderId}`, { status: selectedStatus });
            fetchOrders();
            setSelectedStatus('');
            setSelectedOrderId('');
            setShowUpdatePopup(false);
        } catch (err) {
            console.error('Failed to update order status:', err);
        }
    };

    const handleStatusChange = (e, orderId) => {
        setSelectedStatus(e.target.value);
        setSelectedOrderId(orderId);
        setShowUpdatePopup(true);
    };

    const handleSearch = () => {
        const filtered = orders.filter(order => generateCustomOrderId(order) === searchQuery);
        setFilteredOrders(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const prepareOrderStats = (ordersData) => {
        const stats = {};
        ordersData.forEach((order) => {
            const orderDate = new Date(order.orderDate).toLocaleDateString();
            if (!stats[orderDate]) {
                stats[orderDate] = 0;
            }
            stats[orderDate] += order.totalCost;
        });
        const sortedStats = Object.entries(stats).sort((a, b) => new Date(a[0]) - new Date(b[0]));
        setOrderStats(sortedStats);
    };

    const handleDownloadReport = () => {
        const reportData = generateReportData(orders);
        const link = document.createElement("a");
        link.setAttribute("href", reportData);
        link.setAttribute("download", "all_orders_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handlePDFDownloadReport = () => {
        const input = document.getElementById('report-container');
        if (!input) {
            console.error("Container element with ID 'report-container' not found.");
            return;
        }
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgWidth = 210;
                const pageHeight = 295;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('all_orders_report.pdf');
            })
            .catch((error) => {
                console.error('Error generating PDF:', error);
            });
    };
    

    const generateReportData = (orders) => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Order ID,Customer,Order Date,Status,Net Amount\n";
        orders.forEach((order) => {
            const orderId = generateCustomOrderId(order);
            const customer = order.customer;
            const orderDate = new Date(order.orderDate).toLocaleDateString();
            const status = order.orderStatus;
            const netAmount = order.totalCost.toFixed(2);
            csvContent += `${orderId},${customer},${orderDate},${status},${netAmount}\n`;
        });
        return encodeURI(csvContent);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const totalOrders = orders.length;
    const totalNetAmount = orders.reduce((acc, order) => acc + order.totalCost, 0);
    const shippedOrders = orders.filter(order => order.orderStatus === 'Shipped').length;
    const pendingOrders = orders.filter(order => order.orderStatus === 'Pending').length;

    return (
        <div className="allorders">
            <div className="order-result">
                <div className="order-stats21">
                    <div className="order-stat-box211">
                        <h3>Total Orders</h3>
                        <p>{totalOrders}</p>
                    </div>
                    <div className="order-stat-box212">
                        <h3>Total Net Amount</h3>
                        <p>${totalNetAmount.toFixed(2)}</p>
                    </div>
                    <div className="order-stat-box213">
                        <h3>Shipped Orders</h3>
                        <p>{shippedOrders}</p>
                    </div>
                    <div className="order-stat-box214">
                        <h3>Pending Orders</h3>
                        <p>{pendingOrders}</p>
                    </div>
                </div>
            </div>
              
            <div className="cl21">
                <div className="col-sm-8">						
                    <button className="btn21 btn-primary21" onClick={handleRefresh}>
                        <span>Refresh List</span>
                    </button>  .
                    <button className="btn21 btn-secondary21" onClick={handleDownloadReport}>
                        <span>Excel Download Report</span>
                    </button>  .
                    <button className="btn21 btn-thee21" onClick={handlePDFDownloadReport}>
                        <span>PDF Download</span>
                    </button>
                </div>
                        
                {/*Search */}
                <div className="search-container">
                    <input type="text" placeholder="Search by Order ID" value={searchQuery} onChange={handleSearchChange} className="order-search-input21"/>
                    <button onClick={handleSearch} className="order-search21">Search</button>
                </div>
            </div>     
            <PDFContainer companyName="Farm Link">
            {/* Table  */}
            <div className="order-table-container21">
                <table className="order-table21">
                    <thead className="order-thead21">
                        <tr>
                            <th>#</th>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Order Date</th>						
                            <th>Status</th>						
                            <th>Net Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="order-body21">
                        {filteredOrders.map((order, index) => (
                            <tr key={order._id}>
                                <td>{index + 1}</td>
                                <td>{generateCustomOrderId(order)}</td> 
                                <td>{order.customer}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>{order.orderStatus}</td>
                                <td>${order.totalCost.toFixed(2)}</td>
                                <td>
                                    <div className="select-wrapper21">
                                        <select value={selectedStatus} onChange={(e) => handleStatusChange(e, order._id)}>
                                            <option value=""></option>
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Checking">Checking</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="chart-container21">
                {/* Charts  */}
                <br/>
                <div className="pie-chart-container">
                    <h2>Orders by Status</h2>
                    <OrderChart shippedOrders={shippedOrders} pendingOrders={pendingOrders} />  
                </div>
                <br/>
                <div className="bar-chart-container">
                    <h2>Orders by Week</h2>
                    <OrdersByWeekChart orderStats={orderStats} /> 
                </div>
                <br/><br/>   
                <div className="line-chart-container">
                    <h2>Total Income Day by Day</h2>
                    <IncomeChart orderStats={orderStats} />
                </div>
            </div>               
            </PDFContainer>

            {/* Update Modal Box */}
            {showUpdatePopup && (
                <div className="popup21">
                    <div className="popup-content21" style={{ width: "400px" }}>
                        <h2>Update Order Status</h2>
                        <div className="button-container21">
                            <button onClick={handleChangeStatus}>Update</button>
                            <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllOrders;

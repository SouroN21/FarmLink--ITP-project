import "antd/dist/reset.css";
import React, { useState, useEffect } from "react";
import logo from '../../assets/logo.png';

import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  Tag,
  message,
  Row,
  DatePicker,
  InputNumber,
} from "antd";
import { offerService } from "../../services/offerService";
import productService from "../../services/productService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import Moment from "react-moment";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
 
const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [form] = Form.useForm();
  const [editingOffer, setEditingOffer] = useState(null);
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
 
  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);
 
  const fetchOffers = async (startDate, endDate) => {
    try {
      const data = await offerService.getAllOffers(startDate, endDate);
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };
 
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
 
  const handleFilterChange = async (dates) => {
    if (dates) {
      const startDate = dates[0].toISOString();
      const endDate = dates[1].toString();
    console.log("first",endDate)
      setFilterStartDate(dates[0]);
      setFilterEndDate( dates[0]);
      const data = await offerService.getoffersBydate(startDate,endDate);
      if(data){
        console.log("dataresponse",data)
        setOffers(data)
      }
   
 
    } else {
      setFilterStartDate(null);
      setFilterEndDate(null);
      fetchOffers();
    }
  };
 
  const handleAddOffer = () => {
    setModalVisible(true);
    form.resetFields();
    setEditingOffer(null);
  };
 
  const handleCancel = () => {
    setModalVisible(false);
  };
 
  const handleSubmit = async (values) => {
    try {
      if (editingOffer) {
        await offerService.updateOffer(editingOffer._id, {
          ...values,
          startDate: values.dateRange[0],
          endDate: values.dateRange[1],
        });
        setModalVisible(false);
        fetchOffers();
        form.resetFields();
        setEditingOffer(null);
      } else {
        const response = await offerService.createOffer({
          ...values,
          startDate: values.dateRange[0],
          endDate: values.dateRange[1],
        });
        if (response.status === 406) {
          message.error(response.message);
        } else {
          setModalVisible(false);
          fetchOffers();
          form.resetFields();
          setEditingOffer(null);
        }
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };
 
  const handleDeleteOffer = async (offerId) => {
    try {
      await offerService.deleteOffer(offerId);
      await fetchOffers();
      message.success("Offer deleted successfully");
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };
 
  const columns = [
    {
      title: "Coupon",
      dataIndex: "coupon",
      key: "coupon",
      render: (coupon) => (coupon ? coupon : "No coupon required"),
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate) => moment(startDate).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => moment(endDate).format("YYYY-MM-DD"),
    },
    {
      title: "Products",
      dataIndex: "product",
      key: "products",
      render: (sps, record) => {
        const ps = record.products;
 
        if (ps.length === 0) {
          return <span>All</span>;
        }
        const productTags = ps.map((productId) => {
          const product = products.find((p) => p._id === productId);
          return product ? <Tag key={productId}>{product.name}</Tag> : null;
        });
 
        return <span>{productTags}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => handleEditOffer(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this offer?"
            onConfirm={() => handleDeleteOffer(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger style={{ marginLeft: 8 }}>
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];
 
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.addImage(logo, 'JPEG', 160, 10, 30, 30); // Replace with the path to your logo image
 
    // Set up company header and logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(60, 80, 60); // Dark green color
    doc.addImage(logo, 'JPEG', 160, 10, 30, 30); // Add company logo
    doc.text('FarmLink.Org', 10, 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Email: FarmLink.Org@outlook.com', 10, 20);
    doc.text('Phone: 0761827545', 10, 30);

    // Report Title
    doc.setFontSize(14);
    doc.setTextColor(100, 150, 100); // Theme color
    doc.text('Product Offers Report', 10, 45);

    let y = 55; // Start content below the header

    // Offers Table
    const rows = offers.map((offer, index) => {
        const productNames = offer.products
            .map(productId => {
                const product = products.find(p => p._id === productId);
                return product ? product.name : "";
            })
            .join(", ");

        return [index + 1, offer.coupon, offer.discount, productNames];
    });

    doc.autoTable({
        startY: y,
        head: [['#', 'Coupon', 'Discount', 'Products']],
        body: rows,
    });

    // Save the PDF
    doc.save("offers.pdf");
};



 
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    form.setFieldsValue({
      ...offer,
    });
    setModalVisible(true);
  };
 
  const handleFilterProducts = () => {
    
      navigate("/offers-preview");
  
  }
 
  return (
    <div style={{ padding: 60 }}>
      <h1>Offer Management</h1>
      <Row justify={"space-between"} style={{ marginBottom: 20 }}>
        <DatePicker.RangePicker
          onChange={handleFilterChange}
          style={{ marginRight: 20 }}
        />
        <Button type="primary" onClick={handleAddOffer}>
          Add Offer
        </Button>
        <Button type="primary" onClick={generatePDF}>
          Download Report
        </Button>
        <Button type="primary" onClick={handleFilterProducts}>
         Preview
        </Button>
      </Row>
      <Table dataSource={offers} columns={columns} rowKey="_id" />
 
      <Modal
        title={editingOffer ? "Edit Offer" : "Add Offer"}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item label="Coupon" name="coupon">
            <Input />
          </Form.Item>
          <Form.Item
            label="Discount (%)"
            name="discount"
            rules={[{ required: true, message: "Please input a discount" }]}
          >
          <Input type="number" min={0} max={100} />
            
          </Form.Item>
          <Form.Item label="Products" name="products">
            <Select
              mode="multiple"
              placeholder="Select products"
              onChange={(value) => setSelectedProducts(value)}
            >
              {products.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* Date Range Picker */}
          <Form.Item
            label="Date Range"
            name="dateRange"
            rules={[{ required: true, message: "Please select date range" }]}
          >
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingOffer ? `Edit` : `Submit`}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
 
export default OfferManagement;

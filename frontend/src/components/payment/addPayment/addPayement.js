import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdatePayment = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState({
    holdername: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    address: '',
    city: '',
    state: '',
    zipcode: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/payment/get/${id}`)
      .then((res) => {
        setPayment(res.data.payment);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error fetching payment details');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment(prevPayment => ({
      ...prevPayment,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/payment/update/${id}`, payment)
      .then((res) => {
        toast.success("Payment Updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error updating payment');
      });
  };

  return (
    <div>
    
      <form onSubmit={handleSubmit}>
        <div className="container mt-5 px-5">
          <div className="mb-4">
            <h2>Update Payment Details</h2>
            <span>Update your payment information below.</span>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="card p-3">
                <h6 className="text-uppercase">Payment details</h6>
                <div className="inputbox mt-3">
                  <input type="text" name="holdername" className="form-control" value={payment.holdername} onChange={handleChange} />
                  <span>Name on card</span>
                </div>
                <div className="inputbox mt-3">
                  <input type="email" name="email" className="form-control" value={payment.email} onChange={handleChange} />
                  <span>Email Address</span>
                </div>
                {/* Add more input fields for other payment details */}
                <div className="mt-4 mb-4">
                  <h6 className="text-uppercase">Billing Address</h6>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="inputbox mt-3 mr-2">
                        <input type="text" name="address" className="form-control" value={payment.address} onChange={handleChange} />
                        <span>Street Address</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="inputbox mt-3 mr-2">
                        <input type="text" name="city" className="form-control" value={payment.city} onChange={handleChange} />
                        <span>City</span>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-6">
                      <div className="inputbox mt-3 mr-2">
                        <input type="text" name="state" className="form-control" value={payment.state} onChange={handleChange} />
                        <span>State/Province</span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="inputbox mt-3 mr-2">
                        <input type="text" name="zipcode" className="form-control" value={payment.zipcode} onChange={handleChange} />
                        <span>Zip code</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-4 d-flex justify-content-between">
                <button className="btn btn-primary" type="submit">Update Payment</button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default UpdatePayment;

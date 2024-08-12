import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../components/card/Card";
import axios from "axios";
import GlobalStyles from '../../GlobalStyles';
//import toast from 'react-hot-toast';
import "./BiddingForm.scss";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook



const BiddingForm = () => {
  const navigate = useNavigate(); // Get the navigate function
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [biddingEndTime, setBiddingEndTime]= useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({}); // State to manage form validation errors

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") setDescription(value);
    if (name === "location") setLocation(value);
    if (name === "category") setCategory(value);
    if (name === "title") setTitle(value);
    if (name === "startingPrice") setStartingPrice(value);
    if (name ==="biddingEndTime") setBiddingEndTime(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //form validations
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = "Title is required";
    }
    if (!description.trim()) {
      errors.description = "Description is required";
    }
    if (!location.trim()) {
      errors.location = "Location is required";
    }
    if (!category) {
      errors.category = "Category is required";
    }
    if (!startingPrice.trim()) {
      errors.startingPrice = "Starting Price is required";
    } else if (isNaN(startingPrice)) {
      errors.startingPrice = "Starting Price must be a number";
    }
    if (!image) {
      errors.image = "Image is required";
    }
    if (!biddingEndTime) {
      errors.biddingEndTime = "End time is required";
    }
    return errors;
  };

  const saveBidding = async (e) => {
    e.preventDefault();

    const errors = validateForm(); // Validate form fields
    if (Object.keys(errors).length > 0) {
      setErrors(errors); // Set validation errors in state
      
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description.replace(/<p>/g, '').replace(/<\/p>/g, ''));
      formData.append("location", location);
      formData.append("category", category);
      formData.append("title", title);
      formData.append("startingPrice", startingPrice);
      formData.append("image", image);
      formData.append("biddingEndTime", biddingEndTime);

      const res = await axios.post("http://localhost:5000/api/buyer/createPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data); // Assuming the backend returns the saved bidding data
      
      // Clear form fields after successful submission
      setDescription("");
      setLocation("");
      setCategory("");
      setTitle("");
      setStartingPrice("");
      setImage(null);
      setImagePreview(null);
      setBiddingEndTime("");
      navigate('/addBidding');

      
        toast.success('Your Bid Placed Succesfully.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
        })

     

    } catch (error) {
      console.log(error);
      toast.error('Something Went Wrong.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
      })
  }
  };

  return (
    <div className="add-bidding">
      <GlobalStyles/>      
      <Card cardClass={"card"}>
        <h2 style={{alignSelf:'center'}}>Add A Bidding</h2>
        <form onSubmit={saveBidding}>
          <label>Title:</label>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={handleInputChange}
          />
          {errors.title && <span className="error">{errors.title}</span>}

          <label>Description:</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            modules={BiddingForm.modules}
            formats={BiddingForm.formats}
          />
          {errors.description && <span className="error">{errors.description}</span>}

          <label>Location:</label>
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={handleInputChange}
          />
          {errors.location && <span className="error">{errors.location}</span>}

          <label>Category:</label>
          <select
            name="category"
            value={category}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Fruit">Fruit</option>
            <option value="Grain">Grain</option>
          </select>
          {errors.category && <span className="error">{errors.category}</span>}

          <Card cardClass={"group"}>
            <label>Image:</label>
            <input
              type="file"
              name="image"
              onChange={(e) => handleImageChange(e)}
            />
            {errors.image && <span className="error">{errors.image}</span>}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="bidding" />
              </div>
            )}
          </Card>

          <label>Starting Price:</label>
          <input
            type="number"
            placeholder="Starting Price"
            name="startingPrice"
            value={startingPrice}
            onChange={handleInputChange}
          />
          {errors.startingPrice && <span className="error">{errors.startingPrice}</span>}

          <label>Bidding Duration:</label>
<input
    type="datetime-local"
    placeholder="Bidding end time"
    name="biddingEndTime"
    value={biddingEndTime}
    onChange={handleInputChange}
    style={{ width: '300px',padding:'10px' }}
/>
{errors.biddingEndTime && <span className="error">{errors.biddingEndTime}</span>}

          <div className="--my">
            <button type="submit" className="--btn --btn-primary">
              Submit Bidding
            </button>
          </div>
        </form>
      </Card>
    </div>  
  );
};

BiddingForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
  ],
};
BiddingForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "video",
  "image",
  "code-block",
  "align",
];

export default BiddingForm;
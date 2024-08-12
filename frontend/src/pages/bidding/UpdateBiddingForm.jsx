import React, { useState, useEffect } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Card from "../../components/card/Card";
import axios from 'axios';
import GlobalStyles from '../../GlobalStyles';
//import toast from 'react-hot-toast';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import "./BiddingForm.scss";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UpdateBiddingForm() {
    const { id } = useParams(); // Access the bidding ID from URL parameter
    const navigate = useNavigate(); // Get the navigate function
    const [descriptionHTML, setDescriptionHTML] = useState("");
    const [biddingEndTime, setBiddingEndTime] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [bidding, setBidding] = useState({
        _id: "",
        title: "",
        location: "",
        category: "",
        startingPrice: "",
        description: "",

    });
    const [errors, setErrors] = useState({}); // State to manage form validation errors

    useEffect(() => {
        if (id) {
            fetchBidding(id);
        }
    }, [id]);

    useEffect(() => {
        // When the descriptionHTML state changes, update the bidding state with plain text
        setBidding(prevState => ({
            ...prevState,
            description: descriptionHTML
        }));
    }, [descriptionHTML]);

    useEffect(() => {
        setDescriptionHTML(stripHTML(bidding?.description || ""));
    }, [bidding]);

    const stripHTML = (htmlString) => {
        if (!htmlString) return "";
        return htmlString.replace(/<[^>]+>/g, "");
    };

    const fetchBidding = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/buyer/getPost/${id}`);
            const { _id, title, description, location, category, startingPrice } = response.data.bidding;
            setBidding({
                _id,
                title,
                description,
                location,
                category,
                startingPrice: String(startingPrice) // Convert startingPrice to string

            });


        } catch (error) {
            console.error('Error fetching bidding:', error);
        }
    };

    const handleInputChange = (e) => {
        if (e && e.target) {
            const { name, value } = e.target;
            setBidding(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleDescriptionChange = (value) => {
        console.log("Description Value:", value);
        setDescriptionHTML(value);
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
        if (!bidding.title.trim()) {
            errors.title = "Title is required";
        }
        if (!bidding.description.trim()) {
            errors.description = "Description is required";
        }
        if (!bidding.location.trim()) {
            errors.location = "Location is required";
        }
        if (!bidding.category) {
            errors.category = "Category is required";
        }
        if (!bidding.startingPrice.trim()) {
            errors.startingPrice = "Starting Price is required";
        } else if (isNaN(Number(bidding.startingPrice))) {
            errors.startingPrice = "Starting Price must be a number";
        }
        return errors;
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        console.log(bidding.description + "22")
        const errors = validateForm(); // Validate form fields
        if (Object.keys(errors).length > 0) {
            setErrors(errors); // Set validation errors in state
            return;
        }
        if (!bidding._id) {
            console.error("Bidding ID is undefined.");
            return; // Skip the update if _id is undefined
        }
        axios.put(`http://localhost:5000/api/buyer/update/${bidding._id}`, bidding)
            .then((res) => {
                {
                    toast.success('Your Bidding Post Updated Succesfully.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "dark",
                    })

                }

                navigate('/addBidding');
            })
            .catch((err) => {
                console.error("Error updating Bidding:", err);
                toast.error("Error occurred while updating Bidding. Please try again later.");
            });
    };

    return (
        <div className="add-bidding">
            <GlobalStyles />
            <Card cardClass={"card"}>
                <h2 style={{ alignSelf: 'center' }}>Edit Bidding</h2>
                <form onSubmit={handleUpdateSubmit}>
                    <label>Title:</label>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        value={bidding.title}
                        onChange={handleInputChange}
                    />
                    {errors.title && <span className="error">{errors.title}</span>}

                    <label>Description:</label>
                    <ReactQuill
                        theme="snow"
                        value={descriptionHTML}
                        onChange={handleDescriptionChange}
                        modules={UpdateBiddingForm.modules}
                        formats={UpdateBiddingForm.formats}
                    />

                    {errors.description && <span className="error">{errors.description}</span>}

                    <label>Location:</label>
                    <input
                        type="text"
                        placeholder="Location"
                        name="location"
                        value={bidding.location}
                        onChange={handleInputChange}
                    />
                    {errors.location && <span className="error">{errors.location}</span>}

                    <label>Category:</label>
                    <select
                        name="category"
                        value={bidding.category}
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
                        value={bidding.startingPrice}
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
                        style={{ width: '300px', padding: '10px' }}
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
}

UpdateBiddingForm.modules = {
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
UpdateBiddingForm.formats = [
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

export default UpdateBiddingForm;
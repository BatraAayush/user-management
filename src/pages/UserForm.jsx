import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createUser,
  getAllUsers,
  updateLocalUser,
  updateUser,
} from "../features/usersSlice";

const UserForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector((state) => state.users);

  const isEditMode = !!id;

  const initialFormData = {
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    address: {
      city: "",
      street: "",
      suite: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: "",
      },
    },
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      dispatch(getAllUsers());
      const user = users.find((user) => user.id === Number(id));
      if (user) {
        setFormData(user);
      }
    }
  }, [dispatch, id, isEditMode, users]);

  const check = (value, fieldName, min) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const websitePattern =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/[^\s]*)?$/;
    const phonePattern =
      /^(\+?\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}( (x|ext\.?)\d{1,5})?$/;

    if (fieldName === "Company Name") {
      if (value && value.length < min) {
        return `${fieldName} must contain ${min} Characters`;
      } else {
        return null;
      }
    }

    if (fieldName === "Website") {
      if (value && !websitePattern.test(value)) {
        return "Please Enter a Valid Website";
      } else {
        return null;
      }
    }

    if (fieldName === "Phone Number") {
      if (!value) {
        return "Phone Number Required";
      } else if (!phonePattern.test(value)) {
        return "Please Enter a Valid Phone Number only.";
      } else {
        return null;
      }
    }

    if (!value) {
      return `${fieldName} is Required`;
    } else if (fieldName === "Email") {
      if (!emailPattern.test(value)) {
        return `Please Enter a valid Email`;
      }
    } else if (min && value.length < min) {
      return `${fieldName} must contain at least ${min} characters`;
    } else {
      return null;
    }
  };

  const validate = () => {
    const newErrors = {};

    const name = formData.name;
    newErrors.name = check(name, "Name", 3);

    const email = formData.email;
    newErrors.email = check(email, "Email");

    const phone = formData.phone;
    newErrors.phone = check(phone, "Phone Number", 10);

    const city = formData.address.city;
    newErrors.city = check(city, "City");
    const street = formData.address.street;
    newErrors.street = check(street, "Street");

    const companyName = formData.company.name;
    newErrors.companyName = check(companyName, "Company Name", 3);

    const website = formData.website;
    newErrors.website = check(website, "Website");

    if (
      users.find(
        (user) =>
          user.username.toLowerCase() === formData.username.toLowerCase()
      ) &&
      !isEditMode
    ) {
      newErrors.username = "Username already exists";
    }

    setErrors(newErrors);
    let isErrorPresent = false;
    Object.keys(newErrors).map((error) => {
      if (newErrors[error]) {
        isErrorPresent = true;
      }
    });
    return !isErrorPresent;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "name" && !isEditMode) {
      const username = value.split(" ").join("");
      setFormData((prevData) => ({
        ...prevData,
        username: `USER-${username}`,
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        [name]: value,
      },
    }));
  };

  const handleGeoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      address: {
        ...prevData.address,
        geo: {
          ...prevData.address.geo,
          [name]: value,
        },
      },
    }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      company: {
        ...prevData.company,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (isEditMode) {
        if (Number(id) > 10) {
          dispatch(updateLocalUser({ ...formData, id: Number(id) }));
        } else dispatch(updateUser({ ...formData, id: Number(id) }));
      } else {
        dispatch(createUser(formData));
      }
      navigate("/");
    }
  };

  return (
    <div className="m-4 max-w-lg mx-auto bg-white p-8 shadow-lg rounded-md">
      <h2 className="text-xl flex justify-center font-bold mb-4">
        {isEditMode ? "Edit User" : "Create User"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center space-x-2">
          <label className="font-bold w-[10rem]">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded p-1 w-full"
          />
        </div>
        {errors.name && <span className="text-red-500">{errors.name}</span>}

        <div className="flex items-center space-x-2">
          <label className="font-bold w-[10rem]">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            className={`border-2 border-gray-300 ${
              isEditMode ? "cursor-no-drop bg-gray-200" : ""
            } rounded p-1 w-full`}
            onChange={handleChange}
            disabled={isEditMode}
          />
        </div>
        {errors.username && (
          <span className="text-red-500">{errors.username}</span>
        )}
        <div className="flex items-center space-x-2">
          <label className="font-bold w-[10rem]">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded p-1 w-full"
          />
        </div>
        {errors.email && <span className="text-red-500">{errors.email}</span>}

        <div className="flex items-center space-x-2">
          <label className="font-bold w-[10rem]">Phone *</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded p-1 w-full"
          />
        </div>
        {errors.phone && <span className="text-red-500">{errors.phone}</span>}

        <div className="flex items-center space-x-2">
          <label className="font-bold w-[10rem]">Website</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="border-2 border-gray-300 rounded p-1 w-full"
          />
        </div>
        {errors.website && (
          <span className="text-red-500">{errors.website}</span>
        )}
        <div>
          <label className="font-bold">Address</label>
          <div className="ml-8 space-y-2">
            <div className="flex items-center space-x-2">
              <label className="font-bold w-[10rem]">City *</label>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleAddressChange}
                className="border-2 border-gray-300 rounded p-1 w-full"
              />
            </div>
            <span className="text-red-500">{errors.city}</span>
            <div className="flex items-center space-x-2">
              <label className="font-bold w-[10rem]">Street *</label>
              <input
                type="text"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                className="border-2 border-gray-300 rounded p-1 w-full"
              />
            </div>
            <span className="text-red-500">{errors.street}</span>
            <div className="flex items-center space-x-2">
              <label className="font-bold w-[10rem]">Suite</label>
              <input
                type="text"
                name="suite"
                value={formData.address.suite}
                onChange={handleAddressChange}
                className="border-2 border-gray-300 rounded p-1 w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-bold w-[10rem]">Zipcode</label>
              <input
                type="text"
                name="zipcode"
                value={formData.address.zipcode}
                onChange={handleAddressChange}
                className="border-2 border-gray-300 rounded p-1 w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="font-bold w-[10rem]">Latitude</label>
              <input
                type="text"
                name="lat"
                value={formData.address.geo.lat}
                onChange={handleGeoChange}
                className="border-2 border-gray-300 rounded p-1 w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-bold w-[10rem]">Longitude</label>
              <input
                type="text"
                name="lng"
                value={formData.address.geo.lng}
                onChange={handleGeoChange}
                className="border-2 border-gray-300 rounded p-1 w-full"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="font-bold">Company</label>
          <div className="ml-8 space-y-2">
            <div className="flex items-center space-x-2">
              <label className="font-bold w-[10rem]">Company Name</label>
              <input
                type="text"
                name="name"
                value={formData.company.name}
                onChange={handleCompanyChange}
                className="border-2 border-gray-300 rounded p-1 w-full"
              />
            </div>
            {errors.companyName && (
              <span className="text-red-500">{errors.companyName}</span>
            )}
            <div className="flex items-center space-x-2">
              <label className="font-bold w-[10rem]">Catch Phrase</label>
              <input
                type="text"
                name="catchPhrase"
                value={formData.company.catchPhrase}
                onChange={handleCompanyChange}
                className="border-2 border-gray-300 rounded p-1 w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="font-bold w-[10rem]">BS</label>
              <input
                type="text"
                name="bs"
                value={formData.company.bs}
                onChange={handleCompanyChange}
                className="border-2 border-gray-300 rounded p-1 w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-12 rounded hover:bg-blue-600 transition duration-300"
          >
            {isEditMode ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

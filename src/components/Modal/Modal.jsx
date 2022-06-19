import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { ToastContainer, toast } from "react-toastify";
import { setIn, useFormik } from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import axios from "axios";
import cookie from "react-cookies";

// Modal component to handle car record addition and updating
const AddModal = ({ openModal, setOpenModal, addModal, setAddModal, item }) => {
  // we get modal properties as props

  //state to handle modal loading
  const [loading, setLoading] = useState(false);

  //state to handle initial values for fomik. the values can be fetched for item.
  //item is for editing
  const [initialValues, setInitialValues] = useState(
    item
      ? {
          id: item.ID,
          model: item.Model,
          make: item.Make,
          category: item.Category,
          color: item.Color,
          registrationNumber: item.Registration,
        }
      : {
          model: "",
          make: 0,
          category: "",
          color: "",
          registrationNumber: "",
        }
  );

  //to set Initial formik values on component mount
  //and on modal type change
  useEffect(() => {
    //we set modal loading to true
    setLoading(true);
    // if we are adding a enw record we set initial values as empty
    if (addModal) {
      setInitialValues({
        model: "",
        make: 0,
        category: "",
        color: "",
        registrationNumber: "",
      });
    }
    //  if we are editing we set initial values on the edited row content
    else {
      setInitialValues({
        id: item.ID,
        model: item.Model,
        make: item.Make,
        category: item.Category,
        color: item.Color,
        registrationNumber: item.Registration,
      });
    }
    //after successful addition of initialValues we setLoading to false
    setLoading(false);
  }, [addModal]);

  // these are the option for category of cars
  const categories = [
    { value: "Bus", label: "Bus" },
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "Hatchback", label: "Hatchback" },
  ];

  // this function is used to send data to backend
  const handleSubmit = async (values, resetForm) => {
    //  we check if we are adding or updating record
    if (addModal) {
      setLoading(true);
      //add data to backend
      if (formik.values.category === "") {
        setLoading(false);
        return toast.error("Category is required");
      }
      // we put api call in try to catch exceptions
      try {
        //we call post api and send values in body
        //also make sure that registration number is in uppercase
        const response = await axios.post(
          "/api/cars/admin/add_car",
          {
            model: values.model,
            make: values.make,
            category: values.category,
            color: values.color,
            registrationNumber: values.registrationNumber.toUpperCase(),
          },
          {
            headers: {
              "Content-Type": "application/json",
              // to get token from cookie storage
              "access-token": cookie.load("access-token"),
            },
          }
        );
        //return toast based on response
        toast.success("Record Added Successfully!");
        //reset form after addition
        resetForm();
        setLoading(false);
        // we close modal after successfully adding record
        setOpenModal(false);
      } catch (error) {
        setLoading(false);
        return toast.error(error.response.data.message);
      }

      //close modal
      setOpenModal(false);
    }
    // if we are updating record
    else {
      if (formik.values.category === "") {
        return toast.error("Category is required");
      }
      // we put api call in try to catch exceptions
      try {
        // we send all fields and replace the record based on id currently

        const response = await axios.patch(
          `/api/cars/admin/${values.id}`,
          {
            model: values.model,
            make: values.make,
            category: values.category,
            color: values.color,
            registrationNumber: values.registrationNumber.toUpperCase(),
          },
          {
            headers: {
              "Content-Type": "application/json",
              "access-token": cookie.load("access-token"),
            },
          }
        );
        //return toast based on response
        toast.success("Record Updated Successfully!");
        resetForm();
        setLoading(false);
        setOpenModal(false);
      } catch (error) {
        setLoading(false);
        return toast.error(error.response.data.message);
      }

      //close modal
      setOpenModal(false);
    }
  };

  // formik initialization using hook for form validation
  const formik = useFormik({
    initialValues,
    // enabled reinitialization in case of value change
    enableReinitialize: true,
    // a schema is defined here that is used for validation
    validationSchema: Yup.object({
      //model is string with no whitespaces and is mandatory and max 200 characters
      model: Yup.string()
        .trim()
        .required("Model of the car is mandatory")
        .max(200, "Model can't be more then 200 characters!"),
      //make is number which will be more then 1885 and less then 3000 and is must
      make: Yup.number()
        .moreThan(1885, "First car was invented in 1886!")
        .lessThan(3000, "Car Make year can't be more than 3000")
        .required("Make year is mandatory"),
      //category must be one of the following  ["Bus", "Sedan", "SUV", "Hatchback"]
      category: Yup.mixed().oneOf(
        ["Bus", "Sedan", "SUV", "Hatchback"],
        "Invalid Value"
      ),
      // color will be string, no whitespaces, max 50 characters and is must
      color: Yup.string()
        .trim()
        .max(50, "Color can't be more than 50 characters")
        .required("Color of car is mandatory"),
      // registration number will be string, no whitespaces, max 50 characters and is must
      registrationNumber: Yup.string()
        .trim()
        .max(50, "Registration can't be more than 50 characters")
        .required("Registration number is mandatory"),
    }),
    onSubmit: (values, { resetForm }) => {
      // to handle form submission
      handleSubmit(values, resetForm);
    },
  });

  // this function is used by formik to show errors in case of empty or invalid fields
  const errorHelper = (formik, values) => ({
    error: formik.errors[values] && formik.touched[values] ? true : false,
    helperText:
      formik.errors[values] && formik.touched[values]
        ? formik.errors[values]
        : null,
  });

  // handle modal open
  const handleOpen = () => setOpenModal(true);
  // handle close modal
  const handleClose = () => {
    setAddModal(true);
    setOpenModal(false);
  };
  // handle close modal using close button
  const handleCloseClick = (e) => {
    e.preventDefault();
    setOpenModal(false);
  };

  // styling for modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div>
      {/* Toast container to show notification. Limit is 1 at a time */}
      <ToastContainer limit={1} />
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {/* handling add and edit in 1 modal */}
            {addModal ? "Add Car Information" : "Edit Car Information"}
          </Typography>
          {/* checking loading to show loading otherwise form */}
          {!loading ? (
            <form className="col-md-12 mt-3" onSubmit={formik.handleSubmit}>
              <div className="d-flex flex-row gap-2">
                <div className="form-group col-md-6">
                  {/* MUI TEXTFIELD */}
                  <TextField
                    className="form-control"
                    label="Model"
                    variant="outlined"
                    type="text"
                    placeholder="Name of car"
                    value={formik.values.model}
                    onChange={formik.handleChange}
                    // the below two statements are for formik error display
                    {...formik.getFieldProps("model")}
                    {...errorHelper(formik, "model")}
                  />
                </div>

                <div className="form-group col-md-6">
                  <TextField
                    className="form-control"
                    label="Make"
                    variant="outlined"
                    type="number"
                    value={formik.values.make}
                    placeholder="Year of manufacturing"
                    onChange={formik.handleChange}
                    {...formik.getFieldProps("make")}
                    {...errorHelper(formik, "make")}
                  />
                </div>
              </div>

              <div className="d-flex flex-row gap-2">
                <div className="form-group col-md-6 mt-3">
                  {/* select for category selection */}
                  <select
                    className={"form-control w-100 py-3"}
                    value={formik.values.category}
                    onChange={(e) => (formik.values.category = e.target.value)}
                    {...formik.getFieldProps("category")}
                    {...errorHelper(formik, "category")}
                  >
                    <option value="" defaultChecked hidden>
                      {formik.values.category
                        ? formik.values.category
                        : "Select Category"}
                    </option>
                    {categories.map((itm, indx) => {
                      return (
                        <option value={itm.value} key={indx}>
                          {itm.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="form-group col-md-6 mt-3">
                  <TextField
                    className="form-control"
                    label="Color"
                    variant="outlined"
                    type="text"
                    value={formik.values.color}
                    placeholder="Color of car"
                    onChange={formik.handleChange}
                    {...formik.getFieldProps("color")}
                    {...errorHelper(formik, "color")}
                  />
                </div>
              </div>

              <div className="d-flex flex-row gap-2">
                <div className="form-group col-md-6 mt-3">
                  <TextField
                    className="form-control"
                    label="Registration Number"
                    variant="outlined"
                    type="text"
                    value={formik.values.registrationNumber}
                    placeholder="Registration number of car"
                    onChange={formik.handleChange}
                    {...formik.getFieldProps("registrationNumber")}
                    {...errorHelper(formik, "registrationNumber")}
                  />
                </div>
              </div>

              <div className="d-flex flex-row mt-3 from-group col-md-12 justify-between">
                <button
                  className="px-4 py-2 bg-green-500 text-white hover:bg-green-700 active:bg-green-400"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Loading" : addModal ? "Add" : "Edit"}
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-700 active:bg-red-400"
                  onClick={(e) => {
                    setAddModal(true);
                    handleCloseClick(e);
                  }}
                  disabled={loading}
                >
                  Close
                </button>
              </div>
            </form>
          ) : (
            <div>Loading...</div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AddModal;

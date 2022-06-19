import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import { AiOutlineDelete } from "react-icons/ai";
import { BsFillPencilFill } from "react-icons/bs";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ModalForm from "../Modal/Modal";
import axios from "axios";
import cookie from "react-cookies";
import { ToastContainer, toast } from "react-toastify";

const DataTable = () => {
  // for handling sorting
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  // for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // for modals
  const [openModal, setOpenModal] = useState(false);
  const [addModal, setAddModal] = useState(true);
  const [modalItem, setModalItem] = useState();
  // for datatable rows
  const [rowData, setRowData] = useState([]);
  // for loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // to identify if modal was open or closed so that we can update data from database
    setLoading(true);

    if (openModal) {
      setLoading(true);

      fetchData();
    } else {
      setLoading(true);

      fetchData();
    }
  }, [openModal]);

  const fetchData = async () => {
    setLoading(true);

    try {
      // to get all car data from database
      const response = await axios.get("/api/cars/admin/", {
        headers: {
          "Content-Type": "application/json",
          "access-token": cookie.load("access-token"),
        },
      });
      // if response ok we add row data that will be shown in table
      if (response.status === 200) {
        setRowData(response.data.data);
        setLoading(false);
      } else {
        setLoading(false);
        return toast.error("Error fetching data");
      }
    } catch (error) {
      setLoading(false);
      return toast.error(error.response.data.message);
    }
  };

  // this is function used by MUI to generate table rows
  function createData(ID, Model, Make, Category, Color, Registration, Actions) {
    return {
      ID,
      Model,
      Make,
      Category,
      Color,
      Registration,
    };
  }

  // my custom function to delete record from database and refetch data
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      // calling delete car record api with record is
      const response = await axios.delete(`/api/cars/admin/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "access-token": cookie.load("access-token"),
        },
      });
      toast.success(response.data.message);
      // refetching data for table
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  // for opening add record modal
  const handleAdd = () => {
    setAddModal(true);
    setOpenModal(true);
  };

  // using the same modal for updating record based on row data
  const handleEdit = (row) => {
    setModalItem(row);
    setAddModal(false);
    setOpenModal(true);
  };

  // these are the rows that will be used by MUI to generate table
  let rows = [];
  rowData.map((data, index) =>
    rows.push(
      createData(
        data._id,
        data.model,
        data.make,
        data.category,
        data.color,
        data.registrationNumber
      )
    )
  );
  // ];

  // table sorting functions for mui table
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  //  table sorting function for mui table
  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  //  table sorting function for mui table
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  // table headings
  const headCells = [
    {
      id: "Model",
      numeric: false,
      disablePadding: true,
      label: "Model",
    },
    {
      id: "Make",
      numeric: false,
      disablePadding: false,
      label: "Make",
    },
    {
      id: "Category",
      numeric: false,
      disablePadding: false,
      label: "Category",
    },
    {
      id: "Color",
      numeric: false,
      disablePadding: false,
      label: "Color",
    },
    {
      id: "Registration",
      numeric: false,
      disablePadding: false,
      label: "Registration",
    },
    {
      id: "Actions",
      numeric: false,
      disablePadding: false,
      label: "Actions",
    },
  ];

  // to generate table heading
  function EnhancedTableHead(props) {
    const { order, orderBy, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              className="p-3"
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  // for the sorting functionality in table
  EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,

    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  // for the main heading of the table that also contains the add record button
  const EnhancedTableToolbar = (props) => {
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        }}
      >
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Registered Cars
        </Typography>

        <Tooltip title="Add New Record">
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            onClick={() => {
              handleAdd();
            }}
          >
            Add
          </Button>
        </Tooltip>
        <ModalForm
          openModal={openModal}
          setOpenModal={setOpenModal}
          addModal={addModal}
          setAddModal={setAddModal}
          item={modalItem}
        />
      </Toolbar>
    );
  };

  // sorting function for mui data table
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  // for page change on  the data table in frontend
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //to change if number of rows to show per page is changed
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // this is to keep the layout consistent if there are empty rows on final page of table
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      {/* toast for notifications. 1 at a time */}
      <ToastContainer limit={1} />
      <Box sx={{ width: "100%" }} className="mt-2 p-3">
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar />
          <hr />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* we are  mapping the rowsData to generate the rows*/}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow hover tabIndex={-1} key={row.ID}>
                        <TableCell>{row.Model}</TableCell>
                        <TableCell>{row.Make}</TableCell>
                        <TableCell>{row.Category}</TableCell>
                        <TableCell>{row.Color}</TableCell>
                        <TableCell>{row.Registration}</TableCell>
                        {/* these are two icons that are used to handle edit and delete for row */}
                        <TableCell>
                          <div className="d-flex justify-start">
                            <div
                              style={{ color: "blue" }}
                              className="m-1 cursor-pointer"
                            >
                              <BsFillPencilFill
                                onClick={() => handleEdit(row)}
                              />
                            </div>
                            <div
                              style={{ color: "red" }}
                              className="m-1 cursor-pointer"
                            >
                              <AiOutlineDelete
                                onClick={() => handleDelete(row.ID)}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {/* in case there is extra space at last page */}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 33 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* to handle pagination in frontend */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </>
  );
};

export default DataTable;

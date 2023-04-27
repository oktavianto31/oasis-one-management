import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import TablePagination from "../../Pagination/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faXmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { useMinimalSelectStyles } from "./select/index";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ThreeDots } from "react-loader-spinner";
import moment from "moment";
import "./CustomerPage.css";

function CustomerPage() {
  const tenantUrl = process.env.REACT_APP_TENANTURL;
  const localUrl = process.env.REACT_APP_USERURL;
  const managementUrl = process.env.REACT_APP_MANAGEMENTURL;
  const [userData, setUserData] = useState([]);
  const [userRetrieved, setUserRetrieved] = useState(false);
  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);
  const [tablePagination, setTablePagination] = useState(
    userRetrieved ? userData.length : 0
  );

  // Get User Data
  useEffect(() => {
    console.log("haloo")
    let mounted = true;

    if (mounted) {
      const url = localUrl + "/retrieve";
      console.log("urlll",url)
      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            const userData = result.data.filter((e)=>{
              return(
                e.history[0] !== undefined
              )
            })
            setUserData(userData);
            setUserRetrieved(() => true);
          } else {
            setUserRetrieved(() => false);
          }
        });
    }

    return () => {
      mounted = false;
    };
  }, [userRetrieved]);

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "No",
      "Customer Name",
      "Customer Phonenumber",
      "Last Order Placed",
    ];
    const tableRows = [];
    userData.map((post, index) => {
      const length = post.history.length - 1
      const dateOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      const ordertime = new Date(post.history[length].lastOrder);
      const OrderData = [
        index + 1,
        post.name === undefined ? '-' : post.name,
        post.phoneNumber === undefined ? '-' : post.phoneNumber,
        ordertime.toLocaleDateString("en-ID", dateOptions),
      ];
      // tableRows.push(userData);
      tableRows.push(OrderData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    const date = Date();
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    doc.text(`OasisOne Customer Report.`, 14, 15);
    doc.save(`OasisOne_customerreport.pdf`);
  };

  const [page, setPage] = useState(0);
  const rowsPerPage = 7;

  const [formValues, setFormValues] = useState("");
  const [customeropen, setcustomeropen] = useState(false);
  const handlecustomeropen = () => setcustomeropen(true);
  const handlecustomerclose = () => setcustomeropen(false);

  const [restaurantname, setRestaurantname] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instruction, setInstruction] = useState("");
  const [table, setTable] = useState("");
  const [customeritems, setcustomeritems] = useState([]);
  const [itemtotal, setItemtotal] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [service, setService] = useState("");
  const [tax, setTax] = useState("");
  const [index, setIndex] = useState(1);

  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, onPageChange } = props;

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
      setIndex(index - 7);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);

      setIndex(index + 7);
    };

    return (
      <div className="containerbutton">
        <button
          onClick={handleBackButtonClick}
          disabled={page === 0}
          className={page === 0 ? "leftdisabledbutton" : "leftdisplaybutton"}
        >
          {" "}
          <FontAwesomeIcon
            icon={faAngleLeft}
            style={page === 0 ? { color: "#BEBEBE" } : { color: "#949494" }}
          />
        </button>

        <button
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / 7) - 1}
          className={
            page >= Math.ceil(count / 7) - 1
              ? "rightdisabledbutton"
              : "rightdisplaybutton"
          }
        >
          <FontAwesomeIcon
            icon={faAngleRight}
            style={
              page >= Math.ceil(count / 7) - 1
                ? { color: "#BEBEBE" }
                : { color: "#949494" }
            }
          />
        </button>
      </div>
    );
  }

  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //search and filter
  const [customerSearch, setCustomerSearch] = useState("");

  const [customerfilter, setCustomerFilter] = useState(0);

  //handle select drop down
  const minimalSelectClasses = useMinimalSelectStyles();

  const menuProps = {
    classes: {
      paper: minimalSelectClasses.paper,
      list: minimalSelectClasses.list,
    },
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    getContentAnchorEl: null,
  };

  const iconComponent = (props) => {
    return (
      <ExpandMoreRoundedIcon
        className={props.className + " " + minimalSelectClasses.icon}
      />
    );
  };

  async function handleCustomerFilter(e) {
    if (e != 0) {
      setCustomerFilter(e.target.value);
    }

    if (e === 0) {
      setCustomerFilter(0);
      const filteredurl = localUrl + "/retrieve";
      fetch(filteredurl, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setUserData(result.data);
            setUserRetrieved(() => true);
          } else {
            setUserRetrieved(() => false);
          }
        });
    }

    if (e.target.value == "Alphabetically") {
      const filteredurl = managementUrl + "/client/name/ascending";
      fetch(filteredurl, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setUserData(result.data);
            setUserRetrieved(() => true);
          } else {
            setUserRetrieved(() => false);
          }
        });
    } else if (e.target.value == "Location") {
      const filteredurl = managementUrl + "/client/location/ascending";
      fetch(filteredurl, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setUserData(result.data);
            setUserRetrieved(() => true);
          } else {
            setUserRetrieved(() => false);
          }
        });
    }
  }

  return (
    <div className="container" style={{ zoom:"60%" }}>
      {userRetrieved ? (
        <div className="customercontainer">
          <div className="tenantheader">
            <div className="tenantleft">Total Customer ({userData.length})</div>
            <div className="tenantcenter">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="searchicon"
              />
              <input
                type="text"
                value={customerSearch}
                className="searchinput"
                placeholder="Search"
                onChange={(e) => setCustomerSearch(e.target.value)}
              />
              <button
                className={
                  customerSearch == "" ? "searchhide" : "searchclosebutton"
                }
                onClick={() => setCustomerSearch(() => "")}
              >
                {" "}
                <FontAwesomeIcon icon={faXmark} className="closeicon" />
              </button>
            </div>
            <div className="tenantright">
              <Select
                disableUnderline
                classes={{ root: minimalSelectClasses.select }}
                IconComponent={iconComponent}
                value={customerfilter}
                onChange={(e) => handleCustomerFilter(e)}
                renderValue={(selected) => {
                  if (selected === 0) {
                    return <p className="placeholder">Filter by</p>;
                  }
                  return selected;
                }}
                MenuProps={menuProps}
              >
                <MenuItem key={1} value="Alphabetically">
                  Alphabetically
                </MenuItem>
                <MenuItem key={2} value="Location">
                  Location
                </MenuItem>
              </Select>
              <button
                className={customerfilter === 0 ? "hide" : "unhide"}
                onClick={() => handleCustomerFilter(0)}
              >
                Clear
              </button>
            </div>
          </div>

          {customerSearch == "" ? (
            <div className="outercustomertable">
              <div className="customertable">
                <div className="border">
                  <div className="innercustomertable">
                    <div className="customerheader">
                      <div className="customerleft">All Customer</div>
                      <div className="customerright">
                        <button
                          className="downloadbutton"
                          onClick={generatePdf}
                        >
                          Download as PDF{" "}
                        </button>
                      </div>
                    </div>
                    <div className="customerheadertitlegrid">
                      <div className="customerheadertitle">NO</div>
                      <div className="customerheadertitle">NAME</div>
                      <div className="customerheadertitle">PHONE NUMBER</div>
                      <div className="customerheadertitle">LAST ORDER</div>
                      <div className="customerheadertitle">LAST TENANT</div>
                    </div>

                    <div className="customerrendercontainer">
                      {(rowsPerPage > 0
                        ? userData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        : userData
                      ).map((post, i) => {
                        let orderDate;
                        if(post.history[0] === undefined){
                           orderDate = new Date(post.updatedAt);
                        }else{
                           orderDate = new Date(post.history[0].lastOrder);
                        }
                        const length = post.history.length-1
                        return (
                          
                          <div className={i != 6 ? "bordered" : "noborder"}>
                         
                            <div className="customerrendergrid">
                              <div className="customertext">{i + index}</div>
                              <div className="customertext">{post.name === undefined ? "-" : post.name}</div>
                              <div className="customertext">
                                {post.phoneNumber === undefined ? "-" : post.phoneNumber}
                              </div>

                              <div className="customertext">
                                {orderDate.toLocaleDateString(
                                  "en-ID",
                                  dateOptions
                                )}{" "}
                                | {moment(post.updatedAt).fromNow()}
                              </div>

                              <div className="customertext">
                                {post.history[length].tenant_name === undefined ? post.history[length].tenant_id : post.history[length].tenant_name}
                                {/* {post.history[0] === undefined ? "Unknown" : post.history[0].tenant_name} */}
                              </div>
                            </div>
                          
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="tenantfooter">
                <TablePagination
                  colSpan={3}
                  count={userData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  ActionsComponent={TablePaginationActions}
                />
              </div>
            </div>
          ) : (
            <div className="outercustomertable">
              <div className="customertable">
                <div className="border">
                  <div className="innercustomertable">
                    <div className="customerheader">
                      <div className="customerleft">All Customer</div>
                      <div className="customerright">
                        <button
                          className="downloadbutton"
                          onClick={generatePdf}
                        >
                          Download as PDF{" "}
                        </button>
                      </div>
                    </div>
                    <div className="customerheadertitlegrid">
                      <div className="customerheadertitle">NO</div>
                      <div className="customerheadertitle">NAME</div>
                      <div className="customerheadertitle">PHONE NUMBER</div>
                      <div className="customerheadertitle">LAST ORDER</div>
                      <div className="customerheadertitle">LAST TENANT</div>
                    </div>

                    <div className="searchcustomerrendercontainer">
                      {userRetrieved === true &&
                        userData
                          .filter((post, a) => {
                            if (
                              post.name !== undefined &&
                              post.name
                                .toLowerCase()
                                .includes(customerSearch.toLowerCase())
                            ) {
                              return post;
                            }
                          })

                          .map((post, i) => {
                            const orderDate = new Date(
                              post.updatedAt
                            );
                            const length = post.history.length-1
                            return (
                              <div className="bordered">
                                <div className="customerrendergrid">
                                  <div className="customertext">
                                    {i + index}
                                  </div>
                                  <div className="customertext">
                                    {post.name === undefined ? "-" : post.name}
                                  </div>
                                  <div className="customertext">
                                    {post.phoneNumber === undefined ? "-" : post.phoneNumber}
                                  </div>

                                  <div className="customertext">
                                    {orderDate.toLocaleDateString(
                                      "en-ID",
                                      dateOptions
                                    )}{" "}
                                    |{" "}
                                    {moment(
                                      post.history[0].lastOrder
                                    ).fromNow()}
                                  </div>

                                  <div className="customertext">
                                  {post.history[length].tenant_name === undefined ? post.history[length].tenant_id : post.history[length].tenant_name}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            height: "100vh",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <ThreeDots color="#f10c0c" height={80} width={80} />
        </div>
      )}
    </div>
  );
}

export default CustomerPage;

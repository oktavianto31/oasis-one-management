import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import PropTypes from "prop-types";
import Select from "@material-ui/core/Select";
import React, { useEffect, useState } from "react";
import { useMinimalSelectStyles } from "./select/index";
import { BlockPicker } from "../TenantDetailPage/colorpalette/index";

import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";
import Compressor from "compressorjs";
import "./FoodCourtPage.css";
import "../TenantPage/ProfilePage.css";
// import "../TenantPage/ProfilePage.css";

import { useHistory } from "react-router-dom";
import TablePagination from "../../Pagination/index";
import { faAngleLeft, faAngleRight, faEye, faEyeSlash, faXmark, faMagnifyingGlass, faCalendar, faPaperclip, faPencil, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import { upload } from "@testing-library/user-event/dist/upload";

function FoodCourtPage() {
  const localUrl = process.env.REACT_APP_FOODCOURTURL;
  const imageUrl = process.env.REACT_APP_IMAGEURL;

  const [foodCourtData, setFoodCourtData] = useState([]);
  const [foodCourtRetrieved, setFoodCourtRetrieved] = useState(false);

  const [foodCourtName, setFoodCourtName] = useState();
  const [textAddress, setTextAddress] = useState();
  const [color, setColor] = useState();
  const [profileImage, setProfileImage] = useState();

  const [createFoodCourtOpen, setCreateFoodCourtOpen] = useState(false);
  const [foodCourtId, setFoodCourtId] = useState();

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [foodCourtDeleteId, setFoodCourtDeleteId] = useState();

  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Get All Foodcourt
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      const url = localUrl + "/retrieve/all";
      console.log("urlll", url);
      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setFoodCourtData(result.data);
            setProfileImage()
            setFoodCourtRetrieved(() => true);
          } else {
            setFoodCourtRetrieved(() => false);
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, [foodCourtRetrieved]);

  // search and filter
  const [foodCourtSearch, setFoodCourtSearch] = useState("");
  const [foodCourtFiltered, setFoodCourtFiltered] = useState(0);

  // navigate
  const history = useHistory();
  function redirectFoodCourtList(foodcourt_id) {
    history.push({
      pathname: "/foodcourtdetails",
      state: foodcourt_id,
    });
  }

  async function handleSubmitFoodCourt() {
    setButtonDisabled(true)
    const createUrl = localUrl + "/create";
    const uploadLogoUrl = imageUrl + "/logo/";

    fetch(createUrl, {
      method: "POST",
      body: JSON.stringify({
        foodcourt_address: textAddress,
        foodcourt_name: foodCourtName,
        foodcourt_color: color,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          var input = document.querySelector(".productinputfile");
          const file = input.files[0];

          new Compressor(file, {
            quality: 0.5,
    
            success(resultimage) {
              let formData = new FormData();
              
              formData.append("foodcourt", resultimage, resultimage.name);
              if(input.files[0] === undefined){
                setCreateFoodCourtOpen(false);
                setFoodCourtRetrieved(false);
              }else{
                fetch(uploadLogoUrl + result.data[0].foodcourt_id, {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((result) => {
                    console.log("rerssss",result)
                    if (result.status === "SUCCESS") {
                      setButtonDisabled(false)
                      setCreateFoodCourtOpen(false);
                      setFoodCourtRetrieved(false);
                    }
                  })
                  .catch((error) => {
                    console.error("Error Upload Logo:", error);
                  });
              }
              
            },
          });
        }
      });
  }

  function handleRemoveFoodcourt(foodcourt_id) {
    const url = localUrl + "/delete/" + foodcourt_id;

    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          // setFoodCourtData();
          setFoodCourtRetrieved(false);
          setOpenModalDelete(false);
        }
      });
  }

  //handle filter select drop down
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
    return <ExpandMoreRoundedIcon className={props.className + " " + minimalSelectClasses.icon} />;
  };

  const date = new Date();

  async function handleFilter(e) {
    if (e != 0) {
      setFoodCourtFiltered(e.target.value);
    }
    if (e === 0) {
      setFoodCourtFiltered(0);
      const filteredurl = localUrl + "/retrieve/all";
      fetch(filteredurl, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setFoodCourtData(result.data);
            setFoodCourtRetrieved(() => true);
          } else {
            setFoodCourtRetrieved(() => false);
          }
        });
    }
    if (e.target.value == "Alphabetically") {
      const filteredurl = localUrl + "/sort/name/ascending";
      fetch(filteredurl, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setFoodCourtData(result.data);
            setFoodCourtRetrieved(() => true);
          } else {
            setFoodCourtRetrieved(() => false);
          }
        });
    } else if (e.target.value == "Location") {
      const filteredurl = localUrl + "/sort/location/ascending";
      fetch(filteredurl, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setFoodCourtData(result.data);
            setFoodCourtRetrieved(() => true);
          } else {
            setFoodCourtRetrieved(() => false);
          }
        });
    }
  }

  // Pagination
  const [page, setPage] = useState(0);
  const [index, setIndex] = useState(1);
  const rowsPerPage = 6;
  function TablePaginationActions(props) {
    const { count, page, onPageChange } = props;

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
      setIndex(index - 6);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);

      setIndex(index + 6);
    };
    return (
      <div className="containerbutton">
        <button onClick={handleBackButtonClick} disabled={page === 0} className={page === 0 ? "leftdisabledbutton" : "leftdisplaybutton"}>
          {" "}
          <FontAwesomeIcon icon={faAngleLeft} style={page === 0 ? { color: "#BEBEBE" } : { color: "#949494" }} />
        </button>

        <button onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / 6) - 1} className={page >= Math.ceil(count / 6) - 1 ? "rightdisabledbutton" : "rightdisplaybutton"}>
          <FontAwesomeIcon icon={faAngleRight} style={page >= Math.ceil(count / 6) - 1 ? { color: "#BEBEBE" } : { color: "#949494" }} />
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

  // image handler
  async function imageHandler(e) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  function modalDelete(id){
    setOpenModalDelete(true)
    setFoodCourtDeleteId(id)
  }

  return (
    <div className="container" style={{ zoom:"60%" }}>
    <Modal open={openModalDelete}>
        <Box className="deletefoodcourtmodalbox" style={{ zoom:"80%" }}>
          <div className="modalheader" >Delete Foodcourt ?</div>
          <div className="buttonmodalbox">
            <div
              onClick={() => {
                setOpenModalDelete(false);
              }}
              className="cancelbtn"
            >
              Cancel
            </div>
            <div onClick={()=>handleRemoveFoodcourt(foodCourtDeleteId)} className="submitbtn">
              Delete
            </div>
          </div>
        </Box>
      </Modal>
      <Modal open={createFoodCourtOpen}>
        <Box className="createfoodcourtmodalbox">
          <div className="modalboxtitle">Add New Food Court</div>
          <div className="inputcreatemodalbox">
            <div className="leftcolumncontainer">
              <div className="labelcolumn">
                <div className="settingslabeltext">Food Court Name</div>
                <div className="settingsinputcontainer">
                  <input type="text" className="inputcontainer1" onChange={(e) => setFoodCourtName(e.target.value)} />
                </div>
              </div>
              <div className="labelcolumn">
                <div className="settingslabeltext">Address</div>
                <div className="settingsinputcontainer">
                  <textarea type="text" className="textareainputcontainer" onChange={(e) => setTextAddress(e.target.value)} />
                </div>
              </div>
              <div className="whiteabsolute"></div>
              <div className="labelcolumncolor">
                <div className="settingslabeltext2">Profile Color</div>
                <div className="settingsinputcontainer">
                  <div className="pickcolor">
                    <BlockPicker
                      color={color}
                      onChange={(color) => {
                        setColor(color.hex);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rightcolumncontainer">
              <div className="settingslabeltext">Profile Picture</div>
              <div className="editprofileimagecontainer">
                <div className="customButton">
                  <img src={profileImage} className="editprofileimage1" />

                  <div className="editprofileimagebuttoncontainer">
                    <div className="imagebuttoncontainer">
                      <div className="productimagebutton">
                        <label htmlFor="file-input">
                          <FontAwesomeIcon icon={faPencil} className="promoinput" />
                        </label>

                        <input id="file-input" type="file" name="foodcourt" accept=".png, .jpg" className="productinputfile" onChange={imageHandler} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="buttonmodalbox">
            <div
              onClick={() => {
                setCreateFoodCourtOpen(false);
              }}
              className="cancelbtn"
            >
              Cancel
            </div>
            <div onClick={buttonDisabled ? null : handleSubmitFoodCourt} className= {buttonDisabled ? "disabledbtn" : "submitbtn"}>
                {buttonDisabled ? "Saving..." : "Submit"}
            </div>
          </div>
        </Box>
      </Modal>

      {foodCourtRetrieved ? (
        <div className="foodcourtcontainer">
          <div className="foodcourtheader">
            <div className="foodcourtheaderleft">
              <div className="foodcourtleft">Total Foodcourt ({foodCourtData.length})</div>
              <div className="foodcourtcenter">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="searchicon" />
                <input type="text" value={foodCourtSearch} className="searchinput" placeholder="Search" onChange={(e) => setFoodCourtSearch(e.target.value)} />
                <button className={foodCourtSearch == "" ? "searchhide" : "searchclosebutton"} onClick={() => setFoodCourtSearch(() => "")}>
                  {" "}
                  <FontAwesomeIcon icon={faXmark} className="closeicon" />
                </button>
              </div>
              <div className="foodcourtright">
                <Select
                  disableUnderline
                  classes={{ root: minimalSelectClasses.select }}
                  IconComponent={iconComponent}
                  value={foodCourtFiltered}
                  onChange={(e) => handleFilter(e)}
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
                <button className={foodCourtFiltered === 0 ? "hide" : "unhide"} onClick={() => handleFilter(0)}>
                  Clear
                </button>
              </div>
            </div>
            <div  className="foodcourtheaderright">
              <button onClick={() => setCreateFoodCourtOpen(true)} className="addfoodcourtbtn">+ Add Food Court</button>
            </div>
          </div>

          {foodCourtSearch == "" ? (
            <div className="outerfoodcourttable">
              <div className="foodcourtheadertitlegrid">
                <div className="foodcourtheadertitle">No.</div>
                <div className="foodcourtheadertitle">Food Court Name</div>
                <div className="foodcourtheadertitle">Location</div>
                <div className="foodcourtheadertitle">Details</div>
              </div>
              <div className="foodcourtrendercontainer">
                {foodCourtRetrieved == true &&
                  (rowsPerPage > 0 ? foodCourtData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : foodCourtData).map((post, indexs) => {
                    console.log("posttt", post);
                    return (
                      <div className="foodcourtrendergrid">
                        <div className="foodcourttext">{indexs + index}</div>
                        <div className="foodcourtprofilecontainer">
                          <img className="foodcourtprofile" src={post.foodcourt_logo} /> {post.foodcourt_name}
                        </div>
                        <div className="foodcourtaddresscontainer">
                          <div className="clusteraddress">{post.foodcourt_location}</div>

                          <div className="address">{post.foodcourt_address}</div>
                        </div>
                        <div className="viewdetails" onClick={() => redirectFoodCourtList(post.foodcourt_id)}>
                          <button className="viewbutton">View Details</button>
                        </div>
                        <div className="deletefoodcourt" onClick={() => modalDelete(post.foodcourt_id)}>
                          <button className="deletefoodcourtbutton">Delete</button>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="foodcourtfooter">
                <TablePagination colSpan={3} count={foodCourtData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} ActionsComponent={TablePaginationActions} />
              </div>
            </div>
          ) : (
            <div className="outerfoodcourttable">
              <div className="foodcourtheadertitlegrid">
                <div className="foodcourtheadertitle">No.</div>
                <div className="foodcourtheadertitle">Food Court Name</div>
                <div className="foodcourtheadertitle">Location</div>
                <div className="foodcourtheadertitle">Details</div>
              </div>
              <div className="foodcourtrendercontainer">
                {foodCourtRetrieved == true &&
                  foodCourtData
                    .filter((post) => {
                      if (post.foodcourt_name.toLowerCase().includes(foodCourtSearch.toLowerCase())) {
                        return post;
                      }
                    })
                    .map((post, indexs) => {
                      return (
                        <div className="foodcourtrendergrid">
                          <div className="foodcourttext">{indexs + index}</div>
                          <div className="foodcourtprofilecontainer">
                            <img className="foodcourtprofile" src={post.foodcourt_logo} />
                            {post.foodcourt_name}
                          </div>
                          <div className="foodcourtaddresscontainer">
                            <div className="clusteraddress">{post.foodcourt_location}</div>

                            <div className="address">{post.foodcourt_address}</div>
                          </div>
                          <div className="viewdetails" onClick={() => redirectFoodCourtList(post.foodcourt_id)}>
                            <button className="viewbutton">View Details</button>
                          </div>
                          <div className="deletefoodcourt" onClick={() => modalDelete(post.foodcourt_id)}>
                            <button className="deletefoodcourtbutton">Delete</button>
                          </div>
                        </div>
                      );
                    })}
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

export default FoodCourtPage;

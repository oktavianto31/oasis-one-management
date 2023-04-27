import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import PropTypes from "prop-types";
import Select from "@material-ui/core/Select";
import React, { useEffect, useState } from "react";
import { useMinimalSelectStyles } from "./select/index";

import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";

import { useHistory, useLocation } from "react-router-dom";
import TablePagination from "../../Pagination/index";
import { faAngleLeft, faAngleRight, faEye, faEyeSlash, faXmark, faMagnifyingGlass, faCalendar, faPaperclip, faPencil } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import { BlockPicker } from "../TenantDetailPage/colorpalette";

import "./FoodCourtDetailPage.css";
import "../TenantPage/TenantPage.css";
import "../TenantPage/OrderPage.css";
import "../TenantPage/CustomerPage.css";
import "../TenantPage/ProfilePage.css";
import "../TenantDetailPage/TenantDetailPage.css";
import { Box, Modal } from "@mui/material";
import { FormControl } from "@material-ui/core";
import RowTenant from "./RowTenant";

import QRCode from "qrcode.react";

const FoodCourtDetailPage = () => {
  const localUrl = process.env.REACT_APP_FOODCOURTURL;
  const managementUrl = process.env.REACT_APP_MANAGEMENTURL;
  const imageUrl = process.env.REACT_APP_IMAGEURL;
  const tenantUrl = process.env.REACT_APP_TENANTURL;
  const location = useLocation();
  const myparam = location.state || {};
  const [tenantData, setTenantData] = useState();
  const [allTenantList, setAllTenantList] = useState();
  const [tenantRetrieved, setTenantRetrieved] = useState(false);
  const [openModalTenant, setOpenModalTenant] = useState(false);

  const [profileImage, setProfileImage] = useState();
  const [profileId, setProfileId] = useState();
  const [profileName, setProfileName] = useState();
  const [color, setColor] = useState();
  const [textAddress, setTextAddress] = useState();

  const [tenantIdSelected, setTenantIdSelected] = useState();
  const [tenantNameSelected, setTenantNameSelected] = useState();

  const [foodCourtData, setFoodCourtData] = useState([]);

  const [profileedit, setProfileEdit] = useState(false);

  const [tenantFiltered, setTenantFiltered] = useState();

  // Get All TenantId from foodcourt
  useEffect(() => {
    console.log("parammm", myparam);

    let mounted = true;
    if (mounted) {
      const url = localUrl + "/retrieve/" + myparam;
      fetch(url, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setTenantData(result.data[0].tenant_list);
            setFoodCourtData(result.data);
            setTenantRetrieved(() => true);
          } else {
            setTenantRetrieved(() => false);
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {

        setProfileId(foodCourtData[0].foodcourt_id)
        setProfileImage(foodCourtData[0].foodcourt_logo);
        setProfileName(foodCourtData[0].foodcourt_name);
        setColor(foodCourtData[0].foodcourt_color);
        setTextAddress(foodCourtData[0].foodcourt_address);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  // Get All Tenant
  async function getAllTenant() {
    setOpenModalTenant(true);
    const tenantUrl = managementUrl + "/user";

    fetch(tenantUrl, {
      method: "GET",
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setAllTenantList(result.data);
          setTenantRetrieved(() => true);
        } else {
          setTenantRetrieved(() => false);
        }
      });
  }

  // search and filter
  const [foodCourtDetailSearch, setFoodCourtDetailSearch] = useState("");
  const [foodCourtDetailFiltered, setFoodCourtDetailFiltered] = useState(0);

  // select component
  const [tenantSelected, setTenantSelected] = useState(0);

  // navigate
  //   const history = useHistory();
  //   function redirectFoodCourtList(foodcourt_id) {
  //     history.push({
  //       pathname: "/foodcourtdetails",
  //       state: foodcourt_id,
  //     });
  //   }

  function handleRemoveTenant(tenant_id) {
    const url = localUrl + "/removetenant/" + tenant_id;

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        tenant_id: tenant_id,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setTenantData();
          setTenantRetrieved(false);
        }
      });
  }

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

  function handleSelectedTenant(e) {
    if (e != 0) {
      setTenantSelected(e.target.value.name);
    }
    setTenantNameSelected(e.target.value.name);
    setTenantIdSelected(e.target.value.tenant_id);
  }

  async function handleFilter(e) {
    if (e != 0) {
      setFoodCourtDetailFiltered(e.target.value);
    }
    if (e === 0) {
      setFoodCourtDetailFiltered(0);
    }
    if (e.target.value == "Alphabetically") {
      const filteredurl = localUrl + "/sort/tenant/name/" + myparam + "/ascending";
      fetch(filteredurl, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setTenantData(result.data);
            setTenantRetrieved(() => true);
          } else {
            setTenantRetrieved(() => false);
          }
        });
    } else if (e.target.value == "Location") {
      const filteredurl = localUrl + "/sort/tenant/location/" + myparam + "/ascending";
      fetch(filteredurl, {
        method: "GET",
        headers: { "content-type": "application/JSON" },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status === "SUCCESS") {
            setTenantData(result.data);
            setTenantRetrieved(() => true);
          } else {
            setTenantRetrieved(() => false);
          }
        });
    }
  }

  // Handle Save Profile
  function HandleSaveProfile() {
    setProfileEdit(false);

    const editUrl = localUrl + "/edit/" + myparam;
    const uploadLogoUrl = imageUrl + "/logo/";

    fetch(editUrl, {
      method: "POST",
      body: JSON.stringify({
        foodcourt_address: textAddress,
        foodcourt_name: profileName,
        foodcourt_color: color,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
        }
      });

    var input = document.querySelector(".productinputfile");

    let formData = new FormData();
    formData.append("foodcourt", input.files[0]);
    fetch(uploadLogoUrl + myparam, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setFoodCourtData(result.data);
          // setTenantRetrieved(false);
        }
      })
      .catch((error) => {
        console.error("Error Upload Logo:", error);
      });
  }

  // Handle Add Tenant
  function handleSubmitTenant() {
    const addTenantUrl = localUrl + "/addtenant/" + foodCourtData[0].foodcourt_id;

    fetch(addTenantUrl, {
      method: "POST",
      body: JSON.stringify({
        tenant_id: tenantIdSelected,
        tenant_name: tenantNameSelected,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setOpenModalTenant(false);
          setTenantRetrieved(false);
        }
      });
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

  function downloadQRCode(){
    const qrCodeURL = document
    .getElementById("qrCodeEl")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  let aEl = document.createElement("a");
  aEl.href = qrCodeURL;
  aEl.download = foodCourtData[0].foodcourt_name + "qrcode.png";
  document.body.appendChild(aEl);
  aEl.click();
  document.body.removeChild(aEl);
  } 

  function handleTenantData(){
    // setTenantData();
    setTenantRetrieved(false);
  }
  
  return (
    <div className="container" style={{ zoom:"60%" }}>
      <Modal open={openModalTenant} style={{ zoom:"80%" }}>
        <Box className="createtenantmodalbox">
          <div className="createtenantheader">Add New Tenant</div>
          <div className="profiletext">Add Tenant to Food Court</div>

          <Select
            disableUnderline
            classes={{ root: minimalSelectClasses.select }}
            IconComponent={iconComponent}
            value={tenantSelected}
            onChange={(e) => handleSelectedTenant(e)}
            renderValue={(selected) => {
              if (selected === 0) {
                return <p className="placeholder">Pilih Tenant</p>;
              }
              return selected;
            }}
            MenuProps={menuProps}
          >
            {allTenantList !== undefined && tenantData !== undefined
              ? allTenantList.filter(tenant => tenant.foodcourt_id === "-").map((e, index) => {
                  return (
                    <MenuItem key={index + 1} value={e} style={{ zoom:"80%" }}>
                      {e.name}
                    </MenuItem>
                  );
                })
              : null}

            {/* <MenuItem key={1} value="Alphabetically">
              Alphabetically
            </MenuItem>
            <MenuItem key={2} value="Location">
              Location
            </MenuItem> */}
          </Select>

          <div className="buttonmodalbox">
            <div
              onClick={() => {
                setOpenModalTenant(false);
              }}
              className="cancelbtn"
            >
              Cancel
            </div>
            <div onClick={handleSubmitTenant} className="submitbtn">
              Save Contract
            </div>
          </div>
        </Box>
      </Modal>
      {tenantRetrieved ? (
        <div className="detailcontainer">
          <div className="sidepanelfoodcourtdetail" style={{ zoom:"100%" }}>
            <div className="profilecontainer">
              <img src={profileImage} className="profileimage" />
              {/* <img src={profileImage + "?time" + new Date()} className="profileimage" /> */}
              <div className="profilename">{profileName}</div>

              <button className={profileedit ? "profileeditbuttonactive" : "profileeditbutton"} onClick={() => setProfileEdit(true)}>
                Edit Profile
              </button>
            </div>

            <div className="profiledetailcontainer">
              <div className="profiledetails">
                <div className="profiletext">Profile Color :</div>
                <div className="profilecolor" style={{ background: color }}>
                  &nbsp;
                </div>
              </div>
              <div className="profileaddress">
                <div className="profiletext">Address</div>
                <div className="profiletext3">{textAddress}</div>
              </div>
              <div className="profileurl">
                <div className="profiletext">URL Foodcourt</div>
                <div className="profiletext3"><a href={"https://user.oasis-one.com/foodcourt/"+profileId} target="_blank">user.oasis-one.com/foodcourt/{profileId}</a> </div>
              </div>
              <div className="profileqrcode">
                <div className="profiletext">QR Foodcourt</div>
                <div className="qrimage">
                  <QRCode id="qrCodeEl" size={250} value={"https://user.oasis-one.com/foodcourt/"+profileId} />
                  <button  className="qrcodedownloadbtn"  onClick={downloadQRCode}>Download As PNG</button>
                </div>
              </div>
            </div>
          </div>

          <div className={profileedit ? "hide" : "foodcourtdetailcontainer"}>
            <div className="foodcourtdetailheader">
              <div className="foodcourtdetailheaderleft">
                <div className="foodcourtdetailleft">Total Tenant ({tenantData.length})</div>
                <div className="foodcourtdetailcenter">
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="searchicon" />
                  <input type="text" value={foodCourtDetailSearch} className="searchinput" placeholder="Search" onChange={(e) => setFoodCourtDetailSearch(e.target.value)} />
                  <button className={foodCourtDetailSearch == "" ? "searchhide" : "searchclosebutton"} onClick={() => setFoodCourtDetailSearch(() => "")}>
                    {" "}
                    <FontAwesomeIcon icon={faXmark} className="closeicon" />
                  </button>
                </div>
                <div className="foodcourtdetailright">
                  <Select
                    disableUnderline
                    classes={{ root: minimalSelectClasses.select }}
                    IconComponent={iconComponent}
                    value={foodCourtDetailFiltered}
                    onChange={(e) => {
                      handleFilter(e);
                    }}
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
                  <button className={foodCourtDetailFiltered === 0 ? "hide" : "unhide"} onClick={() => handleFilter(0)}>
                    Clear
                  </button>
                </div>
              </div>
              <div className="foodcourtdetailheaderright">
                <button  onClick={() => getAllTenant()} className="addfoodcourtdetailbtn">+ Add Tenant</button>
              </div>
            </div>

            {foodCourtDetailSearch == "" ? (
              <div className="outerfoodcourtdetailtable">
                <div className="foodcourtdetailheadertitlegrid">
                  <div className="foodcourtdetailheadertitle">No.</div>
                  <div className="foodcourtdetailheadertitle">Tenant Name</div>
                  <div className="foodcourtdetailheadertitle">Location</div>
                  <div className="foodcourtdetailheadertitle">Status</div>
                  {/* <div className="foodcourtdetailheadertitle">Recommend</div> */}
                  <div className="foodcourtdetailheadertitle">Details</div>
                </div>
                <div className="foodcourtdetailrendercontainer">
                  {tenantRetrieved == true &&
                    (rowsPerPage > 0 ? tenantData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : tenantData).map((post, indexs) => {
                      if (post.tenant_id === undefined) {
                        return <RowTenant handleTenantData={handleTenantData} foodcourtId={profileId} data={post.tenant_list.tenant_id} index={index} indexs={indexs} isRetrieved={tenantRetrieved} />;
                      } else {
                        return <RowTenant handleTenantData={handleTenantData} foodcourtId={profileId} data={post.tenant_id} index={index} indexs={indexs} isRetrieved={tenantRetrieved} />;
                      }
                    })}
                </div>
                <div className="foodcourtdetailfooter">
                  <TablePagination colSpan={3} count={tenantData.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} ActionsComponent={TablePaginationActions} />
                </div>
              </div>
            ) : (
              <div className="outerfoodcourtdetailtable">
                <div className="foodcourtdetailheadertitlegrid">
                  <div className="foodcourtdetailheadertitle">No.</div>
                  <div className="foodcourtdetailheadertitle">Tenant Name</div>
                  <div className="foodcourtdetailheadertitle">Location</div>
                  <div className="foodcourtdetailheadertitle">Status</div>
                  <div className="foodcourtdetailheadertitle">Details</div>
                </div>
                <div className="foodcourtdetailrendercontainer">
                  {tenantRetrieved === true &&
                    tenantData
                      .filter((post) => {
                        console.log("search", post);
                        if (post.tenant_name.toLowerCase().includes(foodCourtDetailSearch.toLowerCase())) {
                          return post;
                        }
                      })
                      .map((post, indexs) => {
                        console.log("filtered", post);
                        return <RowTenant data={post.tenant_id} index={index} indexs={indexs} tenantRetrieved={tenantRetrieved} />;
                      })}
                </div>
              </div>
            )}
          </div>

          <div className={profileedit ? "editprofilesettingsfoodcourtdetail" : "hide"}>
            <div className="outerprofilecontainer">
              <div className="foodcourtdetailprofileeditcontainer">
                <div className="outtercontainer">
                  <div className="innercontainer">
                    <div className="leftcolumncontainer">
                      <div className="row">
                        <div className="labelcolumn">
                          <div className="settingslabeltext">Food Court Name</div>
                          <div className="settingsinputcontainer">
                            <input type="text" value={profileName} className="inputcontainer1" onChange={(e) => setProfileName(e.target.value)} />
                          </div>
                        </div>
                        <div className="labelcolumn">
                          <div className="absolutewhite"></div>
                          <div className="settingslabeltext2">Profile Color</div>
                          <div className="settingsinputcontainer">
                            <div className="colorpick">
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

                      <div className="row2">
                        <div className="labelcolumn">
                          <div className="settingslabeltext">Address</div>
                          <div className="settingsinputcontainer">
                            <textarea type="text" value={textAddress} className="textareainputcontainer" onChange={(e) => setTextAddress(e.target.value)} />
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

                  <div className="editprofilebutton">
                    <button
                      onClick={() => {
                        setProfileEdit(false);
                        setProfileImage(foodCourtData[0].foodcourt_logo);
                        setProfileName(foodCourtData[0].foodcourt_name);
                        setColor(foodCourtData[0].profileColor);
                        setTextAddress(foodCourtData[0].foodcourt_address);
                      }}
                      className="cancelbutton"
                    >
                      Cancel
                    </button>

                    <button type="submit" onClick={HandleSaveProfile} className="savebutton">
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
};

export default FoodCourtDetailPage;

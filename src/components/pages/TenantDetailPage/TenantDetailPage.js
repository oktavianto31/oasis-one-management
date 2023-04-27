import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TablePagination from "../../Pagination/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faEye,
  faEyeSlash,
  faXmark,
  faPaperclip,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import NumberFormat from "react-number-format";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import moment from "moment"; 
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useHistory, useLocation } from "react-router-dom";
import { BlockPicker } from "./colorpalette/index";
import DatePicker from "./datepicker/components/date_picker/date_picker";
import { useNeonCheckboxStyles } from "./checkbox/index";
import { useOutlineSelectStyles } from "./select1/index";
import { useTimeSelectStyles } from "./select2/index";
import { useOutlineSelect2Styles } from "./select3/index";
import { ThreeDots } from "react-loader-spinner";
import { io } from "socket.io-client";
import recommended from "../../icons/Recommend.png";
import removecat from "../../icons/RemoveCat.svg";
import "../TenantPage/TenantPage.css";
import "../TenantPage/OrderPage.css";
import "../TenantPage/CustomerPage.css";
import "../TenantPage/ProfilePage.css";
import "./TenantDetailPage.css";

function TenantDetailPage() {
  const history = useHistory();
  const location = useLocation();
  const myparam = location.state || {};

  const dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Socket
  const [socket, setSocket] = useState("");
  const [socketRetrieved, setSocketRetrieved] = useState(false);
  const [online, setOnline] = useState(0);

  let peopleOnline = online - 1;
  let onlineText = "";

  if (peopleOnline < 1) {
    onlineText = "No one else is online";
  } else {
    onlineText =
      peopleOnline > 1
        ? `${online - 1} people are online`
        : `${online - 1} person is online`;
  }

  useEffect(() => {
    if (socket && myparam != undefined) {
      socket.on("visitor enters", (data) => setOnline(data));
      socket.on("visitor exits", (data) => setOnline(data));
      socket.emit("joinRoom", myparam);
    }
  });

  useEffect(() => {
    if (myparam != undefined) {
      const newSocket = io(
        "https://backend.oasis-one.com",
        { transports: ["polling"] },
        {
          query: {
            tenant_id: myparam,
          },
        }
      );

      setSocket(newSocket);
      setSocketRetrieved(true);
      return () => newSocket.close();
    }
  }, [socketRetrieved]);

  const tenantUrl = process.env.REACT_APP_TENANTURL;
  const imageUrl = process.env.REACT_APP_IMAGEURL;
  const managementUrl = process.env.REACT_APP_MANAGEMENTURL;
  const contractUrl = process.env.REACT_APP_CONTRACTURL;

  const [tenantData, setTenantData] = useState([]);
  const [tenantRetrieved, setTenantRetrieved] = useState(false);

  // Get Tenant Data
  useEffect(() => {
      if (myparam != undefined) {
        const url = tenantUrl + "/user/" + myparam;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              setTenantData([result.data]);
              setTenantRetrieved(() => true);
            } else {
              setTenantRetrieved(() => false);
            }
          });
      }
  }, [tenantRetrieved]);

  const tablelUrl = process.env.REACT_APP_TABLEURL;
  const [tableData, setTableData] = useState([]);
  const [tableRetrieved, setTableRetrieved] = useState(false);

  // Get Table Data
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (myparam != undefined) {
        const url = tablelUrl + "/" + myparam;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              setTableData([result.data]);
              setTableRetrieved(() => true);
            } else {
              setTableRetrieved(() => false);
            }
          });
      }
    }

    return () => {
      mounted = false;
    };
  }, [tableRetrieved]);

  // Tenant Edit
  const [color, setColor] = useState();
  const [profileName, setProfileName] = useState();
  const [email, setEmail] = useState();
  const [uniqueKey, setUniqueKey] = useState();
  const [profileImage, setProfileImage] = useState();
  const [taxChargeValue, setTaxChargeValue] = useState();
  const [serviceChargeValue, setServiceChargeValue] = useState();
  const [textAddress, setTextAddress] = useState();
  const [textLocation, setTextLocation] = useState();
  const [textPhone, setTextPhone] = useState();
  const [profileimage, setPofileimage] = useState();

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (tenantRetrieved === true) {
        setPofileimage(tenantData[0].profileimage);
        setProfileName(tenantData[0].name);
        setEmail(tenantData[0].email);
        setTextPhone(tenantData[0].phoneNumber);
        setUniqueKey(tenantData[0].uniqueKey);
        setColor(tenantData[0].profileColor);
        setTextAddress(tenantData[0].address);
        setTextLocation(tenantData[0].location);
        setTaxChargeValue(tenantData[0].taxCharge);
        setServiceChargeValue(tenantData[0].serviceCharge);
        setProfileImage(tenantData[0].profileImage);
      }
    }
    return () => {
      mounted = false;
    };
  }, [tenantRetrieved, tenantData]);

  // Pagination Settings
  const [orderpage, setOrderPage] = useState(0);
  const [customerpage, setCustomerPage] = useState(0);
  const [orderindex, setOrderIndex] = useState(1);
  const [customerindex, setCustomerIndex] = useState(1);
  const rowsPerPage2 = 7;

  function TablePaginationActionsorder(props) {
    const { count, page, onPageChange } = props;

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
      setOrderIndex(orderindex - 7);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
      setOrderIndex(orderindex + 7);
    };

    return (
      <div className="tablecontainerbutton">
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

  TablePaginationActionsorder.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage2: PropTypes.number.isRequired,
  };

  function TablePaginationActionscustomer(props) {
    const { count, page, onPageChange } = props;

    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
      setCustomerIndex(customerindex - 7);
    };

    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
      setCustomerIndex(customerindex + 7);
    };

    return (
      <div className="tablecontainerbutton">
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

  TablePaginationActionscustomer.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage2: PropTypes.number.isRequired,
  };

  const handleOrderChangePage = (event, newOrderPage) => {
    setOrderPage(newOrderPage);
  };
  const handleCustomerChangePage = (event, newCustomerPage) => {
    setCustomerPage(newCustomerPage);
  };

  // Generate PDF
  const generateOrderPdf = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "No",
      "Order ID",
      "Customer Name",
      "Customer Phonenumber",
      "Total",
      "Order Placed At",
      " Table No",
      "Order Instruction",
    ];
    const tableRows = [];
    orderData.map((item) => {
      return item.map((post, index) => {
        const dateOptions = {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        };
        const ordertime = new Date(post.order_time);
        const OrderData = [
          index + 1,
          post.order_id,
          post.user_name,
          post.user_phonenumber,
          post.order_total,
          ordertime.toLocaleDateString("en-ID", dateOptions),
          post.order_table,
          post.order_instruction,
        ];
        tableRows.push(OrderData);
      });
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text(`${profileName} Order Report.`, 14, 15);
    doc.save(`${profileName}_orderreport.pdf`);
  };

  const generateCustomerPdf = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "No",
      "Customer Name",
      "Customer Phonenumber",
      "Last Order Placed",
    ];
    const tableRows = [];
    orderData[0].map((post, index) => {
      const dateOptions = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      const ordertime = new Date(post.order_time);

      const OrderData = [
        index + 1,
        post.user_name,
        post.user_phonenumber,

        ordertime.toLocaleDateString("en-ID", dateOptions),
      ];
      tableRows.push(OrderData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text(`${profileName} Customer Report.`, 14, 15);
    doc.save(`${profileName}_customerreport.pdf`);
  };

  // Orders
  const orderUrl = process.env.REACT_APP_ORDERURL;
  const [orderData, setOrderData] = useState([]);
  const [orderRetrieved, setOrderRetrieved] = useState(false);

  // Get Order Data
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (myparam != undefined) {
        const url = orderUrl + "/retrieve/" + myparam;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              console.log("resss",[result.data])
              setOrderData([result.data]);
              setOrderRetrieved(() => true);
            } else {
              setOrderRetrieved(() => false);
            }
          });
      }
    }

    return () => {
      mounted = false;
    };
  }, [orderRetrieved]);

  const [orderOpen, setOrderOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [orderTable, setOrderTable] = useState("");
  const [orderTime, setOrderTime] = useState("");
  const [orderMenu, setOrderMenu] = useState([]);
  const [orderItem, setOrderItem] = useState("");
  const [orderTotal, setOrderTotal] = useState("");
  const [orderServiceCharge, setOrderServiceCharge] = useState("");
  const [orderTaxCharge, setOrderTaxCharge] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhonenumber, setUserPhonenumber] = useState("");
  const [orderInstruction, setOrderInstruction] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const ordertime = new Date(orderTime);

  function handlePassinginfo(
    orderStatus,
    orderTable,
    orderTime,
    orderMenu,
    orderItem,
    orderTotal,
    orderServiceCharge,
    orderTaxCharge,
    userName,
    userPhonenumber,
    orderInstruction,
    rejectReason
  ) {
    setOrderStatus(orderStatus);
    setOrderTable(orderTable);
    setOrderTime(orderTime);
    setOrderMenu(orderMenu);
    setOrderItem(orderItem);
    setOrderTotal(orderTotal);
    setOrderServiceCharge(orderServiceCharge);
    setOrderTaxCharge(orderTaxCharge);
    setUserName(userName);
    setUserPhonenumber(userPhonenumber);
    setOrderInstruction(orderInstruction);
    setRejectReason(rejectReason);
  }

  const [profileedit, setProfileEdit] = useState(false);

  const [settingsavednotif, setSettingSavedNotif] = useState(false);
  function handlenotification() {
    if (settingsavednotif) {
      setSettingSavedNotif(false);
    }
  }

  async function HandleSaveProfile() {
    console.log("testtt")
    setProfileEdit(false);
    setEditShow(false);
    setSettingSavedNotif(true);
    setTimeout(() => {
      setSettingSavedNotif(false);
    }, 3000);

    const profileUrl = imageUrl + "/avatar/" + myparam;
    var input = document.querySelector(".productinputfile");

    let formData = new FormData();
    formData.append("avatar", input.files[0]);

    fetch(profileUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {})
      .catch((error) => {
        console.error("Error Upload Logo:", error);
      });

    const editUrl = tenantUrl + "/edit/" + myparam;

    fetch(editUrl, {
      method: "POST",
      body: JSON.stringify({
        tenant_id: myparam,
        profileName: profileName,
        phoneNumber: textPhone,
        address: textAddress,
        location: textLocation,
        profileColor: color,
        email: email,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          socket.emit("update user", result.data);
        }
      });

    const serviceUrl = tenantUrl + "/edit/servicecharges"; 

    fetch(serviceUrl, {
      method: "POST",
      body: JSON.stringify({
        tenant_id: myparam,
        charges: serviceChargeValue,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          socket.emit("update user", result.data);
        }
      });

    const taxUrl = tenantUrl + "/edit/taxcharges";

    fetch(taxUrl, {
      method: "POST",
      body: JSON.stringify({
        tenant_id: myparam,
        charges: taxChargeValue,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          socket.emit("update user", result.data);
        }
      });

    const passwordUrl = managementUrl + "/updatepassword";

    fetch(passwordUrl, {
      method: "POST",
      body: JSON.stringify({
        tenant_id: myparam,
        newPassword: uniqueKey,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (socket) {
          socket.emit("update user", result.data);
        }
      });
  }

  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [innerview, setInnerView] = useState(true);

  function handleinnerview() {
    if (innerview) {
      setInnerView(false);
      innerview = !innerview;
    } else {
      setInnerView(true);
    }
  }

  //time inputs
  const daysInAWeek = [
    {
      name: "Monday",
      initial: "M",
      isSelected: false,
    },
    {
      name: "Tuesday",
      initial: "T",
      isSelected: false,
    },
    {
      name: "Wednesday",
      initial: "W",
      isSelected: false,
    },
    {
      name: "Thursday",
      initial: "T",
      isSelected: false,
    },
    {
      name: "Friday",
      initial: "F",
      isSelected: false,
    },
    {
      name: "Saturday",
      initial: "S",
      isSelected: false,
    },
    {
      name: "Sunday",
      initial: "S",
      isSelected: false,
    },
  ];

  const [day, setDay] = useState();
  const [open24hrs, setOpen24hrs] = useState(false);
  const [isclosed, setIsClosed] = useState(false);
  const [opentimehour, setOpenTimeHour] = useState();
  const [opentimeminute, setOpenTimeMinute] = useState();
  const [opentimetf, setOpenTimeTF] = useState();
  const [closedtimehour, setClosedTimeHour] = useState();
  const [closedtimeminute, setClosedTimeMinute] = useState();
  const [closedtimetf, setClosedTimeTF] = useState();
  const [openhouredit, setOpenHourEdit] = useState(false);
  const neonStyles = useNeonCheckboxStyles();

  function handleOpenHourEditOpen(
    day,
    is24hrs,
    isclosed,
    openh,
    openm,
    opentf,
    closeh,
    closem,
    closetf
  ) {
    setOpenHourEdit(true);
    setDay(day);
    setOpen24hrs(is24hrs);
    setIsClosed(isclosed);
    setOpenTimeHour(openh);
    setOpenTimeMinute(openm);
    setOpenTimeTF(opentf);
    setClosedTimeHour(closeh);
    setClosedTimeMinute(closem);
    setClosedTimeTF(closetf);
  }

  function DateAndTimeModal() {
    const [daysSelected, setDaysSelected] = useState([]);
    const url = tenantUrl + "/edit/openinghours/" + myparam;

    function handlesavehour() {
      function verifyTime() {
        if (closedtimetf == opentimetf) {
          if (closedtimehour == opentimehour) {
            if (closedtimeminute <= opentimeminute) {
              return false;
            }
          } else if (closedtimehour < opentimehour) {
            return false;
          }
        } else if (closedtimetf == "AM" && opentimetf == "PM") {
          return false;
        } else {
          return true;
        }
      }

      if (verifyTime) {
        setOpenHourEdit((state) => !state);
        daysSelected.map((item, index) => {
          const payload = JSON.stringify({
            day: item,
            is24Hours: open24hrs,
            isClosed: isclosed,
            OpenHour: opentimehour,
            OpenMins: opentimeminute,
            OpenTF: opentimetf,
            CloseHour: closedtimehour,
            CloseMins: closedtimeminute,
            CloseTF: closedtimetf,
          });

          fetch(url, {
            method: "POST",
            body: payload,
            headers: { "content-type": "application/JSON" },
          })
            .then((response) => response.json())
            .then((result) => {
              setDaysSelected([]);
            });
        });
      }
    }

    function RenderButton(item, index) {
      const [selected, setSelected] = useState(false);

      useEffect(() => {
        if (item.name == day) {
          setSelected(true);

          if (daysSelected.indexOf(item.name) === -1) {
            daysSelected.push(item.name);
          }
        }
      }, [day]);

      useEffect(() => {
        if (item.name == daysSelected) {
          setSelected(true);
        }
        if (item.name != daysSelected) {
          setSelected(false);
        }
      }, [daysSelected]);

      return (
        <button
          type="button"
          className={selected ? "daysbutton" : "daysbuttonoff"}
          onClick={() => {
            setSelected((state) => !state);
            daysSelected.indexOf(item.name) === -1
              ? daysSelected.push(item.name)
              : daysSelected.splice(daysSelected.indexOf(item.name), 1);
          }}
        >
          {item.initial}
        </button>
      );
    }

    function handle24checked(event) {
      setOpen24hrs((state) => !state);
      if (open24hrs) {
        setIsClosed(() => false);
      }
      if (isclosed) {
        setIsClosed(() => false);
      }
    }

    function handleclosedchecked(event) {
      setIsClosed((state) => !state);
      if (open24hrs) {
        setOpen24hrs(() => false);
      }
      if (isclosed) {
        setOpen24hrs(() => false);
      }
    }

    return (
      <Modal open={openhouredit}>
        <Box className="openhourbox">
          <div className="openhourinnerbox">
            <div className="openhourmodaltitle">Select Days & Time</div>

            <form>
              <div className="openhourinnermodalbox">
                <div className="days">
                  {daysInAWeek.map((item, index) => RenderButton(item, index))}
                </div>

                <div className="checkbox">
                  <FormControlLabel
                    control={
                      <Checkbox
                        disableRipple
                        checked={open24hrs}
                        onChange={handle24checked}
                        classes={neonStyles}
                        checkedIcon={<span />}
                        icon={<span />}
                      />
                    }
                    label="24 Hours"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        disableRipple
                        checked={isclosed}
                        onChange={handleclosedchecked}
                        classes={neonStyles}
                        checkedIcon={<span />}
                        icon={<span />}
                      />
                    }
                    label="Closed"
                  />
                </div>

                <div className="time">
                  <div className="opentime">
                    <div
                      className={
                        open24hrs || isclosed ? "timelabel" : "timelabelactive"
                      }
                    >
                      Open Time
                    </div>
                    <div className="timeinputcontainer">
                      <div className="timeinputs">
                        <Select
                          defaultValue={opentimehour}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: timeSelectClasses.selectdisabled }
                              : { root: timeSelectClasses.select }
                          }
                          MenuProps={timemenuProps}
                          value={opentimehour}
                          IconComponent={timeiconComponent}
                          onChange={(e) => setOpenTimeHour(e.target.value)}
                        >
                          <MenuItem value="00">00</MenuItem>
                          <MenuItem value="01">01</MenuItem>
                          <MenuItem value="02">02</MenuItem>
                          <MenuItem value="03">03</MenuItem>
                          <MenuItem value="04">04</MenuItem>
                          <MenuItem value="05">05</MenuItem>
                          <MenuItem value="06">06</MenuItem>
                          <MenuItem value="07">07</MenuItem>
                          <MenuItem value="08">08</MenuItem>
                          <MenuItem value="09">09</MenuItem>
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="11">11</MenuItem>
                          <MenuItem value="12">12</MenuItem>
                        </Select>

                        <div
                          className={
                            open24hrs || isclosed
                              ? "semicolon"
                              : "semicolonactive"
                          }
                        >
                          :
                        </div>
                        <Select
                          defaultValue={opentimeminute}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: timeSelectClasses.selectdisabled }
                              : { root: timeSelectClasses.select }
                          }
                          MenuProps={timemenuProps}
                          value={opentimeminute}
                          IconComponent={timeiconComponent}
                          onChange={(e) => setOpenTimeMinute(e.target.value)}
                        >
                          <MenuItem value="00">00</MenuItem>
                          <MenuItem value="05">05</MenuItem>
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="15">15</MenuItem>
                          <MenuItem value="20">20</MenuItem>
                          <MenuItem value="25">25</MenuItem>
                          <MenuItem value="30">30</MenuItem>
                          <MenuItem value="35">35</MenuItem>
                          <MenuItem value="40">40</MenuItem>
                          <MenuItem value="45">45</MenuItem>
                          <MenuItem value="50">50</MenuItem>
                          <MenuItem value="55">55</MenuItem>
                        </Select>
                      </div>
                      <div className="timeselector">
                        <Select
                          defaultValue={opentimetf}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: outlineSelectClasses2.selectdisabled }
                              : { root: outlineSelectClasses2.select }
                          }
                          MenuProps={menuProps}
                          value={opentimetf}
                          IconComponent={iconComponent}
                          onChange={(e) => setOpenTimeTF(e.target.value)}
                        >
                          <MenuItem value="AM">AM</MenuItem>
                          <MenuItem value="PM">PM</MenuItem>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="closetime">
                    <div
                      className={
                        open24hrs || isclosed ? "timelabel" : "timelabelactive"
                      }
                    >
                      Closed Time
                    </div>
                    <div className="timeinputcontainer">
                      <div className="timeinputs">
                        <Select
                          defaultValue={closedtimehour}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: timeSelectClasses.selectdisabled }
                              : { root: timeSelectClasses.select }
                          }
                          MenuProps={timemenuProps}
                          value={closedtimehour}
                          IconComponent={timeiconComponent}
                          onChange={(e) => setClosedTimeHour(e.target.value)}
                        >
                          <MenuItem value="00">00</MenuItem>
                          <MenuItem value="01">01</MenuItem>
                          <MenuItem value="02">02</MenuItem>
                          <MenuItem value="03">03</MenuItem>
                          <MenuItem value="04">04</MenuItem>
                          <MenuItem value="05">05</MenuItem>
                          <MenuItem value="06">06</MenuItem>
                          <MenuItem value="07">07</MenuItem>
                          <MenuItem value="08">08</MenuItem>
                          <MenuItem value="09">09</MenuItem>
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="11">11</MenuItem>
                          <MenuItem value="12">12</MenuItem>
                        </Select>

                        <div
                          className={
                            open24hrs
                              ? isclosed
                                ? "semicolonactive"
                                : "semicolon"
                              : "semicolon"
                          }
                        >
                          :
                        </div>
                        <Select
                          defaultValue={closedtimeminute}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: timeSelectClasses.selectdisabled }
                              : { root: timeSelectClasses.select }
                          }
                          MenuProps={timemenuProps}
                          value={closedtimeminute}
                          IconComponent={timeiconComponent}
                          onChange={(e) => setClosedTimeMinute(e.target.value)}
                        >
                          <MenuItem value="00">00</MenuItem>
                          <MenuItem value="05">05</MenuItem>
                          <MenuItem value="10">10</MenuItem>
                          <MenuItem value="15">15</MenuItem>
                          <MenuItem value="20">20</MenuItem>
                          <MenuItem value="25">25</MenuItem>
                          <MenuItem value="30">30</MenuItem>
                          <MenuItem value="35">35</MenuItem>
                          <MenuItem value="40">40</MenuItem>
                          <MenuItem value="45">45</MenuItem>
                          <MenuItem value="50">50</MenuItem>
                          <MenuItem value="55">55</MenuItem>
                        </Select>
                      </div>
                      <div className="timeselector">
                        <Select
                          defaultValue={closedtimetf}
                          disableUnderline
                          disabled={open24hrs || isclosed ? true : false}
                          classes={
                            open24hrs || isclosed
                              ? { root: outlineSelectClasses2.selectdisabled }
                              : { root: outlineSelectClasses2.select }
                          }
                          MenuProps={menuProps}
                          value={closedtimetf}
                          IconComponent={iconComponent}
                          onChange={(e) => setClosedTimeTF(e.target.value)}
                        >
                          <MenuItem value="AM">AM</MenuItem>
                          <MenuItem value="PM">PM</MenuItem>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <div className="openhourmodalbutton">
              <button
                onClick={() => {
                  setDay();
                  setOpenHourEdit((state) => !state);
                  setDaysSelected([]);
                }}
                className="cancelbutton"
              >
                Cancel
              </button>

              <button
                type="submit"
                onClick={handlesavehour}
                className="savebutton"
              >
                Save
              </button>
            </div>
          </div>
        </Box>
      </Modal>
    );
  }

  //select inputs
  const timeSelectClasses = useTimeSelectStyles();
  const outlineSelectClasses = useOutlineSelectStyles();
  const outlineSelectClasses2 = useOutlineSelect2Styles();

  // moves the menu below the select input
  const timemenuProps = {
    classes: {
      paper: timeSelectClasses.paper,
      list: timeSelectClasses.list,
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

  const menuProps = {
    classes: {
      paper: outlineSelectClasses2.paper,
      list: outlineSelectClasses2.list,
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

  const timeiconComponent = (props) => {
    return (
      <ExpandMoreRoundedIcon
        className={props.className + " " + timeSelectClasses.icon}
      />
    );
  };

  const iconComponent = (props) => {
    return (
      <ExpandMoreRoundedIcon
        className={
          open24hrs
            ? isclosed
              ? props.className + " " + outlineSelectClasses2.icondisabled
              : props.className + " " + outlineSelectClasses2.icondisabled
            : props.className + " " + outlineSelectClasses2.icon
        }
      />
    );
  };

  //handle contracts
  const [contractData, setContractData] = useState();
  const [contractRetrieved, setContractRetrieved] = useState(false);

  // Get Contract Data
  useEffect(() => {
      if (myparam != undefined) {
        const url = contractUrl + "/retrieve/" + myparam;

        fetch(url, {
          method: "GET",
          headers: { "content-type": "application/JSON" },
        })
          .then((response) => response.json())
          .then((result) => {
            if (result.status === "SUCCESS") {
              setContractData(result.data);
              setContractRetrieved(() => true);
            } else if (result.status === "FAILED") {
              setContractRetrieved(() => false);
            }
          });
      }
  }, [contractRetrieved]);

  const [addcontract, setAddContract] = useState(false);

  async function handleremovecontract() {
    setRemoveContract(false);
    //Delete contract file
    const url = contractUrl + "/remove/" + myparam;

    fetch(url, {
      method: "POST",
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setContractData();
          setContractRetrieved(false);
        }
      });
  }

  async function handleaddcontractsave() {
    //save contract file
    const fileUrl = imageUrl + "/contract/" + myparam;
    var input = document.querySelector(".contractfileinput");

    let formData = new FormData();
    formData.append("contract", input.files[0]);

    fetch(fileUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())

      .catch((error) => {
        console.error("Error Upload Logo:", error);
      });

    //set contract to show the details
    const url = contractUrl + "/create/" + myparam;

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        start_Date: startvalue,
        contract_Period: contractval,
        contract_Name: input.files[0].name,
        contract_File: imageUrl + "/contract/" + myparam,
      }),
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setContractData(result.data);
          setContractRetrieved(() => true);
        } else if (result.status === "FAILED") {
          setContractRetrieved(() => false);
        }
      });

    //close modal
    setAddContract(false);
    setContractVal();
    setstartValue();
    setContractFile();
  }

  const [startvalue, setstartValue] = useState();
  const [contractval, setContractVal] = useState();
  const [contractfile, setContractFile] = useState();

  //handle select contract
  const outlinemenuProps = {
    classes: {
      paper: outlineSelectClasses.paper,
      list: outlineSelectClasses.list,
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
  const outlineiconComponent = (props) => {
    return (
      <ExpandMoreRoundedIcon
        className={props.className + " " + outlineSelectClasses.icon}
      />
    );
  };

  async function imageHandler(e) {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }

  const [removecontract, setRemoveContract] = useState(false);

  function RemoveContractModal() {
    return (
      <Modal open={removecontract}>
        <Box className="removecatmodalbox">
          <div className="removecatinnerbox">
            <div className="removecatheading">
              <img src={removecat} className="removecatimage" />
              <div className="removecatmodaltitle">Remove Contract</div>
            </div>
            <div className="removecatmodaltext">
              Are you sure to remove the{" "}
              <span style={{ color: "#e52c32" }}>"{profileName}"</span>{" "}
              contract?
            </div>

            <div className="removecatmodalbuttoncontainer">
              <div>
                <button
                  className="modalcancelbutton"
                  onClick={() => {
                    setRemoveContract(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div>
                <button
                  className="modalconfirmbutton"
                  onClick={() => handleremovecontract()}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    );
  }

  return (
    <div className="container">
      {DateAndTimeModal()}
      {RemoveContractModal()}
      <div className="tenantcontainer2">
        {tenantRetrieved ? (
          <div className="viewdetailscontainer">
            <div className="sidepanel">
              <div className="profilecontainer">
                <img src={profileImage} className="profileimage" />
                {/* <img src={profileImage + "?time" + new Date()} className="profileimage" /> */}
                <div className="profilename">{profileName}</div>

                <button
                  className={
                    profileedit
                      ? "profileeditbuttonactive"
                      : "profileeditbutton"
                  }
                  onClick={() => setProfileEdit(true)}
                >
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
                <div className="profiledetails">
                  <div className="profiletext">Password : </div>

                  <input
                    type={show ? "text" : "password"}
                    value={uniqueKey}
                    disabled="true"
                    className="profilepassword"
                  />
                  <FontAwesomeIcon
                    icon={show ? faEye : faEyeSlash}
                    onClick={() => setShow(!show)}
                    className={show ? "passwordshowicon" : "passwordicon"}
                  />
                </div>
                <div className="profiledetails">
                  <div className="profiletext">Contact Person :</div>
                  <div className="profiletext2">{textPhone}</div>
                </div>
                <div className="profiledetails">
                  <div className="profiletext">Location :</div>
                  <div className="profiletext2">{textLocation}</div>
                </div>
                <div className="profileaddress">
                  <div className="profiletext">Address</div>
                  <div className="profiletext3">{textAddress}</div>
                </div>

                <div className="profileopenhour">
                  <div className="profiletext">Open Hour</div>
                  <div className="profileopen">
                    {tenantRetrieved == true &&
                      tenantData[0].openingDays.map((item, index) => {
                        return (
                          <div className="openhourdetails2">
                            <div className="openleft">{item.day}</div>
                            <div className="openright">
                              {item.is24Hours ? (
                                "Open 24 hours"
                              ) : item.isClosed ? (
                                "Closed"
                              ) : (
                                <>
                                  {item.OpenHour}:{item.OpenMins}&nbsp;
                                  {item.OpenTF}&nbsp;-&nbsp;
                                  {item.CloseHour}:{item.CloseMins}&nbsp;
                                  {item.CloseTF}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <div className="container">
              <div className="maincontainer">
                <div
                  className={
                    settingsavednotif ? "settingsnotification" : "hidden"
                  }
                >
                  <div className="notificationtextcontainer">
                    <div className="notificationtext">
                      {profileName} Settings Saved
                    </div>
                  </div>

                  <div className="notificationclose">
                    <button
                      className="notifclosebutton"
                      onClick={handlenotification}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                </div>

                <div className="backheader">
                  <button
                    className="backheaderbutton"
                    onClick={
                      profileedit
                        ? () => {
                            setProfileEdit(false);
                            setPofileimage(tenantData[0].profileimage);
                            setProfileName(tenantData[0].name);
                            setEmail(tenantData[0].email);
                            setTextPhone(tenantData[0].phoneNumber);
                            setUniqueKey(tenantData[0].uniqueKey);
                            setColor(tenantData[0].profileColor);
                            setTextAddress(tenantData[0].address);
                            setTextLocation(tenantData[0].location);
                            setTaxChargeValue(tenantData[0].taxCharge);
                            setServiceChargeValue(tenantData[0].serviceCharge);
                            setProfileImage(tenantData[0].profileImage);
                          }
                        : () => history.goBack()
                    }
                  >
                    <FontAwesomeIcon icon={faAngleLeft} className="backicon" />
                    Back
                  </button>

                  <div className={profileedit ? "editprofileheader" : "hide"}>
                    Edit Profile
                  </div>
                </div>
                {orderRetrieved == true && (
                  <div className={profileedit ? "hide" : "ordercontainer"}>
                    <div className={profileedit ? "hide" : "ordertable"}>
                      <div className="orderheader">
                        <div className="orderleft">
                          <div
                            className={
                              innerview
                                ? "Orderbuttoncontainer"
                                : "not-orderbutton"
                            }
                          >
                            <button
                              className={innerview ? "orders" : "notorders"}
                              onClick={() => handleinnerview()}
                            >
                              Orders
                            </button>
                          </div>
                          <div
                            className={
                              innerview
                                ? "not-customerbutton"
                                : "Customerbuttoncontainer"
                            }
                          >
                            <button
                              className={innerview ? "notcustomer" : "customer"}
                              onClick={() => handleinnerview()}
                            >
                              Customer
                            </button>
                          </div>
                        </div>

                        <div className="orderright">
                          <button
                            className="downloadbutton"
                            onClick={
                              innerview ? generateOrderPdf : generateCustomerPdf
                            }
                          >
                            Download as PDF{" "}
                          </button>
                        </div>
                      </div>
                      <div
                        className={
                          innerview ? "orderheadertitlegrid" : "trial2"
                        }
                      >
                        <div className="orderheadertitle">NO</div>
                        <div className="orderheadertitle">ORDER ID</div>
                        <div className="orderheadertitle">TOTAL</div>
                        <div className="orderheadertitle">STATUS</div>
                        <div className="orderheadertitle">ORDER PLACED AT</div>
                        <div className="orderheadertitle">TABLE NO</div>
                        <div className="orderheadertitle">ACCEPT/REJECT</div>
                        <div className="orderheadertitle">VIEW ORDER</div>
                      </div>

                      <div
                        className={
                          innerview ? "trial1" : "tenantcustomerheadertitlegrid"
                        }
                      >
                        <div className="customerheadertitle">NO</div>
                        <div className="customerheadertitle">NAME</div>
                        <div className="customerheadertitle">PHONE NUMBER</div>
                        <div className="customerheadertitle">LAST ORDER</div>
                      </div>

                      <div
                        className={
                          innerview ? "tenantorderrendercontainer" : "trial"
                        }
                      >
                        <Modal open={orderOpen}>
                          <Box className="ordermodalbox">
                            <div className="modalclose">
                              <button
                                className="modalclosebutton"
                                onClick={() => setOrderOpen(false)}
                              >
                                <FontAwesomeIcon
                                  className="closebuttonicon"
                                  icon={faCircleXmark}
                                />
                              </button>
                            </div>

                            <div className="innermodalbox">
                              <div className="ordermodaltitle">
                                {profileName}
                              </div>
                              <div className="ordermodalsubtitle">
                                <div className="ordermodaldate">
                                  <div className="ordertime">
                                    <CalendarTodayOutlinedIcon
                                      fontSize="small"
                                      className="timeicon"
                                    />
                                    {ordertime.toLocaleTimeString("en-US")}{" "}
                                    <span className="space">/</span>{" "}
                                    <span className="orderdate">
                                      {" "}
                                      {ordertime.toLocaleDateString(
                                        "en-ID",
                                        dateOptions
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="ordermodalstatus">
                                  <div className="statustext">STATUS</div>
                                  <div className="statuscoloredtext">
                                    {orderStatus == 1 ? (
                                      <div className="pending">PENDING</div>
                                    ) : orderStatus == 2 ? (
                                      <div className="orderplaced">
                                        ORDER PLACED
                                      </div>
                                    ) : orderStatus == 3 ? (
                                      <div className="served">SERVED</div>
                                    ) : orderStatus == 4 ? (
                                      <div className="payment">PAYMENT</div>
                                    ) : orderStatus == 5 ? (
                                      <div className="complete">COMPLETE</div>
                                    ) : orderStatus == 6 ? (
                                      <div className="modalrejectedstatus">
                                        REJECTED
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              <div className="ordermodalitems">
                                <div className="ordermodalform">
                                  <form>
                                    <div className="ordermodalinputlabel">
                                      Name{" "}
                                      <span style={{ color: "#E52C32" }}>
                                        *
                                      </span>
                                    </div>
                                    <input
                                      type="text"
                                      value={userName}
                                      className="ordermodalinputfile"
                                      disabled={true}
                                    />
                                    <div className="ordermodalinputlabel">
                                      Phone Number
                                      <span style={{ color: "#E52C32" }}>
                                        *
                                      </span>
                                    </div>
                                    <input
                                      type="text"
                                      value={userPhonenumber}
                                      className="ordermodalinputfile"
                                      disabled={true}
                                    />
                                    <div className="ordermodalinputlabel">
                                      Special Instructions
                                    </div>
                                    <input
                                      type="text"
                                      value={orderInstruction}
                                      className="ordermodalinputfile"
                                      disabled={true}
                                    />
                                    <div className="ordermodalinputlabel">
                                      Table
                                    </div>
                                    {tableRetrieved &&
                              tableData.map((item) => {
                                return item.map((posts, index) => {
                                  if (posts.table.id == orderTable) {
                                    return (
                                      <span>
                                        <input
                                          type="text"
                                          className="ordermodalinputfile"
                                          value={posts.table.index}
                                        />
                                      </span>
                                    );
                                  }
                                });
                              })}

                                    {orderStatus == 6 ? (
                                      <>
                                        {" "}
                                        <div className="ordermodalinputlabel">
                                          Reasons for rejecting
                                        </div>
                                        <div className="rejectreasontext">
                                          {rejectReason}
                                        </div>
                                      </>
                                    ) : null}
                                  </form>
                                </div>

                                <div className="ordermenuitemcontainer">
                                  <div className="ordermenutitle">
                                    Order Items
                                  </div>
                                  <div className="ordermenuitem">
                                    {orderMenu.map((post, index) => (
                                      <div className="ordermenucontainer">
                                        <div className="ordermenuimagecontainer">
                                          <img
                                            src={post.menuImage}
                                            className="menuimage"
                                          />
                                        </div>
                                        <div className="orderdetailsmenutext">
                                          <div className="orderdetailsmenutitle">
                                            {post.name}
                                          </div>
                                          <div className="recommended">
                                            {post.isRecommended === true ? (
                                              <img src={recommended} />
                                            ) : (
                                              "null"
                                            )}
                                          </div>
                                          <div className="orderdetailmenuprice">
                                            <NumberFormat
                                              value={post.price}
                                              prefix="Rp. "
                                              decimalSeparator="."
                                              thousandSeparator=","
                                              displayType="text"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="ordertotalsummary">
                                    <div className="ordertotalitems">
                                      <div className="lefttext">Items:</div>
                                      <div className="righttext">
                                        {orderItem}
                                      </div>
                                    </div>

                                    <div className="ordertotalitems">
                                      <div className="lefttext">Subtotal:</div>
                                      <div className="righttext">
                                        <NumberFormat
                                          value={orderTotal}
                                          prefix="Rp. "
                                          decimalSeparator="."
                                          thousandSeparator=","
                                          displayType="text"
                                        />
                                      </div>
                                    </div>

                                    <div className="ordertotalitems">
                                      <div className="lefttext">
                                        Service Charge:
                                      </div>
                                      <div className="righttext">
                                        <NumberFormat
                                          value={orderServiceCharge}
                                          prefix="Rp. "
                                          decimalSeparator="."
                                          thousandSeparator=","
                                          displayType="text"
                                        />
                                      </div>
                                    </div>

                                    <div className="ordertotalitems-n">
                                      <div className="lefttext">Tax(%):</div>
                                      <div className="righttext">
                                        <NumberFormat
                                          value={orderTaxCharge}
                                          prefix="Rp. "
                                          decimalSeparator="."
                                          thousandSeparator=","
                                          displayType="text"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Box>
                        </Modal>

                        {orderRetrieved == true &&
                          (rowsPerPage2 > 0
                            ? orderData.map((item) => {
                                return item.slice(
                                  orderpage * rowsPerPage2,
                                  orderpage * rowsPerPage2 + rowsPerPage2
                                );
                              })
                            : orderData
                          ).map((item) => {
                            return item.map((post, i) => {
                              return (
                                <div
                                  className={i != 7 ? "bordered" : "noborder"}
                                >
                                  <div className="orderrendergrid">
                                    <div className="ordertext">
                                      {i + orderindex}
                                    </div>
                                    <div className="ordertext">
                                      {post.order_id}
                                    </div>
                                    <div className="ordertext">
                                      {" "}
                                      <NumberFormat
                                        value={post.order_total}
                                        prefix="Rp. "
                                        decimalSeparator="."
                                        thousandSeparator=","
                                        displayType="text"
                                      />
                                    </div>

                                    <div className="status">
                                      {post.order_status == 1 ? (
                                        <div className="pending">PENDING</div>
                                      ) : post.order_status == 2 ? (
                                        <div className="orderplaced">
                                          ORDER PLACED
                                        </div>
                                      ) : post.order_status == 3 ? (
                                        <div className="served">SERVED</div>
                                      ) : post.order_status == 4 ? (
                                        <div className="payment">PAYMENT</div>
                                      ) : post.order_status == 5 ? (
                                        <div className="complete">COMPLETE</div>
                                      ) : post.order_status == 6 ? (
                                        <div className="rejected">REJECTED</div>
                                      ) : null}
                                    </div>
                                    <div className="ordertext">
                                      {moment(post.order_time).fromNow()}
                                    </div>
                                    <div className="ordertablenumber">
                                    {tableRetrieved &&
                                      
                                           
                                      tableData.map((item) => {
                                        return item.map(
                                          (posts, index) => {
                                            if (
                                              posts.table.id ===
                                             post.order_table
                                            ) {
                                              return (
                                                <span>                                                  
                                                  {posts.table.index}
                                                </span>
                                              );
                                            }
                                          }
                                        );
                                      })}
                                    </div>
                                    <div className="acceptreject">
                                      {post.order_status == 1 ? (
                                        <div className="proceed">PROCEED</div>
                                      ) : post.order_status == 2 ? (
                                        <div className="proceed">PROCEED</div>
                                      ) : post.order_status == 3 ? (
                                        <div className="proceed">SERVE</div>
                                      ) : post.order_status == 4 ? (
                                        <div className=" proceed">COMPLETE</div>
                                      ) : post.order_status == 5 ? (
                                        <div className=" completed">
                                          COMPLETED
                                        </div>
                                      ) : post.order_status == 6 ? (
                                        <div className=" completedR">
                                          COMPLETED
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className="vieworder">
                                      <button
                                        className="vieworderbutton"
                                        onClick={() => {
                                          setOrderOpen(true);
                                          handlePassinginfo(
                                            post.order_status,
                                            post.order_table,
                                            post.order_time,
                                            post.order_menu,
                                            post.order_item,
                                            post.order_total,
                                            post.order_servicecharge,
                                            post.order_taxcharge,
                                            post.user_name,
                                            post.user_phonenumber,
                                            post.order_instruction,
                                            post.reject_reason
                                          );
                                        }}
                                      >
                                        View Order
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          })}
                      </div>

                      <div
                        className={
                          innerview ? "trial" : "tenantcustomerrendercontainer"
                        }
                      >
                        <div className="customerrendercontainer">
                          {(rowsPerPage2 > 0
                            ? orderData[0].slice(
                                customerpage * rowsPerPage2,
                                customerpage * rowsPerPage2 + rowsPerPage2
                              )
                            : orderData[0]
                          ).map((post, i) => {
                            const orderDate = new Date(post.order_time);

                            return (
                              <div className={i != 7 ? "bordered" : "noborder"}>
                                <div className="tenantcustomerrendergrid">
                                  <div className="customertext">
                                    {i + customerindex}
                                  </div>
                                  <div className="customertext">
                                    {post.user_name}
                                  </div>
                                  <div className="customertext">
                                    {post.user_phonenumber}
                                  </div>
                                  <div className="customertext">
                                    {orderDate.toLocaleDateString(
                                      "en-ID",
                                      dateOptions
                                    )}{" "}
                                    | {moment(post.order_time).fromNow()}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className={profileedit ? "editprofilesettings" : "hide"}>
                  <Modal open={addcontract}>
                    <Box className="addcontractmodalbox">
                      <div className="addcontractinnerbox">
                        <div className="addcontractmodaltitle">
                          Add New Contract
                        </div>

                        <form>
                          <div className="addcontractinnermodalbox">
                            <div className="modallabeltext">Start Date</div>
                            <div className="modalinput">
                              <DatePicker
                                format="ddd, DD MMM YY"
                                value={startvalue}
                                arrow={false}
                                onChange={(value) =>
                                  setstartValue(new Date(value))
                                }
                              />
                            </div>

                            <div className="modallabeltext">
                              Contract Periode
                            </div>
                            <div className="modalinput">
                              <Select
                                defaultValue=""
                                disableUnderline
                                classes={{ root: outlineSelectClasses.select }}
                                MenuProps={outlinemenuProps}
                                IconComponent={outlineiconComponent}
                                onChange={(e) => {
                                  {
                                    setContractVal(e.target.value);
                                  }
                                }}
                              >
                                <MenuItem value="1">1 Years</MenuItem>
                                <MenuItem value="2">2 Years</MenuItem>
                                <MenuItem value="3">3 Years</MenuItem>
                                <MenuItem value="4">4 Years</MenuItem>
                                <MenuItem value="5">5 Years</MenuItem>
                                <MenuItem value="6">6 Years</MenuItem>
                                <MenuItem value="7">7 Years</MenuItem>
                                <MenuItem value="8">8 Years</MenuItem>
                                <MenuItem value="9">9 Years</MenuItem>
                                <MenuItem value="10">10 Years</MenuItem>
                                <MenuItem value="11">11 Years</MenuItem>
                                <MenuItem value="12">12 Years</MenuItem>
                              </Select>
                            </div>
                            <div className="modallabeltext">
                              Contract Attachment
                            </div>
                            <div className="modalinput">
                              <div className="attachbutton">
                                <label
                                  htmlFor="file-input2"
                                  className="inputlabel"
                                >
                                  <FontAwesomeIcon
                                    icon={faPaperclip}
                                    className="attachicon"
                                  />

                                  <input
                                    id="file-input2"
                                    type="file"
                                    name="contract"
                                    accept="application/pdf"
                                    className="contractfileinput"
                                    onChange={(e) => {
                                      setContractFile(e.target.files[0].name);
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </form>

                        <div className="addcontractmodalbutton">
                          <button
                            onClick={() => {
                              setAddContract(false);
                              setContractVal();
                              setstartValue();
                              setContractFile();
                            }}
                            className="cancelbutton"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            onClick={handleaddcontractsave}
                            className="savebutton"
                          >
                            Save Contract
                          </button>
                        </div>
                      </div>
                    </Box>
                  </Modal>

                  <div className="outerprofilecontainer">
                    <div className="profileeditcontainer">
                      <div className="outtercontainer">
                        <div className="innercontainer">
                          <div className="leftcolumncontainer">
                            <div className="row">
                              <div className="labelcolumn">
                                <div className="settingslabeltext">
                                  Restaurant Name
                                </div>
                                <div className="settingsinputcontainer">
                                  <input
                                    type="text"
                                    value={profileName}
                                    className="inputcontainer1"
                                    onChange={(e) =>
                                      setProfileName(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="labelcolumn">
                                <div className="absolutewhite"></div>
                                <div className="settingslabeltext2">
                                  Profile Color
                                </div>
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
                            <div className="row">
                              <div className="labelcolumn">
                                <div className="settingslabeltext">Email</div>
                                <div className="settingsinputcontainer">
                                  <input
                                    type="text"
                                    value={email}
                                    className="inputcontainer1"
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="labelcolumn">
                                <div className="settingslabeltext">
                                  Password
                                </div>
                                <div className="settingsinputcontainer">
                                  <div className="passwordsettings">
                                    <input
                                      type={editShow ? "text" : "password"}
                                      value={uniqueKey}
                                      className="editpassword"
                                      onChange={(e) =>
                                        setUniqueKey(e.target.value)
                                      }
                                    />
                                    <FontAwesomeIcon
                                      icon={editShow ? faEye : faEyeSlash}
                                      onClick={() => setEditShow(!editShow)}
                                      className={
                                        editShow
                                          ? "passwordshowicon"
                                          : "passwordicon"
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="labelcolumn">
                                <div className="settingslabeltext">
                                  Location
                                </div>
                                <div className="settingsinputcontainer">
                                  <input
                                    type="text"
                                    value={textLocation}
                                    className="inputcontainer1"
                                    onChange={(e) =>
                                      setTextLocation(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row2">
                              <div className="labelcolumn">
                                <div className="settingslabeltext">Address</div>
                                <div className="settingsinputcontainer">
                                  <textarea
                                    type="text"
                                    value={textAddress}
                                    className="textareainputcontainer"
                                    onChange={(e) =>
                                      setTextAddress(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="row3">
                              <div className="leftcontainer">
                                <div className="settingslabeltext">
                                  Opening Hour
                                </div>

                                <div className="profileopen">
                                  {tenantRetrieved == true &&
                                    tenantData[0].openingDays.map(
                                      (item, index) => {
                                        return (
                                          <div className="opentext">
                                            <div className="openleft">
                                              {item.day}
                                            </div>
                                            <div className="openright">
                                              {item.is24Hours ? (
                                                "Open 24 hours"
                                              ) : item.isClosed ? (
                                                "Closed"
                                              ) : (
                                                <>
                                                  {item.OpenHour}:
                                                  {item.OpenMins}&nbsp;
                                                  {item.OpenTF}&nbsp;-&nbsp;
                                                  {item.CloseHour}:
                                                  {item.CloseMins}&nbsp;
                                                  {item.CloseTF}
                                                </>
                                              )}
                                              <FontAwesomeIcon
                                                icon={faPencil}
                                                className="edithouricon"
                                                onClick={() => {
                                                  handleOpenHourEditOpen(
                                                    item.day,
                                                    item.is24Hours,
                                                    item.isClosed,
                                                    item.OpenHour,
                                                    item.OpenMins,
                                                    item.OpenTF,
                                                    item.CloseHour,
                                                    item.CloseMins,
                                                    item.CloseTF
                                                  );
                                                }}
                                              />
                                            </div>
                                          </div>
                                        );
                                      }
                                    )}
                                </div>
                              </div>
                              <div className="rightcontainer">
                                <div className="labelcolumn">
                                  <div className="settingslabeltext">
                                    Contact Person
                                  </div>
                                  <div className="settingsinputcontainer">
                                    <input
                                      type="text"
                                      value={textPhone}
                                      className="inputcontainer2"
                                      onChange={(e) =>
                                        setTextPhone(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>

                                <div className="contractcontainer">
                                  <div className="settingslabeltext">
                                    Contract with Oasis
                                  </div>
                                  <div
                                    className={
                                      contractRetrieved
                                        ? "hidden"
                                        : "addcontractcontainer"
                                    }
                                  >
                                    <button
                                      className="addcontractbutton"
                                      onClick={() => setAddContract(true)}
                                    >
                                      + Add New Contract
                                    </button>
                                  </div>

                                  {contractRetrieved &&
                                    contractData != null &&
                                    contractData != undefined && (
                                      <div
                                        className={
                                          contractRetrieved != undefined
                                            ? "contractdetailscontainer"
                                            : "hide"
                                        }
                                      >
                                        <div className="contractrow">
                                          <div className="contractduration">
                                            {contractData.contract_Period} Years
                                          </div>
                                          <div className="settingslabeltext3">
                                            Expired at :
                                          </div>
                                          <div className="settingslabeltext4">
                                            {moment(contractData.start_Date)
                                              .add(
                                                contractData.contract_Period,
                                                "years"
                                              )
                                              .format("ddd, MMMM Do YYYY")}
                                          </div>
                                        </div>

                                        <div className="contractfile">
                                          <FontAwesomeIcon
                                            icon={faPaperclip}
                                            className="contractfileicon"
                                          />

                                          <a
                                            href={contractData.contract_File}
                                            className="contractfilenames"
                                          >
                                            {tenantData[0].contract_Name}
                                          </a>
                                        </div>
                                        <div className="contractfilebutton">
                                          <button
                                            className="renewcontract"
                                            onClick={() => setAddContract(true)}
                                          >
                                            Renew Contract
                                          </button>
                                          <div className="settingslabeltext3">
                                            &nbsp;or&nbsp;
                                          </div>
                                          <button
                                            className="removecontract"
                                            onClick={() =>
                                              setRemoveContract(true)
                                            }
                                          >
                                            Remove Contract
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                              <div className="editprofilemodalbutton">
                                <button
                                  onClick={() => {
                                    setProfileEdit(false);
                                    setPofileimage(tenantData[0].profileimage);
                                    setProfileName(tenantData[0].name);
                                    setEmail(tenantData[0].email);
                                    setTextPhone(tenantData[0].phoneNumber);
                                    setUniqueKey(tenantData[0].uniqueKey);
                                    setColor(tenantData[0].profileColor);
                                    setTextAddress(tenantData[0].address);
                                    setTextLocation(tenantData[0].location);
                                    setTaxChargeValue(tenantData[0].taxCharge);
                                    setServiceChargeValue(
                                      tenantData[0].serviceCharge
                                    );
                                    setProfileImage(tenantData[0].profileImage);
                                    setEditShow(false);
                                  }}
                                  className="cancelbutton"
                                >
                                  Cancel
                                </button>

                                <button
                                  type="submit"
                                  onClick={HandleSaveProfile}
                                  className="savebutton"
                                >
                                  Save Profile
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="rightcolumncontainer">
                            <div className="settingslabeltext">
                              Profile Picture
                            </div>
                            <div className="editprofileimagecontainer">
                              <div className="customButton">
                                <img
                                  src={profileImage}
                                  className="editprofileimage1"
                                />

                                <div className="editprofileimagebuttoncontainer">
                                  <div className="imagebuttoncontainer">
                                    <div className="productimagebutton">
                                      <label htmlFor="file-input">
                                      <FontAwesomeIcon
                              icon={faPencil}
                              className="promoinput"
                            />
                                      </label>

                                      <input
                                        id="file-input"
                                        type="file"
                                        name="avatar"
                                        accept=".png, .jpg"
                                        className="productinputfile"
                                        onChange={imageHandler}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        
                      </div>
                    </div>
                  </div>
                </div>

                <div className={profileedit ? "hide2" : "tenantdetailfooter"}>
                {orderData.length >0 && 
                  <TablePagination
                    colSpan={3}
                    count={orderData[0].length}
                    rowsPerPage={rowsPerPage2}
                    page={innerview ? orderpage : customerpage}
                    onPageChange={
                      innerview
                        ? handleOrderChangePage
                        : handleCustomerChangePage
                    }
                    ActionsComponent={
                      innerview
                        ? TablePaginationActionsorder
                        : TablePaginationActionscustomer
                    }
                  />
                  }
                  
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
            {" "}
            <ThreeDots color="#e52c32" height={80} width={80} />
          </div>
        )}
      </div>
    </div>
  );
}

export default TenantDetailPage;

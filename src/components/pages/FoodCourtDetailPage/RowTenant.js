import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";

const RowTenant = ({ data, index, indexs, isRetrieved, foodcourtId, handleTenantData }) => {
  const [detail, setDetail] = useState([]);
  const [isDetailRetrieved, setIsDetailRetrieved] = useState(isRetrieved);
  const localUrl = process.env.REACT_APP_FOODCOURTURL;
  const [openModalDelete, setOpenModalDelete] = useState(false);

  useEffect(() => {
    const url = "https://backend.oasis-one.com/api/tenant/user/" + data;

    fetch(url, {
      method: "GET",
      headers: { "content-type": "application/JSON" },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "SUCCESS") {
          setDetail(result.data);
        } else {
          setIsDetailRetrieved(() => false);
        }
      });
  }, [data,isDetailRetrieved]);

  console.log("dettttt", detail);
  // Navigate
  const history = useHistory();
  function redirectTenantDetail(tenant_id) {
    history.push({
      pathname: "/tenantdetails",
      state: tenant_id,
    });
  }

  function handleRemoveTenant(tenant_id) {
    const url = localUrl + "/removetenant/" + foodcourtId;

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
          setOpenModalDelete(false)
          handleTenantDataRow()
          // setIsDetailRetrieved(false);
        }
      });
  }

  function handleTenantDataRow(){
    handleTenantData()
  }

  return (
    <div>
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
            <div onClick={()=>handleRemoveTenant(detail.tenant_id)} className="submitbtn">
              Delete
            </div>
          </div>
        </Box>
      </Modal>
      <div className="foodcourtdetailrendergrid">
        <div className="foodcourtdetailtext">{index + indexs}</div>
        <div className="foodcourtdetailprofilecontainer">
          <img className="foodcourtdetailprofile" src={detail.profileImage} />
          {detail.name}
        </div>
        <div className="foodcourtdetailaddresscontainer">
          <div className="clusteraddress">{detail.location}</div>

          <div className="address">{detail.address}address</div>
        </div>
        <div className="status">
          {detail.openingDays !== undefined && detail.isOperational ? <div className="openstatus">Open</div> : <div className="closedstatus">Closed</div>}
          {/* detail.openingDays.map((posts, index) => {
              var numberdayweek = [7, 1, 2, 3, 4, 5, 6];
              const today = new Date();

              if (numberdayweek[today.getDay()] === index + 1) {
                if (posts.isClosed) {
                  return <div className="closedstatus">Closed</div>;
                } else if (!posts.isClosed) {
                  return <div className="openstatus">Open</div>;
                }
              }
            })} */}
        </div>

        <div
          className="viewdetails"
          onClick={() => {
            redirectTenantDetail(detail.tenant_id);
          }}
        >
          <button className="viewbutton">View Details</button>
        </div>
        <div className="deletefoodcourtdetail" onClick={() => setOpenModalDelete(true)}>
          <button className="deletefoodcourtdetailbutton">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default RowTenant;

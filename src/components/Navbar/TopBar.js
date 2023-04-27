import React, { useState } from "react";
import { useHistory, NavLink } from "react-router-dom";
import "./TopBar.css";

//auth & redux
import { connect } from "react-redux";
import { logoutUser } from "../Auth/actions/managementActions";

function TopBar({ logoutUser }) {
  let history = useHistory();
  const [isActive, setisActive] = useState(false);

  return (
    <>
      <nav className="topbar">
        <div className="topbarcontainer">
          <div>
            <button className="topbarheader" onClick={() => history.push(`/tenant`)}>
              Oasis One
            </button>
          </div>
          <ul className="menu">
            <li className="menuitem">
              <NavLink
                to="/tenant"
                className={isActive ? "is-active" : "menulinks"}
                isActive={(match, location) => {
                  if (!match) {
                    setisActive(false);
                  }
                  if (location.pathname === `/tenantdetails` || location.pathname === "/tenant") {
                    setisActive(true);
                  }
                  return false;
                }}
              >
                Tenant
              </NavLink>
            </li>
            <li className="menuitem">
              <NavLink to="/foodcourt" activeClassName="is-active" className="menulinks">
                Food Court
              </NavLink>
            </li>
            <li className="menuitem">
              <NavLink to="/customer" activeClassName="is-active" className="menulinks">
                Customer
              </NavLink>
            </li>
          </ul>
          <div className="logout">
            <NavLink to="/#" className="menulinks" onClick={() => logoutUser(history)}>
              Logout
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}

export default connect(null, { logoutUser })(TopBar);

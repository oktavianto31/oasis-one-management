// import React, { useEffect, useState } from "react";

// const RowTenantSearch = ({ isRetrieved, tenantData, search, index }) => {
//   const [detail, setDetail] = useState([]);

//   useEffect(() => {
//     const url = "https://backend.oasis-one.com/api/tenant/user/" + data;

//     fetch(url, {
//       method: "GET",
//       headers: { "content-type": "application/JSON" },
//     })
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("dataaaaa", result);
//         if (result.status === "SUCCESS") {
//           setDetail(result.data);
//         }
//       });
//   }, []);

//   return (
//     <div className="foodcourtdetailrendercontainer">
//       {isRetrieved == true &&
//         tenantData
//           .filter((post) => {
//             console.log("search", post);
//             if (post.tenant_name.toLowerCase().includes(search.toLowerCase())) {
//               return post;
//             }
//           })
//           .map((post, indexs) => {
//             return (
//               <div className="foodcourtdetailrendergrid">
//                 <div className="foodcourtdetailtext">{indexs + index}</div>
//                 <div className="foodcourtdetailprofilecontainer">
//                   <img className="foodcourtdetailprofile" src={post.foodcourt_logo} />
//                   {post.foodcourt_name}
//                 </div>
//                 <div className="foodcourtdetailaddresscontainer">
//                   <div className="clusteraddress">{post.foodcourt_location}</div>

//                   <div className="address">{post.foodcourt_address}</div>
//                 </div>
//                 {/* <div className="viewdetails" onClick={() => redirectFoodCourtList(post.foodcourt_id)}>
//                             <button className="viewbutton">View Details</button>
//                           </div> */}
//                 <div className="deletefoodcourtdetail" onClick={() => handleRemoveTenant(post.foodcourt_id)}>
//                   <button className="deletefoodcourtdetailbutton">Delete</button>
//                 </div>
//               </div>
//             );
//           })}
//     </div>
//   );
// };

// export default RowTenantSearch;

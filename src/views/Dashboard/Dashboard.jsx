import React, {useContext} from "react";
import {AuthContext} from "../../contexts/AuthContext";
import UserDashboard from "./UserDashboard"
import AdminDashboard from "./AdminDashboard"


// Server driven UI
// info about current user - drives Client's data representation
function Dashboard(props) {
  const {isAdmin} = useContext(AuthContext)

  return (
      <>
          {isAdmin ?
              <AdminDashboard props />
          :
              <UserDashboard props />
          }

      </>

  );
}

export default Dashboard;


import React, {useContext} from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
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



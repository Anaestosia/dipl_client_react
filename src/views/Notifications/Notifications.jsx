/* eslint-disable */
import React, {useState, useEffect} from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import CheckBox from "@material-ui/icons/CheckBox";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import AchievementService from "../../API/AchievementService";
import Accessibility from "@material-ui/icons/Accessibility";
import Info from "@material-ui/icons/Info";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const Notifications = (props) => {
  const { classes } = props;
  const [ach, setAch] = useState([])
  const [isLoad, setIsLoad] = useState(true)

  useEffect(()=>{
      const fetchAch = async ()=>{
        try{
          const response = await AchievementService.getAll()
          setAch(response.data.data.data)
          console.log(response.data.data.data)
          setIsLoad(false)
        }
        catch(e){
          console.log(e)
          setIsLoad(false)
        }
      }

      fetchAch()
  }
      ,[])

  return(
      <Card>
        <CardHeader color="primary">
          <h4 className={classes.cardTitleWhite}>Достижения</h4>
          <p className={classes.cardCategoryWhite}>
            Виды достижений и количество баллов к начислению работнику за каждое достижение
          </p>
        </CardHeader>
        <CardBody>
          <GridContainer>
            {
              isLoad ?
                  "Загрузка..."
                  :
              ach.map((a)=>
              <>
              <GridItem xs={12} sm={12} md={4}>
              <Card >
              <CardHeader color="info" stats icon style={{color: "black"}}>
              <CardIcon color="primary" style={{color: "white"}}>
              <CheckBox />
              </CardIcon>
              <p className={classes.cardCategory}>{a.attributes.name}</p>
              Баллы: <h2 className={classes.cardTitle}>{a.attributes.points}</h2>
              </CardHeader>
              <CardFooter stats>
              <div className={classes.stats}>
              <Info />
            {a.attributes.description}
              </div>
              </CardFooter>
              </Card>
              </GridItem>
              </>
              )
            }
          </GridContainer>

        </CardBody>
      </Card>
  );

}

export default withStyles(styles)(Notifications);

import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import IconButton from "@material-ui/core/IconButton";
import Done from "@material-ui/icons/Done";
import Error from "@material-ui/icons/Error";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Group from "@material-ui/icons/Group";
import ShowChart from "@material-ui/icons/ShowChart";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
// import "../../assets/css/common.css"


import UserService from "../../API/UserService";
import AuthService from "../../API/AuthService";
import {AuthContext} from "../../contexts/AuthContext";
import { useQuery,useMutation, gql } from '@apollo/client';

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const UserProfile = (props) => {
  const {currentUserId} = useContext(AuthContext)
  const [user, setUser] = useState(null)
  const { classes, name, email } = props;
  const [bc, setBc] = useState(false)
  const [bcError, setBcError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const GET_USER_DATA = gql`
      query($id: ID!) {
      user(id: $id){
        email
        workersCount
        departament{
          name
          description
        }
        role{
          name
        }
        workerImage{
          imageUrl
        }
      }
    }
  `;
  const CHANGE_USER_IMAGE = gql`
      mutation($imageUrl: String!, $userId: Int!) {
        changeOrCreateUserImage(imageUrl: $imageUrl, userId: $userId){
          workerImage{
            imageUrl 
          }
        }
      }
  `;
  const CHANGE_USER_CREDS = gql`
      mutation($userId: Int!, $email: String!, $currentPassword: String!, $password: String!) {
        changeUserCreds(userId: $userId, email: $email, currentPassword: $currentPassword, password: $password){
          errors
          user{
            email 
          }
        }
      }
  `;

  const { loading, error, data } = useQuery(GET_USER_DATA,{variables: {id: currentUserId}});
  const [changeImage, { dataImage, loadingImage, errorImage }] = useMutation(CHANGE_USER_IMAGE);
  const [changeCreds, {dataCreds, loadingCreds, errorCreds}] = useMutation(CHANGE_USER_CREDS)

  const upload = (e) => {
    const dataRaw = new FormData()
    dataRaw.append("file", e.target.files[0])
    dataRaw.append("upload_preset", "zzpmbswm")
    dataRaw.append("cloud_name","drntpsmxs")
    fetch("https://api.cloudinary.com/v1_1/drntpsmxs/image/upload",{
      method:"post",
      body: dataRaw
    })
        .then(resp => resp.json())
        .then(imageData => {
          changeImage({variables: {imageUrl: imageData.url, userId: parseInt(currentUserId)}})
          if(errorImage)
          {console.log("Error while changing image: ", errorImage)}
          else{
            setUser(prevUser => ({...prevUser, workerImage: {...prevUser.workerImage, imageUrl: imageData.url}}))
            showNotification("bc")
          }
        })
        .catch(err => console.log(err))
  }

  const updateProfile = async (e) => {
      e.preventDefault();

      const fields = ["email", "old_password", "password"];
      const formElements = e.target.elements;
      const formValues = fields
          .map(field => ({
              [field]: formElements.namedItem(field).value
          }))
          .reduce((current, next) => ({...current, ...next}));

      try {
      const dataCred = await changeCreds({
          variables: {
              userId: parseInt(currentUserId),
              email: formValues.email,
              currentPassword: formValues.old_password,
              password: formValues.password
          }
      })
          setUser(prevUser => ({...prevUser, email: formValues.email}))
          showNotification("bc")
      }
      catch (e){
          showNotification("bcError")
          setErrorMessage(e.message)
      }

  }


  useEffect(()=>{
    if(data !== undefined){
        console.log(data.user)
      setUser(data.user)
    }
  },
  [data])

  const showNotification =(place) => {
      if(place === "bcError")
      {
      setBcError(true)
      setTimeout(
          function () {
              setBcError(false)
          }.bind(this),
          4000
      );
      }
          else
      {
          setBc(true)
          setTimeout(
              function () {
                  setBc(false)
              }.bind(this),
              4000
          );
      }
  }

  if (loading || loading===undefined) return `Загрузка...`;
  if (error ) return `Error! ${error}`;
  return (
      <>
        {
          user === null
            ?
            null
            :
            <div>
              <GridContainer>
                <GridItem xs={12} sm={12} md={8}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                            <form onSubmit={updateProfile}>
                            <Card>
                                <CardHeader color="primary">
                                    <h4 className="cardTitleWhite">Редактировать профиль</h4>
                                    <p className="cardCategoryWhite">
                                        Введите новые данные профиля
                                    </p>
                                </CardHeader>
                                <CardBody>
                                    <GridContainer>
                                        <GridItem xs={12} sm={12} md={3}>
                                            <CustomInput
                                                labelText="Email"
                                                id="email"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    required: true,
                                                    defaultValue: name,
                                                    name: "email"
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <CustomInput
                                                labelText="Старый пароль"
                                                id="old_password"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    required: true,
                                                    defaultValue: name,
                                                    name: "old_password"
                                                }}
                                            />
                                        </GridItem>
                                        <GridItem xs={12} sm={12} md={4}>
                                            <CustomInput
                                                labelText="Пароль"
                                                id="password"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    required: true,
                                                    defaultValue: email,
                                                    name: "password"
                                                }}
                                            />
                                        </GridItem>
                                    </GridContainer>
                                </CardBody>
                                <CardFooter>
                                    <Button type="submit" color="primary">
                                        Обновить данные
                                        <input
                                            type="file"
                                            hidden
                                        />
                                    </Button>
                                    {/*<Button*/}
                                    {/*    fullWidth*/}
                                    {/*    color="primary"*/}
                                    {/*    onClick={() => showNotification("bc")}*/}
                                    {/*>*/}
                                    {/*  Top Center*/}
                                    {/*</Button>*/}
                                </CardFooter>
                            </Card>
                        </form>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={8}>
                            <Card>
                            <CardHeader color="primary" stats icon style={{color: "black"}}>
                                <CardIcon color="primary" style={{color: "white"}}>
                                    <Group />
                                </CardIcon>
                                <p className={classes.cardCategory}>Работники "{user.departament.name}"</p>
                                <h3 className={classes.cardTitle}>{user.workersCount}</h3>
                            </CardHeader>
                            <CardFooter stats>
                                <div className={classes.stats}>
                                    <ShowChart />
                                    Количество подчиненных работников
                                </div>
                            </CardFooter>
                        </Card>
                        </GridItem>

                    </GridContainer>
                </GridItem>


                <GridItem xs={12} sm={12} md={4}>
                  <Card profile>
                    <CardAvatar profile>
                      <a href="#pablo" onClick={e => e.preventDefault()}>
                        <img src={ user.workerImage.imageUrl} alt="..."  />
                      </a>
                    </CardAvatar>
                    <div>
                      <IconButton size="large" color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="image/*" type="file" name="images" onChange={upload}  />
                        <PhotoCamera  size="lg" />
                      </IconButton>
                    </div>
                    <CardBody profile>
                      <h7 className={classes.cardCategory}>{user.role.name}: {user.email}</h7>
                      <h4 className={classes.cardTitle}>{user.departament.name}</h4>
                      <p className={classes.description}>
                        {user.departament.description}
                      </p>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
              <Snackbar
                  place="bc"
                  color="success"
                  message="Готово"
                  open={bc}
                  icon={Done}
                  closeNotification={() => setBc(false)}
                  close
              />
              <Snackbar
                  place="bc"
                  color="danger"
                  message={errorMessage}
                  open={bcError}
                  icon={Error}
                  closeNotification={() => setBcError(false)}
                  close
              />
            </div>

        }

      </>
  )
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  email: PropTypes.string
};

export default withStyles(styles)(UserProfile);

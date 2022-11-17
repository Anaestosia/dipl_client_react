import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
// import "../../assets/css/common.css"

import UserService from "../../API/UserService";
import AuthService from "../../API/AuthService";
import {AuthContext} from "../../contexts/AuthContext";
import { useQuery, gql } from '@apollo/client';

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

  const updateProfile = (e) => {
    e.preventDefault();

    const fields = ["email", "password"];
    const formElements = e.target.elements;
    const formValues = fields
        .map(field => ({
          [field]: formElements.namedItem(field).value
        }))
        .reduce((current, next) => ({ ...current, ...next }));

    console.log(formValues)
  }

  const GET_USER_DATA = gql`
      query($id: ID!) {
      user(id: $id){
        email
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

  const upload = (e) => {
    const data = new FormData()
    data.append("file", e.target.files[0])
    data.append("upload_preset", "zzpmbswm")
    data.append("cloud_name","drntpsmxs")
    fetch("https://api.cloudinary.com/v1_1/drntpsmxs/image/upload",{
      method:"post",
      body: data
    })
        .then(resp => resp.json())
        .then(data => {
          // this.setState({image_url: data.url})
        })
        .catch(err => console.log(err))
  }

  const { loading, error, data } = useQuery(GET_USER_DATA,{variables: {id: currentUserId}});

  useEffect(()=>{
        const fetchUser = async () => {
          try {
            const response = await UserService.getUser(currentUserId);
            //console.log(response)
            setUser(response.data.data.data)
            // this.setState({"email": response.data.data.data.attributes.email})
            // this.setState({"role_name": response.data.data.data.relationships.role.meta.role_name})
            // this.setState({"departament_name": response.data.data.data.relationships.departament.meta.departament_name})
            // this.setState({"departament_desc": response.data.data.data.relationships.departament.meta.departament_desc})
            // this.setState({"image_url": response.data.data.data.relationships.worker_image.meta.image_url})
          } catch (e) {
            console.log(e)
          }
        }
        fetchUser()
        console.log(error)
      },
      [])

  if (loading) return null;
  if (error) return `Error! ${error}`;
  return (
      <>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
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
                  </CardFooter>
                </Card>
              </form>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <Card profile>
                <CardAvatar profile>
                  <a href="#pablo" onClick={e => e.preventDefault()}>
                    <img src={data.user.workerImage.imageUrl} alt="..."  />
                  </a>
                </CardAvatar>
                <div>
                  <IconButton size="large" color="primary" aria-label="upload picture" component="label">
                    <input hidden accept="image/*" type="file" name="images" onChange={upload}  />
                    <PhotoCamera  size="lg" />
                  </IconButton>
                </div>
                <CardBody profile>
                  <h7 className={classes.cardCategory}>{data.user.role.name}: {data.user.email}</h7>
                  <h4 className={classes.cardTitle}>{data.user.departament.name}</h4>
                  <p className={classes.description}>
                    {data.user.departament.description}
                  </p>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </>
  )

}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  email: PropTypes.string
};

export default withStyles(styles)(UserProfile);

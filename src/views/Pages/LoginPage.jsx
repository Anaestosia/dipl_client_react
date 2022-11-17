import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

// @material-ui/icons
import Email from "@material-ui/icons/Email";
import Check from "@material-ui/icons/Check";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import loginPageStyle from "assets/jss/material-dashboard-react/views/loginPageStyle.jsx";
import {AuthContext} from "../../contexts/AuthContext";
import AuthService from "../../API/AuthService";

const { REACT_APP_SERVER_URL } = process.env;

class LoginPage extends React.Component {

  static contextType = AuthContext

  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      errors: {},
      isLoginFailed: false,
      formStyleClasses: ""
    };
  }
  login = async e => {
    e.preventDefault();

    const { history } = this.props;
    const {setCurrentUserId, setIsAuth} = this.context
    const fields = ["username", "password"];
    const formElements = e.target.elements;

    const formValues = fields
      .map(field => ({
        [field]: formElements.namedItem(field).value
      }))
      .reduce((current, next) => ({ ...current, ...next }));

    const authFetchUser = async () => {
      try {
        const response = await AuthService.athenticate(formValues.username, formValues.password);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem('user_id',response.data.user_id)
        setCurrentUserId(response.data.user_id)
        localStorage.setItem('auth', 'true')
        setIsAuth(true)
      } catch (e) {
        this.setState({isLoginFailed: true})
      }
    }
    authFetchUser()
  };

  handleToggle = value => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isLoginFailed !== this.state.isLoginFailed && this.state.isLoginFailed) {
      this.setState({formStyleClasses: "shaking-class"})
      setTimeout(() => {this.setState({formStyleClasses: ""})}, 800);
      this.setState({isLoginFailed: false})
    }
  }

  render() {
    const { classes } = this.props;
    const { errors } = this.state;
    return (
      <div className={classes.container}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={8}>
            <h4 className={classes.textCenter} style={{ marginTop: 0 }}>
              Авторизуйтесь для работы в программном средстве распределения премиального
              фонда Вашего IT-предприятия
            </h4>
          </GridItem>
        </GridContainer>
        <GridContainer justify="center">
          <GridItem xs={12} sm={6} md={4}>
            <form onSubmit={this.login}>
              <Card className={classes[this.state.cardAnimaton]}>
                <CardHeader
                  className={`${classes.cardHeader} ${classes.textCenter}`}
                  color="primary"
                >
                  <h4 className={classes.cardTitle}>Вход</h4>
                  <div className={classes.socialLine}>
                    {[
                      "fa fa-facebook-square",
                      "fa fa-twitter",
                      "fa fa-google-plus"
                    ].map((prop, key) => {
                      return (
                        <Button
                          color="transparent"
                          justIcon
                          key={key}
                          className={classes.customButtonClass}
                        >
                          <i className={prop} />
                        </Button>
                      );
                    })}
                  </div>
                </CardHeader>
                <CardBody>
                  <p
                    className={`${classes.textCenter} ${classes.checkboxLabel}`}
                  >
                    Или свяжитесь с <strong>admin1@gmail.com</strong> для получения аккаунта
                  </p>
                  <CustomInput
                    labelText="Email..."
                    id="email"
                    error={errors.username || errors.invalidEmailOrPassword}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    inputProps={{
                      required: true,
                      name: "username",
                      endAdornment: (
                        <InputAdornment position="end">
                          <Email className={classes.inputAdornmentIcon} />
                        </InputAdornment>
                      )
                    }}
                  />
                  <CustomInput
                    labelText="Password"
                    id="password"
                    error={errors.password || errors.invalidEmailOrPassword}
                    formControlProps={{
                      fullWidth: true,
                      className: classes.formControlClassName
                    }}
                    inputProps={{
                      type: "password",
                      required: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputAdornmentIcon}>
                            lock_outline
                          </Icon>
                        </InputAdornment>
                      )
                    }}
                  />
                  <FormControlLabel
                    classes={{
                      root:
                        classes.checkboxLabelControl +
                        " " +
                        classes.checkboxLabelControlClassName,
                      label: classes.checkboxLabel
                    }}
                    control={
                      <Checkbox
                        tabIndex={-1}
                        onClick={() => this.handleToggle(1)}
                        checkedIcon={<Check className={classes.checkedIcon} />}
                        icon={<Check className={classes.uncheckedIcon} />}
                        classes={{
                          checked: classes.checked,
                          root: classes.checkRoot
                        }}
                      />
                    }
                    label={<span>Запомнить меня</span>}
                  />
                </CardBody>
                <CardFooter className={classes.justifyContentCenter}>
                  <Button className={this.state.formStyleClasses} type="submit" color="primary" simple size="lg" block >
                    Войти
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  errors: PropTypes.object
};

export default withStyles(loginPageStyle)(LoginPage);

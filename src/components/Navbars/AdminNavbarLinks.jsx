import React from "react";
import classNames from "classnames";
import { NavLink } from "react-router-dom";
import axios from "axios";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
// core components
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-dashboard-react/components/headerLinksStyle.jsx";
import {AuthContext} from "../../contexts/AuthContext";

const { REACT_APP_SERVER_URL } = process.env;

class HeaderLinks extends React.Component {
  static contextType = AuthContext

  state = {
    open: false,
    profilePopupOpen: false,
  };
  handleToggle = () => {
    this.setState(state => ({ open: !state.open, profilePopupOpen: false }));
  };

  handleToggleProfile = () => {
    this.setState(state => ({ profilePopupOpen: !state.profilePopupOpen, open: false }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false, profilePopupOpen: false });
  };




  logout = async () => {
    const {logOut} =this.context;
    logOut()
  }

  render() {
    const { classes } = this.props;
    const { open, profilePopupOpen } = this.state;
    const {isAdmin} = this.context;

    return (
      <div>

        <div className={classes.manager}>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            color={window.innerWidth > 959 ? "transparent" : "white"}
            justIcon={window.innerWidth > 959}
            simple={!(window.innerWidth > 959)}
            aria-label="Person"
            aria-owns={open ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this.handleToggle}
            className={classes.buttonLink}
          >
            <Person className={classes.icons} />
            <Hidden mdUp implementation="css">
              <p className={classes.linkText}>Profile</p>
            </Hidden>
          </Button>
          <Poppers
            open={open}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            className={
              classNames({ [classes.popperClose]: !open }) +
              " " +
              classes.pooperNav
            }
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList role="menu" >

                      {
                        isAdmin ?
                            null
                            :
                            <NavLink to="/admin/user">
                              <MenuItem
                                  onClick={this.handleClose}
                                  className={classes.dropdownItem}
                              >Профиль
                              </MenuItem>
                            </NavLink>
                      }


                      {
                        !isAdmin ?
                            null
                            :
                            <MenuItem
                                style={{fontSize: "12px", color: "white", marginLeft: "8px"}}
                            >
                              <a href="http://localhost:3000/admin/" target="_blank"
                              >
                                Администрирование
                              </a>

                            </MenuItem>
                      }
                      {
                        !isAdmin ?
                            null
                            :
                      <MenuItem
                          style={{fontSize: "12px", color: "white", marginLeft: "8px"}}
                      >
                        <a href="http://localhost:3000/graphiql/" target="_blank"
                        >
                          GraphQL UI
                        </a>

                      </MenuItem>
                      }
                      <MenuItem
                          onClick={this.logout}
                        className={classes.dropdownItem}
                      >
                        Выйти
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Poppers>
        </div>

      </div>
    );
  }
}

export default withStyles(headerLinksStyle)(HeaderLinks);

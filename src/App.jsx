import AuthLayout from "./layouts/Auth";
import React, {useState,useEffect} from "react";
import {AuthContext} from "contexts/AuthContext";
import { Route, Switch, Redirect } from "react-router-dom";
import Admin from "./layouts/Admin";
import Auth from "./layouts/Auth";
import RTL from "./layouts/RTL";
import "./assets/css/login.css"
import "./assets/css/common.css"

const App = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);


    useEffect( ()=> {
            setIsAuth(false)
            if(localStorage.getItem('auth'))
            {
                setIsAuth(true)
                setCurrentUserId(localStorage.getItem('user_id'))
            }
        }
        ,[])

    const logOut = ()=>{
        const logOutUser = async () => {
            try {
                localStorage.removeItem('token')
                localStorage.removeItem('auth')
                setIsAuth(false)
            } catch (e) {
                console.log(e)
            }
        }
        logOutUser()
    }




    return (
        <Switch>
            <AuthContext.Provider value={{
                isAuth,
                setIsAuth,
                currentUserId,
                setCurrentUserId,
                logOut
            }}>
                <>
                    {
                        isAuth ?
                            <>
                                <Route path="/admin" component={Admin} />
                                <Route path="/rtl" component={RTL} />
                                <Redirect from="/" to="/admin/user" />
                            </>
                            :
                            <>
                                <Route path="/auth" component={Auth} />
                                <Redirect to="/auth/login-page" component={Auth} />
                            </>
                    }
                </>
            </AuthContext.Provider>
        </Switch>
    );
};

export default App;

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useTokenStore, useUserIdStore } from "../store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SimpleAppBar = () => {
    const [errorFlag, setErrorFlag] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const userToken = useTokenStore(state => state.userToken);
    const setUserToken = useTokenStore(state => state.setUserToken);
    const setUserId = useUserIdStore(state => state.setUserId)
    const navigate = useNavigate();

    const logoutUser = () => {
        setUserToken("");
        setUserId(0);
        const config = {
            headers: {
                "X-Authorization": userToken,
            }
        };
        const data = {};
        axios.post('http://localhost:4941/api/v1/users/logout',data, config)
            .then((response) => {
                setErrorFlag(false);
                setErrorMessage("");
                navigate('/auctions')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString() +
                    ": can't log out")
            })
    }


    const LoginOrSignupButton = () => {

        if (userToken !== "") {
            return (
                <div>
                    <Button color="inherit"
                            href="http://localhost:8080/auctions/create">
                        Create New Auction
                    </Button>
                    <Button color="inherit"
                            href="http://localhost:8080/auctions/my">
                        MY Auctions
                    </Button>
                    <Button color="inherit" onClick={logoutUser}>LogOut</Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button color="inherit"
                            href="http://localhost:8080/signin/">
                        Login</Button>
                    <Button color="inherit"
                            href="http://localhost:8080/signup/">
                        SignUp
                    </Button>
                </div>
            )
        }
    }

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar>
                    <Button color="inherit"
                            href="http://localhost:8080/auctions/">
                        Auctions
                    </Button>

                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                      COSC365 mzh103
                    </Typography>
                    {LoginOrSignupButton()}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default SimpleAppBar;
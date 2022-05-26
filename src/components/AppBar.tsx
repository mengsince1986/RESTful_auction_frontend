import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useStore } from '../store';

const SimpleAppBar = () => {

    const loginState = useStore(state => state.login)

    const loginOrSignupButton = () => {
        if (loginState) {
            return (
                <Button color="inherit">LogOut</Button>
            )
        } else {
            return (
                <div>
                    <Button color="inherit">Login</Button>
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
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Button color="inherit"
                            href="http://localhost:8080/auctions/">
                        Auctions
                    </Button>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                      COSC365 mzh103
                    </Typography>
                    {loginOrSignupButton()}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default SimpleAppBar;
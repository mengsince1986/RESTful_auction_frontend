import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTokenStore } from "../store";
import SimpleAppBar from "./AppBar";
import {Alert, Snackbar} from "@mui/material";

const theme = createTheme();

const SignIn = () =>  {
    const navigate = useNavigate();
    const setUserToken = useTokenStore(state => state.setUserToken);
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState("")

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        axios.post('http://localhost:4941/api/v1/users/login', {
            email: data.get('email'),
            password: data.get('password'),
        })
            .then(function (response) {
                console.log(response);
                setUserToken(response.data["token"]);
                navigate('/auctions');
            })
            .catch(function (error) {
                setError(error.response.statusText);
                setOpen(true);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            {SimpleAppBar()}
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" color="primary.main">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                {error}
                            </Alert>
                        </Snackbar>
                        <Grid container>
                            <Grid item>
                                <Link href="http://localhost:8080/signup"
                                      variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default SignIn;
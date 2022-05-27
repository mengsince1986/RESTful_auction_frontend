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
import {Alert, Snackbar} from "@mui/material";
import { useTokenStore } from "../store";
import SimpleAppBar from "./AppBar";

const theme = createTheme();

const SignUp = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState("")
    const setUserToken = useTokenStore(state => state.setUserToken);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const isValidPassword = (password: FormDataEntryValue | null) => {
        return (password !== null) && (String(password).length >= 6)
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (isValidPassword(data.get('password'))) {
            axios.post('http://localhost:4941/api/v1/users/register', {
                firstName: data.get('firstName'),
                lastName: data.get('lastName'),
                email: data.get('email'),
                password: data.get('password'),
            })
                .then(function (response) {
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
                            console.log(error);
                        });
                })
                .catch(function (error) {
                    setError(error.response.statusText);
                    handleClick();
                });
        } else {
            setError("Error: Password must be at least 6 characters");
            //setOpen(true);
            handleClick();
        }

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
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" color="secondary.main">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                {error}
                            </Alert>
                        </Snackbar>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="http://localhost:8080/signin"
                                      variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default SignUp;
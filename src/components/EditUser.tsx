import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {Alert, Checkbox, FormControlLabel, Input, Snackbar} from "@mui/material";
import { useTokenStore, useUserIdStore } from "../store";
import SimpleAppBar from "./AppBar";

const theme = createTheme();

const EditUser = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const userId = useUserIdStore(state => state.userId);
    const userToken = useTokenStore(state => state.userToken);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [checked, setChecked] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleFileSelect = (event:any) => {
        setSelectedFile(event.target.files[0])
    }


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const config = {
            headers: {
                "X-Authorization": userToken,
            }
        };

        const updateUrl = 'http://localhost:4941/api/v1/users/' + userId
        const profileData = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            currentPassword: data.get('currentPassword'),
            password: data.get('password'),
        }

        if (data.get('firstName') === '') {
            // @ts-ignore
            delete profileData.firstName;
        }

        if (data.get('lastName') === '') {
            // @ts-ignore
            delete profileData.lastName;
        }

        if (data.get('email') === '') {
            // @ts-ignore
            delete profileData.email;
        }

        if (data.get('currentPassword') === '') {
            // @ts-ignore
            delete profileData.currentPassword;
        }

        if (data.get('password') === '') {
            // @ts-ignore
            delete profileData.password;
        }

        const isEmptyData = () => {
            setErrorFlag(true)
            setErrorMessage("The form is empty")
            return Object.keys(profileData).length === 0
        }

        const isValidPassword = () => {
            if (data.get('password') !== "" && data.get('currentPassword') === "") {
                setErrorFlag(true)
                setErrorMessage("Need provide current password")
                return false
            }
            if (data.get('password') === "" && data.get('currentPassword') !== "") {
                setErrorFlag(true)
                setErrorMessage("Need provide new password")
                return false
            }
            if (data.get('password') !== null) {
                if (String(data.get('password')).length < 6) {
                    setErrorFlag(true)
                    setErrorMessage("New password must be 6 characters")
                    return false
                }
            }
            return true;
        };

        const isValidEmail = () => {
            if (String(data.get("email")) === "") {
                return true
            }
            if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(String(data.get("email"))))
            {
                return true
            }
            setErrorFlag(true)
            setErrorMessage("The email is invalid")
            return false
        }

        if (!isEmptyData() && isValidEmail() && isValidPassword()) {
            axios.patch(updateUrl, profileData, config)
                .then((response) => {
                    console.log(response)
                    setErrorFlag(false)
                    setErrorMessage("")
                    navigate('/update_profile_message')
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                    handleClick()
                })
                .catch(function (error) {
                    setErrorMessage(error.response.statusText);
                    handleClick();
                });
        } else {
            setOpen(true);
            handleClick();
        }

        if (checked) {
            const config = {
                headers: {
                    "X-Authorization": userToken,
                }
            };
            const url = 'http://localhost:4941/api/v1/users/' + userId + '/image'
            axios.delete(url, config)
                .then(function (response) {
                    navigate('/update_profile_message')
                })
                .catch(function (error) {
                    console.log(error);
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                });
        }

        if (selectedFile !== null) {
            const imgConfig = {
                headers: {
                    "Content-Type": "image/jpeg",
                    "X-Authorization": userToken,
                }
            };
            const uploadUrl = 'http://localhost:4941/api/v1/users/' + userId + '/image';
            const formData = new FormData();
            formData.append("selectedFile", selectedFile);
            axios.post(uploadUrl, formData, imgConfig)
                .then(function (response) {
                    console.log(response);
                    navigate('/update_profile_message')
                })
                .catch(function (error) {
                    console.log(error);
                    setErrorFlag(true)
                    setErrorMessage(error.response.statusText)
                });
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
                        Edit Profile
                    </Typography>
                    <Box component="form" noValidate  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="currentPassword"
                                    label="Current Password"
                                    type="password"
                                    id="currentPassword"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="password"
                                    label="New Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={checked}
                                                  onChange={handleChange}
                                                  inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    }
                                    label="Delete Image"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label htmlFor="userImage">
                                    <Input id="userImage" name="userImage"
                                           type="file" onChange={handleFileSelect}/>
                                </label>
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Modify
                        </Button>
                        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                {errorMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default EditUser;
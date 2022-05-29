import React from "react";
import axios from "axios";
import {
    Alert, AlertTitle, Avatar, Box,  Card,
    Paper, Typography
} from "@mui/material";
import CSS from 'csstype';
import SimpleAppBar from "./AppBar";
import { useTokenStore, useUserIdStore } from "../store";


const Profile = () => {
    const userId = useUserIdStore(state => state.userId);
    const userToken = useTokenStore(state => state.userToken);
    const [user, setUser] = React.useState<User>({firstName: "",
        lastName: "", email: ""})
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {

        const getUser = () => {
            const config = {
                headers: {
                    "X-Authorization": userToken,
                }
            };
            const userUrl = 'http://localhost:4941/api/v1/users/'+ userId
            axios.get(userUrl, config)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setUser(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString() +
                        ": can't get user")
                })
        }

        getUser()
    }, [])

    const getUserImageUrl = (userId:number) => {
        if (userId > 0) {
            return 'http://localhost:4941/api/v1/users/' + userId + '/image'
        }
    }

    const userCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "auto",
        minHeight: "450px",
        width: "500px",
        margin: "10px",
        padding: "0px",

    }

    const paper: CSS.Properties = {
        padding: "0px",
        margin: "auto",
        display: "block",
        width: "100%",
    }

    return (
        <Paper elevation={10} style={paper} >
            {SimpleAppBar()}
            <div style={{
                display: "block",
                minWidth: "320",
            }}>
                {errorFlag ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    : ""}
                <h1>My Profile</h1>
                <Card sx={userCardStyles}>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="h6"  style={{fontWeight:"bold"}}>
                        User
                    </Typography>
                    <Typography>
                        <Avatar alt={user["firstName"]}
                                sx={{width: 100, height: 100, margin: "auto"}}
                                src={getUserImageUrl(userId)}/>
                    </Typography>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        <Box fontWeight='bold' display='inline'>
                            First Name:</Box> {user["firstName"]}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        <Box fontWeight='bold' display='inline'>
                            Last Name:</Box> {user["lastName"]}
                    </Typography>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        <Box fontWeight='bold' display='inline'>
                            Email:</Box> {user["email"]}
                    </Typography>
                </Card>
            </div>
        </Paper>
    )
}


export default Profile;
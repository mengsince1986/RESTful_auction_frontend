import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AppBar from "./AppBar";
import {Paper} from "@mui/material";

const bull = (
    <Box
        component="span"
        sx={{display: 'inline-block', mx: '2px', transform: 'scale(0.8)'}}
    >
        •
    </Box>
);

const EditAuctionMessage = () => {

    return (
        <Paper elevation={10}
               sx={{
                   padding: "0px",
                   margin: "auto",
                   display: "block",
                   width: "100%",}}>
            {AppBar()}
            <div style={{
                display: "block",
                minWidth: "320",
            }}>
                <Card sx={{minWidth: 275}}>
                    <CardContent>
                        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                            Yep!
                        </Typography>
                        <Typography variant="h5" component="div">
                            You have updated your auction!
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </Paper>
    );
}

export default EditAuctionMessage;
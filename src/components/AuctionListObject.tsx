import React from "react";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
//import {useUserStore} from "../store/";
import {
    Alert,
    Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, IconButton, Snackbar, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';

interface IAuctionProps {
    auction: Auction
    categories: Array<Category>
}

const AuctionListObject = (props: IAuctionProps) => {
    const [auction] = React.useState<Auction>(props.auction)
    const [categories] = React.useState<Array<Category>>(props.categories)
    const [auctionImageUrl, setAuctionImageUrl] = React.useState("")
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    //const [username, setUsername] = React.useState("")
    //const [editDialog, setEditDialog] = React.useState(false)
    //const [deleteDialog, setDeleteDialog] = React.useState(false)
    //const deleteUserFromStore = useUserStore(state => state.removeUser)
    //const editUserFromStore = useUserStore(state => state.editUser)

/*    const deleteUser = () => {
        axios.delete('http://localhost:3000/api/users/' + user.user_id)
            .then(() => {
                deleteUserFromStore(user)
            })
    }
    const editUser = () => {
        axios.put('http://localhost:3000/api/users/' + user.user_id,
            {"username": username})
            .then(() => {
                editUserFromStore(user, username)
            })
    }*/



   //  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
   //  const [dialogUser, setDialogUser] = React.useState<User>({username:"", user_id:-1})

   // const [snackOpen, setSnackOpen] = React.useState(false)
   // const [snackMessage, setSnackMessage] = React.useState("")
/*    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };*/

  /*  const handleDeleteDialogOpen = (user:User) => {
        setDialogUser(user)
        setOpenDeleteDialog(true);
    };
    const handleDeleteDialogClose = () => {
        setDialogUser({username:"", user_id:-1})
        setOpenDeleteDialog(false);
    };*/

    /*    const deleteUser = (user: User) => {
            axios.delete('http://localhost:3000/api/users/' + user.user_id)
                .then((response) => {
                    handleDeleteDialogClose()
                    //navigate('/users/')
                    getUsers()
                    setSnackMessage("User Deleted")
                    setSnackOpen(true)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }*/


    const getAuctionImageUrl = (auctionId: number) => {
        return 'http://localhost:4941/api/v1/auctions/' + auctionId + '/image'
    }

    const DaysBeforeClose = (strCloseDate: string) => {
        const closeDate = new Date(strCloseDate);
        const now = new Date();

        const differ_in_time = closeDate.getTime() - now.getTime();
        if (differ_in_time <= 0) {
            return "closed"
        } else {
            const differ_in_days = differ_in_time / (1000 * 3600 * 24);
            if (differ_in_days < 1) {
                return "closes less than 1 day"
            } else {
                const days =  Math.floor(differ_in_days);
                return "closes in " + days + " days"
            }
        }
    }

    const getCategoryName = (categoryId: number) => {
        const categoryLst = categories.filter((category) => {
            return category["categoryId"] === categoryId
        })
        if (categoryLst.length === 0) {
            return "Not Specified"
        } else {
            return categoryLst[0]["name"]
        }
    }

    const getHighestBid = (bid: number) => {
        if (bid === null || bid <= 0) {
            return "No bid placed"
        } else {
            return '$' + bid
        }
    }

    const getReserve = (reserve: number) => {
        if (reserve === null || reserve <= 0) {
            return "not set"
        } else if (auction.highestBid >= reserve) {
            return '$' + reserve + " (Reached)"
        } else {
            return '$' + reserve
        }
    }

    const auctionCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "auto",
        width: "380px",
        margin: "10px",
        padding: "0px"
    }

    return (
        <Card sx={auctionCardStyles}>
            <CardMedia
                component="img"
                height="200"
               // width="200"
                sx={{objectFit: "cover"}}
                image={getAuctionImageUrl(auction.auctionId)}
                alt="Auction hero"
            />

            <CardContent>
                <Typography variant="h6">
                    {auction.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Status: {DaysBeforeClose(auction.endDate)}
                </Typography>
{/*                <Typography variant="h6">
                    Category ID: {auction.categoryId}
                </Typography>*/}
                <Typography variant="body1" color="text.secondary" >
                    Category: {getCategoryName(auction.categoryId)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Seller:  {auction.sellerFirstName} {auction.sellerLastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Highest Bid: {getHighestBid(auction.highestBid)}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Reserve: {getReserve(auction.reserve)}
                </Typography>
            </CardContent>

{/*            <CardActions>
                <IconButton onClick={() => {
                    setEditDialog(true)
                }}>
                    <Edit/>
                </IconButton>
                <IconButton onClick={() => {
                    setDeleteDialog(true)
                }}>
                    <Delete/>
                </IconButton>
            </CardActions>*/}

            {/*            //ADD EDIT/DELETE DIALOGS HERE
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Delete User?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Cancel</Button>
                    <Button variant="outlined" color="error" onClick={() => {
                        //deleteUser(dialogUser)
                        deleteUser()
                    }} autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>*/}
{/*            <Snackbar
                autoHideDuration={6000}
                open={snackOpen}
                onClose={handleSnackClose}
                key={snackMessage}
            >
                <Alert onClose={handleSnackClose} severity="success" sx={{
                    width: '100%'
                }}>
                    {snackMessage}
                </Alert>
            </Snackbar>*/}
        </Card>
    )
}


export default AuctionListObject
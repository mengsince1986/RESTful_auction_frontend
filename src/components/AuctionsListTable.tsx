import axios from 'axios';
import React, {useId} from "react";
import {Link, useNavigate} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TextField, Paper, Table, TableBody,
    TableContainer, TableRow, TableCell, TableHead, Stack, AlertTitle, Alert, Snackbar, CardMedia, Card
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CSS from 'csstype';

interface IAuctionProps {
    auction: Auction
    categories: Array<Category>
}

const AuctionsListTable = (props: IAuctionProps) => {
    const [auction] = React.useState<Auction>(props.auction)
    const [categories] = React.useState<Array<Category>>(props.categories)
/*    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")*/

    /*    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
        const [dialogUser, setDialogUser] = React.useState<User>({username: "", user_id: -1})

        const [snackOpen, setSnackOpen] = React.useState(false)
        const [snackMessage, setSnackMessage] = React.useState("")
        const handleSnackClose = (event?: React.SyntheticEvent | Event,
                                  reason?: string) => {
            if (reason === 'clickaway') {
                return;
            }
            setSnackOpen(false);
        };*/


    /*
        const navigate = useNavigate();
        const handleDeleteDialogOpen = (user: User) => {
            setDialogUser(user)
            setOpenDeleteDialog(true);
        };
        const handleDeleteDialogClose = () => {
            setDialogUser({username: "", user_id: -1})
            setOpenDeleteDialog(false);
        };

        const deleteUser = (user: User) => {
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
        }
    */

    /*  const list_of_users = () => {
          return users.map((item: User) =>
              <tr>
                  <th scope="row">{item.user_id}</th>
                  <td>{item.username}</td>
                  <td><Link to={"/users/" + item.user_id}>Go to
                      user</Link></td>
                  <td>
                      <Button variant="outlined" endIcon={<DeleteIcon/>} onClick={()=>{handleDeleteDialogOpen(item)}}>
                          Delete
                      </Button>
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
                              <Button variant="outlined" color="error" onClick={()=>{deleteUser(dialogUser)}} autoFocus>
                                  Delete
                              </Button>
                          </DialogActions>
                      </Dialog>

                      <button type="button">Edit</button>
                  </td>
              </tr>
          )
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


    return (
        <TableRow hover
                  tabIndex={-1}
                  key={auction.auctionId}>
            <TableCell align="center">
                {auction.auctionId}
            </TableCell>
            <TableCell align="left">
                <Card>
                    <CardMedia
                        component="img"
                        height="100"
                        // width="200"
                        sx={{objectFit: "cover"}}
                        image='http://localhost:4941/api/v1/auctions/7/image'
                        alt="Auction hero"
                    />
                </Card>
            </TableCell>
            <TableCell align="left">
                {auction.title}
            </TableCell>
            <TableCell align="left">
                {auction.endDate}
            </TableCell>
            <TableCell align="center">
                {auction.categoryId}
            </TableCell>
            <TableCell align="left">
                {auction.sellerFirstName} {auction.sellerLastName}
            </TableCell>
            <TableCell align="left">
                ${auction.highestBid}
            </TableCell>
            <TableCell align="left">
                ${auction.reserve}
            </TableCell>
            {/*                <TableCell align="left"><Link
                    to={"/users/" + row.user_id}>Go to user</Link></TableCell>
                <TableCell align="left">*/}
            {/* <Button variant="outlined" endIcon={<EditIcon/>}
                        //onClick={() => {handleEditDialogOpen(row)}}
                    >
                        Edit
                    </Button>
                    <Button variant="outlined" endIcon={<DeleteIcon/>}
                            onClick={() => {
                                handleDeleteDialogOpen(row)
                            }}>
                        Delete
                    </Button>
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
                                deleteUser(dialogUser)
                            }} autoFocus>
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar
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
                    </Snackbar>
                </TableCell>*/}
        </TableRow>
    )
}

export default AuctionsListTable;
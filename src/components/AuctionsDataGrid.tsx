import axios from 'axios';
import React, {useId} from "react";
import {Link, useNavigate} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TextField, Paper, Table, TableBody,
    TableContainer, TableRow, TableCell, TableHead, Stack, AlertTitle, Alert, Snackbar, CardMedia, Card, createTheme
} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import CSS from 'csstype';
// When using TypeScript 4.x and above
import type {} from '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
    components: {
        // Use `MuiDataGrid` on DataGrid, DataGridPro and DataGridPremium
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
            },
        },
    },
});


const card: CSS.Properties = {
    padding: "10px",
    margin: "50px"
}

interface HeadCell {
    id: string;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {id: 'auctionId', label: 'ID', numeric: true},
    {id: 'image', label: 'Image', numeric: false},
    {id: 'title', label: 'Title', numeric: false},
    {id: 'closeDays', label: 'Days to Close', numeric: true},
    {id: 'category', label: 'Category', numeric: false},
    {id: 'seller', label: 'Seller', numeric: false},
    {id: 'highestBid', label: 'Highest Bid $', numeric: true},
    {id: 'reserve', label: 'Reserve $', numeric: true},
    {id: 'hasMetReserve', label: 'Met Reserve', numeric: false}
];


const AuctionsDataGrid = () => {
    const [auctions, setAuctions] = React.useState<Array<Auction>>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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


    // useEffect
    React.useEffect(() => {
        const getAuctions = () => {
            axios.get('http://localhost:4941/api/v1/auctions')
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setAuctions(response.data["auctions"])
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString() +
                        ": can't get auctions")
                })
        }

        const getCategories = () => {
            axios.get('http://localhost:4941/api/v1/auctions/categories')
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setCategories(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString() +
                        ": can't get categories")
                })
        }
        getAuctions()
        getCategories()
    }, [])

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

    const daysBeforeClose = (strCloseDate: string) => {
        const closeDate = new Date(strCloseDate);
        const now = new Date();

        const differ_in_time = closeDate.getTime() - now.getTime();
        if (differ_in_time <= 0) {
            return 0
        } else {
            const differ_in_days = differ_in_time / (1000 * 3600 * 24);
            if (differ_in_days < 1) {
                return 1
            } else {
                const days =  Math.floor(differ_in_days);
                return days
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
            return 0
        } else {
            return bid
        }
    }

    const getReserve = (reserve: number) => {
        if (reserve === null || reserve <= 0) {
            return 0
        } else {
            return reserve
        }
    }

    const auction_rows = () => {
        return auctions.map((row: Auction) =>
            <TableRow hover
                      tabIndex={-1}
                      key={row.auctionId}
            >
                <TableCell align="right">
                    {row.auctionId}
                </TableCell>
                <TableCell align="left" width="100">
                    <Card>
                        <CardMedia
                            component="img"
                            height="70"
                            sx={{objectFit: "cover"}}
                            image={getAuctionImageUrl(row.auctionId)}
                            alt="Auction hero"
                        />
                    </Card>
                </TableCell>
                <TableCell align="left">
                    {row.title}
                </TableCell>
                <TableCell align="right">
                    {daysBeforeClose(row.endDate)}
                </TableCell>
                <TableCell align="left">
                    {getCategoryName(row.categoryId)}
                </TableCell>
                <TableCell align="left">
                    {row.sellerFirstName} {row.sellerLastName}
                </TableCell>
                <TableCell align="right">
                    {getHighestBid(row.highestBid)}
                </TableCell>
                <TableCell align="right">
                    {getReserve(row.reserve)}
                </TableCell>
                <TableCell align="left">
                    {(getHighestBid(row.highestBid) - getReserve(row.reserve)) >= 0? "Yes" : "No"}
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

    const columns: GridColDef[] = [
        { field: 'auctionId', headerName: 'ID', width: 90 },
        {
            field: 'firstName',
            headerName: 'First name',
            width: 150,
            editable: true,
        },
        {
            field: 'lastName',
            headerName: 'Last name',
            width: 150,
            editable: true,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];

    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    if (errorFlag) {
        return (
            <div>
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                </Alert>
            </div>
        )
    } else {
        return (
            <div style={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        )
    }
}

export default AuctionsDataGrid;
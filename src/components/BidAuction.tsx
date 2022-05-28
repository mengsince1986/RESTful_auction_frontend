import React from "react";
import axios from "axios";
import {
    Alert,
    AlertTitle,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider, Input,
    Paper, Snackbar, Stack,
    Typography
} from "@mui/material";
import CSS from 'csstype';
import {useNavigate, useParams} from "react-router-dom";
import {DataGrid, GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import SimpleAppBar from "./AppBar";
import {useTokenStore, useUserIdStore} from "../store";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";


const BidAuction = () => {
    const {id} = useParams();
    const [auction, setAuction] = React.useState<AuctionDetail>({
        auctionId: 0,
        title: "",
        description: "",
        endDate: "",
        categoryId: 0,
        reserve: 0,
        sellerId: 0,
        sellerFirstName: "",
        sellerLastName: "",
        numBids: 0,
        highestBid: 0
    })
    const [auctions, setAuctions] = React.useState<Array<Auction>>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [bids, setBids] = React.useState<Array<Bid>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [auctionId, setAuctionId] = React.useState(0);
    const [currentBid, setCurrentBid] = React.useState(0);
    const userToken = useTokenStore(state => state.userToken);
    const userId = useUserIdStore(state => state.userId);


    React.useEffect(() => {
        const getAuction = () => {
            axios.get('http://localhost:4941/api/v1/auctions/' + id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setAuction(response.data)
                    setCurrentBid(response.data.highestBid)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }

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

        const getBids = () => {
            axios.get('http://localhost:4941/api/v1/auctions/' + id + '/bids')
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setBids(response.data)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString() +
                        ": can't get categories")
                })
        }
        getAuction()
        getAuctions()
        getCategories()
        getBids()
    }, [])

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
        const config = {
            headers: {
                "X-Authorization": userToken,
            }
        };
        const bid = Number(data.get('bid'))
        const auctionData = {
            amount: bid
        };

        if (bid > currentBid) {
            const url = 'http://localhost:4941/api/v1/auctions/'+id+'/bids'
            axios.post(url, auctionData, config)
                .then(function (response) {
                    console.log(response);
                    navigate('/auctions/' + id)
                })
                .catch(function (error) {
                    console.log(error);
                    setErrorMessage("Can't create the auction")
                    handleClick()
                });
        } else {
            setErrorMessage("You need to bid higher than $" + currentBid)
            handleClick()
        }
    };


    const getAuctionImageUrl = () => {
        return 'http://localhost:4941/api/v1/auctions/' + id + '/image'
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
                const days = Math.floor(differ_in_days);
                return "closes in " + days + " days"
            }
        }
    }

    const strToDate = (dateStr: string) => {
        const closeDate = new Date(dateStr);
        return closeDate.toLocaleDateString()
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


    const getBidderList = () => {
        const columns: GridColDef[] = [
            {
                field: 'avatar',
                headerName: 'Avatar',
                type: 'string',
                width: 65,
                editable: true,
                sortable: false,
                renderCell: (params) => <Avatar
                    alt="bidder"
                    sx={{width: 50, height: 50, margin: "auto"}}
                    src={'http://localhost:4941/api/v1/users/' +
                        params.row.bidderId + '/image'}/>
            },
            {
                field: 'firstName',
                headerName: 'First Name',
                type: 'string',
                width: 150,
                editable: true,
                sortable: false,
            },
            {
                field: 'lastName',
                headerName: 'Last Name',
                type: 'string',
                width: 150,
                editable: true,
                sortable: false,
            },
            {
                field: "bidAmount",
                headerName: 'Bid Amount',
                type: 'string',
                width: 150,
                editable: true,
                sortable: false,
            },
            {
                field: "timeStamp",
                headerName: 'Time Stamp',
                type: 'string',
                width: 300,
                editable: true,
                sortable: false,
            },
        ];

        const rows = bids.map((bid) => {
            return {
                id: bid.timestamp,
                bidderId: bid.bidderId,
                firstName: bid.firstName,
                lastName: bid.lastName,
                bidAmount: `$${bid.amount}`,
                timeStamp: bid.timestamp
            }
        })

        return (
            <CardContent>
                <div style={{height: 400, width: '100%'}}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        disableSelectionOnClick
                        disableColumnSelector
                    />
                </div>
            </CardContent>
        )
    }


    const auctionCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "580px",
        width: "500px",
        margin: "10px",
        padding: "0px",

    }

    const paper: CSS.Properties = {
        padding: "0px",
        margin: "auto",
        display: "block",
        width: "fit-content",
    }

    return (
        <Paper elevation={10} style={paper}>
            {SimpleAppBar()}
            <div style={{
                display: "block",
                minWidth: "320",
            }}>
                {errorFlag ?
                    <Alert variant="filled" severity="error">
                        {errorMessage}
                    </Alert>
                    : ""}
                <h1>Make a Bid</h1>
                <Card sx={auctionCardStyles}>

                    <CardContent>
                        <Typography variant="h6" style={{fontWeight: "bold"}}>
                            ITEM
                        </Typography>
                        <Typography>
                            &nbsp;
                        </Typography>
                        <CardMedia
                            component="img"
                            height="200"
                            sx={{objectFit: "cover"}}
                            image={getAuctionImageUrl()}
                            alt="Auction hero"
                        />

                        <Typography>
                            &nbsp;
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="left">
                            <Box fontWeight='bold' display='inline'>
                                Title:</Box> {auction.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="left">
                            <Box fontWeight='bold' display='inline'>
                                Description:</Box> {auction.description}
                        </Typography>
                        <Typography>
                            &nbsp;
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="left">
                            <Box fontWeight='bold' display='inline'>
                                Status:</Box> {DaysBeforeClose(auction.endDate)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="left">
                            <Box fontWeight='bold' display='inline'>
                                End Date:</Box> {strToDate(auction.endDate)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="left">
                            <Box fontWeight='bold' display='inline'>
                                Category:</Box> {getCategoryName(auction.categoryId)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="left">
                            <Box fontWeight='bold' display='inline'>
                                Number of bids:</Box> {auction.numBids}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="left">
                            <Box fontWeight='bold' display='inline'>
                                Highest Bid:</Box> {getHighestBid(auction.highestBid)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" align="left">
                            <Box fontWeight='bold' display='inline'>
                                Reserve:</Box> {getReserve(auction.reserve)}
                        </Typography>
                        <Typography>
                            &nbsp;
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={auctionCardStyles}>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid item xs={12}>
                            <Typography>
                                &nbsp;
                            </Typography>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                name="bid"
                                label="Make a Bid"
                                id="bid"
                                helperText="Must be more than the highest bid"
                            />
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            BID
                        </Button>
                        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                                {errorMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Card>

                <Card sx={{
                    display: "inline-block",
                    height: "auto",
                    minHeight: "580px",
                    width: "1020px",
                    margin: "10px",
                    padding: "0px",
                }}>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="h6" style={{fontWeight: "bold"}}>
                        BIDDER LIST
                    </Typography>
                    {getBidderList()}
                </Card>

            </div>
        </Paper>
    )
}


export default BidAuction;
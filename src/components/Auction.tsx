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
    Divider,
    Paper, Stack,
    Typography
} from "@mui/material";
import CSS from 'csstype';
import {useNavigate, useParams} from "react-router-dom";
import { DataGrid, GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import SimpleAppBar from "./AppBar";
import {useTokenStore, useUserIdStore} from "../store";


const Auction = () => {
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
    const userToken = useTokenStore(state => state.userToken);
    const userId = useUserIdStore(state => state.userId);


    React.useEffect(() => {
        const getAuction = () => {
            axios.get('http://localhost:4941/api/v1/auctions/' + id)
                .then((response) => {
                    setErrorFlag(false)
                    setErrorMessage("")
                    setAuction(response.data)
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
                        ": can't get bids")
                })
        }
        getAuction()
        getAuctions()
        getCategories()
        getBids()
    }, [])

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteAuction = () => {
        const config = {
            headers: {
                "X-Authorization": userToken,
            }
        };
        axios.delete('http://localhost:4941/api/v1/auctions/' + id,
            config)
            .then((response) => {
                console.log(response)
                navigate('/auctions')
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.response.statusText.toString())
            })
    }

    const getButtons = () => {
        {
            const option1 = (
                <div>
                    <Stack  direction="row" spacing={2}>
                    <Button href={'http://localhost:8080/auctions/' + auction.auctionId + '/edit'}
                            variant="contained"
                            disabled>
                        Edit
                    </Button>
                    <Button variant="contained" disabled>
                        Delete
                    </Button>
                    <Button href={'http://localhost:8080/auctions/' + auction.auctionId + '/bid'}
                            variant="contained">
                        Bid!
                    </Button>
                    </Stack>
                </div>
            )
            const option2 = (
                <div>
                    <Stack  direction="row" spacing={2}>
                    <Button href={'http://localhost:8080/auctions/' + auction.auctionId + '/edit'}
                    variant="contained">
                        Edit
                    </Button>
                    <Button onClick={handleClickOpen} variant="contained">
                        Delete
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Warning"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete the auction?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>No</Button>
                            <Button onClick={deleteAuction} autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button href={'http://localhost:8080/auctions/' + auction.auctionId + '/bid'}
                            variant="contained" disabled>
                        Bid!
                    </Button>
                    </Stack>
                </div>
            )

            if (userToken !== "" && userId === auction.sellerId) {
                return option2
            } else if (userToken !== "" && userId !== auction.sellerId
            && Date.parse(auction.endDate) > Date.now()) {
                return option1
            } else {
                return (
                    <div>
                        <Stack  direction="row" spacing={2}>
                            <Button href={'http://localhost:8080/auctions/' + auction.auctionId + '/edit'}
                                    variant="contained"
                                    disabled>
                                Edit
                            </Button>
                            <Button variant="contained" disabled>
                                Delete
                            </Button>
                            <Button href={'http://localhost:8080/auctions/' + auction.auctionId + '/bid'}
                                    variant="contained" disabled>
                                Bid!
                            </Button>
                        </Stack>
                    </div>
                )
            }
        }
    }

    const getAuctionImageUrl = () => {
        return 'http://localhost:4941/api/v1/auctions/' + id + '/image'
    }

    const getUserImageUrl = (userId:number) => {
        if (userId > 0) {
            return 'http://localhost:4941/api/v1/users/' + userId + '/image'
        }
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

    const getCurrentBidderName = () => {
        if (bids.length === 0) {
            return ""
        } else {
            return [bids[0]["firstName"], bids[0]["lastName"]]
        }
    }

    const getCurrentBidAmount = () => {
        if (bids.length === 0) {
            return ""
        } else {
            return bids[0]["amount"]
        }
    }

    const getCurrentBidderId = () => {
        if (bids.length === 0) {
            return 1
        } else {
            return bids[0]["bidderId"]
        }
    }


    const getCurrentBidBlock = () => {
        if (bids.length === 0) {
            return (
                <CardContent>
                    <Divider/>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="h6" style={{fontWeight: "bold"}}>
                        CURRENT BIDDER
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        No bid placed
                    </Typography>
                </CardContent>
            )
        }
        return (
            <CardContent>
                <Divider/>
                <Typography>
                    &nbsp;
                </Typography>
                <Typography variant="h6" style={{fontWeight: "bold"}}>
                    CURRENT BIDDER
                </Typography>
                <Typography>
                    <Avatar alt="bidder"
                            sx={{width: 100, height: 100, margin: "auto"}}
                            src={getUserImageUrl(getCurrentBidderId())}/>
                </Typography>
                <Typography>
                    &nbsp;
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    <Box fontWeight='bold' display='inline'>
                        First Name:</Box> {getCurrentBidderName()[0]}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    <Box fontWeight='bold' display='inline'>
                        Last Name:</Box> {getCurrentBidderName()[1]}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    <Box fontWeight='bold' display='inline'>
                        Bid Amount:</Box> ${getCurrentBidAmount()}
                </Typography>
            </CardContent>
        )
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

        const rows =bids.map((bid) => {
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
                <div style={{ height: 400, width: '100%' }}>
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

    const getSimilarAuctions = (type: string) => {

        const sameSellerAuctions = auctions.filter((candidate) => {
            const haveSameSeller = candidate["sellerId"] === auction["sellerId"]
            const isNotSelf = candidate["auctionId"] !== auction["auctionId"]
            return isNotSelf && haveSameSeller
        })

        const sameCategoryAuctions = auctions.filter((candidate) => {
            const haveSameCategory = candidate["categoryId"] === auction["categoryId"]
            const isNotSelf = candidate["auctionId"] !== auction["auctionId"]
            return isNotSelf && haveSameCategory
        })

        const daysBeforeClose = (params: GridValueGetterParams) => {
            const closeDate = new Date(params.value);
            const now = new Date();
            const differ_in_time = closeDate.getTime() - now.getTime();
            const differ_in_days = differ_in_time / (1000 * 3600 * 24);
            return Math.floor(differ_in_days);
        }

        const isClose = (params: GridValueGetterParams) => {
            const closeDate = new Date(params.row.closeDays);
            const now = new Date();

            const differ_in_time = closeDate.getTime() - now.getTime();
            if (differ_in_time <= 0) {
                return "close"
            } else {
                return "open"
            }
        }

        const getCategoryName = (params: GridValueGetterParams) => {
            const categoryLst = categories.filter((category) => {
                return category["categoryId"] === params.value
            })
            if (categoryLst.length === 0) {
                return "Not Specified"
            } else {
                return categoryLst[0]["name"]
            }
        }

        const getFullName = (params: GridValueGetterParams) => {
            return `${params.row.sellerFirstName || ''} ${params.row.sellerLastName || ''}`
        }

        const getHighestBid = (params: GridValueGetterParams) => {
            if (params.value === null || params.value <= 0) {
                return 0
            } else {
                return params.value
            }
        }

        const getReserve = (params: GridValueGetterParams) => {
            if (params.value === null || params.value <= 0) {
                return 0
            } else {
                return params.value
            }
        }

        const hasMetReserve = (params: GridValueGetterParams) => {
            if (params.row.bid >= params.row.reserve) {
                return "Yes"
            } else {
                return "No"
            }
        }

        const columns: GridColDef[] = [
            {
                field: 'id',
                headerName: 'ID',
                type: 'number',
                width: 100
            },
            {
                field: "link",
                headerName: 'Link',
                type: 'string',
                width: 100,
                editable: true,
                renderCell: (params) =>
                    (<Button href={'http://localhost:8080/auctions/' + params.row.id}>
                        Details
                    </Button>)
            },
            {
                field: 'image',
                headerName: 'Image',
                type: 'string',
                width: 200,
                editable: true,
                sortable: false,
                renderCell: (params) => <Avatar
                    alt="auction" variant="square"
                    sx={{width: 110, height: 110, margin: "auto"}} src={'http://localhost:4941/api/v1/auctions/' + params.value + '/image'}/>
            },
            {
                field: 'title',
                headerName: 'Title',
                type: 'string',
                width: 300,
                editable: true,
            },
            {
                field: 'closeDays',
                headerName: 'Days to close',
                type: 'number',
                width: 150,
                editable: true,
                valueGetter: daysBeforeClose
            },
            {
                field: 'status',
                headerName: 'Status',
                type: 'string',
                width: 150,
                editable: true,
                valueGetter: isClose
            },
            {
                field: 'category',
                headerName: 'Category',
                type: 'string',
                width: 200,
                editable: true,
                valueGetter: getCategoryName
            },
            {
                field: 'sellerName',
                headerName: 'Seller Name',
                type: 'string',
                width: 150,
                editable: true,
                valueGetter: getFullName
            },
            {
                field: "bid",
                headerName: 'Bid',
                type: 'number',
                width: 150,
                editable: true,
                valueGetter: getHighestBid
            },
            {
                field: "reserve",
                headerName: 'Reserve',
                type: 'number',
                width: 150,
                editable: true,
                valueGetter: getReserve
            },
            {
                field: "metReserve",
                headerName: 'Met Reserve',
                type: 'string',
                width: 150,
                editable: true,
                valueGetter: hasMetReserve
            },

        ];

        const sameCategoryRows = sameCategoryAuctions.map((auction:Auction) => {
            return {
                id: auction.auctionId,
                image: auction.auctionId,
                title: auction.title,
                closeDays: auction.endDate,
                category: auction.categoryId,
                sellerFirstName: auction.sellerFirstName,
                sellerLastName: auction.sellerLastName,
                bid: auction.highestBid,
                reserve: auction.reserve
            }
        })

        const sameSellerRows = sameSellerAuctions.map((auction:Auction) => {
            return {
                id: auction.auctionId,
                image: auction.auctionId,
                title: auction.title,
                closeDays: auction.endDate,
                category: auction.categoryId,
                sellerFirstName: auction.sellerFirstName,
                sellerLastName: auction.sellerLastName,
                bid: auction.highestBid,
                reserve: auction.reserve
            }
        })

        let rows;

        if (type === "category") {
            rows = sameCategoryRows
        } else {
            rows = sameSellerRows
        }

        return (
            <CardContent>
                <div style={{ height: 350, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        isCellEditable={(params) => false}
                        autoHeight
                        rowHeight={120}
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
        height: "650px",
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
        <Paper elevation={10} style={paper} >
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
                <h1>Auction Detail</h1>
                <Card sx={auctionCardStyles}>

                    <CardContent>
                        <Typography variant="h6" style={{fontWeight:"bold"}} >
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
                        {getButtons()}
                    </CardContent>

                </Card>
                <Card sx={auctionCardStyles}>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="h6"  style={{fontWeight:"bold"}}>
                        SELLER
                    </Typography>
                    <Typography>
                        <Avatar alt="seller"
                                sx={{width: 100, height: 100, margin: "auto"}}
                                src={getUserImageUrl(auction["sellerId"])}/>
                    </Typography>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        <Box fontWeight='bold' display='inline'>
                            First Name:</Box> {auction.sellerFirstName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        <Box fontWeight='bold' display='inline'>
                            Last Name:</Box> {auction.sellerLastName}
                    </Typography>
                    <Typography>
                        &nbsp;
                    </Typography>
                    {getCurrentBidBlock()}
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
                    <Typography variant="h6"  style={{fontWeight:"bold"}}>
                        BIDDER LIST
                    </Typography>
                    {getBidderList()}
                </Card>

                <Card sx={{
                    display: "inline-block",
                    height: "auto",
                    minHeight: "450px",
                    width: "1020px",
                    margin: "10px",
                    padding: "0px",
                }}>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="h6"  style={{fontWeight:"bold"}}>
                        Auctions from the Same Category
                    </Typography>
                    {getSimilarAuctions("category")}
                </Card>

                <Card sx={{
                    display: "inline-block",
                    height: "auto",
                    minHeight: "450px",
                    width: "1020px",
                    margin: "10px",
                    padding: "0px",
                }}>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="h6"  style={{fontWeight:"bold"}}>
                        Auctions from the Same Seller
                    </Typography>
                    {getSimilarAuctions("seller")}
                </Card>
            </div>
        </Paper>
    )
}


export default Auction
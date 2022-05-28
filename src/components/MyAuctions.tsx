import React from "react";
import axios from "axios";
import {
    Alert, AlertTitle, Avatar, Box, Button, Card,  CardContent, CardMedia,
    Divider, Paper, Typography
} from "@mui/material";
import CSS from 'csstype';
import {useParams} from "react-router-dom";
import { DataGrid, GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
import SimpleAppBar from "./AppBar";
import { useTokenStore, useUserIdStore } from "../store";


const MyAuctionsDataGrid = () => {
    const {id} = useParams();
    const userId =parseInt(useUserIdStore(state => state.userId));
    const userToken = useTokenStore(state => state.userToken);
    const [user, setUser] = React.useState<User>({firstName: "",
    lastName: "", email: ""})
    const [auctions, setAuctions] = React.useState<Array<Auction>>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [bids, setBids] = React.useState<Array<Bid>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {

        const getUser = () => {
            console.log("User Token:")
            console.log(userToken)
            console.log("User ID:")
            console.log(userId)

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
        getUser()
        getAuctions()
        getCategories()
    }, [])

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

 /*   const getReserve = (reserve: number) => {
        if (reserve === null || reserve <= 0) {
            return "not set"
        } else if (auction.highestBid >= reserve) {
            return '$' + reserve + " (Reached)"
        } else {
            return '$' + reserve
        }
    }*/

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

    const getMyAuctions = (type: string) => {

        const sameSellerAuctions = auctions.filter((candidate) => {
            const haveSameSeller = candidate["sellerId"] === userId
            const isNotSelf = candidate["auctionId"] !== userId
            return isNotSelf && haveSameSeller
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
                renderCell: (params) => <img
                    src={'http://localhost:4941/api/v1/auctions/'
                        + params.value + '/image'}
                    alt="hero" width="100%"/>
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
            rows = sameSellerRows
        } else {
            rows = sameSellerRows
        }

        return (
            <CardContent>
                <div style={{ height: 350, width: '100%' }}>
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
        padding: "10px",
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
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    : ""}
                <h1>My Auctions</h1>
                <Card sx={auctionCardStyles}>
                    <Typography>
                        &nbsp;
                    </Typography>
                    <Typography variant="h6"  style={{fontWeight:"bold"}}>
                        Me
                    </Typography>
                    <Typography>
                        <Avatar alt="me"
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
{/*                    {getMyBidAuctions("seller")}*/}
                </Card>
            </div>
        </Paper>
    )
}


export default MyAuctionsDataGrid;
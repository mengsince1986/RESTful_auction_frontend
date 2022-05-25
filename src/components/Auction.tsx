import React from "react";
import axios from "axios";
import {Delete, Edit} from "@mui/icons-material";
//import {useUserStore} from "../store/";
import {
    Alert, AlertTitle, Avatar,
    Button, Card, CardActions, CardContent, CardMedia, Dialog,
    DialogActions, DialogContent, DialogContentText,
    DialogTitle, Divider, IconButton, Paper, Snackbar, Stack, TextField, Typography
} from "@mui/material";
import CSS from 'csstype';
import {useParams} from "react-router-dom";


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
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [auctionImageUrl, setAuctionImageUrl] = React.useState("")
    const [bids, setBids] = React.useState<Array<Bid>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

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
        getCategories()
        getBids()
    }, [])

    const getAuctionImageUrl = () => {
        return 'http://localhost:4941/api/v1/auctions/' + id + '/image'
    }

    const getUserImageUrl = (sellerId:number) => {
        return 'http://localhost:4941/api/v1/users/' + sellerId + '/image'
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
                <div>
                    <Divider/>
                    <Typography variant="h6">
                        CURRENT BIDDER
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        No bid placed
                    </Typography>
                </div>
            )
        }
        return (
            <div>
                <Divider />
                <Typography variant="h6">
                    CURRENT BIDDER
                </Typography>
                <Typography>
                    <Avatar alt="seller"
                            sx={{width: 100, height: 100, margin: "auto"}}
                            src={getUserImageUrl(getCurrentBidderId())}/>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    First Name: {getCurrentBidderName()[0]}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Last Name:  {getCurrentBidderName()[1]}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Bid Amount:  {getCurrentBidAmount()}
                </Typography>
            </div>

        )
    }

    const auctionCardStyles: CSS.Properties = {
        display: "inline-block",
        height: "auto",
        width: "500px",
        margin: "10px",
        padding: "0px"
    }

    const paper: CSS.Properties = {
        padding: "10px",
        margin: "auto",
        display: "block",
        width: "fit-content"
    }

    return (
        <Paper elevation={10} style={paper}>

            <div style={{
                display: "inline-block",
                minWidth: "320"
            }}>
                {errorFlag ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    : ""}
                <Card sx={auctionCardStyles}>
                    <h1>Auction Detail</h1>
                    <CardContent>
                        <Typography variant="h6">
                            ITEM
                        </Typography>
                        <CardMedia
                            component="img"
                            height="200"
                            sx={{objectFit: "cover"}}
                            image={getAuctionImageUrl()}
                            alt="Auction hero"
                        />
                        <Typography variant="body1" color={"black"}>
                           Title: {auction.title}
                        </Typography>
                        <Typography variant="body1" color={"text.secondary"}>
                            Description: {auction.description}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Status: {DaysBeforeClose(auction.endDate)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            End Date: {strToDate(auction.endDate)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Category: {getCategoryName(auction.categoryId)}
                        </Typography>

                        <Typography variant="body1" color="text.secondary">
                            Number of bids: {auction.numBids}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Highest Bid: {getHighestBid(auction.highestBid)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Reserve: {getReserve(auction.reserve)}
                        </Typography>
                        <Divider />
                        <Typography variant="h6">
                            SELLER
                        </Typography>
                        <Typography>
                            <Avatar alt="seller"
                                    sx={{width: 100, height: 100, margin: "auto"}}
                                    src={getUserImageUrl(auction["sellerId"])}/>
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            First Name: {auction.sellerFirstName}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Last Name: {auction.sellerLastName}
                        </Typography>
                        {getCurrentBidBlock()}
                    </CardContent>
                </Card>
            </div>
        </Paper>
    )
}


export default Auction
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
        getAuction()
        getCategories()
    }, [id])

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
                image={getAuctionImageUrl()}
                alt="Auction hero"
            />

            <CardContent>
                <Typography variant="h6">
                    {auction.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Status: {DaysBeforeClose(auction.endDate)}
                </Typography>
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
        </Card>
    )
}


export default Auction
import axios from 'axios';
import React from "react";
import CSS from 'csstype';
import {
    Paper,
    AlertTitle,
    Alert,
    Grid,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";
import AuctionListObject from "./AuctionListObject";
import AuctionsListTable from "./AuctionsListTable";

/*// Table Config
const card: CSS.Properties = {
    padding: "10px",
    margin: "50px",
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
    {id: 'endDate', label: 'Closes', numeric: false},
    {id: 'categoryId', label: 'Category', numeric: false},
    {id: 'sellerId', label: 'Seller', numeric: false},
    {id: 'highestBid', label: 'Highest Bid', numeric: true},
    {id: 'reserve', label: 'Reserve', numeric: true}
];*/

const AuctionList = () => {
    // States
    const [auctions, setAuctions] = React.useState<Array<Auction>>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

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


    // Generate auction rows
    /*    const auction_rows = () => auctions.map((auction: Auction) =>
            <AuctionsListTable
                  key={auction.auctionId + auction.title +
                    auction.endDate + auction.categoryId +
                    auction.reserve + auction.sellerId +
                    auction.sellerFirstName + auction.sellerLastName +
                    auction.numBids + auction.highestBid}
                categories={categories} auction={auction}/>)*/

    const auction_rows = () => auctions.map((auction: Auction) =>
        <AuctionListObject key={auction.auctionId + auction.title +
            auction.endDate + auction.categoryId +
            auction.reserve + auction.sellerId +
            auction.sellerFirstName + auction.sellerLastName +
            auction.numBids + auction.highestBid}
                           auction={auction} categories={categories}/>)

    const card: CSS.Properties = {
        padding: "10px",
        margin: "auto",
        display: "block",
        width: "fit-content"
    }

    return (
        <Paper elevation={10} style={card}>
            <h1>Auctions</h1>
            <div style={{
                display: "inline-block", maxWidth: "965px",
                minWidth: "320"
            }}>
                {errorFlag ?
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {errorMessage}
                    </Alert>
                    : ""}
                {auction_rows()}
            </div>
        </Paper>
    )


    /*
        (
                <Paper elevation={3} style={card}>
                    <h1>Auctions</h1>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.numeric ? 'right' : 'left'}
                                            padding={'normal'}>
                                            {headCell.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {auction_rows()}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
        )
    */


}

export default AuctionList;
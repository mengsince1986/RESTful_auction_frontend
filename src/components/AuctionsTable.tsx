import axios from 'axios';
import React, {useId} from "react";
import {Link, useNavigate} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, TextField, Paper, Table, TableBody,
    TableContainer, TableRow, TableCell, TableHead, Stack, AlertTitle, Alert,
    Snackbar, CardMedia, Card, TableFooter, Typography
} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import DeleteIcon from "@mui/icons-material/Delete";
import PrimarySearchAppBar from "./PrimarySearchAppBar";
import CSS from 'csstype';

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


const AuctionsTable = () => {
    const [auctions, setAuctions] = React.useState<Array<Auction>>([])
    const [localAuctions, setLocalAuctions] = React.useState<Array<Auction>>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [search, setSearch] = React.useState("")
    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // useEffect
    React.useEffect(() => {
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
        getAuctions();
        getCategories();
    }, [])

    const getAuctions = () => {
        axios.get('http://localhost:4941/api/v1/auctions')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctions(response.data["auctions"])
                setLocalAuctions(response.data["auctions"])
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString() +
                    ": can't get auctions")
            })
    }

    const handleSearch = (event:any) => {
        setSearch(event.target.value)
        filterAuctions()
    }

    const filterAuctions = () => {
        const filteredAuctions = auctions.filter((auction) => {
            return auction.title.toLowerCase().includes(search.toLowerCase())
        })
        setAuctions(filteredAuctions)
        console.log("auctions after filtering:")
        console.log(auctions)
    }

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                const days = Math.floor(differ_in_days);
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
                    {(getHighestBid(row.highestBid) - getReserve(row.reserve)) >= 0 ? "Yes" : "No"}
                </TableCell>
            </TableRow>
        )
    }


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
            <div>
                <Paper elevation={3} style={card}>
                    <h1>Auctions</h1>
                    <Card>
                        <Typography variant="h6" align="center">
                            <label htmlFor="search">
                                Search:
                                <input id="search" type="text" onChange={handleSearch} />
                            </label>
                        </Typography>
                    </Card>
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
                    <TablePagination
                        component="div"
                        count={50}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </div>
        )
    }
}

export default AuctionsTable;
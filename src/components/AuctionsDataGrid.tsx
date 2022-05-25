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
import {
    DataGrid,
    GridColDef,
    GridValueGetterParams,
    GridToolbar,
    GridToolbarExport,
    GridToolbarContainer, GridToolbarQuickFilter, GridToolbarFilterButton
} from "@mui/x-data-grid";
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

const AuctionsDataGrid = () => {
    const [auctions, setAuctions] = React.useState<Array<Auction>>([])
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [pageSize, setPageSize] = React.useState<number>(5);


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


    const daysBeforeClose = (params:GridValueGetterParams) => {
        const closeDate = new Date(params.value);
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

    const getCategoryName = (params:GridValueGetterParams) => {
        const categoryLst = categories.filter((category) => {
            return category["categoryId"] === params.value
        })
        if (categoryLst.length === 0) {
            return "Not Specified"
        } else {
            return categoryLst[0]["name"]
        }
    }

    const getFullName = (params:GridValueGetterParams) => {
        return `${params.row.sellerFirstName || ''} ${params.row.sellerLastName || ''}`
    }

    const getHighestBid = (params:GridValueGetterParams) => {
        if (params.value === null || params.value <= 0) {
            return 0
        } else {
            return params.value
        }
    }

    const getReserve = (params:GridValueGetterParams) => {
        if (params.value === null || params.value <= 0) {
            return 0
        } else {
            return params.value
        }
    }


    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'image',
            headerName: 'Image',
            width: 150,
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
            width: 280,
            editable: true,
        },
        {
            field: 'closeDays',
            headerName: 'Days to close',
            width: 150,
            editable: true,
            valueGetter: daysBeforeClose
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 160,
            editable: true,
            valueGetter: getCategoryName
        },
        {
            field: 'sellerName',
            headerName: 'Seller Name',
            width: 150,
            editable: true,
            valueGetter: getFullName
        },
        {
            field: "bid",
            headerName: 'Bid',
            type: 'number',
            width: 110,
            editable: true,
            valueGetter: getHighestBid
        },
        {
            field: "reserve",
            headerName: 'Reserve',
            type: 'number',
            width: 110,
            editable: true,
            valueGetter: getReserve
        },
    ];

    const rows = auctions.map((auction) => {
        return {id: auction.auctionId,
        image: auction.auctionId,
        title: auction.title,
        closeDays: auction.endDate,
        category: auction.categoryId,
        sellerFirstName: auction.sellerFirstName,
        sellerLastName: auction.sellerLastName,
        bid: auction.highestBid,
        reserve: auction.reserve}
    })

    const tableToolBar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarQuickFilter />
            </GridToolbarContainer>
        )
    }

    const card: CSS.Properties = {
        padding: "10px",
        margin: "50px",
        height: "600px",
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
            <div style={{height: 800, width: '100%'}}>
                <div style={{ display: 'flex', height: '100%'}}>
                    <div style={{ flexGrow: 1}}>
                        <DataGrid
                            autoHeight
                            rowHeight={120}
                            rows={rows}
                            disableColumnSelector
                            columns={columns}
                            components={{Toolbar: tableToolBar}}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[5, 10]}
                            pagination
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default AuctionsDataGrid;
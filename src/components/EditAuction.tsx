import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import {Alert, FormControl, Input, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar} from "@mui/material";
import axios from "axios";
import {useTokenStore} from "../store";
import SimpleAppBar from "./AppBar";
import {useParams} from "react-router-dom";

const theme = createTheme();

const EditAuction = () => {
    const {id} = useParams();
    const [categories, setCategories] = React.useState<Array<Category>>([])
    const [category, setCategory] = React.useState('');
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
    const userToken = useTokenStore(state => state.userToken);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [open, setOpen] = React.useState(false);

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
                    handleClick()
                })
        }
        getCategories()
        getAuction()
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


        const auctionData = {
            title: data.get('title'),
            description: data.get('description'),
            reserve: data.get('reserve'),
            categoryId: parseInt(category),
            endDate: data.get('endDate')
        };

        if (data.get('title') === '') {
            // @ts-ignore
            delete auctionData.title;
        }

        if (data.get('description') === '') {
            // @ts-ignore
            delete auctionData.description;
        }

        if (Number(data.get('reserve')) === 0) {
            // @ts-ignore
            delete auctionData.reserve;
        }

        if (category === "") {
            // @ts-ignore
            delete auctionData.categoryId;
        }

        if (data.get('endDate') === '') {
            // @ts-ignore
            delete auctionData.endDate
        }

        const hasSignedIn = userToken !== "";

        const validReserve = Number(data.get('reserve')) === 0 ||  Number(data.get('reserve')) > 0;
        const validEndDate = (dateStr: string) => {
            if (dateStr === "") {
                return true
            } else {
                return (Date.parse(dateStr) - Date.now()) > 0
            }
        }


        if (!validReserve) {
            setErrorMessage("Invalid Reserve");

        }

        if (!validEndDate(String(data.get('endDate')))) {
            setErrorMessage("Invalid End Date");

        }


        if (!hasSignedIn) {
            setErrorMessage("You can only create an auction after sign in");

        }

        if (validReserve && validEndDate(String(data.get('endDate')))) {
            const url = 'http://localhost:4941/api/v1/auctions/' + id
            axios.patch(url, auctionData, config)
                .then(function (response) {
                    console.log(response);
                    const auctionId = response.data["auctionId"];

                    // upload image if exist
                    if (selectedFile !== null) {
                        console.log("uploading img")
                        const imgConfig = {
                            headers: {
                                "Content-Type": "image/jpeg",
                                "X-Authorization": userToken,
                            }
                        };
                        const uploadUrl = 'http://localhost:4941/api/v1/auctions/' + auctionId + '/image';
                        const formData = new FormData();
                        formData.append("selectedFile", selectedFile);
                        axios.post(uploadUrl, formData, imgConfig)
                            .then(function (response) {
                                console.log(response);
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }


                })
                .catch(function (error) {
                    console.log(error);
                    setErrorMessage(error.response.statusText)
                    handleClick()
                });
        } else {
            handleClick()
        }
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setCategory(event.target.value as string);
    };

    const handleFileSelect = (event:any) => {
        setSelectedFile(event.target.files[0])
    }

    const categoryItems = categories.map((category) => {
        const categoryId = category["categoryId"]
        const categoryName = category["name"]
        return  <MenuItem key={categoryId} value={categoryId}>{categoryName}</MenuItem>
    })


    return (
        <ThemeProvider theme={theme}>
            {SimpleAppBar()}
            <Container component="main" maxWidth="xs">

                <CssBaseline/>
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main', width: 50, height: 50}}>
                        <LocalOfferIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Edit Auction
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="title"
                                    helperText={auction['title']}
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="category-label">Category</InputLabel>
                                    <Select
                                        required
                                        labelId="category-label"
                                        id="category"
                                        value = {category}
                                        label="Category"
                                        onChange={handleCategoryChange}
                                    >
                                        {categoryItems}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="endDate"
                                    name="endDate"
                                    type="date"
                                    helperText="The end date of the auction"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    type="number"
                                    name="reserve"
                                    label="Reserve Price"
                                    id="reserve"
                                    helperText= {'$' + auction['reserve']}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    multiline={true}
                                    rows={5}
                                    type="text"
                                    name="description"
                                    label="Description"
                                    id="description"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <label htmlFor="auctionImage">
                                    <Input id="auctionImage" name="auctionImage"
                                           type="file" onChange={handleFileSelect}/>
                                </label>
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            Modify
                        </Button>
                        <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                                {errorMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default EditAuction;
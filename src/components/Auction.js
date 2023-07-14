import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  NavLink,
  useParams,
} from "react-router-dom";

import { Table, Divider } from "antd";
//import "antd/dist/antd.css";

const columns = [
  {
    title: "Bidder",
    dataIndex: "bidder",
    key: "bidder",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
];

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Auction(props) {
  const myContract = props.myContract;
  const ethereum = window.ethereum;
  const web3 = props.web3;

  useEffect(() => {
    getLandDetails();
    getEventDetails();
  }, []);

  let { landId } = useParams();
  let [isOwner, setIsOwner] = useState(false);
  const [landData, setLandData] = useState();
  const [landDocs, setLandDocs] = useState();
  const [landPrice, setLandPrice] = useState();
  const [eventDetails, setEventDetails] = useState("");

  const getLandDetails = async () => {
    let land = await myContract.methods.getLandDetails(landId).call();
    let owner = await myContract.methods.ownerOf(landId).call();

    if (owner.toUpperCase() === ethereum.selectedAddress.toUpperCase()) {
      setIsOwner(true);
    }

    setLandDocs(web3.utils.hexToUtf8(land.documentHash));
    setLandData(land);
  };

  const getEventDetails = async () => {
    myContract.getPastEvents("BidEvent",
      {
        filter: { landID: landId },
        fromBlock: 0,
        toBlock: "latest",
      }, async (err, events) => {
        let eventDetails = [];
        for (let i = 0; i < events.length; i++) {
          let newEvent = {
            key: i,
            bidder: events[i].returnValues[1],
            amount: events[i].returnValues[2],
          };
          eventDetails.unshift(newEvent);
        }
        setEventDetails(eventDetails);
      }
    );
  };

  const priceChangeHandler = (event) => {
    setLandPrice(event.target.value);
  };

  const bidSubmitHandler = async (event) => {
    await myContract.methods
      .bid(landId)
      .send({ from: ethereum.selectedAddress, value: landPrice });
  };

  const acceptBidSubmitHandler = async (event) => {
    await myContract.methods
    .acceptBid(landId)
    .send({ from: ethereum.selectedAddress });
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Tooltip title="Back to Marketplace">
              <IconButton
                size="large"
                color="inherit"
              >
                <NavLink to="/" ><ArrowBackIcon /></NavLink>
              </IconButton>
            </Tooltip>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              LAND MARKETPLACE
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Box
        sx={{
          paddingLeft: 15,
          paddingTop: 2,
          paddingBottom: 2,
          flexGrow: 1,
          maxWidth: "90%",
        }}
      >
        {landData != null && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <img src={process.env.PUBLIC_URL + "/landSale.png"} alt="A" />
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Typography align="left">
                  <b>Land ID: </b>
                  {landId}
                </Typography>
              </Item>
              <br />
              <Item>
                <Typography align="left">
                  <b>Survey No: </b>
                  {landData.surveyNo}
                </Typography>
              </Item>
              <br />
              <Item>
                <Typography align="left">
                  <b>District: </b>
                  {landData.district}
                </Typography>
              </Item>
              <br />
              <Item>
                <Typography align="left">
                  <b>Taluk: </b>
                  {landData.taluk}
                </Typography>
              </Item>
              <br />
              <Item>
                <Typography align="left">
                  <b>Village: </b>
                  {landData.village}
                </Typography>
              </Item>
              <br />
              <Item>
                <Typography align="left">
                  <b>Block No: </b>
                  {landData.blockNo}
                </Typography>
              </Item>
              <br />
              <Item>
                <Typography align="left">
                  <b>Area: </b>
                  {landData.area} Ares
                </Typography>
              </Item>
              <br />
              <Item>
                <Typography align="left">
                  <b>View Documents: </b>
                  <a href={landDocs} target="_blank" rel="noopener noreferrer">{landDocs}</a>
                </Typography>
              </Item>
              <br />
              <Item>
                <Typography align="left">
                  <b> Price (Wei): </b>
                  {landData.landValue}
                </Typography>
              </Item>
              <br />
            </Grid>
            {isOwner ?
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={acceptBidSubmitHandler}
                  sx={{ height: 40 }}
                  color="primary"
                >
                  Accept Bid
                </Button>
              </Grid> :
              <>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Bid Value"
                    helperText="Provide your bid value (should be greater than last bid)"
                    variant="outlined"
                    onChange={priceChangeHandler}
                    sx={{ width: "100%" }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    sx={{ height: 55 }}
                    onClick={bidSubmitHandler}
                    variant="contained"
                    color="primary"
                  >
                    Place Bid
                  </Button>
                </Grid>
              </>}
          </Grid>
        )}
        <Divider />
        <Table columns={columns} dataSource={eventDetails} />
      </Box>
    </div>
  );
}
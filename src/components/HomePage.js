import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MarketPlace from "./MarketPlace";
import { useHistory } from 'react-router-dom'

export default function HomePage(props) {
  const [auth, setAuth] = React.useState(false);

  const myContract = props.myContract;

  const history = useHistory();

  const redirectHandle = () => {
    history.push(`/register`);
  };

  const handleChange = async (event) => {
    const ethereum = window.ethereum;
    await ethereum.request({ method: "eth_requestAccounts" }).then(
      setAuth(event.target.checked)
    );    
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    color="default"
                    checked={auth}
                    onChange={handleChange}
                    aria-label="login switch"
                  />
                }
                label={auth ? "Logout" : "Login"}
              />
            </FormGroup>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              LAND MARKETPLACE
            </Typography>
            {auth && (
              <div className="Register">
                <Typography variant="h5" component="div" sx={{ paddingTop: 1 }}>
                  Register New Land
                </Typography>
                <IconButton size="large" color="inherit">
                  <AddBoxIcon onClick={redirectHandle} />
                </IconButton>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <MarketPlace myContract={myContract} />
      </Box>
    </div>
  );
}
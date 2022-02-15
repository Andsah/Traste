import React from "react";
import Header from "../components/Header";
import { Container, Box, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useNavigate } from "react-router-dom";
function MenuPage() {
  let navigate = useNavigate();
  const routeChange = () => {
    navigate("/factpage");
  };
  //bytte namn på branch
  return (
    <Container
      disableGutters={true}
     sx={{flex:1, display:'flex', flexDirection: 'column'}}
    >
      <Box
        sx={{
          backgroundColor: "#170055",
          color: "white",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={routeChange}
      >
        <Typography variant="h4">New Report</Typography>
        <AddCircleOutlineIcon sx={{ color: "white", fontSize: 60 }} />
      </Box>
      <Box
        sx={{
          backgroundColor: "#ae00fb",
          color: "white",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Show History</Typography>
        <MenuOpenIcon sx={{ color: "white", fontSize: 60 }} />
      </Box>
    </Container>
  );
}
export default MenuPage;

import React, { useState } from "react";
import MenuPage from "./screens/MenuPage";
import { Container, Snackbar, Alert } from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import ReportPage from "./screens/ReportPage";
import Header from "./components/Header";

import { Colors } from "./assets/Colors";

function App() {
  const history = useNavigate();
  const [open, setOpen] = useState();

  const handleClose = () => {
    setOpen(false);
    console.log("snackbar closed");
  };
  const openSnackBar = () => {
    setOpen(true);
  };
  function goBack() {
    history(-1);
  }

  return (
    <Container
      disableGutters={true}
      sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header goBackHandler={goBack} />

      <Snackbar
        open={open}
        onClose={handleClose}
        key={1}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "7vh" }}
      >
        <Alert
          severity="success"
          sx={{
            width: "100%",
            backgroundColor: Colors.trasteGreen,
            color: "#103849",
            fontSize: 18,
          }}
        >
          Report Sent!
        </Alert>
      </Snackbar>

      <Routes>
        <Route exact path="/" element={<MenuPage />} />
        <Route
          path="/reportpage"
          element={<ReportPage snackBarHandler={openSnackBar} />}
        />
      </Routes>
    </Container>
  );
}

export default App;

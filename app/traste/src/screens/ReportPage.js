import React, { useState, useEffect } from "react";
import {
  Typography,
  Stack,
  Container,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import MaterialField from "../components/MaterialField";
import { useForm, Controller } from "react-hook-form";
import Inputfield from "../components/Inputfield";
import Selection from "../components/Selection";
import { Colors } from "../assets/Colors";
import SendIcon from "@mui/icons-material/Send";

import MobileDatePicker from "@mui/lab/MobileDatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import axios from "axios";

const wasteData = { Wood: 0, Plastic: 0, Concrete: 0, Metal: 0, Other: 0 };

const binsizes = [
  {
    id: "0",
    label: "5",
  },
  {
    id: "1",
    label: "10",
  },
  {
    id: "2",
    label: "15",
  },
  {
    id: "3",
    label: "20",
  },
];
const sites = [
  {
    id: "0",
    label: "Linköping",
  },
  {
    id: "1",
    label: "Norrköping",
  },
  {
    id: "2",
    label: "Gustavsberg",
  },
  {
    id: "3",
    label: "Vetlanda",
  },
];

/*FactPage renders the report form for a waste report*/
function FactPage(props) {
  const [total, setTotal] = useState(0);
  const {
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      date: new Date(),
      docketNo: "",
      weight: "",
      binSize: "",
      site: "",
      ...wasteData,
    },
  });
  const all = watch(Object.keys(wasteData));

  async function getDataAxios() {
    const response = await axios.post('http://localhost:5001/traste-71a71/europe-west3/app/createfacility' , {
       adress: "lin2",
       name: "namn",
       facilityId: "Rasmus",
       location: "Glava, Arvika" 
    })
    .then(function (response) {
      console.log(response);
    })
  }


  useEffect(() => {
    var tmp = 0;
    all.forEach((item) => {
      if (!isNaN(parseInt(item))) {
        tmp += parseInt(item);
      }
    });
    setTotal(tmp);
  }, [all]);

  //fungerar inte för t.ex. 10e+12
  const onlyNumbers = (score) => !isNaN(parseFloat(score)) && isFinite(score);
  const onSubmit = (data) => {

    getDataAxios()
    console.log(data);

  }

  function renderWasteList() {
    var outputlist = [];
    for (let i = 0; i < Object.keys(wasteData).length; i += 2) {
      if (i + 1 >= Object.keys(wasteData).length) {
        outputlist.push(
          <Stack direction="row" key={i + "stack"}>
            <Controller
              name={Object.keys(wasteData)[i]}
              control={control}
              rules={{
                validate: onlyNumbers,
                max: { value: 100, message: "Too large of a number" },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <MaterialField
                  key={i}
                  label={Object.keys(wasteData)[i]}
                  onChange={onChange}
                  value={value}
                  error={error}
                />
              )}
            />
          </Stack>
        );
      } else {
        outputlist.push(
          <Stack direction="row" spacing={2} key={i + "stack"}>
            <Controller
              name={Object.keys(wasteData)[i]}
              control={control}
              rules={{
                validate: onlyNumbers,
                max: { value: 100, message: "Too large of a number" },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <MaterialField
                  key={i}
                  label={Object.keys(wasteData)[i]}
                  onChange={onChange}
                  value={value}
                  error={error}
                />
              )}
            />
            <Controller
              name={Object.keys(wasteData)[i + 1]}
              control={control}
              rules={{
                validate: onlyNumbers,
                max: { value: 100, message: "Too large of a number" },
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <MaterialField
                  key={i + 1}
                  label={Object.keys(wasteData)[i + 1]}
                  onChange={onChange}
                  value={value}
                  error={error}
                />
              )}
            />
          </Stack>
        );
      }
    }

    return (
      <Stack direction="column" spacing={2} sx={{ width: "90vw" }}>
        {outputlist}
      </Stack>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      
    >
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Controller
          name="date"
          control={control}
          rules={{ required: "Select a valid date" }}
          render={({ field: { onChange, value } }) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <MobileDatePicker
                label="Date"
                name="Date"
                value={value}
                autoOK
                minDate={new Date("2000-01-01T03:00:00")}
                maxDate={new Date()}
                onChange={onChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      marginTop: "15px",
                      backgroundColor: "rgba(255,255,255,0.3)",
                      width: "90vw",
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          )}
        />

        <Controller
          name="docketNo"
          control={control}
          rules={{ required: "Docket Number required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Inputfield
              label="Docket No."
              onChange={onChange}
              value={value}
              error={error}
            />
          )}
        />
        <Controller
          name="weight"
          control={control}
          rules={{
            required: "Enter a valid number",
            validate: onlyNumbers,
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Inputfield
              label="Weight"
              onChange={onChange}
              value={value}
              error={error}
              type="number"
            />
          )}
        />

        <Controller
          name="binSize"
          control={control}
          rules={{ required: "Select a bin size" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Selection
              label="Bin Size"
              data={binsizes}
              onChange={onChange}
              value={value}
              error={error}
            />
          )}
        />
        <Controller
          name="site"
          control={control}
          rules={{ required: "Select a site" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Selection
              label="Site"
              data={sites}
              onChange={onChange}
              value={value}
              error={error}
            />
          )}
        />
        <Typography
          variant="h3"
          sx={{ textAlign: "center", marginTop: "10px", marginBottom: "10px" }}
        >
          Waste Types
        </Typography>
        {renderWasteList()}
        <Stack
          direction="column"
          justifyContent="center"
          alignContent="stretch"
          sx={{ marginTop: "15px", width: "100vw", flexGrow: "2" }}
        >
          <Stack
            sx={{
              flex: "1",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-around",
              backgroundColor: Colors.trasteNavyBlue,
              color: "white",
              paddingTop: 1,
              paddingBottom: 1
            }}
            direction="row"
          >
            <Typography variant="h4">Waste total: </Typography>

            <Box sx={{ position: "relative", display: "inline-flex"}}>
              <CircularProgress
                variant="determinate"
                value={total > 100 ? 100 : total}
                size={60}
                thickness={5}
                sx={{ color: total > 100 ? "red" : Colors.trasteGreen }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  fontSize={16}
                  fontWeight="bold"
                  sx={{ color: "white" }}
                >
                  {`${Math.round(total)}%`}
                </Typography>
              </Box>
            </Box>
          </Stack>
          
        </Stack>
      </Container>
      
      <Button
            endIcon={
              <SendIcon
                sx={{ color: Colors.trasteNavyBlue, fontSize: "200px", width: 40, height: 40 }}
              />
            }
            disabled={total !== 100}
            type="submit"
            sx={{
              flex: "1",
              display: "flex",
              position: "sticky",
              bottom: 0,
              alignItems: "center",
              aligntContent: "stretch",
              justifyContent: "space-around",
              width: 1,
              zIndex: 2,
              backgroundColor:
                isValid && total === 100
                  ? Colors.trastePurple
                  : Colors.trasteDadada,
              borderRadius: "0",
              paddingTop: 1,
              paddingBottom: 1
            }}
          >
            <Typography variant="h4" sx={{ color: Colors.trasteNavyBlue }}>
              Send Report
            </Typography>
          </Button>
    </form>
  );
}
export default FactPage;

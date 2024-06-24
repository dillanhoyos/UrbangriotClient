import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [parentName, setParentName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = () => {
    if (step === 4) {
      // Submit the form or perform final actions
      onComplete({
        parentName,
        role,
        password,
      });
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Box textAlign="center" p={3}>
            <Typography variant="h4">Welcome to UrbanGriots!</Typography>
          </Box>
        );
      case 2:
        return (
          <Box textAlign="center" p={3}>
            <Typography variant="h6">Let's create a Parent Profile</Typography>
            <TextField
              label="Enter your name"
              variant="outlined"
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
        );
      case 3:
        return (
          <Box textAlign="center" p={3}>
            <Typography variant="h6">Select your Role</Typography>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Role"
              >
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="administrator">Administrator</MenuItem>
              </Select>
            </FormControl>
          </Box>
        );
      case 4:
        return (
          <Box textAlign="center" p={3}>
            <Typography variant="h6">Create a Password</Typography>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh", // Change from height to minHeight
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {renderStepContent()}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          
        >
          {step === 4 ? "Finish" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default Onboarding;

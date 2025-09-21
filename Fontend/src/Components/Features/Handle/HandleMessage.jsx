import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function HandleMessage({
  message,
  open,
  onClose,
  severity = "error",
}) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

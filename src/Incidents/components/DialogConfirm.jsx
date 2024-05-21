import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export const DialogConfirm = ({ open, onClose, title, contentText }) => {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {contentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={() => onClose(true)} color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

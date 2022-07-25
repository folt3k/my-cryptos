import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { MyCryptosData } from "../shared/models/data";
import { numberPipe } from "../shared";
import { useState } from "react";

type Props = {
  data: MyCryptosData;
  removeClicked: (id: string) => void;
  editClicked: (id: string) => void;
};

const AssetsList = ({ data, editClicked, removeClicked }: Props) => {
  const [removeItemId, setRemoveItemId] = useState<string | null>(null);
  const [isConfirmRemoveModalOpen, setIsConfirmRemoveModalOpen] =
    useState<boolean>(false);

  const onClickRemove = (id: string) => {
    setRemoveItemId(id);
    setIsConfirmRemoveModalOpen(true);
  };

  const onDiscardRemove = () => {
    setIsConfirmRemoveModalOpen(false);
    setRemoveItemId(null);
  };

  const onConfirmRemove = () => {
    setIsConfirmRemoveModalOpen(false);
    removeClicked(removeItemId as string);
    setRemoveItemId(null);
  };

  return (
    <>
      <div className="w-full max-w-full">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Kurs (USD)</TableCell>
                <TableCell>Ilość</TableCell>
                <TableCell>Wartość (USD)</TableCell>
                <TableCell>Wartość (PLN)</TableCell>
                <TableCell>Wartość (%)</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <div className="flex items-center gap-1">
                      <img
                        src={row.image}
                        alt={row.symbol}
                        width="18px"
                        height="18px"
                      />
                      {row.symbol.toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{numberPipe(row.price.usd)}</TableCell>
                  <TableCell>{numberPipe(row.amount)}</TableCell>
                  <TableCell>{numberPipe(row.total.usd)}</TableCell>
                  <TableCell>{numberPipe(row.total.pln)}</TableCell>
                  <TableCell>
                    {((row.total.usd / data.total.usd) * 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-nowrap">
                      <IconButton
                        className="cursor-pointer mr-2"
                        onClick={() => editClicked(row.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        className="cursor-pointer"
                        onClick={() => onClickRemove(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4}></TableCell>
                <TableCell className="font-bold">
                  {numberPipe(data.total.usd)}
                </TableCell>
                <TableCell className="font-bold">
                  {numberPipe(data.total.pln)}
                </TableCell>
                <TableCell className="font-bold" colSpan={2}>
                  100
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog maxWidth="sm" open={isConfirmRemoveModalOpen}>
        <DialogTitle>Czy na pewno chcesz usunąć ten asset?</DialogTitle>
        <DialogActions className="justify-center">
          <Button autoFocus onClick={onDiscardRemove}>
            Nie
          </Button>
          <Button variant="contained" onClick={onConfirmRemove}>
            Tak
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssetsList;

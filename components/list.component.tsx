import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MyCryptosData } from "../shared/models/data";
import Image from "next/image";

const MyCryptosList = ({ data }: { data: MyCryptosData }) => {
  return (
    <div style={{ width: "100%", maxWidth: "100%" }}>
      <TableContainer>
        <Table aria-label="simple table">
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
                  <Image
                    src={row.image}
                    alt={row.symbol}
                    width="20px"
                    height="20px"
                  />
                  {row.symbol.toUpperCase()}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.price.usd}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.total.usd}</TableCell>
                <TableCell>{row.total.pln}</TableCell>
                <TableCell>
                  {((row.total.usd / data.total.usd) * 100).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <EditIcon
                      style={{ cursor: "pointer", marginRight: "4px" }}
                    />
                    <DeleteIcon style={{ cursor: "pointer" }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4}></TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                {data.total.usd}
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                {data.total.pln}
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }} colSpan={2}>
                100
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MyCryptosList;

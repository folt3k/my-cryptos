import { Button } from "@mui/material";
import MyCryptosList from "../components/list.component";
import { getData } from "../shared/api";
import { MyCryptosData } from "../shared/models/data";

export const getServerSideProps = async () => {
  return {
    props: {
      data: await getData(),
    },
  };
};

const Home = ({ data }: { data: MyCryptosData }) => {
  console.log(data);

  return (
    <div className="main">
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginBottom: '1rem' }}>
        <Button variant="contained">Dodaj nowy</Button>
      </div>
      <MyCryptosList data={data}></MyCryptosList>
    </div>
  );
};

export default Home;

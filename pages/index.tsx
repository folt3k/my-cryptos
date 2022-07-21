import { Button } from "@mui/material";
import type { NextPage } from "next";
import MyCryptosList from "../components/list.component";
import api from "../shared/api";
import { MyCryptosData } from "../shared/models/data";

export const getServerSideProps = async () => {
  return {
    props: {
      data: await api.get("/data").then((res) => res.data),
    },
  };
};

const Home = ({ data }: { data: MyCryptosData }) => {
  console.log(data);

  return (
    <div className="main">
      <MyCryptosList></MyCryptosList>
    </div>
  );
};

export default Home;

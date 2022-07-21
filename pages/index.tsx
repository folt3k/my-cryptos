import { Button } from "@mui/material";
import { useState } from "react";
import AssetForm from "../components/form/form.component";
import AssetsList from "../components/list.component";
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
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const showForm = () => {
    setIsFormVisible(true);
  };

  const hideForm = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="main">
      <div className="flex justify-end items-end w-full mb-6 input-min-height">
        {isFormVisible && <AssetForm cancelled={hideForm} />}
        {!isFormVisible && (
          <Button variant="contained" onClick={showForm}>
            Dodaj nowy
          </Button>
        )}
      </div>
      <AssetsList data={data}></AssetsList>
    </div>
  );
};

export default Home;

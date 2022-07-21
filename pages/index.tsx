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

const Home = ({ data: initData }: { data: MyCryptosData }) => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [data, setData] = useState<MyCryptosData>(initData);

  const showForm = () => {
    setIsFormVisible(true);
  };

  const hideForm = () => {
    setIsFormVisible(false);
  };

  const onSaveNewAsset = () => {
    getData().then((data) => {
      setData(data);
    });
  };

  return (
    <div className="main">
      <div className="flex justify-end items-end w-full mb-6 input-min-height">
        {isFormVisible && (
          <AssetForm cancelled={hideForm} saved={onSaveNewAsset} />
        )}
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

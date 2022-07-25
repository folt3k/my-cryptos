import { Button } from "@mui/material";
import { useState } from "react";
import AssetForm from "../components/form/form.component";
import AssetsList from "../components/list.component";
import * as api from "../shared/api";
import { MyCryptoItem, MyCryptosData } from "../shared/models/data";

export const getServerSideProps = async () => {
  return {
    props: {
      data: await api.getData(),
    },
  };
};

const Home = ({ data: initData }: { data: MyCryptosData }) => {
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [data, setData] = useState<MyCryptosData>(initData);
  const [editItem, setEditItem] = useState<MyCryptoItem | null>(null);

  const showForm = () => {
    setIsFormVisible(true);
  };

  const hideForm = () => {
    setEditItem(null);
    setIsFormVisible(false);
  };

  const onSaveNewAsset = () => {
    setEditItem(null);
    loadData();
  };

  const removeAsset = (id: string) => {
    api.removeAsset(id).then(() => {
      loadData();
    });
  };

  const editAsset = (id: string) => {
    const asset = data.items.find((a) => a.id === id);

    if (asset) {
      setEditItem(asset);
      showForm();
    }
  };

  const loadData = () => {
    api.getData().then((data) => {
      setData(data);
    });
  };

  return (
    <div className="main">
      <div className="flex justify-end items-end w-full mb-6 input-min-height">
        {isFormVisible && (
          <AssetForm
            cancelled={hideForm}
            saved={onSaveNewAsset}
            editItem={editItem}
          />
        )}
        {!isFormVisible && (
          <Button variant="contained" onClick={showForm}>
            Dodaj nowy
          </Button>
        )}
      </div>
      <AssetsList
        data={data}
        removeClicked={removeAsset}
        editClicked={editAsset}
      ></AssetsList>
    </div>
  );
};

export default Home;

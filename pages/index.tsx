import { Button } from "@mui/material";
import { useState } from "react";
import AssetForm from "../components/assets/form/form.component";
import AssetsList from "../components/assets/list/list.component";
import DepositForm from "../components/summary/deposit-form/deposit-form.component";
import { Summary } from "../components/summary/summary.component";
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
  const [isAssetFormVisible, setIsAssetFormVisible] = useState<boolean>(false);
  const [isDepositFormVisible, setIsDepositFormVisible] =
    useState<boolean>(false);
  const [data, setData] = useState<MyCryptosData>(initData);
  const [editItem, setEditItem] = useState<MyCryptoItem | null>(null);

  const showAssetForm = () => {
    setIsAssetFormVisible(true);
  };

  const hideAssetForm = () => {
    setEditItem(null);
    setIsAssetFormVisible(false);
  };

  const showDepositForm = () => {
    setIsDepositFormVisible(true);
  };

  const hideDepositForm = () => {
    setIsDepositFormVisible(false);
  };

  const onSaveNewAsset = () => {
    setEditItem(null);
    loadData();
  };

  const onSaveDeposit = () => {
    hideDepositForm();
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
      showAssetForm();
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
        {isAssetFormVisible && (
          <AssetForm
            cancelled={hideAssetForm}
            saved={onSaveNewAsset}
            editItem={editItem}
          />
        )}
        {isDepositFormVisible && (
          <DepositForm
            cancelled={hideDepositForm}
            saved={onSaveDeposit}
            editValue={data.paid}
          />
        )}
        {!isAssetFormVisible && !isDepositFormVisible && (
          <>
            <Button
              className="mr-3"
              variant="contained"
              onClick={showDepositForm}
            >
              Zmień wkład
            </Button>
            <Button variant="contained" onClick={showAssetForm}>
              Dodaj nowy
            </Button>
          </>
        )}
      </div>
      <AssetsList
        data={data}
        removeClicked={removeAsset}
        editClicked={editAsset}
      ></AssetsList>
      <Summary {...data} />
    </div>
  );
};

export default Home;

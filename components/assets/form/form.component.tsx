import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { FormEvent, SyntheticEvent, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";

import { addAsset, getAssetsOptions, updateAsset } from "../../../shared/api";
import { Option } from "../../../shared/models/common";
import { MyCryptoItem } from "../../../shared/models/data";

type Props = {
  editItem?: MyCryptoItem | null;
  cancelled?: () => void;
  saved?: () => void;
};

const AssetForm = ({ editItem, cancelled, saved }: Props) => {
  const [assetsOptions, setAssetsOptions] = useState<Option[]>([]);
  const [loadingAssetsOptions, setLoadingAssetsOptions] =
    useState<boolean>(false);
  const [idValue, setIdValue] = useState<Option | null>(null);
  const [idInputValue, setIdInputValue] = useState("");
  const [amountValue, setAmountValue] = useState<string>("");
  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);

  const isEdit = !!editItem;
  const isFormValid = !!(idValue?.value && amountValue !== "" && +amountValue);

  const fetchAssets = useMemo(
    () =>
      debounce((value: string, cb: (data: Option[]) => void) => {
        getAssetsOptions(value).then((data) => {
          cb(data.items);
        });
      }, 1000),
    []
  );

  useEffect(() => {
    if (editItem) {
      setIdInputValue(editItem.id);
      setAmountValue(editItem.amount?.toString());
    }
  }, [editItem]);

  useEffect(() => {
    if (idInputValue === "" || idInputValue === idValue?.label) {
      setAssetsOptions(idValue ? [idValue] : []);
      return undefined;
    }

    setLoadingAssetsOptions(true);

    fetchAssets(idInputValue, (assets) => {
      let newOptions: Option[] = [];

      if (idValue) {
        newOptions = [idValue];
      }

      if (assets) {
        newOptions = [...newOptions, ...assets];
      }

      if (idInputValue && !idValue) {
        const option = newOptions.find((o) => o.value === idInputValue);

        if (option) {
          setIdValue(option);
        }
      }

      setAssetsOptions(newOptions);
      setLoadingAssetsOptions(false);
    });
  }, [idValue, idInputValue, fetchAssets]);

  const cancel = () => {
    clearForm();
    if (cancelled) {
      cancelled();
    }
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    setIsFormTouched(true);

    if (!isFormValid) {
      return;
    }

    const fn = isEdit ? updateAsset : addAsset;
    const values = {
      id: idValue?.value as string,
      amount: +amountValue,
    };

    clearForm();

    fn(values).then(() => {
      if (saved) {
        saved();
      }
    });
  };

  const clearForm = () => {
    setAssetsOptions([]);
    setIdInputValue("");
    setIdValue(null);
    setAmountValue("");
    setIsFormTouched(false);
  };

  return (
    <div className="flex flex-col flex-1">
      <form className="flex flex-1 justify-end gap-3 w-full" onSubmit={save}>
        <Autocomplete
          className="w-1/2"
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.label
          }
          filterOptions={(x) => x}
          options={assetsOptions}
          autoComplete
          includeInputInList
          loading={loadingAssetsOptions}
          filterSelectedOptions
          value={idValue}
          onChange={(_: SyntheticEvent, newValue: Option | null) => {
            setAssetsOptions(
              newValue ? [newValue, ...assetsOptions] : assetsOptions
            );
            setIdValue(newValue);
          }}
          onInputChange={(_, newInputValue) => {
            setIdInputValue(newInputValue);
          }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label="Wybierz kryptowalutę"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingAssetsOptions && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            );
          }}
        />
        <div className="flex w-1/2">
          <TextField
            value={amountValue}
            label="Ilość"
            type="number"
            onChange={(event) => {
              setAmountValue(event.target.value);
            }}
          />
          <div className="flex items-end ml-4">
            <Button className="mr-2" onClick={cancel}>
              Anuluj
            </Button>
            <Button variant="contained" color="success" type="submit">
              Zapisz
            </Button>
          </div>
        </div>
      </form>
      {isFormTouched && !isFormValid && (
        <div className="text-sm text-red-600 font-semibold mt-2">
          Wypełnij wszystkie wymagane pola.
        </div>
      )}
    </div>
  );
};

export default AssetForm;

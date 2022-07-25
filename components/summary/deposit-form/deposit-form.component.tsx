import { Button, TextField } from "@mui/material";
import { isNumber } from "lodash";
import { FormEvent, useEffect, useState } from "react";

import { updateDeposit } from "../../../shared/api";

type Props = {
  editValue?: number | null;
  saved?: () => void;
  cancelled?: () => void;
};

const DepositForm = ({ editValue, cancelled, saved }: Props) => {
  const [amountValue, setAmountValue] = useState<string | number>("");
  const [isFormTouched, setIsFormTouched] = useState<boolean>(false);
  

  const isFormValid = isNumber(+amountValue);

  useEffect(() => {
    setAmountValue(editValue as number);
  }, [editValue]);

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

    clearForm();

    updateDeposit(+amountValue).then(() => {
      if (saved) {
        saved();
      }
    });
  };

  const clearForm = () => {
    setAmountValue("");
    setIsFormTouched(false);
  };

  return (
    <div className="flex flex-col flex-1">
      <form className="flex flex-1 justify-end gap-3 w-full" onSubmit={save}>
        <div className="flex w-1/2">
          <TextField
            value={amountValue}
            label="Wartość wkładu"
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

export default DepositForm;

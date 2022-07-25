import { numberPipe } from "../../shared";
import { Currencies } from "../../shared/models/common";

type Props = {
  paid: number;
  total: Currencies;
  balance: Partial<Currencies>;
};

export const Summary = ({ paid, total, balance }: Props) => {
  return (
    <div className="w-full mt-8 text-gray-700">
      <div className="flex justify-end mb-2">
        <div className="font-semibold">Wpłacone:</div>
        <div className="w-[120px] text-right">{numberPipe(paid)} PLN</div>
      </div>
      <div className="flex justify-end mb-2">
        <div className="font-semibold">Suma:</div>
        <div className="w-[120px] text-right">{numberPipe(total.pln)} PLN</div>
      </div>
      <div className="flex justify-end text-lg">
        <div className="font-semibold">Bilans:</div>
        <div
          className={`w-[120px] text-right font-semibold ${
            (balance?.pln || 0) > 0 ? "text-green-700" : "text-red-600"
          }`}
        >
          {numberPipe(balance?.pln as number)} PLN
        </div>
      </div>
    </div>
  );
};

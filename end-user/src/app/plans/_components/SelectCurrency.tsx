type Currency = {
  id: number;
  code: string;
  symbol: string;
};

type Props = {
    selectedCurrency : Currency
    setSelectedCurrency : React.Dispatch<React.SetStateAction<any>>
    currencies : Currency[]
}

export default function SelectCurrency({currencies, selectedCurrency, setSelectedCurrency} : Props){
    return(
        <select
        className="px-4 py-2 border rounded-md border-primary/20 shadow-sm mb-8 self-end text-sm md:text-base"
        value={selectedCurrency.code}
        onChange={(e) => {
          const newCurrency = currencies.find((cur) => cur.code === e.target.value);
          if (newCurrency) setSelectedCurrency(newCurrency);
        }}
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code}
          </option>
        ))}
      </select>
    )
}
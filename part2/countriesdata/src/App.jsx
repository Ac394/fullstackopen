import { useState, useEffect } from "react";
import countryService from "./services/countries";
import Content from "./components/Content";

const App = () => {
  const [allCountries, setAllCountries] = useState(null);
  const [countries, setCountries] = useState(null);
  const [newCountry, setNewCountry] = useState("");

  useEffect(() => {
    countryService.getAllCountries().then((initialCountries) => {
      setAllCountries(initialCountries);
    });
  }, []);

  useEffect(() => {
    if (!allCountries) return;
    const regex = new RegExp(newCountry, "i");
    const filteredCountries = allCountries.filter((country) =>
      country.name.common.match(regex)
    );
    setCountries(filteredCountries);
  }, [newCountry]);

  const handleCountryChange = (event) => setNewCountry(event.target.value);

  return (
    <div>
      <p>
        find countries
        <input value={newCountry} onChange={handleCountryChange} />
      </p>
      <Content countries={countries} setNewCountry={setNewCountry} />
    </div>
  );
};

export default App;

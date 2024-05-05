import Country from "./Country";

const Content = ({ countries, setNewCountry }) => {
  if (!countries) {
    return null;
  }

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />;
  }

  if (countries.length <= 10)
    return (
      <div>
        {countries.map((country, i) => (
          <p key={i}>
            {country.name.common}
            <button onClick={() => setNewCountry(country.name.common)}>
              show
            </button>
          </p>
        ))}
      </div>
    );
};

export default Content;

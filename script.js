const body = document.querySelector("body");
const header = document.querySelector("header");
const themeBtn = document.querySelector(".theme-switcher");
const BackBtn = () => document.querySelector(".back-button");
const themeIcon = document.querySelector(".theme-switcher__img");
const searchIcon = document.querySelector(".filter__searchIcon");
const arrowIcon = () => document.querySelector(".arrow-icon");
const searchInput = document.querySelector(".filter__search");
const selectMenu = document.querySelector("#filter__selectMenu");
const filterSection = document.querySelector(".filter");
const countriesSection = document.querySelector(".countries");
const countriesLinks = () => document.querySelectorAll(".country-link");

let searchValue = "";
let selectedOption = "all region";
const allCountriesURL = "https://restcountries.com/v3.1/all";

const themeToggle = () => {
  body.classList.toggle("dark");
  const arrow = arrowIcon();
  if (body.classList.contains("dark")) {
    themeIcon.src = "./assets/moon-regular-white.svg";
    if (arrow) arrow.src = "./assets/arrow-left-white.svg";
  } else {
    themeIcon.src = "./assets/moon-regular-dark.svg";
    if (arrow) arrow.src = "./assets/arrow-left-dark.svg";
  }
};

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error in fetching data");
    return await response.json();
  } catch (error) {
    console.error("hampozo");
    countriesSection.innerHTML = `<p class="error">Hmmm… can't reach this page</p>`;
    return false;
  }
};

const createCountryCard = ({
  flags,
  name,
  population,
  region,
  capital,
  cca2,
}) => `
<a class="country-link" id=${cca2}>
    <li class="countries__card">
    <div class="countries__img-wrapper" >
              <img
                src="${flags?.svg || "https://placehold.co/400"}"
                alt=""
                class="countries__img"
              />
              </div>
              <div class="countries__infoWrapper">
                <span class="countries__name">${name.common}</span>
                <div class="countries__data">
                  <p>
                    <span class="countries__info">Population:</span>
                    ${population.toLocaleString()}
                  </p>
                  <p>
                    <span class="countries__info">Region:</span>
                    ${region}
                  </p>
                  <p>
                    <span class="countries__info">Capital:</span>
                    ${capital || "N/A"}
                  </p>
                </div>
              </div>
            </li>
</a>
    `;

const createCountryPage = ({
  flags,
  name: { common, nativeName },
  population,
  region,
  capital,
  subregion,
  tld,
  currencies: { SHP },
  languages,
}) => `
          <div class="country-page">
            <button class="back-button">
              <img
                src="./assets/arrow-left-dark.svg"
                alt="left arrow icon"
                class="arrow-icon"
              />
              Back
            </button>
            <div class="country-page__Container">
              <img
                src="${flags?.svg || "https://placehold.co/400"}"
                alt=""
                class="country-page__img"
              />
              <div class="country-page__dataContainer">
                <h2 class="country-page__name">${common}</h2>
                <div>
                  <div class="country-page__data-sectionOne">
                    <p>
                      <span class="country-page__span">Native Name:</span
                      >${nativeName?.common || "N/A"}
                    </p>
                    <p>
                      <span class="country-page__span">Population:</span
                      >${population.toLocaleString()}
                    </p>
                    <p><span class="country-page__span">Region:</span>${region}</p>
                    <p>
                      <span class="country-page__span">Sub Region:</span>${subregion}
                      Europe
                    </p>
                    <p>
                      <span class="country-page__span">Capital:</span>${
                        capital || "N/A"
                      }
                    </p>
                  </div>
                  <div class="country-page__data-sectionTwo">
                    <p>
                      <span class="country-page__span">Top Level Domain:</span
                      >${tld}
                    </p>
                    <p>
                      <span class="country-page__span">Currencies:</span>${SHP}
                    </p>
                    <p>
                      <span class="country-page__span">Languages:</span>${Object.entries(
                        languages
                      ).join(",")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>`;

const getFilteredCountries = (countries, searchValue, selectedOption) => {
  const trimmedSearch = searchValue.trim().toLowerCase();

  const filteredCountries = trimmedSearch
    ? countries.filter((country) =>
        country.name.common.toLowerCase().startsWith(trimmedSearch)
      )
    : countries;

  if (selectedOption === "all region") return filteredCountries;

  return filteredCountries.filter(
    (country) => country.region.toLowerCase() === selectedOption
  );
};

const moveToCountryPage = (country, filteredCountries) => {
  country.addEventListener("click", (e) => {
    e.preventDefault();
    filterSection.classList.add("hidden");

    const selectedCountry = filteredCountries.filter(
      (element) => element.cca2 === country.id
    );

    countriesSection.innerHTML = createCountryPage(selectedCountry[0]);
  });
};

const renderCountries = async (
  countriesSection,
  url,
  searchValue,
  selectedOption
) => {
  const countries = await fetchData(url);
  console.log(countries);

  if (countries) {
    const filteredCountries = getFilteredCountries(
      countries,
      searchValue,
      selectedOption
    );

    const countryCards = filteredCountries.map(createCountryCard).join("");

    countriesSection.innerHTML = `<ul class="countries-list">${countryCards}</ul>`;

    countriesLinks().forEach((country) =>
      moveToCountryPage(country, filteredCountries)
    );
  }
};

searchInput.addEventListener("input", (event) => {
  searchValue = event.target.value;
  renderCountries(
    countriesSection,
    allCountriesURL,
    searchValue,
    selectedOption
  );
});

selectMenu.addEventListener("change", (e) => {
  selectedOption = e.target.value;
  renderCountries(
    countriesSection,
    allCountriesURL,
    searchValue,
    selectedOption
  );
});

themeBtn.addEventListener("click", themeToggle);

countriesSection.addEventListener("click", (event) => {
  if (event.target.classList.contains("back-button")) {
    filterSection.classList.remove("hidden");
    renderCountries(
      countriesSection,
      allCountriesURL,
      searchValue,
      selectedOption
    );
  }
});

renderCountries(countriesSection, allCountriesURL, searchValue, selectedOption);

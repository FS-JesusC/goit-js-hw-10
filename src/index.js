import './css/styles.css';

/**
 * Escriba la función fetchCountries(name) a cual hace una petición HTTP a ресурс name y devuelve promise
 * con el array de los países, el resultado de la consulta. Colóquelo en un archivo separado fetchCountries.js y haga una exportación con nombre.
 */
import { fetchCountries } from './fetchCountries';
/**
 * Debe aplicar un truco Debounce en el manejador de eventos y hacer una petición HTTP `300ms
 * después de que el usuario haya dejado de escribir. Use el paquete lodash.debounce.
 */
let debounce = require('lodash.debounce');
/**
 * Para las notificaciones use la biblioteca notiflix
 */
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
/**
 * Selector para el campo donde se va a introducior el nombre del país a buscar por el usuario
 */
const inputSearch = document.querySelector('#search-box');
/**
 * Selector para mostrar una lista de los países encontrados
 */
const countryList = document.querySelector('.country-list');
/**
 * Selector para mostrar una diseño de tarjeta con los datos del pais encontrado
 */
const countryInfo = document.querySelector('.country-info');

/**
 * Funcion para realizar la busqueda de paises al ser llamada con el evento input
 * Desinfecta la secuencia introducida usando el método trim(), esto resolverá el problema si el
 * ámbito de entrada sólo tiene espacios o si tiene espacios al principio y al final de la secuencia.
 */
const searchCountry = debounce(event => {
  let country = event.target.value.trim();
  if(country===''){
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
  }
  if (country !== '') {
    console.log(fetchCountries(country));
    fetchCountries(country)
      .then(country => {
        renderListOrCard(country);
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        countryInfo.innerHTML = '';
        countryList.innerHTML = '';
      });
  }
}, DEBOUNCE_DELAY);

/**
 * Funcion para selecionar el marcado de la lista ó tarjeta de acuerdo a la longitud
 * de la cadena de busqueda dle pais country
 * @param {*} country
 */
const renderListOrCard = country => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
  if (country.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  }
  if (country.length >= 2 && country.length <= 10) {
    renderListCountry(country);
    console.log(country);
  }
  if (country.length < 2) {
    renderCardCountry(country);
  }
};

/**
 * Funcion para realizar el marcado de la lista de paises
 * @param {*} country
 */
const renderListCountry = country => {
  const markup = country
    .map(({ name, flags }) => {
      return `<li class="country__item">
     <img class="country__img" src="${flags.svg}" alt="Flag of ${name.official}">
     <h3 class="country__name">${name.official}</h3>
     </li>`;
    })
    .join('');
  countryList.insertAdjacentHTML('beforeend', markup);
};

/**
 * Funcion para realizar el marcado de la tarjeta del pais
 * @param {*} country
 */
const renderCardCountry = country => {
  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `
      <div class="country__name-container">
      <img class="country__img" src="${flags.svg}" alt="Flag of ${
        name.official
      }">
     <h3 class="country__name-card">${name.official}</h3>
      </div>
     <p class="country__capital"><span class="country__title">Capital:</span> ${capital}</p>
     <p class="country__population"><span class="country__title">Population:</span> ${population}</p>
     <p class="country__languages"><span class="country__title">Languages:</span> ${Object.values(languages)}</p>
     `;
    })
    .join('');
  countryInfo.insertAdjacentHTML('beforeend', markup);
};

/**
 * Captura el evento input para realizar la busqueda del pais/paises
 */
inputSearch.addEventListener('input', searchCountry);

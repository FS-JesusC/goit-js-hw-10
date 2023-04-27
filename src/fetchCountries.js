
/**
 * Escriba la función fetchCountries(name) a cual hace una petición HTTP a ресурс name y
 * devuelve promise con el array de los países, el resultado de la consulta. Colóquelo en un
 * archivo separado fetchCountries.js y haga una exportación con nombre.
 * @param {*} name Nombre del pais
 * @returns Array de los paises
 */
export function fetchCountries(name){
  return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
  .then(
    (response) => {
      if (!response.ok){
        throw new Error(response.status);
      }
      return response.json();
    }
  );
}
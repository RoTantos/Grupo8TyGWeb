var tomId, generos, token;
const bearerToken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzc0Yzk4ZmFlYzQ1YjZjYmZmZGU2YmNjYjVjZmNmNSIsInN1YiI6IjY2NmM1YWE1MzM4YzQwZTQ2OTI0YWVkNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O62_GCm2m1-gc4JhRpN2jskJecM2LTeUqL7gSOXkcoU';
const urlGenre = 'https://api.themoviedb.org/3/genre/movie/list?language=es'
const urlTomCruise = 'https://api.themoviedb.org/3/search/person?query=Tom%20Cruise&include_adult=false&language=en-US&page=1'
const urlMoviesTomCruise = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es&page=1&sort_by=popularity.desc&with_people='
const BASE_URL = 'https://gestionweb.frlp.utn.edu.ar';
const bearerTokenStrapi = 'Bearer 099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea'

//THE MOVIE DB APIS

//obtengo todos los generos, con id y descripcion
async function getGenre() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: bearerToken
    }
  };
  
  data = await fetch(urlGenre, options)
    .then(response => response.json())
    .catch(err => console.error(err)); 

  generos = data.genres
}

//obtengo el id de Tom Cruise
async function getTomCruise(){
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: bearerToken
    }
  };
  
  data = await fetch(urlTomCruise, options)
    .then(response => response.json())
    .catch(err => console.error(err));  

  tomId = data.results[0].id
}

//obtengo todas las peliculas en donde trabajo Tom Cruise
async function getMovies() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: bearerToken
    }
  };
  
  data = await fetch(urlMoviesTomCruise + tomId, options)
    .then(response => response.json())
    .catch(err => console.error(err));

  return data.results.slice(0,10) //tomo solo 10 peliculas
}

//STRAPI

//obtengo los datos de TheMovieBD y guardo las peliculas en Strapi
async function getData(){
  await getTomCruise();
  console.log(tomId)
  await getGenre();
  console.log(generos)
  peliculasAPI = await getMovies();
  console.log(peliculasAPI)

  await savePeliculasStrapi(peliculasAPI)
}

//guardo las peliculas en Strapi
async function savePeliculasStrapi(peliculas) {
  peliculasGuardadas = await getPeliculasStrapi()
  if (peliculasGuardadas.data.data !== null) {
    await eliminarPeliculasStrapi()
  }
  
  for (const pelicula of peliculas) {
    const generosNombre = getGeneroNombre(pelicula, generos);
    const data = {
        titulo: pelicula.title,
        sinopsis: pelicula.overview,
        cantVotos: pelicula.vote_count,
        promVotos: pelicula.vote_average,
        genero: generosNombre,
        imagen: `${pelicula.poster_path}`
    };

    const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: bearerTokenStrapi
      },
      body: JSON.stringify({ data })
    };
  
    try {
        const response = await fetch('https://gestionweb.frlp.utn.edu.ar/api/g8-peliculas', options);
        if (!response.ok) {
            throw new Error('Error al guardar los datos:', response.statusText);
        }
    } catch (error) {
        console.error(error);
    }
  }  
}

//elimino todas las peliculas de Strapi que cada vez que se guarden se eliminen los ingresos previos
async function eliminarPeliculasStrapi() {
  try {
      const peliculasStrapi = await getPeliculasStrapi();
      const requests = peliculasStrapi.data.map(pelicula =>
          fetch(`https://gestionweb.frlp.utn.edu.ar/api/g8-peliculas/${pelicula.id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': bearerTokenStrapi
              }
          })
      );
      // Esperar a que todas las solicitudes DELETE se completen
      await Promise.all(requests);

      console.log('Peliculas borradas correctamente en Strapi');
  } catch (error) {
      console.error('Error al borrar películas:', error);
  }
}

//obtengo un array con los nombres de los generos que tiene una pelicula
function getGeneroNombre(pelicula, generos) {
  if (!pelicula.genre_ids || !Array.isArray(pelicula.genre_ids)) {
    return 'Género no especificado';
  }

  const nombresGeneros = pelicula.genre_ids
    .map(genreId => {
      const genero = generos.find(g => g.id === genreId);
      return genero ? genero.name : null;
    })
    .filter(name => name !== null);

  const resultado = nombresGeneros.join(' ');

  console.log(resultado);
  return resultado || 'Género no especificado';
}

//obtengo las peliculas desde Strapi
async function getPeliculasStrapi() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: bearerTokenStrapi
    }
  };
  
  data = await fetch('https://gestionweb.frlp.utn.edu.ar/api/g8-peliculas', options)
    .then(response => response.json())
    .catch(err => console.error(err)); 
  console.log(data.data);

  return data
}

//visualizo en la pagina las peliculas obtenidas desde Strapi
async function visualizePeliculasStrapi() {
  const peliculasObtenidas = await getPeliculasStrapi()
  
  const peliculasContainer = document.getElementById('peliculas');
  
  peliculasObtenidas.data.forEach(pelicula => {
    console.log(pelicula.attributes)
    const peliculaDiv = document.createElement('div');
    peliculaDiv.classList.add('pelicula');
  
    peliculaDiv.innerHTML = `
      <h2 id='tituloPelicula'>${pelicula.attributes.titulo}</h2>
      <p>${pelicula.attributes.sinopsis}</p>
      <p>Votos: ${pelicula.attributes.cantVotos} | Promedio: ${pelicula.attributes.promVotos}</p>
      <p>Género: ${pelicula.attributes.genero}</p>
      <img src="https://image.tmdb.org/t/p/w500${pelicula.attributes.imagen}" alt="Poster de la película">
      `;

    peliculasContainer.appendChild(peliculaDiv);
  });
}
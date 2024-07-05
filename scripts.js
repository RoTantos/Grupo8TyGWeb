var tomId, generos, peliculas, token;
const bearerToken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzc0Yzk4ZmFlYzQ1YjZjYmZmZGU2YmNjYjVjZmNmNSIsInN1YiI6IjY2NmM1YWE1MzM4YzQwZTQ2OTI0YWVkNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O62_GCm2m1-gc4JhRpN2jskJecM2LTeUqL7gSOXkcoU';
const urlGenre = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
const urlTomCruise = 'https://api.themoviedb.org/3/search/person?query=Tom%20Cruise&include_adult=false&language=en-US&page=1'
const urlMoviesTomCruise = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_people='
const BASE_URL = 'https://gestionweb.frlp.utn.edu.ar';

//THE MOVIE DB APIS
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

    peliculas = data.results.slice(0,10)
}

//CARGA DE DATOS
async function getData(){
  await getTomCruise();
  console.log(tomId)
  await getGenre();
  console.log(generos)
  await getMovies();
  console.log(peliculas)

  await saveDataStrapi()
}

//guardo en strapi los datos
async function saveDataStrapi(){
  peliculas.forEach(pelicula => {
    app.createPelicula(pelicula)
  });
}

var app = new Vue({
  el: '#app',
  data: {
      peliculas: [],
      pelicula: {
        titulo: '',
        sinopsis:'',
        cantVotos: 0,
        promVotos: 0.0,
        genero: []
      }
  },
  methods: {
      getPeliculas() {
          axios.get('https://gestionweb.frlp.utn.edu.ar/api/g8-peliculas')
              .then(response => {
                  this.peliculas = response.data.data;
              });
      },
      createPelicula(pelicula) {
        var gen = getGeneroNombre(pelicula, generos)
        let data = {
              titulo: pelicula.title,
              sinopsis: pelicula.overview,
              cantVotos: pelicula.vote_count,
              promVotos: pelicula.vote_average,
              genero: gen,
              imagen: pelicula.poster_path
        };
        console.log(data)
          axios.post('https://gestionweb.frlp.utn.edu.ar/api/g8-peliculas', { data: data })
              .then(response => {
                  this.getPeliculas();

                  this.pelicula.titulo = ''; 
                  this.pelicula.sinopsis = '';
                  this.pelicula.cantVotos = 0;
                  this.pelicula.promVotos = 0.0;
                  this.pelicula.genero = '';
              });
      }
  },
  mounted() {
      axios.defaults.headers = {
          Authorization: 'Bearer 099da4cc6cbb36bf7af8de6f1f241f8c81e49fce15709c4cfcae1313090fa2c1ac8703b0179863b4eb2739ea65ae435e90999adb870d49f9f94dcadd88999763119edca01a6b34c25be92a80ed30db1bcacb20df40e4e7f45542bd501f059201ad578c18a11e4f5cd592cb25d6c31a054409caa99f11b6d2391440e9c72611ea'
      };
  }
});

function getGeneroNombre(pelicula, generos){
  var aux = ''
  for (let i = 0; i < pelicula.genre_ids.length; i++){
    for (let j = 0; j < generos.length; j++){
      if (pelicula.genre_ids[i] === generos[j].id){
      aux = aux + generos[j].name + ' ' 
      }
    }
  }
  console.log(aux)
  return aux
};
var tomId, generos, peliculas;
const bearerToken = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNzc0Yzk4ZmFlYzQ1YjZjYmZmZGU2YmNjYjVjZmNmNSIsInN1YiI6IjY2NmM1YWE1MzM4YzQwZTQ2OTI0YWVkNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O62_GCm2m1-gc4JhRpN2jskJecM2LTeUqL7gSOXkcoU';
const urlGenre = 'https://api.themoviedb.org/3/genre/movie/list?language=en'
const urlTomCruise = 'https://api.themoviedb.org/3/search/person?query=Tom%20Cruise&include_adult=false&language=en-US&page=1'
const urlMoviesTomCruise = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_people='

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

async function getData(){
  await getTomCruise();
  console.log(tomId)
  await getGenre();
  console.log(generos)
  await getMovies();
  console.log(peliculas)
}

async function visualizeData() {
}
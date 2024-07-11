# Grupo 8 - TyGWeb
## Proyecto: Recuperación y Visualización de Películas de Tom Cruise

**Trabajo práctico N° 2**

**Asignatura: Tecnología y gestión web**<br>
**Año: 2024**<br>
**Comisión: S31**<br>
**Integrantes:**<br>

- Tantos, Rocio
- Pianelli, Felipe
- Laure, Valentino
- Gomez, Facundo Adrian

Este proyecto consiste en una página web que recupera y visualiza las 10 películas más vistas de Tom Cruise utilizando la API de TheMovieDB. Los datos se almacenan en un repositorio de Strapi y se visualizan en la página junto con un gráfico de torta que muestra el promedio y total de votos de cada película.

## Características

- **Cargar Datos API**: Utiliza el botón "Cargar Datos API" para recuperar las 10 películas más vistas de Tom Cruise desde TheMovieDB y subir los datos al repositorio de Strapi de nuestro grupo.
- **Visualizar Datos**: Utiliza el botón "Visualizar Datos" para recuperar los datos almacenados en Strapi y mostrarlos en la página web. Los datos que se muestran para cada pelicula son: *titulo*, *sinopsis*, *cantidad de votos*, *promedio de votos*, *genero/s* y *poster de la pelicula*
- **Gráfico de Torta**: El botón "Visualizar Datos" también genera un gráfico de torta que muestra el promedio y total de votos de cada película.

## TheMovieDB: Endpoints utilizados
Para obtener los generos de todas las peliculas (con id y name)
```
https://api.themoviedb.org/3/genre/movie/list?language=es 
```

Para obtener el ID de Tom Cruise:
```
https://api.themoviedb.org/3/search/person?query=Tom%20Cruise&include_adult=false&language=en-US&page=1
```

Para obtener todas las peliculas donde participo Tom Cruise:
```
https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es&page=1&sort_by=popularity.desc&with_people=
```
window.onload = function() {
    var x = Math.floor(Math.random()*3);
    texto = document.getElementById("aleatorio");

    switch(x) {
        case 0:
            texto.innerHTML = '<p>Hola! Es un gusto verte aqui</p>';
            texto.style.cssText = `
                font-family: 'Rubik Mono One', sans-serif;
                color: #F6D0B2;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                font-size: 3em;
                transition: color 0.3s ease, text-shadow 0.3s ease;
            `;
            break;
        case 1:
            texto.innerHTML = '<p>Bienvenido a mi trabajo!</p>';
            texto.style.cssText = `
            font-family: 'Bad Script', cursive;
            color: #638475;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            font-size: 3em;
            transition: color 0.3s ease, text-shadow 0.3s ease;
            `;
            break;
        case 2:
            texto.innerHTML = '<p>Hola! Gracias por tu visita</p>';
            texto.style.cssText = `
            font-family: 'Pacifico', cursive;
            color: #5B507A;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            font-size: 3em;
            transition: color 0.3s ease, text-shadow 0.3s ease;
            `;
            break;
    }
}

async function getData() {
    fetch("https://type.fit/api/quotes")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      if (data && data.length > 0) {
        const parrafoQuote = document.getElementById("quote");

        let max = 14; 
        let i = Math.floor(Math.random() * max);
        console.log(i);

        parrafoQuote.textContent = data[i].text;
    }
    });
}

async function visualizeData() {
    fetch("https://api.restful-api.dev/objects")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      if (data && data.length > 0) {
        const parrafoObject = document.getElementById("object");
        
        let max = 14; 
        let i = Math.floor(Math.random() * max);
        console.log(i);

        parrafoObject.textContent = 'Tu necesitas un: ' + data[i].name;
    }
    });
}
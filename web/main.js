const mintButton = document.getElementById('mint-button');

const message = {
    Nombre: 'Ramiro'
}

mintButton.addEventListener('click', (e) => {
    fetch('http://localhost:3001/', {
        method: 'POST',
        body: JSON.stringify(message),
    })
    .then(x => console.log("Enviado"))
});

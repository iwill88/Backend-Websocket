const socket = io(); // emitimos el evento "connection" que el socket server esta escuchando

socket.on('products', (database) => {

    const emptyHTML = `<div class="d-flex justify-content-center align-items-center py-4">
    <div class="text-light bg-danger d-flex justify-content-center align-items-center" style="height: 80px; width: 90%;">
    <p>No se encontraron productos</p> 
    </div>
    </div>`
    const databaseHTML = 
    
    `<table class="table table-dark table-striped">
        <thead >
            <th scope="col">Nombre</th>
            <th scope="col">Precio</th>
            <th scope="col">Foto</th>
        </thead>
        <tbody>`
    +  
    database
      .map((item) => 
        `<tr>
        <td class="align-middle">${item.title}</td>
        <td class="align-middle">${item.price}</td>
        <td class="align-middle"><img src=${item.thumbnail} alt="imagen producto" width="60"></td>
        </tr>`
      ).join('');
      +
      `</tbody>
    </table>`
      

      console.log(database);
      
      if (!database.length) {
        document.getElementById('products').innerHTML = emptyHTML;
      } else {
        document.getElementById('products').innerHTML = databaseHTML;
      }

     
  });








socket.on('conversation', (messages) => {
  const messagesHtml = messages
    .map((message) => `
      <div>
        <strong class="text-primary">${message.author} </strong>
        <span class="text-danger">${message.date}: </span>
        <em class="text-success">${message.text}</em>
       
      </div>
    `)
    .join(' ');

  document.getElementById('messages').innerHTML = messagesHtml;
});



const form = document.getElementById('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  let d = new Date();

  

  let curr_day = String(d.getDate()).padStart(2, '0');
  let curr_month = String(d.getMonth()).padStart(2, '0');
  let curr_year = String(d.getFullYear()).padStart(2, '0');
  let curr_hour = String(d.getHours()).padStart(2, '0');
  let curr_minute = String(d.getMinutes()).padStart(2, '0');
  let curr_sec = String(d.getSeconds()).padStart(2, '0');
  
  const newDate = curr_day + "/" + curr_month + "/" + curr_year + " " + curr_hour + ":" + curr_minute + ":" + curr_sec;

  
  const author = document.getElementById('author').value;
  const text = document.getElementById('text').value;
  const date = "[" + newDate + "]"
  const message = {  author,  date, text}
  socket.emit('new-message', message);
});




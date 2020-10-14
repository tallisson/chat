/* 
 * Bibliotecas Node JS utilizadas:
 * 1) Express -> criar um servidor web (http) e o servidor do chat
 * 2) Path -> diretórios do projeto
 */
const express = require('express');
const path = require('path');

// Criamos o servidor http
const app = express();
const server = require('http').createServer(app);
// Definindo o servidor do chat (WSS). Baseado em WebSocket (WSS)
const io = require('socket.io')(server);

// Configurando a pasta onde vão ser encontrados os arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
// Configurar que estamos construindo telas em HTML
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Definindo a porta onde roda o servidor
const port = process.env.PORT || 8080;
// Lista (Array) de mensagens do chat
let mensagens = [];

// Definindo as rotas (urls) acessíveis no servidor
app.use('/', function(req, res) {
  res.render('index.html');
});

// Responsável por gerenciar as conexões dos clientes
io.on('connection', function(socket) {
  console.log('Socket conectado: ' + socket.id);

  socket.emit('mensagensAnteriores', mensagens);

  socket.on('enviarMensagem', function(dados) {
    mensagens.push(dados);
    socket.broadcast.emit('mensagemRecebida', dados);
  });
});

server.listen(port, function() {
  console.log('Server está sendo executado na porta ' + port);
});
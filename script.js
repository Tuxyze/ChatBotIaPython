let historico = [];

function sendMessage(){
    let texto = document.getElementById("userInput").value;
    if (texto === "") return;
    let div = document.createElement("div");
    div.textContent = texto;
    div.className = 'user-msg';
    document.getElementById("mensagem").appendChild(div);
    chamarAPI(texto);
    document.getElementById("userInput").value = "";
}

async function chamarAPI(texto) {
    historico.push({ role: 'user', content: texto });
    
      //  adiciona o "digitando" antes do fetch(eu acho)
    let digitando = document.createElement("div");
    digitando.textContent = "Digitando...";
    digitando.className = 'bot-msg';
    digitando.id = 'digitando';
    document.getElementById("mensagem").appendChild(digitando);

     let aviso = setTimeout(() => {
        digitando.textContent = "Aguarde, o servidor está iniciando... (pode demorar até 50 segundos)";
    }, 5000);

    const response = await fetch('http://127.0.0.1:3000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensagem: historico })  //  manda o histórico inteiro
    });

    const data = await response.json();
    const textoResposta = data.resposta;

    historico.push({ role: 'assistant', content: textoResposta });  //  salva a resposta

    //  remove o "digitando" quando chegar a resposta do minino jovem aprendiz
    document.getElementById("digitando").remove();

    let divBot = document.createElement("div");
   divBot.innerHTML = textoResposta
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')      //  negrito com __
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')                // itálico com _
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
    divBot.className = 'bot-msg';
    document.getElementById("mensagem").appendChild(divBot);
}

// bota o de enviar mensagem com enter tlgdd
document.getElementById("userInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") sendMessage();
});
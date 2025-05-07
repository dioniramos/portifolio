function toggleMenu() {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('active');
}

// Fecha o menu ao clicar em um link
document.querySelectorAll('#navbar a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.getElementById('navbar');
        if (nav.classList.contains('active')) {
            nav.classList.remove('active'); // Fecha o menu
        }
    });
});

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    emailjs.init('XdMX4UNam9_CcIkzJ'); // Substitua por seu User ID do EmailJS

    emailjs.sendForm('service_4tw0k87', 'template_hq0zmhj', this)
        .then(function () {
            alert('Mensagem enviada com sucesso!');
        }, function (error) {
            alert('Erro ao enviar mensagem: ' + error);
        });
});

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Texto copiado para a área de transferência!');
    }).catch(err => {
        alert('Erro ao copiar texto: ' + err);
    });
}

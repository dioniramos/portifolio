function toggleMenu() {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('active');
}

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

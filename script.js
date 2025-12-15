const introText = "Hey 👋\nJ’ai codé quelque chose juste pour toi...\nPrête ? 😊";
let index = 0;

function typeIntro() {
    if (index < introText.length) {
        document.getElementById("intro").innerText += introText.charAt(index);
        index++;
        setTimeout(typeIntro, 50);
    } else {
        document.getElementById("choices").classList.remove("hidden");
    }
}

typeIntro();

function showMessage(type) {
    const messageEl = document.getElementById("message");
    let text = "";

    if (type === "sincere") {
        text = `
🎂 Joyeux anniversaire !

Je voulais vraiment marquer le coup,
parce que notre amitié compte beaucoup pour moi.
Je suis content de t’avoir rencontrée ici,
et j’espère qu’on partagera encore plein de bons moments 💛
`;
    }

    if (type === "fun") {
        text = `
😂 Joyeux anniversaire !

Aujourd’hui t’as le droit :
✔ de manger trop de gâteau
✔ d’ignorer les responsabilités
✔ et d’être officiellement la personne la plus cool de la journée 🎉
`;
    }

    if (type === "surprise") {
        text = `
🎁 Surprise !

Ce n’est pas juste un message…
C’est un petit bout de code fait avec attention,
juste pour te faire sourire aujourd’hui 😊
`;
    }

    messageEl.innerText = text;
}

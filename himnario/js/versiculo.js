const versiculos = [
  "El Señor es mi pastor; nada me faltará. – Salmo 23:1",
  "Todo lo puedo en Cristo que me fortalece. – Filipenses 4:13",
  "Confía en el Señor con todo tu corazón. – Proverbios 3:5",
  "Porque yo sé los planes que tengo para ti. – Jeremías 29:11",
  "Jehová está cerca de los quebrantados de corazón. – Salmo 34:18",
    "Jehová es mi fortaleza y mi cántico. – Éxodo 15:2",
  "Cantad a Jehová con alegría, porque ha hecho maravillas. – Isaías 12:5",
  "Alabad al Señor, porque es bueno; porque para siempre es su misericordia. – Salmo 136:1"
];

document.addEventListener("DOMContentLoaded", () => {
  const elegido = versiculos[Math.floor(Math.random() * versiculos.length)];
  document.getElementById("versiculoDia").textContent = elegido;
});
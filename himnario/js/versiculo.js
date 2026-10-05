const versiculos = [
  { es: "El Señor es mi pastor; nada me faltará. – Salmo 23:1", en: "The Lord is my shepherd; I shall not want. – Psalm 23:1" },
  { es: "Todo lo puedo en Cristo que me fortalece. – Filipenses 4:13", en: "I can do all things through Christ who strengthens me. – Philippians 4:13" },
  { es: "Confía en el Señor con todo tu corazón. – Proverbios 3:5", en: "Trust in the Lord with all your heart. – Proverbs 3:5" },
  { es: "Porque yo sé los planes que tengo para ti. – Jeremías 29:11", en: "For I know the plans I have for you. – Jeremiah 29:11" },
  { es: "Jehová está cerca de los quebrantados de corazón. – Salmo 34:18", en: "The Lord is near to the brokenhearted. – Psalm 34:18" },
  { es: "Jehová es mi fortaleza y mi cántico. – Éxodo 15:2", en: "The Lord is my strength and my song. – Exodus 15:2" },
  { es: "Cantad a Jehová con alegría, porque ha hecho maravillas. – Isaías 12:5", en: "Sing to the Lord, for he has done glorious things. – Isaiah 12:5" },
  { es: "Alabad al Señor, porque es bueno; porque para siempre es su misericordia. – Salmo 136:1", en: "Give thanks to the Lord, for he is good; his mercy endures forever. – Psalm 136:1" }
];

document.addEventListener("DOMContentLoaded", () => {
  const elegido = versiculos[Math.floor(Math.random() * versiculos.length)];
  const language = window.iadsderI18n?.language?.() || "es";
  document.getElementById("versiculoDia").textContent = elegido[language] || elegido.es;
});

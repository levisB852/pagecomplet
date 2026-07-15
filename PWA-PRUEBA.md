# Prueba de app instalable y himnario offline

Esta es una primera prueba PWA.

## Que debe funcionar sin internet

Despues de abrir el sitio una vez con internet, el celular deberia poder abrir:

- Pagina principal guardada.
- Entrada del himnario.
- Lista de himnos.
- Busqueda de himnos.
- Letras de himnos.
- Favoritos.
- Mi Himnario.
- Anterior y siguiente himno.

## Que necesita internet

- Radio en vivo.
- Videos de YouTube.
- Admin.
- Mapas.
- Galeria online.
- Audios MP3 del himnario.

Los audios no se guardaron todavia porque pesan bastante. Primero conviene probar que el texto del himnario funcione bien sin internet.

## Como probar en el celular

1. Sube los cambios a GitHub y espera que Netlify publique.
2. Abre `https://iadsder.org/` con internet.
3. Entra al himnario y abre algunos himnos.
4. En Chrome, usa `Agregar a pantalla de inicio` o `Instalar app`.
5. Abre la app instalada una vez con internet.
6. Apaga datos y Wi-Fi.
7. Abre la app otra vez.
8. Entra al himnario y prueba buscar y abrir letras.

## Si no funciona a la primera

Puede ser cache viejo del navegador. Prueba:

- Cerrar y abrir la app.
- Actualizar la pagina con internet.
- Borrar cache del sitio.
- Desinstalar la app del inicio y volver a instalarla.

Cada vez que se cambie `service-worker.js`, el celular puede tardar un poco en tomar la version nueva.

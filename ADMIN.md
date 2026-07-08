# Administrador del sitio

El panel esta en:

`https://iadsder.org/admin/`

Desde ahi puedes editar:

- Videos
- Eventos
- Galeria de imagenes

## Activarlo en Netlify

Esto se hace una sola vez:

1. Entra a Netlify.
2. Abre tu sitio.
3. Ve a `Site configuration` > `Identity`.
4. Activa `Enable Identity`.
5. En `Registration preferences`, usa `Invite only`.
6. Ve a `Services` y activa `Git Gateway`.
7. Invitate como usuario administrador con tu correo.
8. Abre el correo de invitacion y crea tu contrasena.

Despues de eso puedes entrar desde el telefono a `/admin/`.

## Agregar videos

1. Entra a `/admin/`.
2. Abre `Videos`.
3. Presiona `Add videos`.
4. Escribe:
   - ID de YouTube
   - Titulo
   - Descripcion
5. Guarda.

El ID de YouTube es la parte final del enlace. Ejemplo:

`https://www.youtube.com/watch?v=OgonAQOnNSo`

El ID es:

`OgonAQOnNSo`

## Agregar eventos

1. Entra a `/admin/`.
2. Abre `Eventos`.
3. Agrega titulo, tipo, fecha, hora y lugar.
4. Guarda.

## Agregar imagenes

1. Entra a `/admin/`.
2. Abre `Galeria de imagenes`.
3. Presiona `Add imagenes`.
4. Sube la imagen desde tu telefono.
5. Escribe un texto alternativo.
6. Guarda.

Las imagenes se guardan en `img/galeria/uploads`.

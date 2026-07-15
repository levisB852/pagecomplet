# Administrador del sitio

El panel esta en:

`https://iadsder.org/admin/`

Usa siempre ese enlace con la diagonal final: `/admin/`.

Desde ahi puedes editar:

- Videos
- Eventos
- Galeria de imagenes

## App instalable y himnario offline

Se agrego una primera prueba PWA. Esto permite instalar el sitio como app desde el celular y guardar el himnario para usarlo sin internet.

Mas detalles de prueba estan en:

`PWA-PRUEBA.md`

## Radio

El reproductor de la radio ahora intenta reconectarse automaticamente si la senal se corta.

- Intenta reconectar cada 5 segundos.
- Hace hasta 5 intentos.
- Si el celular se queda sin internet, espera a que vuelva la conexion.
- Si no logra reconectar, pide presionar reproducir otra vez.

## Como funciona el panel

El panel `/admin/` no cambia la pagina directamente como si fuera Word. Lo que hace es editar archivos del sitio:

- `data/videos.json` guarda los videos.
- `data/eventos.json` guarda los eventos.
- `data/galeria.json` guarda las imagenes.

Cuando presionas guardar en el panel, Netlify crea un cambio en GitHub. Luego Netlify publica el sitio otra vez. Por eso a veces el cambio tarda un poco en verse en la pagina.

## Campo Publicado

En videos, eventos e imagenes agregue el campo `Publicado`.

- Encendido: aparece en la pagina.
- Apagado: queda guardado en el admin, pero no se muestra al publico.

Esto sirve para preparar contenido antes de publicarlo.

## Videos de YouTube

Para agregar un video, pega solo el ID de YouTube.

Ejemplo:

`https://www.youtube.com/watch?v=OgonAQOnNSo`

El ID es:

`OgonAQOnNSo`

Tambien puedes poner titulo y descripcion corta.

## Eventos

Los eventos ahora se cargan desde el panel administrador. Puedes editar:

- Titulo
- Tipo
- Fecha
- Hora
- Lugar
- Enlace de ubicacion
- Imagen del evento
- Publicado

Si no subes imagen, la pagina usa una imagen predeterminada.

Si agregas `Enlace de ubicacion`, el lugar del evento se vuelve clickeable y abre Google Maps u otro enlace que pegues.

## Galeria

Puedes subir fotos desde el telefono. Cada foto tiene:

- Publicado
- Imagen
- Texto alternativo

El texto alternativo es una descripcion breve de la foto. Ayuda a que la pagina sea mas clara y accesible.

La pagina ahora mezcla dos fuentes:

- Fotos subidas desde el admin.
- Fotos que vienen de la carpeta online.

Primero aparecen las fotos del admin y despues las fotos online. Si una foto se repite, la pagina intenta mostrarla solo una vez.

Las fotos nuevas que subas desde el admin se guardan en:

`img/galeria/uploads`

Para copiar todas las fotos online dentro del proyecto habria que tener enlaces directos de esas imagenes o acceso a la cuenta donde estan guardadas. Sin esos datos, el sitio puede mostrarlas, pero no copiarlas automaticamente al repositorio.

## Vista previa del panel

La vista previa del panel queda desactivada porque estos contenidos se guardan como archivos JSON. Para ver como queda en publico, guarda el cambio, espera que Netlify publique y revisa la pagina principal.

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

## Si el correo no te deja crear o cambiar contrasena

Esto suele pasar cuando Netlify manda el enlace de invitacion o recuperacion a la pagina principal. Ya deje la pagina preparada para detectar ese enlace y abrir la ventana correcta de Netlify.

Prueba asi:

1. Borra el usuario anterior en `Identity`, si quedo creado a medias.
2. Envia otra invitacion desde Netlify.
3. Abre el correo desde el mismo navegador del telefono o computadora.
4. Crea la contrasena cuando aparezca la ventana de Netlify.
5. Despues entra a `/admin/`.

Si al recuperar contrasena te vuelve a llevar a la pagina principal, espera a que cargue por completo. La ventana para cambiar la contrasena deberia abrirse sola.

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
3. Agrega titulo, tipo, fecha, hora, lugar y enlace de ubicacion si lo tienes.
4. Guarda.

## Agregar imagenes

1. Entra a `/admin/`.
2. Abre `Galeria de imagenes`.
3. Presiona `Add imagenes`.
4. Sube la imagen desde tu telefono.
5. Escribe un texto alternativo.
6. Guarda.

Las imagenes se guardan en `img/galeria/uploads`.

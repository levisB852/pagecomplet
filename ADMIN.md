# Administrador del sitio

El panel esta en:

`https://iadsder.org/admin/`

Usa siempre ese enlace con la diagonal final: `/admin/`.

Desde ahi puedes editar:

- Videos
- Galeria de imagenes
- Filiales
- Versiculo semanal
- Ajustes para compartir el sitio

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

## Galeria

Puedes subir fotos desde el telefono. Cada foto tiene:

- Publicado
- Imagen
- Texto alternativo

El texto alternativo es una descripcion breve de la foto. Ayuda a que la pagina sea mas clara y accesible.

La pagina usa solamente las fotos guardadas desde el administrador. Ya no mezcla imagenes de Cloudinary u otra galeria externa.

Las fotos nuevas que subas desde el admin se guardan en:

`img/galeria/uploads`

Puedes cambiar el orden arrastrando las fotografias dentro de la lista. Tambien puedes agregar una fecha y una descripcion, que apareceran en la galeria publica.

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

## Agregar imagenes

1. Entra a `/admin/`.
2. Abre `Galeria juvenil` y luego `Administrar fotografias`.
3. Presiona `Agregar fotografia`.
4. Sube la imagen desde tu telefono.
5. Escribe un texto alternativo.
6. Guarda.

Las imagenes se guardan en `img/galeria/uploads`.

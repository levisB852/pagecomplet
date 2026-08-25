(function registerGalleryPreview() {
  if (!window.CMS || !window.createClass || !window.h) return;

  const GalleryPreview = createClass({
    render: function () {
      const value = this.props.entry.getIn(["data", "imagenes"]);
      const images = value && value.toJS ? value.toJS() : [];
      const published = images
        .filter(image => image && image.published !== false && image.image)
        .flatMap(image => {
          const sources = Array.isArray(image.image) ? image.image : [image.image];
          return sources.filter(Boolean).map((source, index) => ({
            ...image,
            image: source,
            alt: sources.length > 1 && image.alt ? `${image.alt} (${index + 1})` : image.alt
          }));
        });

      return h("main", { className: "gallery-preview" },
        h("header", { className: "gallery-preview__head" },
          h("span", {}, "Vista previa"),
          h("h1", {}, "Eventos Juveniles"),
          h("p", {}, `${published.length} ${published.length === 1 ? "fotografía publicada" : "fotografías publicadas"}`)
        ),
        published.length
          ? h("div", { className: "gallery-preview__grid" }, published.map((image, index) =>
              h("figure", { key: `${image.image}-${index}` },
                h("img", { src: this.props.getAsset(image.image).toString(), alt: image.alt || "Fotografía" }),
                h("figcaption", {},
                  h("strong", {}, image.alt || "Sin descripción"),
                  image.date ? h("time", {}, image.date) : null
                )
              )
            ))
          : h("p", { className: "gallery-preview__empty" }, "No hay fotografías marcadas para publicar.")
      );
    }
  });

  CMS.registerPreviewTemplate("galeria_admin", GalleryPreview);
  CMS.registerPreviewStyle("/admin/preview.css");
})();

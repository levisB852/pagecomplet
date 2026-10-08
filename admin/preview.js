(function registerGalleryPreview() {
  if (!window.CMS || !window.createClass || !window.h) return;

  const GalleryPreview = createClass({
    render: function () {
      const value = this.props.entry.getIn(["data", "imagenes"]);
      const images = value && value.toJS ? value.toJS() : [];
      function normalize(item) {
        if (typeof item === "string") return [{ image: item, alt: "Fotografía de evento juvenil" }];
        if (Array.isArray(item)) return item.flatMap(normalize);
        if (!item || item.published === false) return [];
        const sources = Array.isArray(item.image) ? item.image : [item.image];
        return sources.flatMap(source => Array.isArray(source) ? source.flatMap(normalize) : (source ? [{ ...item, image: source }] : []));
      }
      const published = images.flatMap(normalize);

      return h("main", { className: "gallery-preview" },
        h("header", { className: "gallery-preview__head" },
          h("span", {}, "Vista previa"),
          h("h1", {}, "Eventos Juveniles"),
          h("p", {}, `${published.length} ${published.length === 1 ? "fotografía publicada" : "fotografías publicadas"}`)
        ),
        published.length
          ? h("div", { className: "gallery-preview__grid" }, published.map((image, index) =>
              h("figure", { key: `${image.image}-${index}` },
                h("img", { src: this.props.getAsset(image.image).toString(), alt: "Fotografía" })
              )
            ))
          : h("p", { className: "gallery-preview__empty" }, "No hay fotografías marcadas para publicar.")
      );
    }
  });

  CMS.registerPreviewTemplate("galeria_admin", GalleryPreview);

  const FilialesPreview = createClass({
    render: function () {
      const value = this.props.entry.getIn(["data", "filiales"]);
      const filiales = value && value.toJS ? value.toJS() : [];
      const visible = filiales.filter(item => item && item.published !== false);
      const asset = path => {
        if (!path) return "/img/Logo_IADSDER-1000.webp";
        try { return this.props.getAsset(path).toString(); } catch { return path; }
      };

      return h("main", { className: "filiales-preview" },
        h("header", { className: "gallery-preview__head" },
          h("span", {}, "Vista previa"),
          h("h1", {}, "Iglesias filiales"),
          h("p", {}, `${visible.length} ${visible.length === 1 ? "filial publicada" : "filiales publicadas"}`)
        ),
        h("div", { className: "filiales-preview__grid" }, visible.map((item, index) =>
          h("article", { key: `${item.name}-${index}` },
            h("img", { src: asset(item.image), alt: item.name || "Iglesia filial" }),
            h("div", { className: "filiales-preview__body" },
              h("span", { className: "filiales-preview__circuit" }, item.circuit ? `Circuito ${item.circuit}` : "Sin circuito"),
              h("h2", {}, item.name || "Filial sin nombre"),
              h("p", {}, item.address || "Dirección pendiente"),
              h("small", {}, item.zone || "Departamento pendiente")
            )
          )
        ))
      );
    }
  });

  CMS.registerPreviewTemplate("filiales_admin", FilialesPreview);
  CMS.registerPreviewStyle("/admin/preview.css");
})();

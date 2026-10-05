# Fotos de salones

Una foto por salón, guardada dentro del proyecto (no se usan URLs externas).

## Convención

```text
public/img/salones/{edificioId}/{id}.webp
```

Ejemplo: `public/img/salones/edificio-1/sal-1101.webp`

- Formato **WebP**, lado mayor **800 px**, calidad ~80 % (≈ 40-120 KB).
- En `src/data/salones.json` el campo `foto` guarda la **ruta relativa**:
  `"foto": "img/salones/edificio-1/sal-1101.webp"`
- Si un salón no tiene `foto`, la app muestra `img/placeholder-salon.svg`.

## Flujo desde la página (panel admin)

1. Abre el panel admin → edita el salón → **Subir foto**. La imagen se
   comprime en el navegador y queda guardada localmente (IndexedDB) para la vista previa.
2. Pulsa **Exportar ZIP**. El paquete replica la estructura del proyecto:
   - `src/data/salones.json`
   - `public/img/salones/{edificioId}/{id}.webp`
3. Descomprime el ZIP **en la raíz del proyecto** (sobrescribiendo) y haz commit.

Una vez commiteadas, las fotos se precachean con la PWA y funcionan sin internet.

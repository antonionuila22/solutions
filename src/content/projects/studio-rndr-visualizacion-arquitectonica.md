---
title: Studio RNDR — Landing de Alta Gama para un Estudio de Visualización Arquitectónica
seoTitle: "Studio RNDR: landing para visualización 3D | Codebrand"
description: Studio RNDR no tenía sitio web. Construimos su landing en Astro — 45 renders en AVIF, 10.7 KB de HTML por la red, CLS 0 y 100/100 en SEO técnico. La historia completa del proceso y de cuánto cuesta un sitio así.
author: Codebrand Team
img: /photos/projects/studiorndr.jpg
category: Web Development
tags:
  - Astro
  - Visualización Arquitectónica
  - Landing Page
  - Diseño Editorial
  - Rendimiento Web
  - AVIF
  - Netlify
lang: es
client: Studio RNDR
date: 2026-07-01
featured: true
link: https://www.studiorndr.com/
results:
  metric1: 45 renders en AVIF
  metric2: 10.7 KB de HTML por la red
  metric3: 100/100 en SEO técnico
resultsLabel: Medido en el sitio en vivo
resultsNote: >-
  Cifras medidas por Codebrand sobre www.studiorndr.com el 25 de julio de 2026
  con Lighthouse 12 y curl. El HTML pesa 87.7 KB en crudo y 10.7 KB comprimido
  por la red. No son métricas de negocio del cliente: son propiedades
  verificables de la entrega, comprobables por cualquiera hoy.
# TODO(usuario) — para cerrar este caso hace falta confirmar:
#   1) la fecha real de entrega (hoy está puesta el 1 de julio de 2026 como aproximación)
#   2) las horas reales facturadas y el monto real del proyecto — el desglose de la
#      sección "Cuánto cuesta" es una ESTIMACIÓN construida con nuestras tarifas
#      publicadas ($45/$65/$95 por hora), no la factura de Studio RNDR
#   3) métricas de negocio, si Studio RNDR quiere compartirlas: consultas recibidas
#      por el formulario al mes, y desde qué fecha
---

## Contexto

Studio RNDR es un estudio de visualización arquitectónica: renders fotorrealistas, animación y recorridos virtuales para arquitectos, desarrolladores inmobiliarios y agencias. Trabajan proyectos en Honduras y Guatemala —San Pedro Sula, Tegucigalpa, Buena Vista— y su portafolio va de residencias unifamiliares a complejos multifamiliares y líneas de mobiliario.

Su sitio declara 120+ proyectos entregados, 8 países atendidos y 4 años de oficio. Nada de eso estaba en internet: **no tenían sitio web.** Un estudio cuyo producto entero es la imagen no tenía dónde mostrarla.

## El reto

El problema de negocio era específico y poco común.

Un estudio de render vende antes de que exista el edificio. Su cliente —un arquitecto, un desarrollador -- decide contratarlos mirando trabajo previo, y esa decisión se toma con los ojos en menos de diez segundos. Eso pone al sitio en una posición incómoda: **tiene que ser tan bueno visualmente como el trabajo que muestra.** Un portafolio mediocre para un estudio de visualización no es un sitio flojo; es una contradicción que descalifica.

El segundo reto es técnico y es el opuesto del primero. Los renders arquitectónicos son imágenes enormes: alta resolución, mucho detalle, gradientes suaves donde la compresión se nota. La tentación obvia —subir los renders tal cual— produce un sitio precioso que tarda una eternidad. La tentación contraria —comprimirlos hasta que pesen poco— destruye exactamente lo que el estudio vende.

Y el tercero: no había contenido de partida. Ni textos, ni estructura, ni jerarquía de proyectos. Había una carpeta de renders.

## Cómo lo trabajamos

**1. Briefing y arquitectura de contenido.** Antes de diseñar nada hubo que decidir qué historia cuenta el sitio y en qué orden. Salieron cuatro actos, numerados y visibles en la navegación: Trabajo, Proceso, Estudio, Contacto. Esa numeración no es decoración — es la promesa de que el sitio es corto y de que se puede recorrer entero.

**2. Curaduría del portafolio.** De todo el archivo se seleccionaron seis proyectos, cada uno con tipo, locación y año: Bardominium Rústico, Cabaña de Doble Altura, Prisma, Condominios Los Olivos, Colección Ébano y Residencia de Ladrillo Visto. Seis, no sesenta. En un portafolio, cada pieza adicional debilita el promedio.

**3. Dirección de diseño.** El sistema visual se construyó alrededor del oficio del cliente. La tipografía de display va en contorno, no en relleno, como un wireframe antes del render. Las imágenes del hero llevan metadatos de cámara sobreimpresos —apertura f/8, obturador 1/125, ISO 200— porque un render fotorrealista se compone como una fotografía y ese detalle se lo dice a quien sabe leerlo. El encabezado lleva un reloj en vivo en GMT−6, que ancla al estudio en su zona horaria real. Todo eso son microdecisiones; juntas son la diferencia entre un portafolio y una plantilla.

**4. Maquetación en Astro.** El sitio se construyó con Astro porque el problema pedía exactamente lo que Astro hace: páginas que llegan al navegador como HTML terminado, con JavaScript solo donde de verdad hay interacción. El resultado se mide: **87.7 KB de HTML en crudo que viajan en 10.7 KB comprimidos**, con dos hojas de estilo y dos scripts en toda la página.

**5. Pipeline de imágenes.** Los 45 renders se procesaron a **AVIF**, el formato que mejor sostiene los gradientes suaves de una escena renderizada a un peso razonable. Cada imagen se sirve con sus dimensiones declaradas en el HTML, de modo que el navegador reserva el espacio antes de descargarla: por eso el **Cumulative Layout Shift es 0**, sin un solo salto de maquetación mientras carga. Cuarenta de las cuarenta y tres imágenes cargan de forma diferida; la del hero se marca como prioritaria para que sea lo primero que aparece.

**6. SEO técnico y accesibilidad.** Metadatos, jerarquía de encabezados, idioma declarado, texto alternativo, contraste y foco de teclado. Medido con Lighthouse 12 sobre el sitio en vivo: **100/100 en SEO, 100/100 en Buenas Prácticas y 91/100 en Accesibilidad.**

**7. Despliegue.** El sitio vive en Netlify, detrás de su CDN. El tiempo hasta el primer byte medido desde Honduras es de **304 ms**, y la respuesta completa del documento llega en 429 ms.

## Qué construimos

- Landing de una sola página con cuatro secciones numeradas y navegación ancla
- Portafolio curado de seis proyectos, cada uno con tipo, locación y año
- Carrusel continuo de selección visual, con pausa al pasar el cursor
- Sección de proceso del estudio: briefing, modelado 3D, render y entrega
- Bloque de capacidades interactivas: recorrido 3D libre, cambio de hora del día, configurador en vivo y comportamiento en cualquier dispositivo
- Sección de estudio y bloque de preguntas frecuentes
- Reloj en vivo en zona horaria GMT−6 en el encabezado
- Cierre con llamada a la acción directa
- Pipeline completo de 45 imágenes a AVIF, con dimensiones y carga diferida

## Cuánto cuesta un sitio de esta calidad

La pregunta que siempre llega después de ver un sitio así es cuánto cuesta. La respuesta honesta es que no se cotiza por "una landing" — se cotiza por las horas que lleva, y conviene ver en qué se van.

Nuestras tarifas son públicas y por hora: **$45 para un desarrollador mid, $65 para un senior y $95 para un lead o arquitecto.** Un proyecto como este se reparte aproximadamente así:

| Fase | Horas | Perfil |
|---|--:|---|
| Briefing y arquitectura de contenido | 8 | Lead |
| Dirección de diseño y sistema visual | 24 | Lead |
| Maquetación en Astro y componentes | 32 | Senior |
| Pipeline de imágenes y rendimiento | 10 | Senior |
| Interacciones y microdetalles | 12 | Senior |
| SEO técnico, accesibilidad y QA | 10 | Senior |
| Despliegue, dominio y entrega | 4 | Senior |
| **Total** | **100** | |

A esas tarifas, un sitio de este nivel se mueve en el rango de **$6,000 a $8,000 USD**, según cuánto del trabajo lo lleve un lead y cuánta curaduría de contenido haga falta.

Dos cosas que conviene decir sin adornos. La primera: la mayor parte de ese presupuesto **no es programar**. Casi la mitad se va en decidir qué se muestra, en qué orden y con qué jerarquía — que es exactamente lo que separa un portafolio memorable de una plantilla con fotos bonitas. La segunda: un sitio de una página bien hecho cuesta más que un sitio de diez páginas mal hecho, porque no hay dónde esconderse. Cada decisión está a la vista.

Si el presupuesto no da para eso, la respuesta correcta no es hacer lo mismo peor: es reducir el alcance. Menos proyectos en el portafolio, un sistema visual más simple, sin interacciones. Lo que no se debe recortar es el pipeline de imágenes ni el SEO técnico, porque ahí es donde un sitio bonito se convierte en un sitio que además funciona.

## Stack técnico

Astro 6, HTML servido estático, CSS propio, JavaScript mínimo y solo donde hay interacción, imágenes en AVIF con dimensiones declaradas y carga diferida, despliegue en Netlify con su CDN. Sitio en español, con el idioma declarado en el documento.

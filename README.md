# Vaho
## Concepto
Vaho: Vapor que despiden los cuerpos en determinadas condiciones de temperatura y humedad.

historia que se cuenta de la experiencia de hacer vaho en el vidrio

- "toca para descubrir lo que hay detrás"

## ¿Cómo funciona?

Este juego de interacción se compone de distintas fases, las cuales son:
1. ```Pantalla inicial:``` Al deslizar y desplazar el dedo mediante la pantalla de teléfono se despeja este paisaje en donde se basa toda el juego e historia. Se necesita un 80% de la pantalla despejada para poder visualizar la primera etapa del juego.
2. ```Empezar aventura:``` Al despejar toda la pantalla de este vaho tenemos este botón, donde al oprimirlo, se visualiza la cuenta regresiva de la primera etapa, donde este personaje avanza de manera automática por la pantalla, a su vez en el teléfono se visualizarán dos botones (arriba - abajo), los cuales se presionan según el obstáculo que tiene que pasar el personaje, como lo son saltar troncos y agacharse para esquivar las ramas hasta llegar a la puerta final.
3. ```Segunda etapa:``` Al llegar a la puerta final de la 1ra etapa, se pasará a la 2da etapa oprimiendo botón, donde esta consiste en pasar diez pares de tubos al ir pulsando el teléfono.
4. ```Tercera etapa:``` Luego de finalizar la 2da etapa, se inicia la 3ra etapa, la cual al deslizar el dedo por la pantalla el personaje esquivará las rocas para seguir el camino.
5. ```Etapa final:``` El último tramo es ya llegando a la meta, donde al deslizar el dedo por la pantalla del teléfono, este personaje se moverá llegando como límite la escalera, donde se tendrá que deslizar el dedo hacia arriba y llegar a la torre donde se encuentra la princesa. Al terminar esta etapa, se reinicia el juego y se vuelve a contar esta historia volviendo al vaho.

Los 3 juegos inician con 3 vidas cada uno. Si estas se agotan, la opción de "reiniciar etapa" permite repetirla.

## Conexiones

### Referencias
- animal crossing
- terraria
- flappy bird
  
| Gesto en el teléfono | Imagen en el computador | Sonido |
|---|---|---|
| Deslizar un dedo | Limpia el vidrio siguiendo el recorrido | Revela el ambiente de la zona |
| Frotar repetidamente una zona | Esa parte queda más despejada | El sonido pierde su filtro y se oye más definido |
| Usar dos dedos | Deja una huella de limpieza más amplia | Permite escuchar una zona mayor del paisaje |
| Soltar | El vaho reaparece lentamente | Los sonidos vuelven a quedar amortiguados |

## Sonidos

El proyecto usa 9 archivos de audio extraídos de 

<https://www.myinstants.com/es/index/cl/>

<https://pixabay.com/es/> 

| Archivo | Uso | Autoría, origen y licencia |
|---|---|---|
| `despejar.mp3` | Roce al despejar el vidrio | <https://www.myinstants.com/es/instant/minecraft-xp-sound-1-30960/> |
| `salto.mp3` | Salto sobre troncos | <https://pixabay.com/es/sound-effects/search/salto%20de%20videojuego/> |
| `agacharse.mp3` | Agacharse bajo ramas | <https://pixabay.com/es/sound-effects/search/agacharse/?pagi=3> |
| `salto-etapa-2.mp3` | Impulso durante el vuelo | Pendiente de verificar |
| `deslizar.mp3` | Cambio de carril | <https://pixabay.com/es/sound-effects/search/movimiento%20del%20juego/> |
| `caminar.mp3` | Pasos y ascenso por la escalera | <https://pixabay.com/es/sound-effects/search/walking%20game/> |
| `besos.mp3` | Encuentro en la torre | <https://www.myinstants.com/es/instant/besos-79164/> |
| `click.mp3` | Pulsación de botones | <https://pixabay.com/es/sound-effects/search/menu-click/> |
| `cuenta-regresiva.mp3` | Inicio de la primera etapa | <https://pixabay.com/es/sound-effects/search/cuenta%20regresiva/> |




# README

El objetivo es entender el tacto como un sentido que se presta a otros. Importa qué gesto de la mano (posición, presión, cantidad de dedos, giro del teléfono) transforma qué cualidad de la imagen o del sonido, y qué relación construyes entre ellos. Te interesa menos que funcione y más que se sienta como tocar la imagen y escuchar ese contacto.

```
Del teléfono: posición del toque (X, Y), cantidad de dedos, presión, diámetro del contacto y giro en tres ejes. Opcionalmente, micrófono y cámara.
De la experiencia: audio (oscilador o tus propios sonidos), imagen (animación, video o cámara web), física del material (tela, agua, squishy, remolino) y un panel donde conectas cada dato con cada variable.
```
El README del repositorio explica cada función y cómo agregar variables o materiales propios.

La plataforma a desarrollar

Tu plataforma es una herramienta especializada en el concepto que elijas. Puedes partir de Tacto o construirla desde cero, siempre que el teléfono se conecte por MQTT.
```
Concepto: elige una relación entre gesto, imagen y sonido y detalle (por ejemplo: acariciar recuerdos queridos, desgasta su propia existencia, eliminando rastros de audio y visión).
Tacto: decide qué gestos usas y qué controla cada uno. Cada conexión debe tener sentido dentro del concepto, no estar ahí solo porque existe.
Visión y oído: diseña cómo la imagen y el sonido responden al toque. Reúne entre 5 y 15 sonidos propios o de uso libre (indica origen y licencia) y propón una imagen o video que se transforme con el gesto.
Conexión MQTT: el teléfono debe conectarse a tu plataforma por MQTT y funcionar desde su enlace.
Gráfica: nombre, tipografía, color y composición deben responder al concepto, como en una pieza de diseño completa.
Publicación: la plataforma queda publicada en GitHub Pages.
```
Piensa la plataforma como una herramienta que otra persona podría usar para explorar tu tema, no como una demo técnica.

1. Concepto. Qué relación propones entre tocar, ver y oír, y qué quieres que la persona sienta o descubra.
2. Funcionamiento. Qué gestos controlan qué variables (incluye una tabla de conexiones), cómo se conecta el teléfono por MQTT y qué sonidos usaste, con autoría declarada.
3. Reflexión. Qué descubriste al traducir el tacto en imagen y sonido, qué queda fuera de tu sistema, y al menos dos mejoras concretas.

Proceso sugerido
```
Parte por la relación, no por la técnica. Escribe en una frase qué gesto produce qué imagen y qué sonido.
Prueba Tacto con tu teléfono y observa qué datos entrega (presión y diámetro varían según el modelo).
Reúne sonidos cortos (0,3 a 5 segundos) y un video o animación.
Diseña en papel la tabla de conexiones antes de programarla.
Desarrolla y prueba seguido; para trabajar rápido, usa el modo local (node server.js) con el teléfono en tu hotspot.
Publica en GitHub Pages y documenta mientras el proceso está fresco.
```
Criterios de evaluación
```
Claridad del concepto.
Coherencia entre gesto, imagen y sonido.
Uso del tacto y de las variables del teléfono.
Conexión MQTT y funcionamiento.
Gráfica aplicada a la plataforma.
Calidad del README y de la reflexión.
```
Entregables: enlace al repositorio, enlace a la plataforma publicada y un video de 30 a 60 segundos que muestre el teléfono controlando la experiencia.










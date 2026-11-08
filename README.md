# VAHO · Una historia al otro lado del vidrio

Integrantes: 

*Isidora Pérez*

Vaho es una experiencia web táctil y sonora.

Vaho: Vapor que despiden los cuerpos en determinadas condiciones de temperatura y humedad.

historia que se cuenta de la experiencia de hacer vaho en el vidrio

## 1. Concepto

En **Vaho**, deslizar el dedo sobre el teléfono despeja una ventana empañada en el computador y hace audible el roce del gesto. Detrás del vidrio hay un bosque en pixel art. El paisaje se descubre por partes, siguiendo el recorrido de la mano. Cuando la mano se detiene, la huella queda visible y el sonido se atenúa.

Quiero que la persona sienta que su dedo toca la imagen, aunque el teléfono y el bosque estén en pantallas distintas. La posición del dedo determina dónde se abre el vidrio y el sonido acompaña el momento en que se mueve. Una vez descubierto el bosque, la mano pasa de revelar el lugar a recorrerlo. Al final, el vaho vuelve a cubrir la imagen y la aventura puede empezar otra vez.

El nombre alude al empañamiento del vidrio. La tipografía **ARCADECLASSIC** del título y de los botones principales acompaña la estética arcade, mientras **Roboto Mono** se usa para las instrucciones y los controles. El cielo celeste, los verdes del bosque y los tonos de madera y arena toman como referencia la paleta de *Animal Crossing*. El escenario ocupa el centro de la página y el teléfono muestra el control que corresponde a cada etapa.

## ¿Cómo funciona?

Este juego de interacción se compone de distintas fases, las cuales son:

1. ```Pantalla inicial:``` Al deslizar y desplazar el dedo mediante la pantalla de teléfono se despeja este paisaje en donde se basa toda el juego e historia. Se necesita un 80% de la pantalla despejada para poder visualizar la primera etapa del juego.
2. ```Empezar aventura:``` Al despejar toda la pantalla de este vaho tenemos este botón, donde al oprimirlo, se visualiza la cuenta regresiva de la primera etapa, donde este personaje avanza de manera automática por la pantalla, a su vez en el teléfono se visualizarán dos botones (arriba - abajo), los cuales se presionan según el obstáculo que tiene que pasar el personaje, como lo son saltar troncos y agacharse para esquivar las ramas hasta llegar a la puerta final.
3. ```Segunda etapa:``` Al llegar a la puerta final de la 1ra etapa, se pasará a la 2da etapa oprimiendo botón, donde esta consiste en pasar diez pares de tubos al ir pulsando el teléfono.
4. ```Tercera etapa:``` Luego de finalizar la 2da etapa, se inicia la 3ra etapa, la cual al deslizar el dedo por la pantalla el personaje esquivará las rocas para seguir el camino.
5. ```Etapa final:``` El último tramo es ya llegando a la meta, donde al deslizar el dedo por la pantalla del teléfono, este personaje se moverá llegando como límite la escalera, donde se tendrá que deslizar el dedo hacia arriba y llegar a la torre donde se encuentra la princesa. Al terminar esta etapa, se reinicia el juego y se vuelve a contar esta historia volviendo al vaho.
   
Los 3 juegos inician con 3 vidas cada uno. Si estas se agotan, la opción de "reiniciar etapa" permite repetirla.

### Conexiones

| Momento | Gesto o entrada | Respuesta visual | Respuesta sonora |
|---|---|---|---|
| Despeje | Deslizar el dedo. La posición X/Y ubica el contacto. | Se abre una huella que sigue el recorrido y aumenta el porcentaje despejado. | El roce sube de volumen con el movimiento y se atenúa al parar. |
| Despeje | Deslizar con dos o más dedos. | Aumenta el ancho de la huella. | Se mantiene el mismo roce ligado al movimiento. |
| Inicio de la etapa 1 | Pulsar **Empezar aventura** en el computador. | Aparece la cuenta regresiva. | Suenan el clic y el audio del **3, 2, 1**. |
| Etapa 1 | Deslizar hacia arriba o hacia abajo en el teléfono. | El personaje salta o se agacha. | Cada acción tiene su propio efecto. |
| Etapa 2 | Pulsar el escenario con el ratón o con un toque remoto. | El personaje gana altura para pasar entre los tubos. | Suena un impulso en cada pulsación. |
| Etapa 3 | Deslizar a izquierda o derecha. | El personaje cambia de carril para esquivar rocas. | Suena un deslizamiento al cambiar de carril. |
| Torre | Deslizar a la derecha y luego hacia arriba. | La distancia del gesto hace avanzar al personaje hasta la escalera y después hacia la cima. | Suenan pasos mientras hay movimiento. |
| Encuentro | Completar el último deslizamiento hacia arriba. | Aparecen corazones y, unos segundos después, vuelve el vaho. | Suena un beso una sola vez. |

El clic de interfaz se reproduce en el dispositivo donde se pulsa el botón, cuando el sonido está activo. La presión, el diámetro del contacto y el giro del teléfono quedan fuera de las conexiones de esta versión.

## Referentes 
- animal crossing
- terraria
- flapy bird
  
### Conectar el teléfono por MQTT

1. Abre Vaho en el computador y pulsa **Activar sonido**.
2. Pulsa **Conectar teléfono** y abre el enlace generado en el navegador del teléfono. El código de sala va incluido.
3. En el teléfono, pulsa **Conectar**. Cuando indique que está conectado, desliza sobre su superficie táctil y mira el resultado en el computador.

El navegador del teléfono publica los datos de contacto y las acciones por **MQTT sobre WebSocket seguro**. En el servidor local, el broker del computador reenvía los mensajes dentro de la red Wi-Fi. En GitHub Pages, el broker público de EMQX permite conectar ambos navegadores por internet. El computador también envía la etapa actual para que el teléfono cambie entre la superficie táctil, el mando gestual y el control de la torre. La conexión parte de [Tacto, de fefeliperoar](https://github.com/fefeliperoar/tacto).

Para probar en local, ejecuta `python -m http.server 8000 --bind 0.0.0.0` desde la carpeta del proyecto. Con ambos dispositivos en la misma red y con acceso a internet, abre `http://IP-DEL-COMPUTADOR:8000` en el computador para generar el enlace del teléfono.

### Mando y vista previa

Desliza sobre el mando para mover el punto del computador. Durante el despeje, la zona táctil corresponde directamente al vidrio. Pulsa **Mover punto** en el teléfono para recorrer la página y **Volver a despejar** para regresar al vidrio. Toca brevemente para pulsar el botón o enlace de Vaho bajo el punto. Para probar sin MQTT, abre **Probar el mando en otra pestaña sin MQTT** desde el cuadro de conexión y pon las dos ventanas del mismo navegador lado a lado. Usa el ratón para simular el dedo.

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



## 3. Reflexión

Al diseñar el despeje, descubrí que la posición del dedo y su movimiento podían cumplir funciones distintas. La posición deja una marca visible y el movimiento hace audible el contacto. Cuando el dedo se detiene, la huella permanece pero el roce baja de volumen. Esa diferencia me permitió separar el gesto de su rastro.

Lo que queda fuera es la sensación física de tocar vidrio húmedo. La pantalla no reproduce su temperatura ni su resistencia, y la presión del dedo no cambia el resultado. La sensación de contacto depende de que la huella y el audio respondan a tiempo. El juego explora otra relación con el mismo paisaje. Un toque breve se convierte en un salto, y un deslizamiento hacia arriba se convierte en ascenso.

Dos mejoras para una próxima versión:

1. **Vincular la velocidad del dedo al timbre del roce.** Un gesto lento podría sonar más suave y uno rápido más áspero. Probaría ambos con usuarios para ver si pueden distinguirlos al escuchar.
2. **Dar una huella propia a cada dedo.** Ahora varios dedos ensanchan una misma huella. Dibujar dos rastros independientes permitiría conservar mejor la forma del gesto sobre el vidrio.

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

# VAHO · Un bosque al otro lado del vidrio

> Borrador de entrega. Completar los créditos de audio y los enlaces antes de publicar.

## 1. Concepto

En **Vaho**, deslizar el dedo sobre el teléfono despeja una ventana empañada en el computador y hace audible el roce del gesto. Detrás del vidrio hay un bosque en pixel art. El paisaje se descubre por partes, siguiendo el recorrido de la mano. Cuando la mano se detiene, la huella queda visible y el sonido se atenúa.

Quiero que la persona sienta que su dedo toca la imagen, aunque el teléfono y el bosque estén en pantallas distintas. La posición del dedo determina dónde se abre el vidrio y el sonido acompaña el momento en que se mueve. Una vez descubierto el bosque, la mano pasa de revelar el lugar a recorrerlo. Al final, el vaho vuelve a cubrir la imagen y la aventura puede empezar otra vez.

El nombre alude al empañamiento del vidrio. La tipografía **ARCADECLASSIC** del título y de los botones principales acompaña la estética arcade, mientras **Roboto Mono** se usa para las instrucciones y los controles. El cielo celeste, los verdes del bosque y los tonos de madera y arena toman como referencia la paleta de *Animal Crossing*. El escenario ocupa el centro de la página y el teléfono muestra el control que corresponde a cada etapa.

## 2. Funcionamiento

Primero hay que despejar el **60 %** del vidrio. Entonces se revela el bosque completo y aparece **Empezar aventura**. Al pulsarlo, la cuenta regresiva **3, 2, 1** da paso a un recorrido en el que el personaje corre solo, salta troncos y se agacha bajo ramas hasta llegar a una puerta.

La puerta da paso al vuelo entre **diez pares de tubos**, inspirado en *Flappy Bird*. Después, el personaje cambia de carril para esquivar rocas. Los tres juegos empiezan con tres vidas. Si se agotan, **Reiniciar etapa** permite repetir el tramo actual. En el último tramo se camina hasta una escalera y se sube a la torre. Al encontrarse con la princesa, aparecen corazones, suena el beso y vuelve el vaho.

### Tabla de conexiones

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

### Conectar el teléfono por MQTT

1. Abre Vaho en el computador y pulsa **Activar sonido**.
2. Pulsa **Conectar teléfono** y abre el enlace generado en el navegador del teléfono. El código de sala va incluido.
3. En el teléfono, pulsa **Conectar**. Cuando indique que está conectado, desliza sobre su superficie táctil y mira el resultado en el computador.

El navegador del teléfono publica los datos de contacto y las acciones por **MQTT sobre WebSocket seguro**. En el servidor local, el broker del computador reenvía los mensajes dentro de la red Wi-Fi. En GitHub Pages, el broker público de EMQX permite conectar ambos navegadores por internet. El computador también envía la etapa actual para que el teléfono cambie entre la superficie táctil, el mando gestual y el control de la torre. La conexión parte de [Tacto, de fefeliperoar](https://github.com/fefeliperoar/tacto).

Para probar en local, ejecuta `python -m http.server 8000 --bind 0.0.0.0` desde la carpeta del proyecto. Con ambos dispositivos en la misma red y con acceso a internet, abre `http://IP-DEL-COMPUTADOR:8000` en el computador para generar el enlace del teléfono.

### Mando y vista previa

Desliza sobre el mando para mover el punto del computador. Durante el despeje, la zona táctil corresponde directamente al vidrio. Pulsa **Mover punto** en el teléfono para recorrer la página y **Volver a despejar** para regresar al vidrio. Toca brevemente para pulsar el botón o enlace de Vaho bajo el punto. Para probar sin MQTT, abre **Probar el mando en otra pestaña sin MQTT** desde el cuadro de conexión y pon las dos ventanas del mismo navegador lado a lado. Usa el ratón para simular el dedo.

### Sonidos y créditos

Vaho usa **nueve archivos de audio**. Los nombres de la tabla identifican los archivos del proyecto. Para completar la entrega, sustituir cada campo pendiente por el nombre del autor o autora, la fuente original y la licencia de uso.

| Archivo | Uso | Autoría, origen y licencia |
|---|---|---|
| `despejar.mp3` | Roce al despejar el vidrio | Pendiente de verificar |
| `salto.mp3` | Salto sobre troncos | Pendiente de verificar |
| `agacharse.mp3` | Agacharse bajo ramas | Pendiente de verificar |
| `salto-etapa-2.mp3` | Impulso durante el vuelo | Pendiente de verificar |
| `deslizar.mp3` | Cambio de carril | Pendiente de verificar |
| `caminar.mp3` | Pasos y ascenso por la escalera | Pendiente de verificar |
| `besos.mp3` | Encuentro en la torre | Pendiente de verificar |
| `click.mp3` | Pulsación de botones | Pendiente de verificar |
| `cuenta-regresiva.mp3` | Inicio de la primera etapa | Pendiente de verificar |

El bosque y los personajes son gráficos del prototipo creados con asistencia de IA. La referencia de *Animal Crossing* orientó la paleta de colores.

### Entregables

- **Repositorio** · [añadir enlace]
- **Plataforma publicada en GitHub Pages** · [añadir enlace]
- **Video de 30 a 60 segundos** · [añadir enlace]

## 3. Reflexión

Al diseñar el despeje, descubrí que la posición del dedo y su movimiento podían cumplir funciones distintas. La posición deja una marca visible y el movimiento hace audible el contacto. Cuando el dedo se detiene, la huella permanece pero el roce baja de volumen. Esa diferencia me permitió separar el gesto de su rastro.

Lo que queda fuera es la sensación física de tocar vidrio húmedo. La pantalla no reproduce su temperatura ni su resistencia, y la presión del dedo no cambia el resultado. La sensación de contacto depende de que la huella y el audio respondan a tiempo. El juego explora otra relación con el mismo paisaje. Un toque breve se convierte en un salto, y un deslizamiento hacia arriba se convierte en ascenso.

Dos mejoras para una próxima versión:

1. **Vincular la velocidad del dedo al timbre del roce.** Un gesto lento podría sonar más suave y uno rápido más áspero. Probaría ambos con usuarios para ver si pueden distinguirlos al escuchar.
2. **Dar una huella propia a cada dedo.** Ahora varios dedos ensanchan una misma huella. Dibujar dos rastros independientes permitiría conservar mejor la forma del gesto sobre el vidrio.






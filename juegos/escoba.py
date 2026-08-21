import tkinter as tk
import random


# -------------------------
# CONFIGURACIÓN
# -------------------------

ANCHO = 1000
ALTO = 700


# -------------------------
# CREAR BARAJA
# -------------------------

palos = [
    "Oros",
    "Copas",
    "Espadas",
    "Bastos"
]


nombres = {
    "As":1,
    "2":2,
    "3":3,
    "4":4,
    "5":5,
    "6":6,
    "7":7,
    "Sota":8,
    "Caballo":9,
    "Rey":10
}



def crear_baraja():

    baraja=[]

    for palo in palos:

        for nombre,valor in nombres.items():

            carta={
                "nombre":nombre,
                "palo":palo,
                "valor":valor
            }

            baraja.append(carta)


    random.shuffle(baraja)

    return baraja



# -------------------------
# VARIABLES DEL JUEGO
# -------------------------

baraja = crear_baraja()


jugador=[]
maquina=[]

mesa=[]

cartas_jugador=[]


# repartir

for i in range(3):

    jugador.append(baraja.pop())
    maquina.append(baraja.pop())


for i in range(4):

    mesa.append(baraja.pop())



# -------------------------
# VENTANA
# -------------------------

ventana=tk.Tk()

ventana.title(
    "Escoba de 15"
)

ventana.geometry(
    f"{ANCHO}x{ALTO}"
)


ventana.configure(
    bg="#006400"
)



# -------------------------
# TITULO
# -------------------------

titulo=tk.Label(
    ventana,
    text="ESCOBA DE 15",
    font=("Arial",30,"bold"),
    bg="#006400",
    fg="white"
)

titulo.pack(pady=20)



# -------------------------
# MARCOS
# -------------------------

frame_mesa=tk.Frame(
    ventana,
    bg="#006400"
)

frame_mesa.pack(
    pady=40
)



frame_jugador=tk.Frame(
    ventana,
    bg="#006400"
)

frame_jugador.pack(
    side="bottom",
    pady=30
)



# -------------------------
# MOSTRAR MESA
# -------------------------

def mostrar_mesa():

    for widget in frame_mesa.winfo_children():

        widget.destroy()


    for carta in mesa:


        boton=tk.Button(
            frame_mesa,
            text=f"{carta['nombre']}\n{carta['palo']}\n({carta['valor']})",
            width=12,
            height=5,
            font=("Arial",12)
        )


        boton.pack(
            side="left",
            padx=5
        )



# -------------------------
# JUGAR CARTA
# -------------------------

def jugar(carta):

    jugador.remove(carta)


    mesa.append(carta)


    mostrar_mesa()


    mostrar_jugador()



# -------------------------
# MOSTRAR CARTAS JUGADOR
# -------------------------

def mostrar_jugador():


    for widget in frame_jugador.winfo_children():

        widget.destroy()



    for carta in jugador:


        boton=tk.Button(

            frame_jugador,

            text=f"{carta['nombre']}\n{carta['palo']}",

            width=12,

            height=5,

            command=lambda c=carta:jugar(c)

        )


        boton.pack(

            side="left",

            padx=10

        )





mostrar_mesa()

mostrar_jugador()



ventana.mainloop()
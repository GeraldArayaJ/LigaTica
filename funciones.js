document.addEventListener("DOMContentLoaded", () => {
    const calculateButton = document.getElementById("calculateButton");

    // Tabla de puntos según posición
    const pointsByPosition = {
        1: 12,
        2: 9,
        3: 8,
        4: 7,
        5: 6,
        6: 5,
        7: 4,
        8: 3,
        9: 2,
        10: 1,
        11: 0,
        12: 0
    };

    // Objeto para almacenar puntajes acumulados
    let tablaPuntajes = {};
    let botonTablaCreado = false;

    calculateButton.addEventListener("click", () => {
        for (let i = 1; i <= 12; i++) {
            let nombre = document.getElementById(`name${i}`).value.trim();
            let kills = parseInt(document.getElementById(`kills${i}`).value) || 0;
            let position = parseInt(document.getElementById(`posi${i}`).value) || 0;

            if (nombre) {
                // Puntos por posición
                let posPoints = pointsByPosition[position] || 0;

                // Puntos totales = posición + kills
                let totalPoints = posPoints + kills;

                // Mostrar en la celda "Resultado"
                document.getElementById(`result${i}`).textContent = totalPoints;

                // Acumular puntos
                if (!tablaPuntajes[nombre]) {
                    tablaPuntajes[nombre] = totalPoints;
                } else {
                    tablaPuntajes[nombre] += totalPoints;
                }
            }
        }

        // Crear botón de tabla si no existe
        if (!botonTablaCreado) {
            const btnCrearTabla = document.createElement("button");
            btnCrearTabla.textContent = "Crear Tabla de Puntajes";
            btnCrearTabla.type = "button";
            btnCrearTabla.id = "btnTabla";
            document.body.appendChild(btnCrearTabla);

            btnCrearTabla.addEventListener("click", mostrarTabla);
            botonTablaCreado = true;
        }
    });

    function mostrarTabla() {
        // Eliminar tabla anterior si existe
        const tablaExistente = document.getElementById("tablaClasificacion");
        if (tablaExistente) tablaExistente.remove();

        // Crear tabla
        const tabla = document.createElement("table");
        tabla.border = "1";
        tabla.cellPadding = "5";
        tabla.id = "tablaClasificacion";

        // Encabezado
        const thead = document.createElement("thead");
        const encabezadoFila = document.createElement("tr");
        ["Equipo", "Puntos"].forEach(texto => {
            const th = document.createElement("th");
            th.textContent = texto;
            encabezadoFila.appendChild(th);
        });
        thead.appendChild(encabezadoFila);
        tabla.appendChild(thead);

        // Cuerpo ordenado por puntos
        const tbody = document.createElement("tbody");
        Object.entries(tablaPuntajes)
            .sort((a, b) => b[1] - a[1]) // Orden descendente
            .forEach(([equipo, puntos]) => {
                const fila = document.createElement("tr");

                const tdNombre = document.createElement("td");
                tdNombre.textContent = equipo;
                fila.appendChild(tdNombre);

                const tdPuntos = document.createElement("td");
                tdPuntos.textContent = puntos;
                fila.appendChild(tdPuntos);

                tbody.appendChild(fila);
            });

        tabla.appendChild(tbody);
        document.body.appendChild(tabla);

        // Crear botón para borrar tabla y reiniciar puntajes si no existe
        let btnBorrar = document.getElementById("btnBorrarTabla");
        if (!btnBorrar) {
            btnBorrar = document.createElement("button");
            btnBorrar.textContent = "Borrar Tabla y Reiniciar Puntajes";
            btnBorrar.type = "button";
            btnBorrar.id = "btnBorrarTabla";
            document.body.appendChild(btnBorrar);

            btnBorrar.addEventListener("click", () => {
                const tabla = document.getElementById("tablaClasificacion");
                if (tabla) tabla.remove();
                tablaPuntajes = {}; // reinicia puntajes
                alert("Tabla eliminada y puntajes reiniciados.");
            });
        }
    }
});

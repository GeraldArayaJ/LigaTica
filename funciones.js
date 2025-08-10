document.addEventListener("DOMContentLoaded", () => {
  const addPartidaBtn = document.getElementById("addPartidaButton");
  const container = document.getElementById("partidasContainer");

  let botonesContainer = document.getElementById("botonesContainer");
  if (!botonesContainer) {
    botonesContainer = document.createElement("div");
    botonesContainer.id = "botonesContainer";
    botonesContainer.style.marginTop = "20px";
    container.appendChild(botonesContainer);
  }

  const pointsByPosition = {
    1: 12, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5,
    7: 4, 8: 3, 9: 2, 10: 1, 11: 0, 12: 0
  };

  let tablaPuntajes = {};
  let partidaCounter = 0;

  let calculateButton = null;
  let resetButton = null;
  let btnCrearTabla = null;
  let btnBorrarTabla = null;
  let btnEliminarPartida = null;
  let btnEditarPartida = null;
  let btnDescargarAcumulado = null;
  let btnDescargarTodo = null;

  function tablaInputsAExcel(tabla, nombreHoja) {
    const rows = [];
    const thead = tabla.querySelector("thead");
    const tbody = tabla.querySelector("tbody");

    if (thead) {
      const headers = [];
      thead.querySelectorAll("th").forEach(th => {
        headers.push(th.textContent.trim());
      });
      rows.push(headers);
    }

    if (tbody) {
      tbody.querySelectorAll("tr").forEach(tr => {
        const filaDatos = [];
        tr.querySelectorAll("td").forEach(td => {
          const input = td.querySelector("input");
          if (input) {
            filaDatos.push(input.value);
          } else {
            filaDatos.push(td.textContent.trim());
          }
        });
        rows.push(filaDatos);
      });
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
    return wb;
  }

  addPartidaBtn.addEventListener("click", () => {
    partidaCounter++;

    const tabla = document.createElement("table");
    tabla.border = "1";
    tabla.cellPadding = "5";
    tabla.style.marginBottom = "20px";
    tabla.id = `tablaPartida${partidaCounter}`;

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["#", "Nombre del equipo", "Kills", "Posición", "Resultado"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (let i = 1; i <= 12; i++) {
      const fila = document.createElement("tr");

      const tdNum = document.createElement("td");
      tdNum.textContent = i;
      fila.appendChild(tdNum);

      const tdName = document.createElement("td");
      const inputName = document.createElement("input");
      inputName.type = "text";
      inputName.required = true;
      inputName.id = `name_p${partidaCounter}_e${i}`;
      tdName.appendChild(inputName);
      fila.appendChild(tdName);

      const tdKills = document.createElement("td");
      const inputKills = document.createElement("input");
      inputKills.type = "number";
      inputKills.min = 0;
      inputKills.required = true;
      inputKills.id = `kills_p${partidaCounter}_e${i}`;
      tdKills.appendChild(inputKills);
      fila.appendChild(tdKills);

      const tdPosi = document.createElement("td");
      const inputPosi = document.createElement("input");
      inputPosi.type = "number";
      inputPosi.min = 1;
      inputPosi.max = 12;
      inputPosi.required = true;
      inputPosi.id = `posi_p${partidaCounter}_e${i}`;
      tdPosi.appendChild(inputPosi);
      fila.appendChild(tdPosi);

      const tdResult = document.createElement("td");
      tdResult.id = `result_p${partidaCounter}_e${i}`;
      fila.appendChild(tdResult);

      tbody.appendChild(fila);
    }
    tabla.appendChild(tbody);

    const tituloPartida = document.createElement("h3");
    tituloPartida.textContent = `Partida ${partidaCounter}`;
    tituloPartida.id = `tituloPartida${partidaCounter}`;

    const btnDescargarPartida = document.createElement("button");
    btnDescargarPartida.type = "button";
    btnDescargarPartida.textContent = `Descargar Partida ${partidaCounter} (Excel)`;
    btnDescargarPartida.style.marginLeft = "10px";

    btnDescargarPartida.addEventListener("click", () => {
      const tablaDescargar = document.getElementById(`tablaPartida${partidaCounter}`);
      if (!tablaDescargar) {
        alert("Tabla no encontrada");
        return;
      }
      const wb = tablaInputsAExcel(tablaDescargar, `Partida ${partidaCounter}`);
      XLSX.writeFile(wb, `partida_${partidaCounter}.xlsx`);
    });

    container.insertBefore(tituloPartida, botonesContainer);
    container.insertBefore(btnDescargarPartida, botonesContainer);
    container.insertBefore(tabla, botonesContainer);

    if (!calculateButton) {
      calculateButton = document.createElement("button");
      calculateButton.type = "button";
      calculateButton.id = "calculateButton";
      calculateButton.textContent = "Calcular Puntos";
      botonesContainer.appendChild(calculateButton);

      calculateButton.addEventListener("click", () => {
        tablaPuntajes = {};

        for (let p = 1; p <= partidaCounter; p++) {
          for (let e = 1; e <= 12; e++) {
            const nombreElem = document.getElementById(`name_p${p}_e${e}`);
            const killsElem = document.getElementById(`kills_p${p}_e${e}`);
            const posiElem = document.getElementById(`posi_p${p}_e${e}`);
            const resultElem = document.getElementById(`result_p${p}_e${e}`);

            if (!nombreElem || !killsElem || !posiElem || !resultElem) continue;

            const nombre = nombreElem.value.trim();
            const kills = parseInt(killsElem.value) || 0;
            const position = parseInt(posiElem.value) || 0;

            if (nombre) {
              const posPoints = pointsByPosition[position] || 0;
              const totalPoints = posPoints + kills;
              resultElem.textContent = totalPoints;

              if (!tablaPuntajes[nombre]) {
                tablaPuntajes[nombre] = totalPoints;
              } else {
                tablaPuntajes[nombre] += totalPoints;
              }
            } else {
              resultElem.textContent = "";
            }
          }
        }

        if (!btnCrearTabla) crearBotonTabla();
      });
    }

    if (!resetButton) {
      resetButton = document.createElement("button");
      resetButton.type = "button";
      resetButton.id = "resetButton";
      resetButton.textContent = "Eliminar Todas las Partidas";
      botonesContainer.appendChild(resetButton);

      resetButton.addEventListener("click", () => {
        // Eliminar todas las partidas, títulos y botones de descarga creados dinámicamente
        for (let i = partidaCounter; i >= 1; i--) {
          const tabla = document.getElementById(`tablaPartida${i}`);
          const titulo = document.getElementById(`tituloPartida${i}`);
          const btnDescargar = Array.from(container.querySelectorAll("button")).find(btn =>
            btn.textContent === `Descargar Partida ${i} (Excel)`
          );
          if (tabla) tabla.remove();
          if (titulo) titulo.remove();
          if (btnDescargar) btnDescargar.remove();
        }

        // También elimina la tabla acumulada si existe
        const tablaClasificacion = document.getElementById("tablaClasificacion");
        if (tablaClasificacion) tablaClasificacion.remove();

        // Eliminar botones extras si existen
        if (btnCrearTabla) { btnCrearTabla.remove(); btnCrearTabla = null; }
        if (btnBorrarTabla) { btnBorrarTabla.remove(); btnBorrarTabla = null; }
        if (btnDescargarAcumulado) { btnDescargarAcumulado.remove(); btnDescargarAcumulado = null; }
        if (btnDescargarTodo) { btnDescargarTodo.remove(); btnDescargarTodo = null; }

        tablaPuntajes = {};
        partidaCounter = 0;

        addPartidaBtn.style.display = "inline-block";
      });
    }

    if (!btnEliminarPartida) {
      btnEliminarPartida = document.createElement("button");
      btnEliminarPartida.type = "button";
      btnEliminarPartida.id = "btnEliminarPartida";
      btnEliminarPartida.textContent = "Eliminar Última Partida";
      botonesContainer.appendChild(btnEliminarPartida);

      btnEliminarPartida.addEventListener("click", () => {
        if (partidaCounter === 0) {
          alert("No hay partidas para eliminar.");
          return;
        }
        const ultimaTabla = document.getElementById(`tablaPartida${partidaCounter}`);
        const ultimoTitulo = document.getElementById(`tituloPartida${partidaCounter}`);
        const ultimoBtnDescargar = Array.from(container.querySelectorAll("button")).find(btn =>
          btn.textContent === `Descargar Partida ${partidaCounter} (Excel)`
        );
        if (ultimaTabla) ultimaTabla.remove();
        if (ultimoTitulo) ultimoTitulo.remove();
        if (ultimoBtnDescargar) ultimoBtnDescargar.remove();

        partidaCounter--;

        if (partidaCounter === 0) {
          tablaPuntajes = {};
          if (btnCrearTabla) btnCrearTabla.remove();
          btnCrearTabla = null;
          if (btnBorrarTabla) btnBorrarTabla.remove();
          btnBorrarTabla = null;
          if (btnDescargarAcumulado) btnDescargarAcumulado.remove();
          btnDescargarAcumulado = null;
          if (btnDescargarTodo) btnDescargarTodo.remove();
          btnDescargarTodo = null;
        }
      });
    }

    if (!btnEditarPartida) {
      btnEditarPartida = document.createElement("button");
      btnEditarPartida.type = "button";
      btnEditarPartida.id = "btnEditarPartida";
      btnEditarPartida.textContent = "Editar Última Partida";
      botonesContainer.appendChild(btnEditarPartida);

      btnEditarPartida.addEventListener("click", () => {
        if (partidaCounter === 0) {
          alert("No hay partidas para editar.");
          return;
        }
        const inputEditar = document.getElementById(`name_p${partidaCounter}_e1`);
        if (inputEditar) inputEditar.focus();
      });
    }
  });

  function crearBotonTabla() {
    const botonesContainer = document.getElementById("botonesContainer");

    btnCrearTabla = document.createElement("button");
    btnCrearTabla.textContent = "Crear Tabla de Puntajes Acumulados";
    btnCrearTabla.type = "button";
    btnCrearTabla.id = "btnTabla";
    botonesContainer.appendChild(btnCrearTabla);

    btnCrearTabla.addEventListener("click", mostrarTabla);
  }

  function mostrarTabla() {
    const container = document.getElementById("partidasContainer");

    let tablaExistente = document.getElementById("tablaClasificacion");
    if (tablaExistente) tablaExistente.remove();

    const tabla = document.createElement("table");
    tabla.border = "1";
    tabla.cellPadding = "5";
    tabla.id = "tablaClasificacion";
    tabla.style.marginTop = "20px";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Equipo", "Puntos"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    Object.entries(tablaPuntajes)
      .sort((a, b) => b[1] - a[1])
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

    container.appendChild(tabla);

    if (!btnDescargarAcumulado) {
      btnDescargarAcumulado = document.createElement("button");
      btnDescargarAcumulado.type = "button";
      btnDescargarAcumulado.id = "btnDescargarAcumulado";
      btnDescargarAcumulado.textContent = "Descargar Tabla Acumulada (Excel)";
      container.appendChild(btnDescargarAcumulado);

      btnDescargarAcumulado.addEventListener("click", () => {
        const tablaAcum = document.getElementById("tablaClasificacion");
        if (!tablaAcum) {
          alert("Primero crea la tabla acumulada");
          return;
        }
        const wb = tablaInputsAExcel(tablaAcum, "Puntajes Acumulados");
        XLSX.writeFile(wb, "puntajes_acumulados.xlsx");
      });
    }

    if (!btnBorrarTabla) {
      btnBorrarTabla = document.createElement("button");
      btnBorrarTabla.type = "button";
      btnBorrarTabla.id = "btnBorrarTabla";
      btnBorrarTabla.textContent = "Borrar Tabla y Reiniciar Puntajes";
      container.appendChild(btnBorrarTabla);

      btnBorrarTabla.addEventListener("click", () => {
        const tabla = document.getElementById("tablaClasificacion");
        if (tabla) tabla.remove();
        tablaPuntajes = {};
        alert("Tabla eliminada y puntajes reiniciados.");
      });
    }

    if (!btnDescargarTodo) {
      btnDescargarTodo = document.createElement("button");
      btnDescargarTodo.type = "button";
      btnDescargarTodo.id = "btnDescargarTodo";
      btnDescargarTodo.textContent = "Descargar Todas las Partidas y Tabla Acumulada (Excel)";
      container.appendChild(btnDescargarTodo);

      btnDescargarTodo.addEventListener("click", () => {
        const wb = XLSX.utils.book_new();

        for (let p = 1; p <= partidaCounter; p++) {
          const tablaP = document.getElementById(`tablaPartida${p}`);
          if (!tablaP) continue;
          const wbPartida = tablaInputsAExcel(tablaP, `Partida ${p}`);
          XLSX.utils.book_append_sheet(wb, wbPartida.Sheets[`Partida ${p}`], `Partida ${p}`);
        }

        const tablaAcum = document.getElementById("tablaClasificacion");
        if (tablaAcum) {
          const wbAcum = tablaInputsAExcel(tablaAcum, "Puntajes Acumulados");
          XLSX.utils.book_append_sheet(wb, wbAcum.Sheets["Puntajes Acumulados"], "Puntajes Acumulados");
        }

        XLSX.writeFile(wb, "todas_las_partidas_y_acumulado.xlsx");
      });
    }
  }
});

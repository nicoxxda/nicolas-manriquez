class TarjetaDePago {
    constructor(numero, fechaDeCarga, numeroChip, saldoAnterior, saldoActual, habilitada) {
        this.numero = numero;
        this.fechaDeCarga = new Date(fechaDeCarga);
        this.numeroChip = numeroChip;
        this.saldoAnterior = saldoAnterior;
        this.saldoActual = saldoActual;
        this.habilitada = habilitada;
        this.montoDeCargas = 0;
    }

    actualizarSaldo(monto) {
        this.saldoAnterior = this.saldoActual;
        this.saldoActual += monto;
        this.montoDeCargas += monto;
    }
}

class Caja {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
        this.tarjetas = [];
    }

    agregarTarjeta(tarjeta) {
        this.tarjetas.push(tarjeta);
    }

    cargarMonto(numeroTarjeta, monto) {
        let tarjeta = this.tarjetas.find(t => t.numero === numeroTarjeta);
        if (tarjeta && tarjeta.habilitada) {
            tarjeta.actualizarSaldo(monto);
            return { success: true, tarjeta: tarjeta };
        }
        return { success: false };
    }

    cambiarEstado(numeroTarjeta, habilitada) {
        let tarjeta = this.tarjetas.find(t => t.numero === numeroTarjeta);
        if (tarjeta) {
            tarjeta.habilitada = habilitada;
            return true;
        }
        return false;
    }

    consultarTarjetasHabilitadas() {
        return this.tarjetas.filter(t => t.habilitada).length;
    }

    consultarTarjetasDeshabilitadas() {
        return this.tarjetas.filter(t => !t.habilitada).length;
    }

    consultarTarjetasHabilitadasPorFecha(inicio, fin) {
        return this.tarjetas.filter(t => t.habilitada && t.fechaDeCarga >= inicio && t.fechaDeCarga <= fin).length;
    }

    consultarMontoPromedioSaldosAnteriores() {
        let tarjetasConSaldos = this.tarjetas.filter(t => t.saldoAnterior > 0);
        let totalSaldos = tarjetasConSaldos.reduce((sum, t) => sum + t.saldoAnterior, 0);
        return totalSaldos / tarjetasConSaldos.length || 0;
    }

    consultarMontoPromedioCargas() {
        let totalCargas = this.tarjetas.reduce((sum, t) => sum + t.montoDeCargas, 0);
        return totalCargas / this.tarjetas.length || 0;
    }

    consultarMontoTotalSaldosAnteriores() {
        return this.tarjetas.reduce((sum, t) => sum + t.saldoAnterior, 0);
    }

    consultarMontoTotalCargasHabilitadas() {
        return this.tarjetas.filter(t => t.habilitada).reduce((sum, t) => sum + t.montoDeCargas, 0);
    }

    consultarMontoTotalCargasDeshabilitadas() {
        return this.tarjetas.filter(t => !t.habilitada).reduce((sum, t) => sum + t.montoDeCargas, 0);
    }
}

let cajas = [];

function inicializarDatos() {
    let caja1 = new Caja(1, "Caja 1");
    let caja2 = new Caja(2, "Caja 2");

    caja1.agregarTarjeta(new TarjetaDePago(101001, "2023-01-01", 1234, 100, 100, true));
    caja1.agregarTarjeta(new TarjetaDePago(102002, "2023-01-01", 1235, 200, 200, false));
    caja1.agregarTarjeta(new TarjetaDePago(103003, "2023-01-01", 1236, 300, 300, true));
    caja1.agregarTarjeta(new TarjetaDePago(104004, "2023-01-01", 1237, 400, 400, true));
    caja1.agregarTarjeta(new TarjetaDePago(105005, "2023-01-01", 1238, 500, 500, false));

    caja2.agregarTarjeta(new TarjetaDePago(201001, "2023-01-01", 2234, 150, 150, true));
    caja2.agregarTarjeta(new TarjetaDePago(202002, "2023-01-01", 2235, 250, 250, true));
    caja2.agregarTarjeta(new TarjetaDePago(203003, "2023-01-01", 2236, 350, 350, false));
    caja2.agregarTarjeta(new TarjetaDePago(204004, "2023-01-01", 2237, 450, 450, true));
    caja2.agregarTarjeta(new TarjetaDePago(205005, "2023-01-01", 2238, 550, 550, false));

    cajas.push(caja1);
    cajas.push(caja2);
}

// Validación para asegurar que el número de tarjeta tenga exactamente 6 dígitos
function validarNumeroTarjeta(numeroTarjeta) {
    return numeroTarjeta.toString().length === 6;
}

document.getElementById('cargarMontoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let numeroTarjeta = document.getElementById('numeroTarjeta').value;
    if (!validarNumeroTarjeta(numeroTarjeta)) {
        alert('El número de tarjeta debe tener exactamente 6 dígitos.');
        return;
    }
    numeroTarjeta = parseInt(numeroTarjeta);
    let montoCarga = parseFloat(document.getElementById('montoCarga').value);
    let resultado = cajas[0].cargarMonto(numeroTarjeta, montoCarga);
    if (resultado.success) {
        alert(`Monto cargado correctamente. Nuevo saldo: ${resultado.tarjeta.saldoActual}`);
    } else {
        alert('No se pudo cargar el monto. Asegúrese de que la tarjeta esté habilitada.');
    }
});

document.getElementById('cambiarEstadoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let numeroTarjeta = document.getElementById('numeroTarjetaEstado').value;
    if (!validarNumeroTarjeta(numeroTarjeta)) {
        alert('El número de tarjeta debe tener exactamente 6 dígitos.');
        return;
    }
    numeroTarjeta = parseInt(numeroTarjeta);
    let estado = document.getElementById('estadoTarjeta').value === 'habilitar';
    let resultado = cajas[0].cambiarEstado(numeroTarjeta, estado);
    if (resultado) {
        alert(`Tarjeta ${estado ? 'habilitada' : 'deshabilitada'} correctamente.`);
    } else {
        alert('No se pudo cambiar el estado de la tarjeta.');
    }
});

function consultarTarjetasHabilitadas() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarTarjetasHabilitadas()} tarjetas habilitadas\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarTarjetasDeshabilitadas() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarTarjetasDeshabilitadas()} tarjetas deshabilitadas\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarPromedioSaldosAnteriores() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoPromedioSaldosAnteriores().toFixed(2)} promedio de saldos anteriores\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarPromedioCargas() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoPromedioCargas().toFixed(2)} promedio de cargas\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarTotalSaldosAnteriores() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoTotalSaldosAnteriores().toFixed(2)} total de saldos anteriores\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarTotalCargasHabilitadas() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoTotalCargasHabilitadas().toFixed(2)} total de cargas habilitadas\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarTotalCargasDeshabilitadas() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoTotalCargasDeshabilitadas().toFixed(2)} total de cargas deshabilitadas\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

inicializarDatos();

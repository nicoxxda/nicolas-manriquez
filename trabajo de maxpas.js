class TarjetaDePago {
    constructor(numero, fechaDeCarga, clave, saldoActual, montoDeCargas, habilitada) {
        this.numero = numero;
        this.fechaDeCarga = fechaDeCarga;
        this.clave = clave;
        this.saldoActual = saldoActual;
        this.montoDeCargas = montoDeCargas;
        this.habilitada = habilitada;
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
            tarjeta.saldoActual += monto;
            tarjeta.montoDeCargas += monto;
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

    consultarMontoPromedioSaldosAnteriores() {
        let tarjetasConSaldos = this.tarjetas.filter(t => t.saldoActual > 0);
        let totalSaldos = tarjetasConSaldos.reduce((sum, t) => sum + t.saldoActual, 0);
        return totalSaldos / tarjetasConSaldos.length || 0;
    }

    consultarMontoPromedioCargas() {
        let totalCargas = this.tarjetas.reduce((sum, t) => sum + t.montoDeCargas, 0);
        return totalCargas / this.tarjetas.length || 0;
    }

    consultarMontoTotalSaldosAnteriores() {
        return this.tarjetas.reduce((sum, t) => sum + t.saldoActual, 0);
    }

    consultarMontoTotalCargasHabilitadas() {
        return this.tarjetas.filter(t => t.habilitada).reduce((sum, t) => sum + t.montoDeCargas, 0);
    }

    consultarMontoTotalCargasDeshabilitadas() {
        return this.tarjetas.filter(t => !t.habilitada).reduce((sum, t) => sum + t.montoDeCargas, 0);
    }
}

let cajas = [];

document.getElementById('cargarMontoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let numeroTarjeta = parseInt(document.getElementById('numeroTarjeta').value);
    let montoCarga = parseFloat(document.getElementById('montoCarga').value);
    let montoCargado = false;

    cajas.forEach(caja => {
        let resultado = caja.cargarMonto(numeroTarjeta, montoCarga);
        if (resultado.success) {
            montoCargado = true;
            alert(`Monto de ${montoCarga} cargado a la tarjeta ${numeroTarjeta}. Nuevo saldo: ${resultado.tarjeta.saldoActual}`);
        }
    });

    if (!montoCargado) {
        alert(`No se pudo cargar el monto a la tarjeta ${numeroTarjeta}. Verifique que la tarjeta esté habilitada.`);
    }
});

document.getElementById('cambiarEstadoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let numeroTarjetaEstado = parseInt(document.getElementById('numeroTarjetaEstado').value);
    let estadoTarjeta = document.getElementById('estadoTarjeta').value === 'habilitar';
    let estadoCambiado = false;

    cajas.forEach(caja => {
        if (caja.cambiarEstado(numeroTarjetaEstado, estadoTarjeta)) {
            estadoCambiado = true;
            alert(`Estado de la tarjeta ${numeroTarjetaEstado} cambiado a ${estadoTarjeta ? 'Habilitada' : 'Deshabilitada'}`);
        }
    });

    if (!estadoCambiado) {
        alert(`No se pudo cambiar el estado de la tarjeta ${numeroTarjetaEstado}. Verifique el número de tarjeta.`);
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
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoPromedioSaldosAnteriores()} promedio de saldos anteriores\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarPromedioCargas() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoPromedioCargas()} promedio de cargas\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarTotalSaldosAnteriores() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoTotalSaldosAnteriores()} total de saldos anteriores\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarTotalCargasHabilitadas() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoTotalCargasHabilitadas()} total de cargas habilitadas\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function consultarTotalCargasDeshabilitadas() {
    let resultado = '';
    cajas.forEach(caja => {
        resultado += `Caja ${caja.nombre}: ${caja.consultarMontoTotalCargasDeshabilitadas()} total de cargas deshabilitadas\n`;
    });
    document.getElementById('resultados').innerText = resultado;
}

function inicializarDatos() {
    let caja1 = new Caja(1, "Caja 1");
    let caja2 = new Caja(2, "Caja 2");

    caja1.agregarTarjeta(new TarjetaDePago(100001, "2023-01-01", 1234, 100, 0, true));
    caja1.agregarTarjeta(new TarjetaDePago(100002, "2023-01-01", 1235, 200, 0, false));
    caja1.agregarTarjeta(new TarjetaDePago(100003, "2023-01-01", 1236, 300, 0, true));
    caja1.agregarTarjeta(new TarjetaDePago(100004, "2023-01-01", 1237, 400, 0, true));
    caja1.agregarTarjeta(new TarjetaDePago(100005, "2023-01-01", 1238, 500, 0, false));

    caja2.agregarTarjeta(new TarjetaDePago(200001, "2023-01-01", 2234, 150, 0, true));
    caja2.agregarTarjeta(new TarjetaDePago(200002, "2023-01-01", 2235, 250, 0, true));
    caja2.agregarTarjeta(new TarjetaDePago(200003, "2023-01-01", 2236, 350, 0, false));
    caja2.agregarTarjeta(new TarjetaDePago(200004, "2023-01-01", 2237, 450, 0, true));
    caja2.agregarTarjeta(new TarjetaDePago(200005, "2023-01-01", 2238, 550, 0, false));

    cajas.push(caja1);
    cajas.push(caja2);
}

inicializarDatos();

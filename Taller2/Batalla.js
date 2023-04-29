
const attacks = require("./attacks.json");

/*--------|CREAR PERSONAJE|-------*/
function crearPersonaje(name, clase){
    return {
        name: name,
        class: clase,
        firstAttack: asignarAtaque(clase),
        secondAttack: asignarAtaque(clase),
        hp: asignarVida(),
        speed: asignarVelocidad(),
        fallos: 0
    }
}
var personaje1 = crearPersonaje("nombre-generico-1", asignarClase());
var personaje2 = crearPersonaje("nombre-generico-2", asignarClase());

/*--------|CALCULAR RANDOM|-------*/
function calcularRandom(min, max){
    return Math.floor(Math.random() * ((max) - min)) + min;
}
/*--------|ASIGNAR ATAQUE SEGUN TIPO|-------*/
function asignarAtaque(clase){
    if (clase === "MAGICIAN" || clase === "FAIRY"){
        type = "MAGIC";
    }
    else if(clase === "KNIGHT" || clase === "WARRIOR"){
        type = "PHYSICAL";
    }
    const filteredData = attacks.filter(item => item.type === type);
    const random = calcularRandom(0, filteredData.length);
    return filteredData[random];
}
/*--------|ASIGNAR CLASE|-------*/
function asignarClase(){
    const clase = ["MAGICIAN", "KNIGHT", "WARRIOR", "FAIRY"]
    const random = calcularRandom(0, clase.length);
    return clase[random];
}
/*--------|ASIGNAR VIDA|-------*/
function asignarVida(){
    return calcularRandom(100, 200);
}
/*--------|ASIGNAR VELOCIDAD|-------*/
function asignarVelocidad(){
    return calcularRandom(1, 10);
}
/*--------|ATACAR segun personaje y ataque|-------*/
function seleccionarAtaque(personaje){
    let seleccion = calcularRandom(1,2);
    if(seleccion === 1){
        return personaje.firstAttack;
    }
    else{
        return personaje.secondAttack;
    }
}
/*--------|COMPROBAR SI ACERTÓ|--------*/
function comprobarAcierto(ataque){
    let porcentajeFallo = ataque.accuracy;
    let acierto = calcularRandom(porcentajeFallo, 100);
    if(acierto > porcentajeFallo){
        return true;
    }
    else{
        return false;
    }
}
/*--------|CALCULAR DAÑO|-------*/
function calcularDaño(ataque){
    return ataque.damage;

}
    
/*--------|ASIGNAR TURNO SEGUN VELOCIDAD|-------*/
function asignarTurno(personaje1, personaje2){
    if(personaje1.speed > personaje2.speed){
        return [personaje1, personaje2];
    }
    else{
        return [personaje2, personaje1];
    }
}
/*---------|FORMATO BATALLA|---------- */
/*
—------------------------------------------------------------------------------------------------------------------
### INICIO ###
Personaje_1 | CLASS_1 | HEALTH_1 de vida vs Personaje_2 | CLASS_2 | HEALTH_2 de vida
### BATALLA ###
Turno N
Personaje_1 ataca con ATACK_NAME… Da en el blanco!. La vida del Personaje_2 queda en
HEALTH_2.
Personaje_2 ataca con ATACK_NAME… Da en el blanco!. La vida del Personaje_1 queda en
HEALTH_1.
Turno N
Personaje_1 ataca con ATACK_NAME_1…Falla!. La vida del Personaje_2 se mantiene en
HEALTH_2.
Personaje_2 ataca con ATACK_NAME_2…Falla!. La vida del Personaje_1 se mantiene en
HEALTH_1.
Turno N
Personaje_1 ataca con ATACK_NAME_1…Falla!. La vida del Personaje_2 se mantiene en
HEALTH_2.
Personaje_2 ataca con ATACK_NAME_2…Da en el blanco!. El Personaje_1 no puede
continuar.
### RESUMEN ###
Personaje_2 gana la batalla!
El Personaje_1 falló N_FALLOS_1 veces su ataque
El Personaje_2 falló N_FALLOS_2 veces su ataque
—------------------------------------------------------------------------------------------------------------------------
*/
/*--------|BATALLA|-------*/
function batalla(personaje1, personaje2){
    let turnoJugador = [];
    let ganador = null;
    let ronda = 1;
    let logs = inicio(personaje1, personaje2); 
    var lineaBatalla = "\n### BATALLA ###";
    logs += lineaBatalla;
    while(ganador === null){
        logs += "\nTurno " + ronda + "\n";
        turnoJugador = asignarTurno(personaje1, personaje2);
        let cantidadVida = turno(turnoJugador[0], turnoJugador[1], ronda);
        let cantidadFallos = [cantidadVida[3], cantidadVida[4]];
        personaje1.fallos += cantidadFallos[0];
        personaje2.fallos += cantidadFallos[1];
        /*------|cantidadVida tiene [GANADOR, PERDEDOR, LOGS, fallos1, fallos2]|------*/
        if(cantidadVida[1].hp <= 0 || cantidadVida[0].hp <= 0){
            ganador = turnoJugador[0];
            logs += cantidadVida[2];
        }
        logs += cantidadVida[2];
        ronda++;
    }
    logs += resumen(turnoJugador[0], turnoJugador[1], personaje1.fallos, personaje2.fallos);
    generateFileLog(logs, "LOGS_DE_BATALLA.txt")    
}
/*--------|INICIO|-------*/
function inicio(personaje1, personaje2){
    var linea1 = ("—------------------------------------------------------------------------------------------------------------------------");
    var linea2 = ("\n### INICIO ###");
    var linea3 = ("\n" + personaje1.name + " | " + personaje1.class + " | " + personaje1.hp + " de vida vs " + personaje2.name + " | " + personaje2.class + " | " + personaje2.hp + " de vida");
    return [linea1 + linea2 + linea3];
}
/*--------|TURNO|-------*/
function turno(personaje1, personaje2, turno){
    let fallo1 = 0;
    let fallo2 = 0;
    let logs = "";
    var lineaAccion1 = "";
    let ataquePersonaje1 = seleccionarAtaque(personaje1);
    let ataquePersonaje2 = seleccionarAtaque(personaje2);
    let acierto1 = comprobarAcierto(ataquePersonaje1);
    let acierto2 = comprobarAcierto(ataquePersonaje2);
    if(acierto1 === true && personaje1.hp > 0){// si acierta y tiene vida ataca personaje 1
        let daño = calcularDaño(ataquePersonaje1);
        personaje2.hp = personaje2.hp - daño;
        lineaAccion1 = (personaje1.name + " ataca con " + ataquePersonaje1.name + "… Da en el blanco!. La vida del " + personaje2.name + " queda en " + personaje2.hp);
        logs += "\n" + lineaAccion1;
    }
    else if(personaje1.hp > 0){ // si falla y tiene vida no ataca personaje 1
        lineaAccion1 = (personaje1.name + " ataca con " + ataquePersonaje1.name + "… Falla!. La vida del " + personaje2.name + " se mantiene en " + personaje2.hp);
        logs += "\n" + lineaAccion1;
        fallo1 = 1;
    }
    if(acierto2 === true && personaje2.hp > 0){ // si acierta y tiene vida ataca personaje 2
        let daño = calcularDaño(ataquePersonaje2);
        personaje1.hp = personaje1.hp - daño;
        var lineaAcierto2 = (personaje2.name + " ataca con " + ataquePersonaje2.name + "… Da en el blanco!. La vida del " + personaje1.name + " queda en " + personaje1.hp);
        logs += "\n" + lineaAcierto2;
        return [personaje1, personaje2, logs,fallo1, fallo2];
    }
    else if(personaje2.hp > 0){ // si falla y tiene vida no ataca personaje 2
        var lineaFallo2 = (personaje2.name + " ataca con " + ataquePersonaje2.name + "… Falla!. La vida del " + personaje1.name + " se mantiene en " + personaje1.hp);
        logs += "\n" + lineaFallo2;
        fallo2 = 1;
        return [personaje1, personaje2, logs, fallo1, fallo2];
    }
    if(personaje1.hp <= 0){ // si el personaje 1 se queda sin vida se asigna el dos como ganador y se retorna en orden de ganador y perdedor junto con los logs y los fallos
        let ganador = personaje2;
        let perdedor = personaje1;
        return [ganador, perdedor, logs, fallo1, fallo2];
    }
    else if(personaje2.hp <= 0){ // si el personaje 2 se queda sin vida se asigna el uno como ganador y se retorna en orden de ganador y perdedor junto con los logs y los fallos
        let ganador = personaje1;
        let perdedor = personaje2;
        return [ganador, perdedor, logs, fallo2, fallo1];
    }
}
/*--------|RESUMEN|-------*/
function resumen(personaje1, personaje2, fallos1, fallos2){
    var linea1 = ("\n### RESUMEN ###");
    var linea2 = ("\n" + personaje2.name + " gana la batalla!");
    var linea3 = ("\nEl " + personaje2.name + " falló " + fallos2 + " veces su ataque");
    var linea4 = ("\nEl " + personaje1.name + " falló " + fallos1 + " veces su ataque");
    var linea5 = ("\n—------------------------------------------------------------------------------------------------------------------------");
    return [linea1 + linea2 + linea3 + linea4 + linea5];
}

function generateFileLog(logs, filename) {
    const fs = require("fs");
    fs.writeFile(filename, logs, (err) => {
    if (err) throw err;
    });
}
/*-----------------------------|COMIENZO DE BATALLA|-------------------------------*/
batalla(personaje1, personaje2);
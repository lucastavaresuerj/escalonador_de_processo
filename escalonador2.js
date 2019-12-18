const fs = require('fs');
var processos = [];
var processosTerminados = 0;
var entrada = fs.readFileSync('entrada.in');

function processaEntrada() {
    var stringEntrada = entrada.toString()
    var processosDaEntrada = stringEntrada.match(/[^ ].*\n(\n|)/g)
    for(var p of processosDaEntrada){
        var processo = {
            etapas: p.split(', '),
            naFila: true,
            tempoNaFila: 0
        }
        processos.push(processo)
    }
}

function escalonador() {
    var tempo = 0;
    var processoAtual = avalia();
    var indiceProcesso = 0;
    while(processos.length != processosTerminados){
        indiceProcesso = 0;
        contaIO=0;
        processoAtual = avalia()
        for(processo of processos) {
            if(processo.naFila) {
                var etapa = processo.etapas[0]
                if((!/[1-9]/.test(etapa))) { // (?<!\d) (cpu)|(io)
                    processo.etapas.shift()
                    if(processo.etapas.length == 0){
                        processo.naFila = false
                        processosTerminados++;
                    }
                    processo.tempoNaFila++;
                    tempo++
                    indiceProcesso++;
                    continue    
                }
                else if(/io/.test(etapa)){ // E IO
                    IOrestante = etapa.match(/[0-9]+/)[0]
                    etapa = etapa.replace(/[0-9]+/, IOrestante - 1)
                }
                else if(indiceProcesso == processoAtual) { // E CPU
                    CPUrestanteProximoProcesso = etapa.match(/[0-9]+/)[0]
                    CPUrestanteProximoProcesso--;
                    etapa = etapa.replace(/[0-9]+/, CPUrestanteProximoProcesso)
                    tempo++
                }               
                processo.etapas[0] = etapa;
                processo.tempoNaFila++;
            }
            indiceProcesso++;
        }
        
    }
    return tempo;
}

function imprimeTempos(){
    var numeroProcesso = 0;
    for(processo of processos) {
        numeroProcesso++;
        console.log("processo: "+numeroProcesso+" tempo: "+processo.tempoNaFila)
    }
}

function avalia(){
    var minimo = Infinity;
    var ind = 0;
    var indiceMinimo = Infinity
    var restante = 0;
    for(processo of processos){
        if(processo.naFila){
            if(/cpu/.test(processo.etapas[0]) ){
                restante = processo.etapas[0].match(/[0-9]+/)[0]
                if(parseInt(restante) < minimo) {
                    minimo = restante
                    indiceMinimo = ind
                }
            }
        }
        ind++;
    }
    return indiceMinimo
}

processaEntrada()
var tempo = escalonador()
imprimeTempos()
console.log(tempo)

/* =========================================
   BANCO DE DADOS DAS MÁQUINAS
========================================= */

const maquinas = {


     "LBSC 30": {
        consumo: 0.395,
        imagem: "assets/maq30.png"
    },


    "LBSC 45": {
        consumo: 0.009,
        imagem: "assets/maq45.png"
    },


    "LBSC 70": {
        consumo: 0.000967031,
        imagem: "assets/maq70.png"
    },


    "LBSC 100": {
        consumo: 0.000967031,
        imagem: "assets/maq100.png"
    },

    "LBSC 120": {
        consumo: 0.000967031,
        imagem: "assets/maq120.png"
    },

    "LBSC 150": {
        consumo: 0.00139,
        imagem: "assets/maq150.png"
    },

    "LBSC 400": {
        consumo: 0.00139,
        imagem: "assets/maq400.png"
    }

};


/* =========================================
   ELEMENTOS
========================================= */

const machineSelect =
    document.getElementById("machine");

const machineImage =
    document.getElementById("machineImage");

const imagePlaceholder =
    document.getElementById("imagePlaceholder");

const machineName =
    document.getElementById("machineName");

const machineConsumption =
    document.getElementById("machineConsumption");

const powerInput =
    document.getElementById("power");

const shotTimeInput =
    document.getElementById("shotTime");

const intervalInput =
    document.getElementById("intervalTime");

const refillVolumeInput =
    document.getElementById("refillVolume");

const densityInput =
    document.getElementById("density");

const startTimeInput =
    document.getElementById("startTime");

const endTimeInput =
    document.getElementById("endTime");

const calculateButton =
    document.getElementById("calculateButton");

const dayButtons =
    document.querySelectorAll(".days button");


/* =========================================
   DIAS SELECIONADOS
========================================= */

let selectedDays = [];


/* =========================================
   SELEÇÃO DOS DIAS
========================================= */

dayButtons.forEach(button => {

    button.addEventListener("click", () => {

        const day =
            Number(button.dataset.day);

        button.classList.toggle("selected");

        if (selectedDays.includes(day)) {

            selectedDays =
                selectedDays.filter(
                    item => item !== day
                );

        } else {

            selectedDays.push(day);

        }

    });

});


/* =========================================
   SELEÇÃO DA MÁQUINA
========================================= */

machineSelect.addEventListener("change", () => {

    const selectedMachine =
        machineSelect.value;

    if (!selectedMachine) {

        machineName.textContent = "—";

        machineConsumption.textContent = "—";

        imagePlaceholder.style.display = "flex";

        return;
    }


    const machine =
        maquinas[selectedMachine];


    machineName.textContent =
        selectedMachine;


    machineConsumption.textContent =
        `${machine.consumo} g/s`;


    machineImage.src =
        machine.imagem;


    machineImage.style.display =
        "block";

    imagePlaceholder.style.display =
        "none";


    machineImage.onerror = () => {

        imagePlaceholder.style.display =
            "flex";

        imagePlaceholder.textContent =
            "Imagem não encontrada";

    };

});


/* =========================================
   FUNÇÃO PARA TRANSFORMAR HH:MM EM SEGUNDOS
========================================= */

function timeToSeconds(time) {

    const [hours, minutes] =
        time.split(":").map(Number);

    return (
        hours * 3600 +
        minutes * 60
    );

}


/* =========================================
   CALCULAR HORAS DE FUNCIONAMENTO
========================================= */

function calculateOperatingSeconds() {

    const start =
        timeToSeconds(
            startTimeInput.value
        );

    const end =
        timeToSeconds(
            endTimeInput.value
        );


    /*
       Caso o horário ultrapasse meia-noite,
       por exemplo:

       22:00 → 02:00
    */

    if (end <= start) {

        return (
            86400 - start + end
        );

    }


    return end - start;

}


/* =========================================
   FORMATAÇÃO DE NÚMEROS
========================================= */

function formatNumber(
    value,
    decimals = 2
) {

    return new Intl.NumberFormat(
        "pt-BR",
        {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }
    ).format(value);

}


/* =========================================
   DATA DA PRÓXIMA TROCA
========================================= */

function calculateReplacementDate(days) {

    const date =
        new Date();

    date.setDate(
        date.getDate() +
        Math.ceil(days)
    );

    return date.toLocaleDateString(
        "pt-BR"
    );

}


/* =========================================
   CLASSIFICAÇÃO DA CALIBRAGEM
========================================= */

function getCalibrationStatus(
    dailyConsumption
) {

    if (dailyConsumption <= 2) {

        return {
            text: "CALIBRAGEM ECONÔMICA",
            className: "economic"
        };

    }

    if (dailyConsumption <= 5) {

        return {
            text: "CALIBRAGEM MODERADA",
            className: "moderate"
        };

    }

    return {
        text: "CALIBRAGEM INTENSA",
        className: "intense"
    };

}


/* =========================================
   CÁLCULO PRINCIPAL
========================================= */

calculateButton.addEventListener(
    "click",
    calculate
);


function calculate() {


    /* =========================
       VALIDAÇÕES
    ========================== */

    const selectedMachine =
        machineSelect.value;

    const power =
        Number(powerInput.value);

    const shotTime =
        Number(shotTimeInput.value);

    const intervalTime =
        Number(intervalInput.value);

    const refillVolume =
        Number(refillVolumeInput.value);

    const density =
        Number(densityInput.value);


    if (!selectedMachine) {

        alert(
            "Selecione o modelo da máquina."
        );

        return;

    }


    if (!shotTime || shotTime <= 0) {

        alert(
            "Informe o tempo de disparo."
        );

        return;

    }


    if (intervalTime < 0) {

        alert(
            "Informe um intervalo válido."
        );

        return;

    }


    if (!refillVolume || refillVolume <= 0) {

        alert(
            "Informe o volume do refil."
        );

        return;

    }


    if (!density || density <= 0) {

        alert(
            "Informe uma densidade válida."
        );

        return;

    }


    if (
        selectedDays.length === 0
    ) {

        alert(
            "Selecione pelo menos um dia da semana."
        );

        return;

    }


    /* =========================
       DADOS DA MÁQUINA
    ========================== */

    const machine =
        maquinas[selectedMachine];

    const consumptionPerSecond =
        machine.consumo;


    /* =========================
       HORÁRIO
    ========================== */

    const operatingSeconds =
        calculateOperatingSeconds();


    /*
       Cada ciclo é:

       tempo de disparo
       +
       intervalo
    */

    const cycleTime =
        shotTime +
        intervalTime;


    /*
       Quantidade de disparos
       durante o horário
    */

    const shotsPerDay =
        Math.floor(
            operatingSeconds /
            cycleTime
        );


    /*
       Tempo efetivamente
       pulverizando por dia
    */

    const spraySecondsPerDay =
        shotsPerDay *
        shotTime;


    /* =========================
       CONSUMO EM GRAMAS
    ========================== */

    const gramsPerDay =
        spraySecondsPerDay *
        consumptionPerSecond;


    /* =========================
       CONVERSÃO PARA ML
    ========================== */

    const mlPerDay =
        gramsPerDay /
        density;


    /* =========================
       DIAS DA SEMANA
    ========================== */

    const daysPerWeek =
        selectedDays.length;


    /* =========================
       CONSUMO SEMANAL
    ========================== */

    const weeklyConsumption =
        mlPerDay *
        daysPerWeek;


    /* =========================
       CONSUMO MENSAL
    ========================== */

    /*
       Média de 4,345 semanas
       por mês.
    */

    const monthlyConsumption =
        weeklyConsumption *
        4.345;


    /* =========================
       DURAÇÃO DO REFIL
    ========================== */

    const refillDuration =
        refillVolume /
        mlPerDay;


    /*
       Importante:

       Como a máquina não funciona
       necessariamente todos os dias,
       calculamos a quantidade de
       dias corridos considerando
       os dias selecionados.

       Primeiro calculamos quantos
       dias de funcionamento são
       necessários.
    */

    const operatingDaysNeeded =
        refillVolume /
        weeklyConsumption *
        daysPerWeek;


    /*
       Conversão aproximada para
       dias corridos.
    */

    const calendarDays =
        operatingDaysNeeded *
        (7 / daysPerWeek);


    /* =========================
       DATA
    ========================== */

    const replacementDate =
        calculateReplacementDate(
            calendarDays
        );


    /* =========================
       STATUS
    ========================== */

    const status =
        getCalibrationStatus(
            mlPerDay
        );


    /* =========================
       EXIBIR RESULTADOS
    ========================== */

    document.getElementById(
        "dailyConsumption"
    ).textContent =
        formatNumber(
            mlPerDay
        );


    document.getElementById(
        "weeklyConsumption"
    ).textContent =
        formatNumber(
            weeklyConsumption
        );


    document.getElementById(
        "monthlyConsumption"
    ).textContent =
        formatNumber(
            monthlyConsumption
        );


    document.getElementById(
        "refillDuration"
    ).textContent =
        formatNumber(
            calendarDays,
            1
        );


    document.getElementById(
        "shotsPerDay"
    ).textContent =
        formatNumber(
            shotsPerDay,
            0
        );


    document.getElementById(
        "spraySeconds"
    ).textContent =
        formatNumber(
            spraySecondsPerDay,
            1
        );


    document.getElementById(
        "dailyGrams"
    ).textContent =
        `${formatNumber(
            gramsPerDay,
            3
        )} g`;


    document.getElementById(
        "replacementDate"
    ).textContent =
        replacementDate;


    /* =========================
       STATUS VISUAL
    ========================== */

    const statusElement =
        document.getElementById(
            "calibrationStatus"
        );

    statusElement.textContent =
        status.text;


    statusElement.className =
        "calibration-status";


    statusElement.classList.add(
        status.className
    );


    /* =========================
       BARRA DE VIDA
    ========================== */

    /*
       A barra representa uma escala
       visual de até 180 dias.
    */

    const percentage =
        Math.min(
            (calendarDays / 180) * 100,
            100
        );


    document.getElementById(
        "progressBar"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "lifePercentage"
    ).textContent =
        `${Math.round(percentage)}%`;


    document.getElementById(
        "lifeText"
    ).textContent =
        `${formatNumber(
            calendarDays,
            1
        )} dias estimados`;


    /* =========================
       CONSOLE
       ÚTIL PARA DEBUG
    ========================== */

    console.log(
        "===== CALIBRAGEM ====="
    );

    console.log(
        "Máquina:",
        selectedMachine
    );

    console.log(
        "Potência:",
        power
    );

    console.log(
        "Consumo:",
        consumptionPerSecond,
        "g/s"
    );

    console.log(
        "Disparo:",
        shotTime,
        "segundos"
    );

    console.log(
        "Intervalo:",
        intervalTime,
        "segundos"
    );

    console.log(
        "Disparos/dia:",
        shotsPerDay
    );

    console.log(
        "Consumo diário:",
        mlPerDay,
        "ml"
    );

    console.log(
        "Duração:",
        calendarDays,
        "dias"
    );

}
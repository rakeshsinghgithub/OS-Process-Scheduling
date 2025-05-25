function SJF() {
    const arrivalTimeArray = getInputNumbers("arrivaltime");
    const burstTimeArray = getInputNumbers("bursttime");
    const arrivalLen = arrivalTimeArray.length;
    const burstLen = burstTimeArray.length;
    if (!arrivalLen)
        return errorMessage("Arrival time cannot be blank.");
    else if (!burstLen)
        return errorMessage("Burst time cannot be blank.");
    else if (burstTimeArray.some(el => el === 0))
        return errorMessage("0 as burst time is invalid.");
    else if (arrivalLen != burstLen)
        return errorMessage("The number of arrival times and burst times does not match.");
    else if (arrivalTimeArray.some(el => el < 0))
        return errorMessage("Negative numbers can be valid for arrival times.");
    else if (burstTimeArray.some(el => el < 0))
        return errorMessage("Negative numbers can be valid for burst times.");
    let inputArray = arrivalTimeArray.map((arrival, index) => [arrival, burstTimeArray[index]]);
    
    SJFSOLVE(inputArray);
}


class Process4 {
    constructor(processNumber, arrivalTime, burstTime, priority) {
        this.visit = 0;
        this.waitingTime = 0;
        this.completionTime = 0;
        this.turnAroundTime = 0;
        this.priority = priority;
        this.burstTime = burstTime;
        this.arrivalTime = arrivalTime;
        this.tempburstTime = burstTime;
        this.processNumber = processNumber;
    }
}

function SJFSOLVE(inputArray) {
    const arrayLen = inputArray.length;
    let ti = 0;
    let avgTAT = 0, avgWT = 0;
    let processArray = inputArray.map((p, i) => new Process4(i + 1, p[0], p[1]));
    const grantChart = document.querySelector(".GrantChart");

    if (grantChart) {
        grantChart.innerHTML = "";
    }

    let blankSpace = false;
    let firstBlankSpace = true;

    let completed = 0;

    // Initial idle time if no process arrives at 0
    processArray.sort((a, b) => a.arrivalTime - b.arrivalTime);
    if (processArray[0].arrivalTime > 0) {
        printGrantChartN("-", processArray[0].arrivalTime);
        ti = processArray[0].arrivalTime;
    }

    while (completed < arrayLen) {
        let idx = -1;
        let minBurst = Infinity;

        for (let i = 0; i < arrayLen; i++) {
            if (!processArray[i].visit && processArray[i].arrivalTime <= ti && processArray[i].burstTime < minBurst) {
                minBurst = processArray[i].burstTime;
                idx = i;
            }
        }

        if (idx !== -1) {
            let p = processArray[idx];
            if (blankSpace && !firstBlankSpace) {
                printGrantChartN("-", ti);
            }
            ti += p.burstTime;
            p.completionTime = ti;
            p.turnAroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnAroundTime - p.burstTime;
            avgTAT += p.turnAroundTime;
            avgWT += p.waitingTime;
            p.visit = 1;
            completed++;

            printGrantChartN(p.processNumber, p.completionTime);
            blankSpace = false;
            firstBlankSpace = false;
        } else {
            // CPU is idle (no process has arrived yet)
            blankSpace = true;
            ti++;
        }
    }

    tablePrint(processArray, avgTAT, avgWT, "SJF");
}

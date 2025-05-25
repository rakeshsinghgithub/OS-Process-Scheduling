function getInputNumbers(id) {
    return document.getElementById(id).value
        .split(" ")
        .map(function (val) {
            return parseInt(val);
        })
        .filter(function (val) {
            return !isNaN(val);
        });
}

function NPP() {
    const arrivalTimeArray = getInputNumbers("arrivaltime");
    const burstTimeArray = getInputNumbers("bursttime");
    const priorityArray = getInputNumbers("priority");

    const arrivalLen = arrivalTimeArray.length;
    const burstLen = burstTimeArray.length;
    const priorityLen = priorityArray.length;

    if (!arrivalLen)
        return errorMessage("Arrival time cannot be blank.");
    else if (!burstLen)
        return errorMessage("Burst time cannot be blank.");
    else if (!priorityLen)
        return errorMessage("Priorities cannot be blank.");
    else if (burstTimeArray.some(el => el === 0))
        return errorMessage("0 as burst time is invalid.");
    else if (arrivalLen !== burstLen)
        return errorMessage("The number of arrival times and burst times does not match.");
    else if (burstLen !== priorityLen)
        return errorMessage("Arrival times, burst times and priorities should have equal length.");
    else if (arrivalTimeArray.some(el => el < 0))
        return errorMessage("Negative numbers are not valid for arrival times.");
    else if (burstTimeArray.some(el => el < 0))
        return errorMessage("Negative numbers are not valid for burst times.");
    else if (priorityArray.some(el => el < 0))
        return errorMessage("Negative numbers are not valid for priorities.");

    let inputArray = [];
    for (let i = 0; i < arrivalTimeArray.length; i++) {
        inputArray.push([arrivalTimeArray[i], burstTimeArray[i], priorityArray[i]]);
    }

    NPPSOLVE(inputArray);
}

class ProcessNPP {
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

function NPPSOLVE(inputArray) {
    const processArray = inputArray.map((p, i) => new ProcessNPP(i + 1, p[0], p[1], p[2]));
    const arrayLen = processArray.length;
    let ti = 0;
    let avgturnAroundTime = 0;
    let avgwaitingTime = 0;
    let grantChartArray = [];

    // Sort initially by arrival time
    processArray.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const grantChart = document.querySelector(".GrantChart");
    if (grantChart) {
        grantChart.innerHTML = "";
    }

    if (processArray[0].arrivalTime > 0) {
        grantChartArray.push(["-", processArray[0].arrivalTime]);
        ti = processArray[0].arrivalTime;
    }

    let completed = 0;
    let blankSpace = false;
    let firstBlankSpace = true;

    while (completed < arrayLen) {
        let idx = -1;
        let highestPriority = -Infinity;

        for (let j = 0; j < arrayLen; j++) {
            if (!processArray[j].visit && processArray[j].arrivalTime <= ti) {
                if (processArray[j].priority > highestPriority) {
                    highestPriority = processArray[j].priority;
                    idx = j;
                }
            }
        }

        if (idx !== -1) {
            const p = processArray[idx];

            if (blankSpace && !firstBlankSpace) {
                grantChartArray.push(["-", ti]);
            }

            ti += p.burstTime;
            p.completionTime = ti;
            p.turnAroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnAroundTime - p.burstTime;

            avgturnAroundTime += p.turnAroundTime;
            avgwaitingTime += p.waitingTime;

            p.visit = 1;
            completed++;

            grantChartArray.push([p.processNumber, ti]);

            blankSpace = false;
            firstBlankSpace = false;
        } else {
            blankSpace = true;
            ti++;
        }
    }

    printGrantChart(grantChartArray);
    tablePrint(processArray, avgturnAroundTime, avgwaitingTime, "NPP");
}

function getInputNumbers(id) {
    return document.getElementById(id).value
        .split(" ")
        .map(val => parseInt(val))
        .filter(val => !isNaN(val));
}

function PP() {
    const arrivalTimeArray = getInputNumbers("arrivaltime");
    const burstTimeArray = getInputNumbers("bursttime");
    const priorityArray = getInputNumbers("priority");

    const n = arrivalTimeArray.length;

    if (!n) return errorMessage("Arrival time cannot be blank.");
    if (burstTimeArray.length !== n) return errorMessage("Mismatch in burst times.");
    if (priorityArray.length !== n) return errorMessage("Mismatch in priorities.");
    if (arrivalTimeArray.some(el => el < 0)) return errorMessage("Negative arrival time is not valid.");
    if (burstTimeArray.some(el => el <= 0)) return errorMessage("Burst time must be positive.");
    let inputArray = arrivalTimeArray.map((arrival, index) => [arrival, burstTimeArray[index],priorityArray[i]]);
    
    PPSOLVE(inputArray);
}

class ProcessPP {
    constructor(id, arrivalTime, burstTime, priority) {
        this.processNumber = id;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.priority = priority;
        this.completionTime = 0;
        this.turnAroundTime = 0;
        this.waitingTime = 0;
        this.tempburstTime = burstTime;
        this.complete = false;
    }
}

function PPSOLVE(inputArray) {
    const n = inputArray.length;
    const processArray = inputArray.map((p, i) => new ProcessPP(i + 1, p[0], p[1], p[2]));
    let t = 0;
    let completed = 0;
    let grantChartArray = [];
    let avgWT = 0, avgTAT = 0;

    // Initial idle time check
    processArray.sort((a, b) => a.arrivalTime - b.arrivalTime);
    const grantChart = document.querySelector(".GrantChart");
    if (grantChart) {
        
        grantChart.innerHTML = "";
    }
    if (processArray[0].arrivalTime > 0) {
        grantChartArray.push(["-", processArray[0].arrivalTime]);
        t = processArray[0].arrivalTime;
    }

    while (completed < n) {
        let idx = -1;
        let maxPriority = -Infinity;

        for (let i = 0; i < n; i++) {
            if (processArray[i].arrivalTime <= t && !processArray[i].complete && processArray[i].remainingTime > 0) {
                if (processArray[i].priority > maxPriority) {
                    maxPriority = processArray[i].priority;
                    idx = i;
                }
            }
        }

        if (idx !== -1) {
            processArray[idx].remainingTime--;
            t++;
            grantChartArray.push([processArray[idx].processNumber, t]);

            if (processArray[idx].remainingTime === 0) {
                processArray[idx].completionTime = t;
                processArray[idx].turnAroundTime = t - processArray[idx].arrivalTime;
                processArray[idx].waitingTime = processArray[idx].turnAroundTime - processArray[idx].arrivalTime;
                avgWT += processArray[idx].waitingTime;
                avgTAT += processArray[idx].turnAroundTime;
                processArray[idx].complete = true;
                completed++;
            }
        } else {
            // CPU Idle
            grantChartArray.push(["-", t + 1]);
            t++;
        }
    }

    printGrantChart(grantChartArray);
    tablePrint(processArray, avgTAT, avgWT, "PP");
}

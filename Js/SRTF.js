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

function SRTF() {
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
    else if (arrivalLen !== burstLen)
        return errorMessage("Arrival and burst times count must match.");
    else if (arrivalTimeArray.some(el => el < 0))
        return errorMessage("Arrival time cannot be negative.");
    else if (burstTimeArray.some(el => el < 0))
        return errorMessage("Burst time cannot be negative.");

    const inputArray = arrivalTimeArray.map((arrival, index) => [arrival, burstTimeArray[index]]);
    SRTFSOLVE(inputArray);
}

class ProcessSRTF {
    constructor(processNumber, arrivalTime, burstTime) {
        this.processNumber = processNumber;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.completionTime = 0;
        this.turnAroundTime = 0;
        this.waitingTime = 0;
        this.tempburstTime = burstTime;
        this.isCompleted = false;
    }
}

function SRTFSOLVE(inputArray) {
    const processArray = inputArray.map((p, i) => new ProcessSRTF(i + 1, p[0], p[1]));
    const n = processArray.length;
    let currentTime = 0;
    let completed = 0;
    let grantChartArray = [];
    let avgTAT = 0;
    let avgWT = 0;
    const grantChart = document.querySelector(".GrantChart");
    if (grantChart) {
        
        grantChart.innerHTML = "";
    }
    processArray.sort((a, b) => a.arrivalTime - b.arrivalTime);
    if (processArray[0].arrivalTime > 0) {
        grantChartArray.push(["-", processArray[0].arrivalTime]);
       
    }
    while (completed !== n) {
        let idx = -1;
        let minRemaining = Infinity;

        for (let i = 0; i < n; i++) {
            if (processArray[i].arrivalTime <= currentTime && !processArray[i].isCompleted && processArray[i].remainingTime < minRemaining && processArray[i].remainingTime > 0) {
                minRemaining = processArray[i].remainingTime;
                idx = i;
            }
        }
        
        if (idx !== -1) {
            processArray[idx].remainingTime--;
            currentTime++;
            grantChartArray.push([processArray[idx].processNumber, currentTime]);

            if (processArray[idx].remainingTime === 0) {
                processArray[idx].completionTime = currentTime;
                processArray[idx].turnAroundTime = currentTime - processArray[idx].arrivalTime;
                processArray[idx].waitingTime = processArray[idx].turnAroundTime - processArray[idx].burstTime;
                avgTAT += processArray[idx].turnAroundTime;
                avgWT += processArray[idx].waitingTime;
                processArray[idx].isCompleted = true;
                completed++;
            }
        } else {
            // CPU is idle
            currentTime++;
            grantChartArray.push(["-", currentTime]);
        }
    }

    printGrantChart(grantChartArray);
    tablePrint(processArray, avgTAT, avgWT, "SRTF");

}

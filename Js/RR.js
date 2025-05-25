function getInputNumbers(id) {
    return document.getElementById(id).value
        .split(" ")
        .map(val => parseInt(val))
        .filter(val => !isNaN(val));
}

function RR() {
    const arrivalTimeArray = getInputNumbers("arrivaltime");
    const burstTimeArray = getInputNumbers("bursttime");
    const timeQuantum = parseInt(document.getElementById("priority").value);

    if (!arrivalTimeArray.length)
        return errorMessage("Arrival time cannot be blank.");
    else if (!burstTimeArray.length)
        return errorMessage("Burst time cannot be blank.");
    else if (isNaN(timeQuantum) || timeQuantum <= 0)
        return errorMessage("Enter a valid Time Quantum.");
    else if (arrivalTimeArray.length !== burstTimeArray.length)
        return errorMessage("The number of arrival and burst times must match.");

    let inputArray = arrivalTimeArray.map((arrival, index) => [arrival, burstTimeArray[index]]);
    

    RRSOLVE(inputArray, timeQuantum);
}

class ProcessRR {
    constructor(processNumber, arrivalTime, burstTime) {
        this.processNumber = processNumber;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.completionTime = 0;
        this.turnAroundTime = 0;
        this.waitingTime = 0;
        this.tempburstTime = burstTime;
    }
}

function RRSOLVE(inputArray, timeQuantum) {
    let processArray = inputArray.map((p, i) => new ProcessRR(i + 1, p[0], p[1]));
    let t = 0;
    let n = processArray.length;
    let queue = [];
    let completed = 0;
    let visited = Array(n).fill(false);
    let grantChartArray = [];
    let avgWT = 0, avgTAT = 0;

    processArray.sort((a, b) => a.arrivalTime - b.arrivalTime);
    const grantChart = document.querySelector(".GrantChart");
    if (grantChart) {
        
        grantChart.innerHTML = "";
    }
    if (processArray.length && processArray[0].arrivalTime > 0) {
        grantChartArray.push(["-", processArray[0].arrivalTime]);
        t = processArray[0].arrivalTime;
    } else {
        t = processArray[0].arrivalTime;
    }
    queue.push(0);
    visited[0] = true;
    

    while (completed !== n) {
        if (queue.length === 0) {
            // CPU idle
            grantChartArray.push(["-", t + 1]);
            t++;
            // Look for any new arrivals
            for (let j = 0; j < n; j++) {
                if (!visited[j] && processArray[j].arrivalTime <= t) {
                    queue.push(j);
                    visited[j] = true;
                }
            }
            continue;
        }

        let i = queue.shift();

        if (processArray[i].remainingTime > timeQuantum) {
            t += timeQuantum;
            console.log(processArray[i].processNumber,t);
            processArray[i].remainingTime -= timeQuantum;
            grantChartArray.push([processArray[i].processNumber, t]);
        } else {
            t += processArray[i].remainingTime;
            processArray[i].remainingTime = 0;
            processArray[i].completionTime = t;
            processArray[i].turnAroundTime = t - processArray[i].arrivalTime;
            processArray[i].waitingTime = processArray[i].turnAroundTime - processArray[i].burstTime;
            avgWT += processArray[i].waitingTime;
            avgTAT += processArray[i].turnAroundTime;
            grantChartArray.push([processArray[i].processNumber, t]);
            completed++;
        }

        // Check for newly arrived processes
        for (let j = 0; j < n; j++) {
            if (!visited[j] && processArray[j].arrivalTime <= t) {
                queue.push(j);
                visited[j] = true;
            }
        }

        // Re-add current process if it's not finished
        if (processArray[i].remainingTime > 0) {
            queue.push(i);
        }
    }

    printGrantChart(grantChartArray);
    tablePrint(processArray, avgTAT, avgWT, "RR");
}

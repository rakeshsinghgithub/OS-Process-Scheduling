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
    console.log(inputArray);
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
    const processArray = [];
    var arrayLen = inputArray.length, ti = 0, ch = 0;
    var avgturnAroundTime = 0, avgwaitingTime = 0;
    for (var i = 0; i < arrayLen; i++) {
        const process = new Process4(i + 1, inputArray[i][0], inputArray[i][1]);
        processArray.push(process);
    }
    sortArray(processArray, 'burstTime');
    const grantChart = document.querySelector(".GrantChart");
    if (grantChart) {
        while (grantChart.firstChild) {
            grantChart.removeChild(grantChart.firstChild);
        }
        grantChart.innerHTML = "";
    }
    var blankSpace = false;
    var firstBlankSpace = true;
    for (var i = 0; i < arrayLen; i++) {
        ch = 0;
        for (var j = 0; j < arrayLen; j++) {
            if (!processArray[j].visit && ti >= processArray[j].arrivalTime) {
                ch = 1;
                if (blankSpace && !firstBlankSpace)
                    printGrantChartN("-", ti);
                ti += processArray[j].burstTime;
                firstBlankSpace = false;
                blankSpace = false;
                processArray[j].completionTime = ti;
                processArray[j].turnAroundTime = processArray[j].completionTime - processArray[j].arrivalTime;
                processArray[j].waitingTime = processArray[j].turnAroundTime - processArray[j].burstTime;
                avgturnAroundTime += processArray[j].turnAroundTime;
                avgwaitingTime += processArray[j].waitingTime;
                processArray[j].visit = 1;
                printGrantChartN(processArray[j].processNumber, processArray[j].completionTime);
                break;
            }
        }
        if (!ch) {
            blankSpace = true;
            ti++;
            i--;
        }
    }

    const data = processArray;
    tablePrint(data, avgturnAroundTime, avgwaitingTime, "SJF");
}


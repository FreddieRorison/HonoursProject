// Histroic test data contains old records for the consideration of moisture level
// New test data is fed in incrementally and is assumed to be data from a sensor.
// UserPlantId is set in file
// Humidity, Temp, Ph, How many hours ago from current date.

const {readFile} = require("fs");

const AccessKey = "1effbaad-31ad-6d60-9441-ce4eff57a647"
const url = "http://localhost:8080/api/SubmitData"
const WaitTime = 1 * 60 * 1000;

readFile('./historicTestData.csv', 'utf-8', (err, data) => {
    if (err) {console.error(err); return;}
    let formattedList = [];
    let i = 0;
    data.split('\n').forEach(function (row) {
        let currentRow = row.split(',')
        let date = new Date();
        date.setHours(date.getHours()-currentRow[3])
        formattedList[i] = {
            moisture: currentRow[0],
            temperature: currentRow[1],
            ph: currentRow[2],
            timestamp: date.toISOString().replace("T", " ")
        }
        i++
    })
    const response = fetch(url, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            AccessKey: AccessKey,
            entries: formattedList
        })
    })
})

readFile('./newTestData.csv', 'utf-8', (err, data) => {
    if (err) {console.error(err); return;}
    let formattedList = [];
    let i = 0;
    data.split('\n').forEach(function (row) {
        let currentRow = row.split(',')
        let date = new Date()
        formattedList[i] = {
            moisture: currentRow[0],
            temperature: currentRow[1],
            ph: currentRow[2]
        }
        i++
    })
    dataSubmission(formattedList)
})

async function dataSubmission(data) {
    let i = 0;
    const SubmitData = async () => {
        try {
            let date = new Date()
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({AccessKey: AccessKey, entries: [
                    {
                        moisture: data[i].moisture,
                        temperature: data[i].temperature,
                        ph: data[i].ph,
                        timestamp: date.toISOString().replace("T", " ")
                    }
                ]})
                })
                const result = await response;
                return result;
        } catch (err) {
            console.error(err);
            await SubmitData();
        }
        
    }

    for (i; i < data.length; i++) {
        await SubmitData()
        console.log((i+1) + "/" + data.length + " Submitted, waiting...")
        await new Promise(r => setTimeout(r, WaitTime));
    }
}
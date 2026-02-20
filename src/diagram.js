window.onload = init;

function init() {
    processData();
}

async function getCoursesInfo() {
    try {
        const response = await fetch('https://studenter.miun.se/~mallar/dt211g/');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

async function processData() {
    try {
        const result = await getCoursesInfo();
        console.log('Received data:', result);
        const filterCourses = result.filter(item => item.type === "Kurs");
        let coursesArray = filterCourses.sort((a, b) => b.applicantsTotal - a.applicantsTotal).slice(0, 6);

        const filterProgram = result.filter(item => item.type === "Program");
        let programArray = filterProgram.sort((a, b) => b.applicantsTotal - a.applicantsTotal).slice(0, 5);

        createChart(coursesArray);
        console.log(coursesArray); 

        createChartPie(programArray);
        console.log(programArray); 

    } catch (error) {
        console.error('Error processing data:', error);
    }
}

function createChart(data) {
    const ctx = document.getElementById('diagram').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(row => row.name),
            datasets: [
                {
                    label: 'Acquisitions by year',
                    data: data.map(row => row.applicantsTotal)
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function createChartPie(data) {
    const ctx = document.getElementById('piediagram').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.map(row => row.name),
            datasets: [
                {
                    label: 'Acquisitions by year',
                    data: data.map(row => row.applicantsTotal)
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
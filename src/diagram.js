/**
* Initierar applikationen när sidan laddas
*/
window.onload = init;

/**
* Anropar funktionen processData vid initialisering
* @returns {void}
*/
function init() {
    processData();
}


/**
* Hämtar data för kurser från API
* @async - asynkron funktion som använder await
* @returns {Promise<Array>} returnerar vektor med kurser
* @throws {Error} - visar error om felet uppstår
*/
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

/**
* Bearbetar data som hämtades med getCoursesInfo()
* @async - asynkton funktion som använder await
* @returns {void}
* @throws {Error} - visar error om felet uppstår
*/

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

/**
* Skapar stapeldiagram som visar data som hämtades från API
* @param {Array} data - vektor med objekt med kursnamn osv
* @returns {void}
*/

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
                },
                x: {
                    ticks: {
                        callback: function(value, index) {
                            const label = this.getLabelForValue(index);
                            const maxLength = 15;

                            if (label.length > maxLength) {
                                return label.match(/.{1,15}/g).map((segment, i, arr) => {
                                    if (i < arr.length - 1 && 
                                        !segment.endsWith(' ') && 
                                        !arr[i + 1].startsWith(' ')) {
                                        return segment.trimEnd() + '-';
                                    }
                                    return segment.trim();
                                });
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

/**
* Skapar cirkeldiagram som visar data som hämtades från API
* @param {Array} data - vektor med objekt med programnamn osv
* @returns {void}
*/

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
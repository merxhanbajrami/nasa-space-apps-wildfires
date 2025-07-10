import config from './config.js';

async function getClusteredWildfireSummary(wildfireData) {
    // Prepare the prompt for clustering/grouping
    const promptDataString = wildfireData.map(d => `Latitude: ${d.latitude}, Longitude: ${d.longitude}, Intensity: ${d.bright_ti4}`).join(', ');
    const prompt = `Given the following wildfire data (latitude, longitude, intensity) for North Macedonia, group the wildfires by their nearest city or region. For each group, provide the city/region name, the number of wildfires, and the average intensity. Output as a simple HTML unordered list. Here is the data: ${promptDataString}`;

    const payload = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5
    };

    try {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        if (data && data.choices && data.choices.length > 0) {
            return data.choices[0].message.content.trim();
        }
        return '<li>No summary available</li>';
    } catch (error) {
        console.error('Error fetching clustered wildfire summary:', error);
        return `<li>Error: ${error.message}</li>`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (config.NASA_API_KEY === 'YOUR_NASA_API_KEY_HERE') {
        alert('Please configure your NASA API key in config.js');
        return;
    }

    var map = L.map('map').setView([41.42094, 21.93514], 6);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors, © CartoDB'
    }).addTo(map);

    var intensityColor = d3.scaleLinear()
        .domain([300, 350])
        .range(['orange', 'red'])
        .clamp(true);

    let nasaApiUrl;
    if (config.DAYS_BACK === 1) {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        nasaApiUrl = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${config.NASA_API_KEY}/VIIRS_SNPP_NRT/${config.COUNTRY_CODE}/1/${dateString}`;
    } else {
        nasaApiUrl = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${config.NASA_API_KEY}/VIIRS_SNPP_NRT/${config.COUNTRY_CODE}/${config.DAYS_BACK}`;
    }

    d3.csv(nasaApiUrl).then(async data => {
        if (!data || data.length === 0) {
            document.getElementById('wildfire-list').innerHTML = '<li>No active wildfires detected for the selected period</li>';
            return;
        }

        // Draw wildfires on the map
        data.forEach(d => {
            var circle = L.circleMarker([+d.latitude, +d.longitude], {
                color: intensityColor(+d.bright_ti4),
                radius: 4
            }).addTo(map);
            circle.bindTooltip(`Intensity: ${d.bright_ti4}`);
            circle.on('mouseover', function(e) {
                document.getElementById('latitude').textContent = `Latitude: ${d.latitude}`;
                document.getElementById('longitude').textContent = `Longitude: ${d.longitude}`;
                document.getElementById('intensity').textContent = `Intensity: ${d.bright_ti4}`;
                document.getElementById('info-box').style.display = 'block';
            });
            circle.on('mouseout', function(e) {
                document.getElementById('info-box').style.display = 'none';
            });
        });

        // Grouped summary via LLM
        const sidebar = document.getElementById('wildfire-list');
        sidebar.innerHTML = '<li>Loading grouped wildfire summary...</li>';
        const summaryHtml = await getClusteredWildfireSummary(data);
        sidebar.innerHTML = `<div><strong>Grouped Wildfire Summary</strong>${summaryHtml}</div>`;

        // Add collapsible for raw data
        const rawDataHtml = data.slice(0, 50).map(d => `<li>Lat: ${d.latitude}, Long: ${d.longitude}, Intensity: ${d.bright_ti4}</li>`).join('');
        const collapsible = document.createElement('details');
        collapsible.innerHTML = `<summary>Show raw wildfire data</summary><ul>${rawDataHtml}</ul>`;
        sidebar.appendChild(collapsible);
    }).catch(error => {
        document.getElementById('wildfire-list').innerHTML = '<li>Error loading wildfire data. Please check your API key.</li>';
    });

    var modal = document.getElementById("myModal");
    var btn = document.querySelector("button");
    var span = document.getElementsByClassName("close")[0];
    btn.onclick = function() { modal.style.display = "block"; }
    span.onclick = function() { modal.style.display = "none"; }
    window.onclick = function(event) { if (event.target == modal) { modal.style.display = "none"; } }

    document.querySelector('button').addEventListener('click', async () => {
        try {
            const nasaResponse = await d3.csv(nasaApiUrl);
            if (!nasaResponse || nasaResponse.length === 0) {
                document.getElementById('modal-text').innerHTML = '<h3>No Data Available</h3><p>No wildfire data is currently available for analysis.</p>';
                modal.style.display = "block";
                return;
            }
            nasaResponse.sort((a, b) => parseFloat(b.bright_ti4) - parseFloat(a.bright_ti4));
            const promptDataString = nasaResponse.slice(0, 10).map(d => `Latitude: ${d.latitude}, Longitude: ${d.longitude}, Intensity: ${d.bright_ti4}`).join(', ');
            const promptData = {
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "user",
                    content: `Generate a report for the following wildfire data: ${promptDataString}.
                    Please convert the given wildfire data from langitude and latitude values into cities. Note that these coordinates 
                    are from country North Macedonia. If you see more wildfires, from one city please group them by city and explain if they are near by one another.
                    In your report take in consideration that your answer will be shown to the normal user and for this
                    you need to make it simpler, with city names and intensity informations. 
                    Interpret the intensity and make the report more into the style of a story telling.  The report title should be:
                    "AI analysis report for active wildfires in North Macedonia"
                    Give advice how to behave. Your report should be in HTML elements, in a wrapped div. 
                    Please make your report in 5 paragraphs only and organise them in them with subheaders. 
                    In your output report, always use city approximate city names since the data for widlfires are in 
                    North Macedonia country!
                    \n\nAdditionally, include a section on how current or typical weather conditions (such as wind, temperature, humidity, and drought) in North Macedonia affect the spread and danger of wildfires. Provide a technical but user-friendly explanation of these weather effects, and offer practical advice for residents based on these conditions.`
                    }],
                temperature: 0.7
            };
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promptData),
            });
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
            }
            const reportData = await response.json();
            if (reportData && reportData.choices && reportData.choices.length > 0) {
                const reportText = reportData.choices[0].message.content.trim();
                document.getElementById('modal-text').innerHTML = reportText;
                modal.style.display = "block";
            } else {
                document.getElementById('modal-text').innerHTML = '<h3>Error</h3><p>Unable to generate AI report. Please try again later.</p>';
                modal.style.display = "block";
            }
        } catch (error) {
            document.getElementById('modal-text').innerHTML = `<h3>Error</h3><p>Failed to generate AI report: ${error.message}</p>`;
            modal.style.display = "block";
        }
    });
});

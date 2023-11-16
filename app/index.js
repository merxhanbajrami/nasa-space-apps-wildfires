document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([41.42094, 21.93514], 6);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors, © CartoDB'
    }).addTo(map);

    var intensityColor = d3.scaleLinear()
        .domain([300, 350])
        .range(['orange', 'red'])
        .clamp(true);

    d3.csv("https://firms.modaps.eosdis.nasa.gov/api/country/csv/5f8beb2842be8c7fdf82232f67538867/VIIRS_SNPP_NRT/MKD/1/2023-10-07").then(data => {
        data.forEach(d => {
            var circle = L.circleMarker([+d.latitude, +d.longitude], {
                color: intensityColor(+d.bright_ti4),
                radius: 4
            }).addTo(map);
            circle.bindTooltip(`Intensity: ${d.bright_ti4}`);
            // Add event listeners for mouseover and mouseout
            circle.on('mouseover', function(e) {
                document.getElementById('latitude').textContent = `Latitude: ${d.latitude}`;
                document.getElementById('longitude').textContent = `Longitude: ${d.longitude}`;
                document.getElementById('intensity').textContent = `Intensity: ${d.bright_ti4}`;
                document.getElementById('info-box').style.display = 'block'; // show the info box
            });
            circle.on('mouseout', function(e) {
                document.getElementById('info-box').style.display = 'none'; // hide the info box
            });
        });
        data.sort((a, b) => parseFloat(b.bright_ti4) - parseFloat(a.bright_ti4));
        const wildfireList = document.getElementById('wildfire-list');
        data.slice(0, 10).forEach(d => { // Only list top 10
            const li = document.createElement('li');
            li.textContent = `Lat: ${d.latitude}, Long: ${d.longitude}, Intensity: ${d.bright_ti4}`;
            wildfireList.appendChild(li);
        });
    }).catch(error => console.error('Error fetching or parsing CSV data:', error));
    var modal = document.getElementById("myModal");

// Get the button that opens the modal
    var btn = document.querySelector("button");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    //SAt0X8sqyOzqMZ5LLOQiT3BlbkFJMPHrWqLUs0l1qcWQFiPJ
    // Add event listener to your AI report button
    // Add event listener to your AI report button
    document.querySelector('button').addEventListener('click', async () => {
        try {
            const nasaResponse = await d3.csv("https://firms.modaps.eosdis.nasa.gov/api/country/csv/5f8beb2842be8c7fdf82232f67538867/VIIRS_SNPP_NRT/MKD/1/2023-10-07");

            if (!nasaResponse || nasaResponse.length === 0) {
                console.error('No data returned from NASA API');
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
                    North Macedonia country!`
                    }],
                temperature: 0.7
            };

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`, // Replace YOUR_API_KEY with your actual key
                },
                body: JSON.stringify(promptData),
            });

            const reportData = await response.json();

            if (reportData && reportData.choices && reportData.choices.length > 0) {
                const reportText = reportData.choices[0].message.content.trim();
                document.getElementById('modal-text').innerHTML = reportText;
                modal.style.display = "block";
            } else {
                console.error('No data returned from OpenAI');
            }
        } catch (error) {
            console.error('Error fetching AI report:', error);
        }
    });


});

# Space Apps Challenge 2023 - Wildfire Map

## Overview
The project for the NASA Space Apps Challenge 2023 is themed "Managing Fire: Increasing Community-based Fire Management Opportunities" and is executed for a Hackathon in North Macedonia. This project aims to provide an interactive visual representation of active wildfires in North Macedonia, providing crucial data such as the location and intensity of each fire.

## Description
The project is a web-based application consisting of an HTML file and an accompanying JavaScript (index.js) file. The application visually represents active wildfires on a map, displaying relevant data to users.

### HTML Structure
- A sidebar on the left, containing:
  - Logo
  - Header for active wildfires
  - A list of wildfires
  - A button to generate AI Report
  - Robot Icon
- A map visualization section
- A modal for displaying AI-generated report
- An information box which is shown on mouse-over events on each wildfire marker, providing detailed data

### index.js Overview
- Initializes a map centered at North Macedonia using the Leaflet library.
- Uses D3 to fetch and process wildfire data from a NASA API endpoint, represented as CSV.
- Visualizes the wildfire data on the map with circle markers whose colors represent the intensity of the fires.
- Displays the top 10 intense wildfires in the sidebar.
- Provides an event listener for each marker to display an info-box with details about the fire.
- Implements modal control for AI-generated reports.

### Style Elements
- The styling in the HTML document provides a responsive and visually appealing interface, with a modal setup and an informative sidebar that adjusts according to the viewport size.

## Deployment
The application is deployed on [Vercel](https://vercel.com/), a platform suitable for frontend projects and serverless functions. Vercel’s Serverless Functions feature is utilized to create an API that generates the wildfire report dynamically.

### Deployment Steps
1. Push the project code to your GitHub, GitLab, or Bitbucket repository.
2. Connect your repository to Vercel.
3. Deploy the project on Vercel, making sure to set up the serverless function for report generation correctly.

## Setup & Installation for Local Development
1. Clone this repository to your local machine.
2. Open `index.html` in a web browser to run the application.
3. For official representation, ensure you have the rights to use NASA's official logo and replace the "logo.png" source in the `img` tag with NASA's official logo. Similarly, ensure compliance with usage rights for any other images or icons used in the project.

## Usage
- On loading, the application displays active wildfires on the map.
- Users can view details of each wildfire by hovering over the markers on the map.
- Users can generate an AI report which can be viewed by clicking the 'Generate AI Report' button. The report provides a detailed analysis of the wildfire data, formatted for easy understanding by general users.

## Dependencies
- [Leaflet.js](https://leafletjs.com/) for mapping functionalities.
- [D3.js](https://d3js.org/) for data manipulation and binding.

## License
Ensure you have the right to use NASA's official logos and any other proprietary material. Adhere to the licensing agreements of the dependencies and third-party assets used.

## Acknowledgements
Special thanks to NASA for organizing the Space Apps Challenge 2023 and providing the necessary data and platform for developing this project.

## Disclaimer
This project is developed for the NASA Space Apps Challenge 2023 Hackathon in North Macedonia. Ensure compliance with the legal and ethical standards pertaining to data usage and representation of official logos and icons.


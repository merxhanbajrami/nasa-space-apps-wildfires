# NASA Space Apps Wildfire Mapping Application

This application displays active wildfires on an interactive map using real-time data from NASA's FIRMS API and provides AI-powered analysis using OpenAI's API.

## Features

- Interactive map showing active wildfires
- Real-time data from NASA FIRMS API
- AI-powered wildfire analysis reports
- Focus on North Macedonia (configurable)
- Intensity-based color coding

## Setup Instructions

### 1. Get API Keys

#### NASA FIRMS API Key
1. Go to [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/)
2. Sign up for a free account
3. Navigate to your dashboard
4. Copy your API key

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 2. Configure API Keys

1. Open `config.js` in the app directory
2. Replace the placeholder values with your actual API keys:

```javascript
const config = {
    NASA_API_KEY: 'your_nasa_api_key_here',
    OPENAI_API_KEY: 'your_openai_api_key_here',
    COUNTRY_CODE: 'MKD', // North Macedonia
    DAYS_BACK: 1
};
```

### 3. Run the Application

#### Option 1: Python HTTP Server
```bash
cd app
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

#### Option 2: Node.js HTTP Server
```bash
cd app
npx http-server
```

#### Option 3: Live Server (VS Code)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 4: Direct File Opening
Double-click `index.html` to open directly in your browser (some features may not work due to CORS).

## Configuration Options

In `config.js`, you can modify:

- `COUNTRY_CODE`: Change from 'MKD' to any other country code (e.g., 'USA', 'CAN', 'AUS')
- `DAYS_BACK`: Number of days back to fetch wildfire data (default: 1)

## Troubleshooting

### "Please configure your NASA API key"
- Make sure you've added your NASA FIRMS API key to `config.js`
- Verify the API key is correct and active

### "Please configure your OpenAI API key"
- Make sure you've added your OpenAI API key to `config.js`
- Verify the API key is correct and has credits

### "Error loading wildfire data"
- Check your NASA API key
- Verify internet connection
- Check if there's wildfire data available for the selected date/region

### CORS Errors
- Use a local HTTP server instead of opening the file directly
- The application requires a web server to make API calls

## Data Sources

- **Wildfire Data**: NASA FIRMS (Fire Information for Resource Management System)
- **Map Tiles**: CartoDB Dark Matter
- **AI Analysis**: OpenAI GPT-3.5 Turbo

## Security Notes


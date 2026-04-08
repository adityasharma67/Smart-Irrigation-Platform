# Smart Irrigation Platform ||  Live link- https://smart-irrigation-platform-3.onrender.com

Smart Irrigation Platform is a full-stack web application for intelligent monitoring and management of irrigation and water usage for agricultural deployments. It integrates **predictive machine learning models**, **real-time weather API**, **crop-specific irrigation science**, and **advanced data analytics** to optimize irrigation scheduling and conserve water.

## 🧠 Intelligent Features

### 1. ML Predictive Irrigation Model
- **Linear Regression** trend analysis on historical water usage data
- **Exponential Moving Average (EMA)** for smoothed short-term predictions
- **Penman-Monteith Evapotranspiration (ET₀)** calculation — the FAO-standard scientific method
- 7-day water need forecasting with confidence scores

### 2. Weather API Integration
- Real-time weather data from **OpenWeatherMap API**
- 5-day forecast with irrigation impact analysis
- Automatic rain-skip logic (skips irrigation when rain >60% probability)
- Temperature, humidity, and wind-based water adjustment factors

### 3. Crop-Specific Irrigation Logic
- **15+ crop profiles** based on FAO Irrigation & Drainage Paper No. 56
- Growth stage detection with **crop coefficients (Kc)** per stage
- Soil type adjustment factors (7 soil types)
- Critical stage alerts for maximum yield protection

### 4. Sensor Data Simulation & Analytics
- Realistic IoT sensor data generation with diurnal patterns
- **Statistical analysis**: mean, median, std deviation, percentiles, skewness, kurtosis
- **Z-score anomaly detection** for unusual sensor readings
- **Trend analysis** with R² scoring and moving averages

### 5. Smart Scheduling Engine
- Multi-factor optimization: weather × crop needs × soil × priority
- Field prioritization by drought stress level
- Optimal irrigation timing (minimize evaporation)
- Water savings estimation vs. traditional irrigation

### 6. Data Visualization Dashboard
- Canvas-based charts (Line, Bar, Gauge, Multi-line) — no external library
- Interactive Smart Analytics Dashboard with 4 tabs
- Crop Advisor with water requirement calculator
- Efficiency scoring with actionable recommendations

## Key Features

- User authentication and authorization (JWT + bcrypt)
- Dashboard with summaries and quick actions
- Create, review, and manage irrigation proposals
- Log and visualize water usage data
- Support and contact pages

## Tech Stack

- Frontend: React, React Router, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT (jsonwebtoken), bcrypt for password hashing
- ML/Analytics: Custom implementations (Linear Regression, EMA, Penman-Monteith)
- Weather: OpenWeatherMap API integration
- HTTP client: Axios

## Quick Start (local)

1. Backend

	- Change to `smart-irrigation-platform/backend`
	- Install: `npm install`
	- Configure: create a `.env` with `MONGO_URI`, `JWT_SECRET`, and optionally `OPENWEATHER_API_KEY`
	- Run: `npm run dev`

2. Frontend

	- Change to `smart-irrigation-platform/frontend`
	- Install: `npm install`
	- Run: `npm start`

Open the frontend (typically at `http://localhost:3000`) and ensure it points to the running backend API.

## Repository Layout

- `backend/` — Node/Express server, API routes, models, services (ML, weather, analytics)
- `frontend/` — React application and UI components

## API Endpoints

### Existing
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `GET /api/proposals` — List proposals
- `GET /api/water-usage` — Water usage history

### New Intelligent Endpoints
- `GET /api/weather/:location` — Current weather + forecast
- `GET /api/weather/:location/irrigation-impact` — Weather impact on irrigation
- `GET /api/predictions/:cropType` — 7-day water need prediction
- `GET /api/crops` — List all crop profiles
- `GET /api/crops/:name/recommendation` — Crop-specific irrigation advice
- `POST /api/crops/calculate` — Calculate water requirements
- `GET /api/analytics/sensor-data/:fieldId` — Sensor data with analysis
- `GET /api/analytics/efficiency/:userId` — Efficiency report
- `GET /api/analytics/trends/:fieldId` — Trend analysis
- `GET /api/schedule/:userId` — Smart irrigation schedule

## Scientific References

- Allen, R.G., Pereira, L.S., Raes, D., Smith, M. (1998). "Crop evapotranspiration - Guidelines for computing crop water requirements" FAO Irrigation and Drainage Paper 56.
- Penman-Monteith equation for reference evapotranspiration (ET₀)
- Hargreaves radiation formula for solar radiation estimation

## Contributing

Contributions welcome via issues and pull requests. Please include clear descriptions and tests where appropriate.

## License & Contact

See the repository on GitHub for license information and to contact the maintainers.

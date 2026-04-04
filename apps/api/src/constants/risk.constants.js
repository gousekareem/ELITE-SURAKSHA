const CITY_RISK_PROFILES = {
  mumbai: {
    weatherRiskScore: 8.5,
    aqiRiskScore: 5.0,
    heatRiskScore: 5.0,
    floodRiskScore: 9.0
  },
  delhi: {
    weatherRiskScore: 5.5,
    aqiRiskScore: 9.5,
    heatRiskScore: 8.5,
    floodRiskScore: 4.5
  },
  chennai: {
    weatherRiskScore: 7.5,
    aqiRiskScore: 4.5,
    heatRiskScore: 7.5,
    floodRiskScore: 7.0
  },
  kolkata: {
    weatherRiskScore: 7.0,
    aqiRiskScore: 6.0,
    heatRiskScore: 7.0,
    floodRiskScore: 7.5
  },
  hyderabad: {
    weatherRiskScore: 5.5,
    aqiRiskScore: 5.5,
    heatRiskScore: 8.0,
    floodRiskScore: 4.0
  },
  bengaluru: {
    weatherRiskScore: 4.5,
    aqiRiskScore: 4.0,
    heatRiskScore: 4.5,
    floodRiskScore: 3.5
  },
  bangalore: {
    weatherRiskScore: 4.5,
    aqiRiskScore: 4.0,
    heatRiskScore: 4.5,
    floodRiskScore: 3.5
  },
  pune: {
    weatherRiskScore: 5.0,
    aqiRiskScore: 4.5,
    heatRiskScore: 6.0,
    floodRiskScore: 4.0
  },
  default: {
    weatherRiskScore: 5.0,
    aqiRiskScore: 5.0,
    heatRiskScore: 5.0,
    floodRiskScore: 5.0
  }
};

module.exports = {
  CITY_RISK_PROFILES
};
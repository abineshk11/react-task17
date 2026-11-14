import { useEffect, useState } from 'react'

export function useSkyForecast(location) {
  const [state, setState] = useState({ loading: true, data: null, error: '' })

  useEffect(() => {
    const controller = new AbortController()
    const loadForecast = async () => {
      setState({ loading: true, data: null, error: '' })
      try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`, { signal: controller.signal })
        if (!geoResponse.ok) throw new Error('Could not look up that location. Please try again.')
        const geo = await geoResponse.json()
        const place = geo.results?.[0]
        if (!place) throw new Error(`We couldn’t find “${location}”. Try a nearby city or town.`)

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&hourly=cloud_cover,wind_speed_10m&forecast_days=2&timezone=auto`, { signal: controller.signal })
        if (!weatherResponse.ok) throw new Error('The forecast is unavailable right now. Please try again later.')
        const weather = await weatherResponse.json()
        const localNow = new Date(Date.now() + weather.utc_offset_seconds * 1000)
        const localDate = localNow.toISOString().slice(0, 10)
        const localTime = localNow.toISOString().slice(0, 16).replace('T', ' ')
        const availableHours = weather.hourly.time
          .map((time, index) => ({ time, cloud: weather.hourly.cloud_cover[index], wind: weather.hourly.wind_speed_10m[index] }))
          .filter((hour) => hour.time.replace('T', ' ') >= localTime && Number(hour.time.slice(11, 13)) >= 18)
        const tonight = availableHours.filter((hour) => hour.time.slice(0, 10) === localDate)
        const hours = (tonight.length ? tonight : availableHours.filter((hour) => hour.time.slice(0, 10) > localDate)).slice(0, 5)
        const currentIndex = Math.max(0, weather.hourly.time.findIndex((time) => time.replace('T', ' ') >= localTime))
        const cloud = weather.hourly.cloud_cover[currentIndex] ?? 0
        const wind = Math.round(weather.hourly.wind_speed_10m[currentIndex] ?? 0)
        const score = Math.max(1, Math.min(10, Math.round(10 - cloud / 11 - wind / 15)))
        setState({
          loading: false,
          error: '',
          data: {
            location: [place.name, place.country].filter(Boolean).join(', '),
            cloud,
            wind,
            clarity: score,
            condition: cloud < 20 ? 'Clear skies' : cloud < 55 ? 'Partly cloudy' : 'Cloudy',
            hours: hours.map((hour) => {
              const cloudScore = Math.max(1, Math.min(10, Math.round(10 - hour.cloud / 11 - hour.wind / 15)))
              return { time: new Date(hour.time).toLocaleTimeString('en', { hour: 'numeric' }), cloud: hour.cloud, score: cloudScore }
            }),
          },
        })
      } catch (error) {
        if (error.name !== 'AbortError') setState({ loading: false, data: null, error: error.message || 'The forecast could not be loaded.' })
      }
    }
    loadForecast()
    return () => controller.abort()
  }, [location])

  return state
}

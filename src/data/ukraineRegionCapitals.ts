import type { AppLocale } from '@/i18n'

export interface UkraineCity {
  id: string
  labelUk: string
  labelEn: string
  latitude: number
  longitude: number
}

export const UKRAINE_REGION_CAPITALS: UkraineCity[] = [
  { id: 'kyiv', labelUk: 'Київ', labelEn: 'Kyiv', latitude: 50.4501, longitude: 30.5234 },
  {
    id: 'vinnytsia',
    labelUk: 'Вінниця',
    labelEn: 'Vinnytsia',
    latitude: 49.2331,
    longitude: 28.4682,
  },
  { id: 'dnipro', labelUk: 'Дніпро', labelEn: 'Dnipro', latitude: 48.4647, longitude: 35.0462 },
  {
    id: 'donetsk',
    labelUk: 'Донецьк',
    labelEn: 'Donetsk',
    latitude: 48.0159,
    longitude: 37.8028,
  },
  {
    id: 'zhytomyr',
    labelUk: 'Житомир',
    labelEn: 'Zhytomyr',
    latitude: 50.2547,
    longitude: 28.6587,
  },
  {
    id: 'uzhhorod',
    labelUk: 'Ужгород',
    labelEn: 'Uzhhorod',
    latitude: 48.6208,
    longitude: 22.2879,
  },
  {
    id: 'zaporizhzhia',
    labelUk: 'Запоріжжя',
    labelEn: 'Zaporizhzhia',
    latitude: 47.8388,
    longitude: 35.1396,
  },
  {
    id: 'ivano-frankivsk',
    labelUk: 'Івано-Франківськ',
    labelEn: 'Ivano-Frankivsk',
    latitude: 48.9226,
    longitude: 24.7111,
  },
  {
    id: 'kropyvnytskyi',
    labelUk: 'Кропивницький',
    labelEn: 'Kropyvnytskyi',
    latitude: 48.5079,
    longitude: 32.2623,
  },
  { id: 'luhansk', labelUk: 'Луганськ', labelEn: 'Luhansk', latitude: 48.574, longitude: 39.3078 },
  { id: 'lviv', labelUk: 'Львів', labelEn: 'Lviv', latitude: 49.8397, longitude: 24.0297 },
  {
    id: 'mykolaiv',
    labelUk: 'Миколаїв',
    labelEn: 'Mykolaiv',
    latitude: 46.975,
    longitude: 31.9946,
  },
  { id: 'odesa', labelUk: 'Одеса', labelEn: 'Odesa', latitude: 46.4825, longitude: 30.7233 },
  {
    id: 'poltava',
    labelUk: 'Полтава',
    labelEn: 'Poltava',
    latitude: 49.5883,
    longitude: 34.5514,
  },
  { id: 'rivne', labelUk: 'Рівне', labelEn: 'Rivne', latitude: 50.6199, longitude: 26.2516 },
  { id: 'sumy', labelUk: 'Суми', labelEn: 'Sumy', latitude: 50.9077, longitude: 34.7981 },
  {
    id: 'ternopil',
    labelUk: 'Тернопіль',
    labelEn: 'Ternopil',
    latitude: 49.5535,
    longitude: 25.5948,
  },
  {
    id: 'kharkiv',
    labelUk: 'Харків',
    labelEn: 'Kharkiv',
    latitude: 49.9935,
    longitude: 36.2304,
  },
  {
    id: 'kherson',
    labelUk: 'Херсон',
    labelEn: 'Kherson',
    latitude: 46.6354,
    longitude: 32.6169,
  },
  {
    id: 'khmelnytskyi',
    labelUk: 'Хмельницький',
    labelEn: 'Khmelnytskyi',
    latitude: 49.4229,
    longitude: 26.9871,
  },
  {
    id: 'cherkasy',
    labelUk: 'Черкаси',
    labelEn: 'Cherkasy',
    latitude: 49.4444,
    longitude: 32.0598,
  },
  {
    id: 'chernivtsi',
    labelUk: 'Чернівці',
    labelEn: 'Chernivtsi',
    latitude: 48.2915,
    longitude: 25.9403,
  },
  {
    id: 'chernihiv',
    labelUk: 'Чернігів',
    labelEn: 'Chernihiv',
    latitude: 51.4982,
    longitude: 31.2893,
  },
  { id: 'lutsk', labelUk: 'Луцьк', labelEn: 'Lutsk', latitude: 50.7472, longitude: 25.3254 },
  {
    id: 'simferopol',
    labelUk: 'Сімферополь',
    labelEn: 'Simferopol',
    latitude: 44.9521,
    longitude: 34.1024,
  },
]

export function getCityLabel(city: UkraineCity, locale: AppLocale): string {
  return locale === 'uk' ? city.labelUk : city.labelEn
}

export function findNearestCity(latitude: number, longitude: number): UkraineCity {
  return UKRAINE_REGION_CAPITALS.reduce((nearestCity, city) => {
    const nearestDistance = haversineDistance(
      latitude,
      longitude,
      nearestCity.latitude,
      nearestCity.longitude,
    )
    const cityDistance = haversineDistance(latitude, longitude, city.latitude, city.longitude)

    return cityDistance < nearestDistance ? city : nearestCity
  })
}

function haversineDistance(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const earthRadiusKm = 6371
  const dLatitude = toRadians(latitudeB - latitudeA)
  const dLongitude = toRadians(longitudeB - longitudeA)
  const latA = toRadians(latitudeA)
  const latB = toRadians(latitudeB)

  const a =
    Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
    Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2) * Math.cos(latA) * Math.cos(latB)

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a))
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180
}

export interface City {
  value: string;
  label: string;
  popular?: boolean;
}

export interface Country {
  value: string;
  label: string;
  flag: string;
  popular: boolean;
  cities: City[];
}

export const countries: Country[] = [
  {
    value: 'malaysia',
    label: 'Malaysia',
    flag: '🇲🇾',
    popular: true,
    cities: [
      { value: 'kuala_lumpur', label: 'Kuala Lumpur', popular: true },
      { value: 'johor_bahru', label: 'Johor Bahru', popular: true },
      { value: 'penang', label: 'Penang', popular: true },
      { value: 'malacca', label: 'Malacca' },
      { value: 'ipoh', label: 'Ipoh' },
      { value: 'kota_kinabalu', label: 'Kota Kinabalu' },
    ],
  },
  {
    value: 'singapore',
    label: 'Singapore',
    flag: '🇸🇬',
    popular: true,
    cities: [
      { value: 'singapore_city', label: 'Singapore City', popular: true },
      { value: 'orchard', label: 'Orchard', popular: true },
      { value: 'raffles_place', label: 'Raffles Place' },
    ],
  },
  {
    value: 'thailand',
    label: 'Thailand',
    flag: '🇹🇭',
    popular: true,
    cities: [
      { value: 'bangkok', label: 'Bangkok', popular: true },
      { value: 'phuket', label: 'Phuket', popular: true },
      { value: 'chiang_mai', label: 'Chiang Mai', popular: true },
      { value: 'pattaya', label: 'Pattaya' },
      { value: 'hua_hin', label: 'Hua Hin' },
      { value: 'koh_samui', label: 'Koh Samui' },
    ],
  },
  {
    value: 'india',
    label: 'India',
    flag: '🇮🇳',
    popular: true,
    cities: [
      { value: 'mumbai', label: 'Mumbai', popular: true },
      { value: 'delhi', label: 'Delhi', popular: true },
      { value: 'bangalore', label: 'Bangalore', popular: true },
      { value: 'chennai', label: 'Chennai', popular: true },
      { value: 'hyderabad', label: 'Hyderabad' },
      { value: 'kolkata', label: 'Kolkata' },
      { value: 'pune', label: 'Pune' },
      { value: 'ahmedabad', label: 'Ahmedabad' },
    ],
  },
  {
    value: 'turkey',
    label: 'Turkey',
    flag: '🇹🇷',
    popular: true,
    cities: [
      { value: 'istanbul', label: 'Istanbul', popular: true },
      { value: 'ankara', label: 'Ankara', popular: true },
      { value: 'antalya', label: 'Antalya', popular: true },
      { value: 'izmir', label: 'Izmir' },
      { value: 'bursa', label: 'Bursa' },
    ],
  },
  {
    value: 'south_korea',
    label: 'South Korea',
    flag: '🇰🇷',
    popular: true,
    cities: [
      { value: 'seoul', label: 'Seoul', popular: true },
      { value: 'busan', label: 'Busan', popular: true },
      { value: 'incheon', label: 'Incheon' },
      { value: 'daegu', label: 'Daegu' },
      { value: 'gangnam', label: 'Gangnam' },
    ],
  },
  {
    value: 'philippines',
    label: 'Philippines',
    flag: '🇵🇭',
    popular: false,
    cities: [
      { value: 'manila', label: 'Manila', popular: true },
      { value: 'makati', label: 'Makati', popular: true },
      { value: 'cebu', label: 'Cebu', popular: true },
      { value: 'davao', label: 'Davao' },
      { value: 'iloilo', label: 'Iloilo' },
    ],
  },
  {
    value: 'vietnam',
    label: 'Vietnam',
    flag: '🇻🇳',
    popular: false,
    cities: [
      { value: 'ho_chi_minh', label: 'Ho Chi Minh City', popular: true },
      { value: 'hanoi', label: 'Hanoi', popular: true },
      { value: 'da_nang', label: 'Da Nang' },
      { value: 'nha_trang', label: 'Nha Trang' },
    ],
  },
  {
    value: 'indonesia',
    label: 'Indonesia',
    flag: '🇮🇩',
    popular: false,
    cities: [
      { value: 'jakarta', label: 'Jakarta', popular: true },
      { value: 'surabaya', label: 'Surabaya', popular: true },
      { value: 'bandung', label: 'Bandung' },
      { value: 'bali', label: 'Bali (Denpasar)' },
      { value: 'yogyakarta', label: 'Yogyakarta' },
    ],
  },
  {
    value: 'japan',
    label: 'Japan',
    flag: '🇯🇵',
    popular: false,
    cities: [
      { value: 'tokyo', label: 'Tokyo', popular: true },
      { value: 'osaka', label: 'Osaka', popular: true },
      { value: 'kyoto', label: 'Kyoto' },
      { value: 'yokohama', label: 'Yokohama' },
      { value: 'kobe', label: 'Kobe' },
    ],
  },
  {
    value: 'uae',
    label: 'United Arab Emirates',
    flag: '🇦🇪',
    popular: false,
    cities: [
      { value: 'dubai', label: 'Dubai', popular: true },
      { value: 'abu_dhabi', label: 'Abu Dhabi', popular: true },
      { value: 'sharjah', label: 'Sharjah' },
      { value: 'ajman', label: 'Ajman' },
    ],
  },
  {
    value: 'taiwan',
    label: 'Taiwan',
    flag: '🇹🇼',
    popular: false,
    cities: [
      { value: 'taipei', label: 'Taipei', popular: true },
      { value: 'kaohsiung', label: 'Kaohsiung', popular: true },
      { value: 'taichung', label: 'Taichung' },
      { value: 'tainan', label: 'Tainan' },
    ],
  },
];

// Helper functions
export const getCountryByValue = (value: string): Country | undefined => {
  return countries.find(country => country.value === value);
};

export const getCitiesByCountry = (countryValue: string): City[] => {
  const country = getCountryByValue(countryValue);
  return country ? country.cities : [];
};

export const getPopularCountries = (): Country[] => {
  return countries.filter(country => country.popular);
};

export const getPopularCitiesInCountry = (countryValue: string): City[] => {
  const cities = getCitiesByCountry(countryValue);
  return cities.filter(city => city.popular);
};

export const formatLocationForSearch = (country: string, city?: string): string => {
  const countryData = getCountryByValue(country);
  if (!countryData) return '';
  
  if (city) {
    const cityData = countryData.cities.find(c => c.value === city);
    if (cityData) {
      return `${cityData.label}, ${countryData.label}`;
    }
  }
  
  return countryData.label;
};
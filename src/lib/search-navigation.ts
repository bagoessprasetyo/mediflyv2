import {
  IconSearch,
  IconHistory,
  IconBookmark,
  IconFilter,
  IconBuilding,
  IconStethoscope,
  IconMapPin,
  IconStar,
  IconUsers,
  IconClock,
  IconHeart,
  IconShield,
  IconUserCheck,
  IconHeartHandshake,
} from "@tabler/icons-react"

export const searchNavigationData = {
  quickActions: [
    {
      title: "New Search",
      url: "/search",
      icon: IconSearch,
      description: "Start a new healthcare search"
    },
    {
      title: "Find Specialists",
      url: "/search?type=specialists",
      icon: IconStethoscope,
      description: "Search for medical specialists"
    },
    {
      title: "Find Hospitals",
      url: "/search?type=hospitals",
      icon: IconBuilding,
      description: "Search for hospitals and clinics"
    },
  ],
  
  savedAndHistory: [
    {
      title: "Search History",
      url: "#history",
      icon: IconHistory,
      description: "View recent searches"
    },
    {
      title: "Saved Searches",
      url: "#saved",
      icon: IconBookmark,
      description: "Your bookmarked searches"
    },
    {
      title: "Favorite Doctors",
      url: "#favorites",
      icon: IconHeart,
      description: "Your favorite specialists"
    },
  ],

  filterPresets: [
    {
      title: "Emergency Care",
      url: "/search?filters=emergency",
      icon: IconShield,
      description: "24/7 emergency services"
    },
    {
      title: "Highly Rated",
      url: "/search?filters=top-rated",
      icon: IconStar,
      description: "Top-rated healthcare providers"
    },
    {
      title: "Accepting Patients",
      url: "/search?filters=accepting",
      icon: IconUserCheck,
      description: "Currently accepting new patients"
    },
  ],

  specialtyCategories: [
    {
      title: "Cardiology",
      url: "/search?specialty=cardiology",
      icon: IconHeart,
      color: "text-red-600"
    },
    {
      title: "Orthopedics",
      url: "/search?specialty=orthopedics", 
      icon: IconUsers,
      color: "text-blue-600"
    },
    {
      title: "Neurology",
      url: "/search?specialty=neurology",
      icon: IconStethoscope,
      color: "text-purple-600"
    },
    {
      title: "Oncology",
      url: "/search?specialty=oncology",
      icon: IconShield,
      color: "text-green-600"
    },
  ],

  locationPresets: [
    {
      title: "Singapore",
      url: "/search?location=singapore",
      icon: IconMapPin,
      flag: "🇸🇬"
    },
    {
      title: "Malaysia",
      url: "/search?location=malaysia", 
      icon: IconMapPin,
      flag: "🇲🇾"
    },
    {
      title: "Thailand",
      url: "/search?location=thailand",
      icon: IconMapPin,
      flag: "🇹🇭"
    },
    {
      title: "India",
      url: "/search?location=india",
      icon: IconMapPin,
      flag: "🇮🇳"
    },
  ],

  recentSearches: [
    {
      query: "rehabilitation hospital for stroke patients",
      location: "singapore",
      timestamp: "2 hours ago",
      icon: IconClock,
      url: "/search?concern=rehabilitation+hospital+for+stroke+patients&location=singapore"
    },
    {
      query: "best cardiologist for heart surgery",
      location: "malaysia", 
      timestamp: "1 day ago",
      icon: IconClock,
      url: "/search?concern=best+cardiologist+for+heart+surgery&location=malaysia"
    },
    {
      query: "orthopedic specialist knee replacement",
      location: "thailand",
      timestamp: "3 days ago", 
      icon: IconClock,
      url: "/search?concern=orthopedic+specialist+knee+replacement&location=thailand"
    },
  ],

  helpAndSupport: [
    {
      title: "Search Tips",
      url: "/help/search-tips",
      icon: IconHeartHandshake,
      description: "How to find the right healthcare"
    },
    {
      title: "Contact Support",
      url: "/support",
      icon: IconUsers,
      description: "Get help with your search"
    },
  ]
}

export type SearchNavigationItem = {
  title: string
  url: string
  icon: any
  description?: string
  color?: string
  flag?: string
  query?: string
  location?: string
  timestamp?: string
}
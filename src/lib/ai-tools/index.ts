// Import all AI tools
import {
  searchHospitalsTool,
  getHospitalDetailsTool,
  searchHospitalsTextOnlyTool
} from './hospital-tools';

import {
  searchDoctorsTool,
  getDoctorDetailsTool,
  getSpecialtiesTool,
  getDoctorsByHospitalTool
} from './doctor-tools';

import {
  searchHealthcareCombinedTool,
  getHealthcareRecommendationsTool,
  compareHealthcareOptionsTool
} from './combined-search-tools';

// Export individual tools
export {
  searchHospitalsTool,
  getHospitalDetailsTool,
  searchHospitalsTextOnlyTool,
  searchDoctorsTool,
  getDoctorDetailsTool,
  getSpecialtiesTool,
  getDoctorsByHospitalTool,
  searchHealthcareCombinedTool,
  getHealthcareRecommendationsTool,
  compareHealthcareOptionsTool
};

// Combined tools object for easy import
export const allHealthcareTools = {
  // Hospital tools
  searchHospitals: searchHospitalsTool,
  getHospitalDetails: getHospitalDetailsTool,
  searchHospitalsTextOnly: searchHospitalsTextOnlyTool,
  
  // Doctor tools
  searchDoctors: searchDoctorsTool,
  getDoctorDetails: getDoctorDetailsTool,
  getSpecialties: getSpecialtiesTool,
  getDoctorsByHospital: getDoctorsByHospitalTool,
  
  // Combined & recommendation tools
  searchHealthcareCombined: searchHealthcareCombinedTool,
  getHealthcareRecommendations: getHealthcareRecommendationsTool,
  compareHealthcareOptions: compareHealthcareOptionsTool
};

// Essential tools for most common use cases
export const essentialTools = {
  searchHealthcareCombined: searchHealthcareCombinedTool,
  searchHospitals: searchHospitalsTool,
  searchDoctors: searchDoctorsTool,
  getHealthcareRecommendations: getHealthcareRecommendationsTool
};
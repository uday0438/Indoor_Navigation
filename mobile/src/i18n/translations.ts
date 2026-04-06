// ═══════════════════════════════════════════
// i18n Translation System
// ═══════════════════════════════════════════
export type Language = 'en' | 'te' | 'hi' | 'kn' | 'ta';

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  te: 'తెలుగు',
  hi: 'हिन्दी',
  kn: 'ಕನ್ನಡ',
  ta: 'தமிழ்',
};

export interface Translations {
  // Home
  appName: string;
  subtitle: string;
  startNavigation: string;
  buildingName: string;
  buildingDesc: string;
  navigate: string;
  vision: string;
  aboutECE: string;
  aboutKEC: string;
  indoorMaps: string;
  ourGoals: string;
  department: string;
  collegeInfo: string;
  quickNavigate: string;
  aboutUs: string;
  getInTouch: string;
  emailUs: string;
  sendMessage: string;
  yourName: string;
  yourEmail: string;
  yourMessage: string;
  messageSent: string;
  // Navigation
  navigatingTo: string;
  arrivedAt: string;
  liveTracking: string;
  recalculating: string;
  arrived: string;
  idle: string;
  planning: string;
  endNav: string;
  calculating: string;
  step: string;
  of: string;
  total: string;
  youHaveArrived: string;
  done: string;
  wrongDirection: string;
  wrongDirectionMsg: string;
  // Map
  indoorMap: string;
  selectStart: string;
  selectDestination: string;
  selectDest: string;
  go: string;
  searchStart: string;
  searchDest: string;
  clear: string;
  // NavBot
  navbotGreeting: string;
  askAnything: string;
  // General
  home: string;
  back: string;
  close: string;
  language: string;
  selectLanguage: string;
  // About team
  projectGuide: string;
  teamLead: string;
  frontendDev: string;
  backendDev: string;
  softwareTesting: string;
  // Vision & About
  visionTitle: string;
  aboutECETitle: string;
  aboutKECTitle: string;
  hodTitle: string;
  guideTitle: string;
  achievementsTitle: string;
  contributionTitle: string;
}

const en: Translations = {
  appName: 'KEC Navigator',
  subtitle: 'Sir Visveswaraiah Block • Indoor Navigation',
  startNavigation: 'Start Navigation →',
  buildingName: 'Sir Visveswaraiah Block',
  buildingDesc: 'Navigate with real-time indoor tracking using sensor fusion',
  navigate: 'Navigate',
  vision: 'Vision',
  aboutECE: 'About ECE',
  aboutKEC: 'About KEC',
  indoorMaps: 'Indoor maps',
  ourGoals: 'Our goals',
  department: 'Department',
  collegeInfo: 'College info',
  quickNavigate: 'Quick Navigate',
  aboutUs: 'About Us',
  getInTouch: 'Get in Touch',
  emailUs: 'Email Us',
  sendMessage: 'Send Message',
  yourName: 'Your Name',
  yourEmail: 'Your Email',
  yourMessage: 'Your Message',
  messageSent: 'Message sent successfully!',
  navigatingTo: 'Navigating to',
  arrivedAt: 'Arrived at',
  liveTracking: 'LIVE TRACKING',
  recalculating: 'RECALCULATING...',
  arrived: 'ARRIVED!',
  idle: 'IDLE',
  planning: 'PLANNING...',
  endNav: 'End',
  calculating: 'Calculating...',
  step: 'Step',
  of: 'of',
  total: 'total',
  youHaveArrived: 'You have arrived!',
  done: 'Done',
  wrongDirection: '⚠️ Wrong Direction',
  wrongDirectionMsg: 'You are moving away from the path. Please turn around.',
  indoorMap: 'Indoor Map',
  selectStart: 'Select start...',
  selectDestination: 'Select destination...',
  selectDest: 'Now select a destination',
  go: 'GO',
  searchStart: 'Search start...',
  searchDest: 'Search destination...',
  clear: 'Clear',
  navbotGreeting: "Hello! I'm NavBot. 👋 How can I help you today?",
  askAnything: 'Ask anything...',
  home: 'Home',
  back: 'Back',
  close: 'Close',
  language: 'Language',
  selectLanguage: 'Select Language',
  projectGuide: 'Project Guide',
  teamLead: 'Team Lead',
  frontendDev: 'Frontend Developer',
  backendDev: 'Backend Developer',
  softwareTesting: 'Software Testing',
  visionTitle: 'Vision — Our Goals',
  aboutECETitle: 'Electronics & Communication Engineering',
  aboutKECTitle: 'About Kuppam Engineering College',
  hodTitle: 'Head of the Department – ECE',
  guideTitle: 'Our Project Guide',
  achievementsTitle: 'Achievements and Contributions',
  contributionTitle: 'Contribution',
};

const te: Translations = {
  appName: 'KEC నావిగేటర్',
  subtitle: 'సర్ విశ్వేశ్వరయ్య బ్లాక్ • ఇండోర్ నావిగేషన్',
  startNavigation: 'నావిగేషన్ ప్రారంభించు →',
  buildingName: 'సర్ విశ్వేశ్వరయ్య బ్లాక్',
  buildingDesc: 'సెన్సార్ ఫ్యూజన్ ఉపయోగించి రియల్-టైమ్ ఇండోర్ ట్రాకింగ్‌తో నావిగేట్ చేయండి',
  navigate: 'నావిగేట్',
  vision: 'దృష్టి',
  aboutECE: 'ECE గురించి',
  aboutKEC: 'KEC గురించి',
  indoorMaps: 'ఇండోర్ మ్యాప్‌లు',
  ourGoals: 'మా లక్ష్యాలు',
  department: 'విభాగం',
  collegeInfo: 'కళాశాల సమాచారం',
  quickNavigate: 'త్వరిత నావిగేట్',
  aboutUs: 'మా గురించి',
  getInTouch: 'సంప్రదించండి',
  emailUs: 'ఇమెయిల్ చేయండి',
  sendMessage: 'సందేశం పంపు',
  yourName: 'మీ పేరు',
  yourEmail: 'మీ ఇమెయిల్',
  yourMessage: 'మీ సందేశం',
  messageSent: 'సందేశం విజయవంతంగా పంపబడింది!',
  navigatingTo: 'నావిగేట్ చేస్తోంది',
  arrivedAt: 'చేరుకున్నారు',
  liveTracking: 'లైవ్ ట్రాకింగ్',
  recalculating: 'తిరిగి లెక్కిస్తోంది...',
  arrived: 'చేరుకున్నారు!',
  idle: 'నిష్క్రియం',
  planning: 'ప్లానింగ్...',
  endNav: 'ముగించు',
  calculating: 'లెక్కిస్తోంది...',
  step: 'స్టెప్',
  of: 'లో',
  total: 'మొత్తం',
  youHaveArrived: 'మీరు చేరుకున్నారు!',
  done: 'పూర్తయింది',
  wrongDirection: '⚠️ తప్పు దిశ',
  wrongDirectionMsg: 'మీరు దారికి దూరంగా వెళ్తున్నారు. దయచేసి వెనక్కి తిరగండి.',
  indoorMap: 'ఇండోర్ మ్యాప్',
  selectStart: 'ప్రారంభ స్థానం ఎంచుకోండి...',
  selectDestination: 'గమ్యస్థానం ఎంచుకోండి...',
  selectDest: 'ఇప్పుడు గమ్యస్థానం ఎంచుకోండి',
  go: 'వెళ్ళు',
  searchStart: 'ప్రారంభం వెతకండి...',
  searchDest: 'గమ్యస్థానం వెతకండి...',
  clear: 'క్లియర్',
  navbotGreeting: 'నమస్కారం! నేను NavBot. 👋 మీకు ఎలా సహాయం చేయగలను?',
  askAnything: 'ఏదైనా అడగండి...',
  home: 'హోమ్',
  back: 'వెనుకకు',
  close: 'మూసివేయి',
  language: 'భాష',
  selectLanguage: 'భాష ఎంచుకోండి',
  projectGuide: 'ప్రాజెక్ట్ గైడ్',
  teamLead: 'టీం లీడ్',
  frontendDev: 'ఫ్రంటెండ్ డెవలపర్',
  backendDev: 'బ్యాకెండ్ డెవలపర్',
  softwareTesting: 'సాఫ్ట్‌వేర్ టెస్టింగ్',
  visionTitle: 'దృష్టి — మా లక్ష్యాలు',
  aboutECETitle: 'ఎలక్ట్రానిక్స్ & కమ్యూనికేషన్ ఇంజనీరింగ్',
  aboutKECTitle: 'కుప్పం ఇంజనీరింగ్ కళాశాల గురించి',
  hodTitle: 'విభాగాధిపతి – ECE',
  guideTitle: 'మా ప్రాజెక్ట్ గైడ్',
  achievementsTitle: 'విజయాలు మరియు సహకారాలు',
  contributionTitle: 'సహకారం',
};

const hi: Translations = {
  appName: 'KEC नेविगेटर',
  subtitle: 'सर विश्वेश्वरैया ब्लॉक • इंडोर नेविगेशन',
  startNavigation: 'नेविगेशन शुरू करें →',
  buildingName: 'सर विश्वेश्वरैया ब्लॉक',
  buildingDesc: 'सेंसर फ्यूजन का उपयोग करके रियल-टाइम इंडोर ट्रैकिंग के साथ नेविगेट करें',
  navigate: 'नेविगेट',
  vision: 'विजन',
  aboutECE: 'ECE के बारे में',
  aboutKEC: 'KEC के बारे में',
  indoorMaps: 'इंडोर मैप्स',
  ourGoals: 'हमारे लक्ष्य',
  department: 'विभाग',
  collegeInfo: 'कॉलेज जानकारी',
  quickNavigate: 'त्वरित नेविगेट',
  aboutUs: 'हमारे बारे में',
  getInTouch: 'संपर्क करें',
  emailUs: 'ईमेल करें',
  sendMessage: 'संदेश भेजें',
  yourName: 'आपका नाम',
  yourEmail: 'आपका ईमेल',
  yourMessage: 'आपका संदेश',
  messageSent: 'संदेश सफलतापूर्वक भेजा गया!',
  navigatingTo: 'नेविगेट कर रहे हैं',
  arrivedAt: 'पहुँच गए',
  liveTracking: 'लाइव ट्रैकिंग',
  recalculating: 'पुनर्गणना...',
  arrived: 'पहुँच गए!',
  idle: 'निष्क्रिय',
  planning: 'योजना बना रहे हैं...',
  endNav: 'समाप्त',
  calculating: 'गणना कर रहे हैं...',
  step: 'चरण',
  of: 'का',
  total: 'कुल',
  youHaveArrived: 'आप पहुँच गए हैं!',
  done: 'पूर्ण',
  wrongDirection: '⚠️ गलत दिशा',
  wrongDirectionMsg: 'आप रास्ते से दूर जा रहे हैं। कृपया वापस मुड़ें।',
  indoorMap: 'इंडोर मैप',
  selectStart: 'प्रारंभ चुनें...',
  selectDestination: 'गंतव्य चुनें...',
  selectDest: 'अब गंतव्य चुनें',
  go: 'जाओ',
  searchStart: 'प्रारंभ खोजें...',
  searchDest: 'गंतव्य खोजें...',
  clear: 'साफ़ करें',
  navbotGreeting: 'नमस्ते! मैं NavBot हूँ। 👋 आज मैं आपकी कैसे मदद कर सकता हूँ?',
  askAnything: 'कुछ भी पूछें...',
  home: 'होम',
  back: 'वापस',
  close: 'बंद करें',
  language: 'भाषा',
  selectLanguage: 'भाषा चुनें',
  projectGuide: 'प्रोजेक्ट गाइड',
  teamLead: 'टीम लीड',
  frontendDev: 'फ्रंटएंड डेवलपर',
  backendDev: 'बैकएंड डेवलपर',
  softwareTesting: 'सॉफ्टवेयर टेस्टिंग',
  visionTitle: 'विजन — हमारे लक्ष्य',
  aboutECETitle: 'इलेक्ट्रॉनिक्स एवं संचार इंजीनियरिंग',
  aboutKECTitle: 'कुप्पम इंजीनियरिंग कॉलेज के बारे में',
  hodTitle: 'विभागाध्यक्ष – ECE',
  guideTitle: 'हमारे प्रोजेक्ट गाइड',
  achievementsTitle: 'उपलब्धियाँ और योगदान',
  contributionTitle: 'योगदान',
};

const kn: Translations = {
  appName: 'KEC ನ್ಯಾವಿಗೇಟರ್',
  subtitle: 'ಸರ್ ವಿಶ್ವೇಶ್ವರಯ್ಯ ಬ್ಲಾಕ್ • ಒಳಾಂಗಣ ನ್ಯಾವಿಗೇಷನ್',
  startNavigation: 'ನ್ಯಾವಿಗೇಷನ್ ಪ್ರಾರಂಭಿಸಿ →',
  buildingName: 'ಸರ್ ವಿಶ್ವೇಶ್ವರಯ್ಯ ಬ್ಲಾಕ್',
  buildingDesc: 'ಸೆನ್ಸಾರ್ ಫ್ಯೂಷನ್ ಬಳಸಿ ನೈಜ-ಸಮಯದ ಒಳಾಂಗಣ ಟ್ರ್ಯಾಕಿಂಗ್‌ನೊಂದಿಗೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಿ',
  navigate: 'ನ್ಯಾವಿಗೇಟ್',
  vision: 'ದೃಷ್ಟಿ',
  aboutECE: 'ECE ಬಗ್ಗೆ',
  aboutKEC: 'KEC ಬಗ್ಗೆ',
  indoorMaps: 'ಒಳಾಂಗಣ ನಕ್ಷೆಗಳು',
  ourGoals: 'ನಮ್ಮ ಗುರಿಗಳು',
  department: 'ವಿಭಾಗ',
  collegeInfo: 'ಕಾಲೇಜು ಮಾಹಿತಿ',
  quickNavigate: 'ತ್ವರಿತ ನ್ಯಾವಿಗೇಟ್',
  aboutUs: 'ನಮ್ಮ ಬಗ್ಗೆ',
  getInTouch: 'ಸಂಪರ್ಕಿಸಿ',
  emailUs: 'ಇಮೇಲ್ ಮಾಡಿ',
  sendMessage: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
  yourName: 'ನಿಮ್ಮ ಹೆಸರು',
  yourEmail: 'ನಿಮ್ಮ ಇಮೇಲ್',
  yourMessage: 'ನಿಮ್ಮ ಸಂದೇಶ',
  messageSent: 'ಸಂದೇಶ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!',
  navigatingTo: 'ನ್ಯಾವಿಗೇಟ್ ಮಾಡುತ್ತಿದೆ',
  arrivedAt: 'ತಲುಪಿದ್ದೀರಿ',
  liveTracking: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
  recalculating: 'ಮರು ಲೆಕ್ಕಾಚಾರ...',
  arrived: 'ತಲುಪಿದ್ದೀರಿ!',
  idle: 'ನಿಷ್ಕ್ರಿಯ',
  planning: 'ಯೋಜನೆ...',
  endNav: 'ಕೊನೆ',
  calculating: 'ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತಿದೆ...',
  step: 'ಹಂತ',
  of: 'ಲ್ಲಿ',
  total: 'ಒಟ್ಟು',
  youHaveArrived: 'ನೀವು ತಲುಪಿದ್ದೀರಿ!',
  done: 'ಮುಗಿದಿದೆ',
  wrongDirection: '⚠️ ತಪ್ಪು ದಿಕ್ಕು',
  wrongDirectionMsg: 'ನೀವು ದಾರಿಯಿಂದ ದೂರ ಹೋಗುತ್ತಿದ್ದೀರಿ. ದಯವಿಟ್ಟು ಹಿಂತಿರುಗಿ.',
  indoorMap: 'ಒಳಾಂಗಣ ನಕ್ಷೆ',
  selectStart: 'ಪ್ರಾರಂಭ ಆಯ್ಕೆಮಾಡಿ...',
  selectDestination: 'ಗಮ್ಯಸ್ಥಾನ ಆಯ್ಕೆಮಾಡಿ...',
  selectDest: 'ಈಗ ಗಮ್ಯಸ್ಥಾನ ಆಯ್ಕೆಮಾಡಿ',
  go: 'ಹೋಗು',
  searchStart: 'ಪ್ರಾರಂಭ ಹುಡುಕಿ...',
  searchDest: 'ಗಮ್ಯಸ್ಥಾನ ಹುಡುಕಿ...',
  clear: 'ತೆರವುಗೊಳಿಸಿ',
  navbotGreeting: 'ನಮಸ್ಕಾರ! ನಾನು NavBot. 👋 ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
  askAnything: 'ಏನಾದರೂ ಕೇಳಿ...',
  home: 'ಹೋಮ್',
  back: 'ಹಿಂದೆ',
  close: 'ಮುಚ್ಚಿ',
  language: 'ಭಾಷೆ',
  selectLanguage: 'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
  projectGuide: 'ಪ್ರಾಜೆಕ್ಟ್ ಗೈಡ್',
  teamLead: 'ಟೀಮ್ ಲೀಡ್',
  frontendDev: 'ಫ್ರಂಟೆಂಡ್ ಡೆವಲಪರ್',
  backendDev: 'ಬ್ಯಾಕೆಂಡ್ ಡೆವಲಪರ್',
  softwareTesting: 'ಸಾಫ್ಟ್‌ವೇರ್ ಟೆಸ್ಟಿಂಗ್',
  visionTitle: 'ದೃಷ್ಟಿ — ನಮ್ಮ ಗುರಿಗಳು',
  aboutECETitle: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ & ಕಮ್ಯೂನಿಕೇಷನ್ ಇಂಜಿನಿಯರಿಂಗ್',
  aboutKECTitle: 'ಕುಪ್ಪಂ ಇಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು ಬಗ್ಗೆ',
  hodTitle: 'ವಿಭಾಗ ಮುಖ್ಯಸ್ಥರು – ECE',
  guideTitle: 'ನಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ಗೈಡ್',
  achievementsTitle: 'ಸಾಧನೆಗಳು ಮತ್ತು ಕೊಡುಗೆಗಳು',
  contributionTitle: 'ಕೊಡುಗೆ',
};

const ta: Translations = {
  appName: 'KEC நேவிகேட்டர்',
  subtitle: 'சர் விஸ்வேஸ்வரையா பிளாக் • உட்புற வழிசெலுத்தல்',
  startNavigation: 'வழிசெலுத்தல் தொடங்கு →',
  buildingName: 'சர் விஸ்வேஸ்வரையா பிளாக்',
  buildingDesc: 'சென்சார் ஃப்யூஷன் பயன்படுத்தி நிகழ்நேர உட்புற கண்காணிப்புடன் வழிசெலுத்துங்கள்',
  navigate: 'வழிசெலுத்து',
  vision: 'தொலைநோக்கு',
  aboutECE: 'ECE பற்றி',
  aboutKEC: 'KEC பற்றி',
  indoorMaps: 'உட்புற வரைபடம்',
  ourGoals: 'எங்கள் இலக்குகள்',
  department: 'துறை',
  collegeInfo: 'கல்லூரி தகவல்',
  quickNavigate: 'விரைவு வழிசெலுத்தல்',
  aboutUs: 'எங்களைப் பற்றி',
  getInTouch: 'தொடர்பு கொள்ளுங்கள்',
  emailUs: 'மின்னஞ்சல் அனுப்புங்கள்',
  sendMessage: 'செய்தி அனுப்பு',
  yourName: 'உங்கள் பெயர்',
  yourEmail: 'உங்கள் மின்னஞ்சல்',
  yourMessage: 'உங்கள் செய்தி',
  messageSent: 'செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!',
  navigatingTo: 'வழிசெலுத்துகிறது',
  arrivedAt: 'வந்துவிட்டீர்கள்',
  liveTracking: 'நேரடி கண்காணிப்பு',
  recalculating: 'மீண்டும் கணக்கிடுகிறது...',
  arrived: 'வந்துவிட்டீர்கள்!',
  idle: 'செயலற்ற',
  planning: 'திட்டமிடுகிறது...',
  endNav: 'முடிவு',
  calculating: 'கணக்கிடுகிறது...',
  step: 'படி',
  of: 'இல்',
  total: 'மொத்தம்',
  youHaveArrived: 'நீங்கள் வந்துவிட்டீர்கள்!',
  done: 'முடிந்தது',
  wrongDirection: '⚠️ தவறான திசை',
  wrongDirectionMsg: 'நீங்கள் பாதையிலிருந்து விலகிச் செல்கிறீர்கள். திரும்புங்கள்.',
  indoorMap: 'உட்புற வரைபடம்',
  selectStart: 'தொடக்கத்தை தேர்ந்தெடுக்கவும்...',
  selectDestination: 'இலக்கை தேர்ந்தெடுக்கவும்...',
  selectDest: 'இப்போது இலக்கை தேர்ந்தெடுக்கவும்',
  go: 'செல்',
  searchStart: 'தொடக்கம் தேடு...',
  searchDest: 'இலக்கு தேடு...',
  clear: 'அழி',
  navbotGreeting: 'வணக்கம்! நான் NavBot. 👋 இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
  askAnything: 'எதையும் கேளுங்கள்...',
  home: 'முகப்பு',
  back: 'பின்',
  close: 'மூடு',
  language: 'மொழி',
  selectLanguage: 'மொழி தேர்ந்தெடுக்கவும்',
  projectGuide: 'திட்ட வழிகாட்டி',
  teamLead: 'குழு தலைவர்',
  frontendDev: 'ஃபிரான்ட்எண்ட் டெவலப்பர்',
  backendDev: 'பேக்எண்ட் டெவலப்பர்',
  softwareTesting: 'மென்பொருள் சோதனை',
  visionTitle: 'தொலைநோக்கு — எங்கள் இலக்குகள்',
  aboutECETitle: 'எலக்ட்ரானிக்ஸ் & தகவல் தொடர்பு பொறியியல்',
  aboutKECTitle: 'குப்பம் பொறியியல் கல்லூரி பற்றி',
  hodTitle: 'துறைத் தலைவர் – ECE',
  guideTitle: 'எங்கள் திட்ட வழிகாட்டி',
  achievementsTitle: 'சாதனைகள் மற்றும் பங்களிப்புகள்',
  contributionTitle: 'பங்களிப்பு',
};

export const translations: Record<Language, Translations> = { en, te, hi, kn, ta };

/**
 * Multi-language Translation Utility for KEC Navigation
 */

export const TRANSLATE = (text: string, lang: 'en' | 'hi' | 'te') => {
  if (lang === 'en' || !text) return text;

  // Hindi Translations
  if (lang === 'hi') {
    if (text.startsWith("Starting navigation to")) {
      const dest = text.replace("Starting navigation to ", "").replace(". Follow the path.", "");
      return `${dest} के लिए नेవిగేషన్ शुरू हो रहा है। नीली रेखा का पालन करें।`;
    }
    if (text === "You have arrived at your destination.") return "आप अपनी मंजिल पर पहुंच गए हैं।";
    if (text === "Goal Reached!") return "मंजिल तक पहुँच गए!";
    if (text === "Searching...") return "खोज रहे हैं...";
    if (text.startsWith("Attention!")) return "ध्यान दें! आप मार्ग से हट रहे हैं। कृपया नीली रेखा का पालन करें।";
    if (text.startsWith("Changing to floor")) {
      const f = text.replace("Changing to floor ", "");
      return `मंजिल ${f} पर जा रहे हैं`;
    }
    if (text.includes("Walk straight for")) {
      const match = text.match(/(\d+)/);
      return `${match ? match[1] : ''} मीटर सीधे चलें`;
    }
    if (text.includes("Turn right")) return "दाएं मुड़ें";
    if (text.includes("Turn left")) return "बाएं मुड़ें";
    if (text.includes("Turn slightly right")) return "थोड़ा दाएं मुड़ें";
    if (text.includes("Turn slightly left")) return "थोड़ा बाएं मुड़ें";
    if (text.includes("Change floor") || text.includes("stairs") || text.includes("lift")) return "अगली मंजिल पर जाएं";
    return text;
  }

  // Telugu Translations
  if (lang === 'te') {
    if (text.startsWith("Starting navigation to")) {
      const dest = text.replace("Starting navigation to ", "").replace(". Follow the path.", "");
      return `${dest} కు నావిగేషన్ ప్రారంభమవుతోంది. బ్లూ లైన్ అనుసరించండి.`;
    }
    if (text === "You have arrived at your destination.") return "మీరు మీ గమ్యస్థానానికి చేరుకున్నారు.";
    if (text === "Goal Reached!") return "గమ్యాన్ని చేరుకున్నారు!";
    if (text === "Searching...") return "వెతుకుతోంది...";
    if (text.startsWith("Attention!")) return "గమనిక! మీరు దారి తప్పుతున్నారు. దయచేసి బ్లూ లైన్ అనుసరించండి.";
    if (text.startsWith("Changing to floor")) {
      const f = text.replace("Changing to floor ", "");
      return `ఫ్లోర్ ${f} కి మారుతున్నారు`;
    }
    if (text.includes("Walk straight for")) {
      const match = text.match(/(\d+)/);
      return `${match ? match[1] : ''} మీటర్లు నేరుగా నడవండి`;
    }
    if (text.includes("Turn right")) return "కుడి వైపు తిరగండి";
    if (text.includes("Turn left")) return "ఎడమ వైపు తిరగండి";
    if (text.includes("Turn slightly right")) return "కొద్దిగా కుడివైపు తిరగండి";
    if (text.includes("Turn slightly left")) return "కొద్దిగా ఎడమవైపు తిరగండి";
    if (text.includes("Change floor") || text.includes("stairs") || text.includes("lift")) return "తదుపరి అంతస్తుకి వెళ్ళండి";
    return text;
  }

  return text;
};

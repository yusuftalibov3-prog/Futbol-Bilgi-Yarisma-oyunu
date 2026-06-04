export type Language = 'en' | 'tr' | 'ar';

export interface TranslationDictionary {
  score: string;
  lvl: string;
  lives: string;
  goalProgress: string;
  pausedAwaiting: string;
  incomingTrivia: string;
  settings: string;
  sound: string;
  soundOn: string;
  soundOff: string;
  language: string;
  close: string;
  selectColor: string;
  startRunner: string;
  gameOver: string;
  finalScore: string;
  questionsAnswered: string;
  accuracyRate: string;
  maxCombo: string;
  distanceTraveled: string;
  retryRun: string;
  pressToSelect: string;
  swipeToMove: string;
  decisionBoundary: string;
  pathA: string;
  pathB: string;
  wrongSelection: string;
  velocityRestricted: string;
}

export const UI_TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    score: 'Score',
    lvl: 'Lvl',
    lives: 'Lives',
    goalProgress: 'Goal progress',
    pausedAwaiting: 'PAUSED - AWAITING ANSWER',
    incomingTrivia: '⚽ INCOMING TRIVIA GATE ⚽',
    settings: 'Settings',
    sound: 'Game Sound',
    soundOn: 'ON',
    soundOff: 'OFF',
    language: 'Language',
    close: 'Close',
    selectColor: 'Select Hero Glow Color',
    startRunner: 'START RUNNER GAME',
    gameOver: 'GAME OVER!',
    finalScore: 'FINAL SCORE',
    questionsAnswered: 'Questions Answered',
    accuracyRate: 'Accuracy Rate',
    maxCombo: 'Max Combo Streak',
    distanceTraveled: 'Distance Traveled',
    retryRun: 'RETRY RUN',
    pressToSelect: 'PRESS LEFT/RIGHT KEY OR SWIPE TO CHOOSE',
    swipeToMove: 'Swipe left or right to steer/choose',
    decisionBoundary: 'DECISION BOUNDARY',
    pathA: 'PATH A',
    pathB: 'PATH B',
    wrongSelection: '❌ WRONG ANSWER SELECTION ❌',
    velocityRestricted: 'Velocity accelerator temporarily restricted!',
  },
  tr: {
    score: 'Skor',
    lvl: 'Seviye',
    lives: 'Can',
    goalProgress: 'Hedef İlerlemesi',
    pausedAwaiting: 'DURAKLATILDI - CEVAP BEKLENİYOR',
    incomingTrivia: '⚽ YAKLAŞAN BİLGİ GEÇİDİ ⚽',
    settings: 'Ayarlar',
    sound: 'Oyun Sesi',
    soundOn: 'AÇIK',
    soundOff: 'KAPALI',
    language: 'Dil',
    close: 'Kapat',
    selectColor: 'Kahraman Işık Rengini Seç',
    startRunner: 'KOŞUYU BAŞLAT',
    gameOver: 'OYUN BİTTİ!',
    finalScore: 'TOPLAM SKOR',
    questionsAnswered: 'Cevaplanan Sorular',
    accuracyRate: 'Doğruluk Oranı',
    maxCombo: 'Maksimum Seri Kombo',
    distanceTraveled: 'Katedilen Mesafe',
    retryRun: 'YENİDEN KOŞU',
    pressToSelect: 'SEÇMEK İÇİN SOL/SAĞ TUŞUNA BASIN VEYA SÜRÜKLEYİN',
    swipeToMove: 'Yönlendirmek/seçmek için sola veya sağa sürükleyin',
    decisionBoundary: 'KARAR SINIRI',
    pathA: 'A YOLU',
    pathB: 'B YOLU',
    wrongSelection: '❌ YANLIŞ CEVAP SEÇİLDİ ❌',
    velocityRestricted: 'Hızlandırıcı geçici olarak sınırlandırıldı!',
  },
  ar: {
    score: 'النقاط',
    lvl: 'المستوى',
    lives: 'القلوب',
    goalProgress: 'التقدم نحو الهدف',
    pausedAwaiting: 'مؤقت - في انتظار الإجابة',
    incomingTrivia: '⚽ بوابة الأسئلة القادمة ⚽',
    settings: 'الإعدادات',
    sound: 'صوت اللعبة',
    soundOn: 'تشغيل',
    soundOff: 'كتم',
    language: 'اللغة',
    close: 'إغلاق',
    selectColor: 'اختر لون توهج البطل',
    startRunner: 'بدء الجري السريع',
    gameOver: 'انتهت اللعبة!',
    finalScore: 'النتيجة الإجمالية',
    questionsAnswered: 'الأسئلة المجابة',
    accuracyRate: 'نسبة الدقة',
    maxCombo: 'أقصى متتالية كاشفة',
    distanceTraveled: 'المسافة المقطوعة',
    retryRun: 'إعادة المحاولة',
    pressToSelect: 'اضغط مفتاح يسار/يمين أو اسحب للاختيار',
    swipeToMove: 'اسحب لليسار أو اليمين للتوجيه والاختيار',
    decisionBoundary: 'حد اتخاذ القرار',
    pathA: 'المسار أ',
    pathB: 'المسار ب',
    wrongSelection: '❌ اختيار إجابة خاطئة ❌',
    velocityRestricted: 'تم تقييد مسرع السرعة مؤقتًا!',
  }
};

export const QUESTION_TRANSLATIONS: Record<string, Record<Language, { question: string; left: string; right: string }>> = {
  d1_1: {
    en: { question: "Where is Lionel Messi from?", left: "ARGENTINA", right: "BRAZIL" },
    tr: { question: "Lionel Messi nerelidir?", left: "ARJANTİN", right: "BREZİLYA" },
    ar: { question: "من أين ليونيل ميسي؟", left: "الأرجنتين", right: "البرازيل" }
  },
  d1_2: {
    en: { question: "Which of these numbers is Cristiano Ronaldo's famous jersey number?", left: "10", right: "7" },
    tr: { question: "Cristiano Ronaldo'nun ünlü forma numarası hangisidir?", left: "10", right: "7" },
    ar: { question: "ما هو رقم قميص كريستيانو رونالدو الشهير؟", left: "١٠", right: "٧" }
  },
  d1_3: {
    en: { question: "Which country does Kylian Mbappé play for internationally?", left: "FRANCE", right: "BELGIUM" },
    tr: { question: "Kylian Mbappé milli takımda hangi ülke için oynuyor?", left: "FRANSA", right: "BELÇİKA" },
    ar: { question: "لأي منتخب يلعب كيليان مبابي دولياً؟", left: "فرنسا", right: "بلجيكا" }
  },
  d1_4: {
    en: { question: "Which country's national team is nicknamed 'Seleção'?", left: "BRAZIL", right: "ARGENTINA" },
    tr: { question: "Hangi ülkenin milli takımının lakabı 'Seleção'dur?", left: "BREZİLYA", right: "ARJANTİN" },
    ar: { question: "أي منتخب يلقب بـ 'سيليساو'؟", left: "البرازيل", right: "الأرجنتين" }
  },
  d1_5: {
    en: { question: "What is Erling Haaland's nationality?", left: "SWEDEN", right: "NORWAY" },
    tr: { question: "Erling Haaland'ın uyruğu nedir?", left: "İSVEÇ", right: "NORVEÇ" },
    ar: { question: "ما هي جنسية إرلينغ هالاند؟", left: "السويد", right: "النرويج" }
  },
  d1_6: {
    en: { question: "How many Ballon d'Or awards has Lionel Messi won?", left: "8", right: "5" },
    tr: { question: "Lionel Messi kaç Ballon d'Or kazanmıştır?", left: "8", right: "5" },
    ar: { question: "كم مرة فاز ليونيل ميسي بجائزة الكرة الذهبية؟", left: "٨", right: "٥" }
  },
  d1_7: {
    en: { question: "Which European giant did Ronaldo play for in Spain?", left: "BARCELONA", right: "REAL MADRID" },
    tr: { question: "Ronaldo, İspanya'da hangi Avrupa devinde oynadı?", left: "BARSELONA", right: "REAL MADRID" },
    ar: { question: "أي عملاق أوروبي لعب له رونالدو في إسبانيا؟", left: "برشلونة", right: "ريال مدريد" }
  },
  d1_8: {
    en: { question: "Which giant did Neymar play for alongside Messi and Suarez (MSN)?", left: "BARCELONA", right: "REAL MADRID" },
    tr: { question: "Neymar, Messi ve Suarez ile birlikte (MSN) hangi dev kulüpte oynadı?", left: "BARSELONA", right: "REAL MADRID" },
    ar: { question: "أي عملاق لعب له نيمار بجانب ميسي وسواريز (MSN)؟", left: "برشلونة", right: "ريال مدريد" }
  },
  d1_9: {
    en: { question: "Who won the 2022 FIFA World Cup in Qatar?", left: "ARGENTINA", right: "FRANCE" },
    tr: { question: "Katar'daki 2022 FIFA Dünya Kupası'nı kim kazandı?", left: "ARJANTİN", right: "FRANSA" },
    ar: { question: "من فاز بكأس العالم في قطر 2022؟", left: "الأرجنتين", right: "فرنسا" }
  },
  d1_10: {
    en: { question: "What is the duration of a standard football match (excluding extra time)?", left: "80 MINS", right: "90 MINS" },
    tr: { question: "Standart bir futbol maçının süresi kaç dakikadır (uzatmalar hariç)?", left: "80 DK", right: "90 DK" },
    ar: { question: "ما هي مدة مباراة كرة القدم القياسية (دون الأشواط الإضافية)؟", left: "٨٠ دقيقة", right: "٩٠ دقيقة" }
  },
  d1_11: {
    en: { question: "Which player has the nickname 'CR7'?", left: "C. RONALDO", right: "RIVALDO" },
    tr: { question: "Hangi futbolcu 'CR7' lakabına sahiptir?", left: "C. RONALDO", right: "RIVALDO" },
    ar: { question: "من اللقب بالرمز 'CR7'؟", left: "ك. رونالدو", right: "ريفالدو" }
  },
  d1_12: {
    en: { question: "Which of these is Haaland's primary foot?", left: "RIGHT FOOT", right: "LEFT FOOT" },
    tr: { question: "Haaland'ın birincil olarak kullandığı ayağı hangisidir?", left: "SAĞ AYAK", right: "SOL AYAK" },
    ar: { question: "أي قدم هي القدم الأساسية لهالاند؟", left: "القدم اليمنى", right: "القدم اليسرى" }
  },
  d1_13: {
    en: { question: "Where does Neymar currently play club football?", left: "AL HILAL", right: "INTER MIAMI" },
    tr: { question: "Neymar şu anda hangi kulüpte futbol oynuyor?", left: "AL HILAL", right: "INTER MIAMI" },
    ar: { question: "أين يلعب نيمار حالياً؟", left: "الهلال", right: "إنتر ميامي" }
  },
  d1_14: {
    en: { question: "How many players are on the pitch for one team?", left: "11 PLAYERS", right: "12 PLAYERS" },
    tr: { question: "Bir takım için sahada kaç oyuncu bulunur?", left: "11 OYUNCU", right: "12 OYUNCU" },
    ar: { question: "كم لاعب يتواجد في الملعب لكل فريق؟", left: "١١ لاعباً", right: "١٢ لاعباً" }
  },
  d1_15: {
    en: { question: "Which of these is the position of Alisson Becker or Thibaut Courtois?", left: "STRIKER", right: "GOALKEEPER" },
    tr: { question: "Alisson Becker veya Thibaut Courtois'nın mevkisi hangisidir?", left: "FORVET", right: "KALECİ" },
    ar: { question: "ما هو مركز اللاعب أليسون بيكر أو تيبو كورتوا؟", left: "مهاجم", right: "حارس مرمى" }
  },
  d2_1: {
    en: { question: "Which club won the UEFA Champions League in 2023?", left: "REAL MADRID", right: "MANCHESTER CITY" },
    tr: { question: "Hangi kulüp 2023'te UEFA Şampiyonlar Ligi'ni kazandı?", left: "REAL MADRID", right: "MANCHESTER CITY" },
    ar: { question: "أي نادي فاز بدوري أبطال أوروبا عام 2023؟", left: "ريال مدريد", right: "مانشستر سيتي" }
  },
  d2_2: {
    en: { question: "In which league does Borussia Dortmund play?", left: "BUNDESLIGA", right: "SERIE A" },
    tr: { question: "Borussia Dortmund hangi ligde oynuyor?", left: "BUNDESLIGA", right: "SERIE A" },
    ar: { question: "في أي دوري يلعب بوروسيا دورتموند؟", left: "الدوري الألماني", right: "الدوري الإيطالي" }
  },
  d2_3: {
    en: { question: "How many World Cups did the legendary Pelé win?", left: "3 WORLD CUPS", right: "2 WORLD CUPS" },
    tr: { question: "Efsanevi Pelé kaç kez Dünya Kupası kazandı?", left: "3 DÜNYA KUPASI", right: "2 DÜNYA KUPASI" },
    ar: { question: "كم كأس عالم فاز بها الأسطورة بيليه؟", left: "٣ كؤوس عالم", right: "كأسا عالم" }
  },
  d2_4: {
    en: { question: "Which Premier League club has won the most titles in total history?", left: "LIVERPOOL", right: "MANCHESTER UTD" },
    tr: { question: "Tarih boyunca en çok Premier Lig şampiyonluğu kazanan kulüp hangisidir?", left: "LIVERPOOL", right: "MANCHESTER UTD" },
    ar: { question: "أي نادي في الدوري الإنجليزي الممتاز فاز بأكبر عدد من الألقاب عبر التاريخ؟", left: "ليفربول", right: "مانشستر يونايتد" }
  },
  d2_5: {
    en: { question: "Which Serie A club is nicknamed 'The Old Lady'?", left: "AC MILAN", right: "JUVENTUS" },
    tr: { question: "Hangi Serie A kulübünün lakabı 'Yapraklı Hanım' veya 'The Old Lady'dir?", left: "AC MILAN", right: "JUVENTUS" },
    ar: { question: "أي نادي إيطالي يلقب بـ 'السيدة العجوز'؟", left: "أي سي ميلان", right: "يوفنتوس" }
  },
  d2_6: {
    en: { question: "Who is the all-time top scorer in UEFA Champions League history?", left: "C. RONALDO", right: "LIONEL MESSI" },
    tr: { question: "UEFA Şampiyonlar Ligi tarihinin tüm zamanların en golcü oyuncusu kimdir?", left: "C. RONALDO", right: "LIONEL MESSI" },
    ar: { question: "من هو الهداف التاريخي لدوري أبطال أوروبا؟", left: "ك. رونالدو", right: "ليونيل ميسي" }
  },
  d2_7: {
    en: { question: "Which country hosted the 2014 FIFA World Cup?", left: "BRAZIL", right: "GERMANY" },
    tr: { question: "2014 FIFA Dünya Kupası'na hangi ülke ev sahipliği yaptı?", left: "BREZİLYA", right: "ALMANYA" },
    ar: { question: "أي بلد استضاف كأس العالم 2014؟", left: "البرازيل", right: "ألمانيا" }
  },
  d2_8: {
    en: { question: "Which English player won the Ballon d'Or in 2001 while playing for Liverpool?", left: "DAVID BECKHAM", right: "MICHAEL OWEN" },
    tr: { question: "Hangi İngiliz oyuncu, Liverpool'da oynarken 2001'de Ballon d'Or kazandı?", left: "DAVID BECKHAM", right: "MICHAEL OWEN" },
    ar: { question: "أي لاعب إنجليزي فاز بجائزة الكرة الذهبية عام 2001 أثناء لعبه مع ليفربول؟", left: "ديفيد بيكهام", right: "مايكل أوين" }
  },
  d2_9: {
    en: { question: "Which Italian city do Inter and Milan share stadium in?", left: "ROME", right: "MILAN" },
    tr: { question: "Inter ve Milan stadyumlarını hangi İtalyan şehrinde paylaşıyorlar?", left: "ROMA", right: "MİLANO" },
    ar: { question: "في أي مدينة إيطالية يتشارك إنتر وميلان الملعب؟", left: "روما", right: "ميلان" }
  },
  d2_10: {
    en: { question: "Who wear 'The Red Devils' nickname in English Football?", left: "MANCHESTER UTD", right: "ARSENAL" },
    tr: { question: "İngiliz futbolunda hangisinin lakabı 'Kırmızı Şeytanlar'dır?", left: "MANCHESTER UTD", right: "ARSENAL" },
    ar: { question: "أي فريق يلقب بـ 'الشياطين الحمر' في كرة القدم الإنجليزية؟", left: "مانشستر يونايتد", right: "أرسنال" }
  },
  d2_11: {
    en: { question: "Which French club is famous for playing at 'Parc des Princes'?", left: "MARSEILLE", right: "PARIS SG" },
    tr: { question: "Hangi Fransız kulübü 'Parc des Princes' stadyumunda oynamasıyla ünlüdür?", left: "MARSİLYA", right: "PARIS SG" },
    ar: { question: "أي نادي فرنسي شهير يلعب في ملعب 'حديقة الأمراء'؟", left: "مارسيليا", right: "باريس سان جيرمان" }
  },
  d2_12: {
    en: { question: "What team is known as 'The Gunners'?", left: "ARSENAL", right: "CHELSEA" },
    tr: { question: "Hangi takım 'Topçular' (The Gunners) olarak bilinir?", left: "ARSENAL", right: "CHELSEA" },
    ar: { question: "من يلقب بـ 'المدفعجية' (The Gunners)؟", left: "أرسنال", right: "تشيلسي" }
  },
  d2_13: {
    en: { question: "Where was the 2018 World Cup held?", left: "RUSSIA", right: "QATAR" },
    tr: { question: "2018 Dünya Kupası nerede düzenlendi?", left: "RUSYA", right: "KATAR" },
    ar: { question: "أين أقيمت بطولة كأس العالم 2018؟", left: "روسيا", right: "قطر" }
  },
  d2_14: {
    en: { question: "Which of these managers is famous for his 'Tiki-Taka' style?", left: "PEP GUARDIOLA", right: "JOSÉ MOURINHO" },
    tr: { question: "Bu teknik direktörlerden hangisi 'Tiki-Taka' tarzıyla ünlüdür?", left: "PEP GUARDIOLA", right: "JOSÉ MOURINHO" },
    ar: { question: "من من هؤلاء المدربين اشتهر بأسلوب 'تيكي تاكا'؟", left: "بيب غوارديولا", right: "جوزيه مورينهو" }
  },
  d2_15: {
    en: { question: "In which country was the famous tiki-taka master Andres Iniesta born?", left: "SPAIN", right: "PORTUGAL" },
    tr: { question: "Ünlü tiki-taka ustası Andres Iniesta hangi ülkede doğdu?", left: "İSPANYA", right: "PORTEKİZ" },
    ar: { question: "في أي بلد ولد أندريه إنييستا الشهير؟", left: "إسبانيا", right: "البرتغال" }
  },
  d3_1: {
    en: { question: "Who is the all-time top scorer in World Cup tournament history?", left: "MIROSLAV KLOSE", right: "RONALDO NAZARIO" },
    tr: { question: "Dünya Kupası turnuvaları tarihinin tüm zamanların en golcü oyuncusu kimdir?", left: "MIROSLAV KLOSE", right: "RONALDO NAZARIO" },
    ar: { question: "من هو الهداف التاريخي لبطولات كأس العالم؟", left: "ميروسلاف كلوزه", right: "رونالدو نازاريو" }
  },
  d3_2: {
    en: { question: "Which professional club did Zlatan Ibrahimovic play for first?", left: "MALMÖ FF", right: "AJAX" },
    tr: { question: "Zlatan Ibrahimovic profesyonel olarak ilk hangi kulüpte oynadı?", left: "MALMÖ FF", right: "AJAX" },
    ar: { question: "ما هو أول فريق محترف لعب له زلاتان إبراهيموفيتش؟", left: "مالمو السويدي", right: "أياكس" }
  },
  d3_3: {
    en: { question: "Who won the Ballon d'Or in 2007 (just before the Messi-Ronaldo era)?", left: "KAKÁ", right: "RONALDINHO" },
    tr: { question: "Messi-Ronaldo dönemi başlamadan hemen önce, 2007'de Ballon d'Or'u kim kazandı?", left: "KAKÁ", right: "RONALDINHO" },
    ar: { question: "من فاز بجائزة الكرة الذهبية عام 2007 (قبل حقبة ميسي ورونالدو مباشرة)؟", left: "كاكا", right: "رونالدينيو" }
  },
  d3_4: {
    en: { question: "Which country won the first-ever FIFA World Cup held in 1930?", left: "URUGUAY", right: "ARGENTINA" },
    tr: { question: "1930'da düzenlenen ilk FIFA Dünya Kupası'nı hangi ülke kazandı?", left: "URUUGUAY", right: "ARJANTİN" },
    ar: { question: "أي منتخب فاز بأول كأس عالم عام 1930؟", left: "الأوروغواي", right: "الأرجنتين" }
  },
  d3_5: {
    en: { question: "What is the official nickname of the Spanish club Villarreal CF?", left: "YELLOW SUBMARINE", right: "THE BATS" },
    tr: { question: "Villarreal CF kulübünün resmi lakabı hangisidir?", left: "SARI DENİZALTI", right: "YARASALAR" },
    ar: { question: "ما هو اللقب الرسمي للفريق الإسباني فياريال؟", left: "الغواصات الصفراء", right: "الخفافيش" }
  },
  d3_6: {
    en: { question: "Which team was nicknamed 'The Foxes' when they shockingly won the PL in 2016?", left: "WATFORD", right: "LEICESTER CITY" },
    tr: { question: "2016'da şok edici şekilde Premier Lig kazandıklarında lakabı 'The Foxes' (Tilkiler) olan takım hangisiydi?", left: "WATFORD", right: "LEICESTER CITY" },
    ar: { question: "من الفريق الملقب بـ 'الثعالب' الذي صدم العالم وفاز بالبريميرليغ عام 2016؟", left: "واتفورد", right: "ليستر سيتي" }
  },
  d3_7: {
    en: { question: "Who managed Arsenal's historic 49-game undefeated 'Invincibles'?", left: "ARSÈNE WENGER", right: "ALEX FERGUSON" },
    tr: { question: "Arsenal'in tarihi 49 maçlık namağlup 'Yenilmezler' (Invincibles) kadrosunu kim yönetti?", left: "ARSÈNE WENGER", right: "ALEX FERGUSON" },
    ar: { question: "من كان مدرب أرسنال في موسم الـ 49 مباراة التاريخي دون خسارة؟", left: "أرسين فينغر", right: "أليكس فيرغسون" }
  },
  d3_8: {
    en: { question: "Which African nation became the first to reach a World Cup Semi-Final (2022)?", left: "MOROCCO", right: "SENEGAL" },
    tr: { question: "2022'de Dünya Kupası Yarı Finaline ulaşan ilk Afrika ülkesi hangisi oldu?", left: "FAS", right: "SENEGAL" },
    ar: { question: "أي دولة أفريقية كانت الأولى التي تصل لنصف نهائي كأس العالم (2022)؟", left: "المغرب", right: "السنغال" }
  },
  d3_9: {
    en: { question: "Which club did Diego Maradona play for in Italy, winning two Serie A titles?", left: "NAPOLI", right: "AC MILAN" },
    tr: { question: "Diego Maradona, İtalya'da hangi takımda oynayarak iki Serie A şampiyonluğu kazandı?", left: "NAPOLI", right: "AC MILAN" },
    ar: { question: "أي نادٍ لعب له دييغو مارادونا في إيطاليا وفاز معه بلقبين في الدوري الإيطالي؟", left: "نابولي", right: "ميلان" }
  },
  d3_10: {
    en: { question: "How many Champions League titles did Cristiano Ronaldo win with Real Madrid?", left: "4 CL TITLES", right: "5 CL TITLES" },
    tr: { question: "Cristiano Ronaldo, Real Madrid ile kaç Şampiyonlar Ligi şampiyonluğu kazandı?", left: "4 ŞL KUPASI", right: "5 ŞL KUPASI" },
    ar: { question: "كم عدد ألقاب دوري أبطال أوروبا التي فاز بها كريستيانو رونالدو مع ريال مدريد؟", left: "٤ ألقاب", right: "٥ ألقاب" }
  },
  d3_11: {
    en: { question: "Which nation won the UEFA Euro championship in 2004 as massive underdogs?", left: "GREECE", right: "PORTUGAL" },
    tr: { question: "2004 UEFA Euro şampiyonasını büyük sürpriz yaparak hangi ülke kazandı?", left: "YUNANİSTAN", right: "PORTEKİZ" },
    ar: { question: "أي منتخب فاز ببطولة أمم أوروبا عام 2004 كمفاجأة هائلة؟", left: "اليونان", right: "البرتغال" }
  },
  d3_12: {
    en: { question: "Who was the top goal scorer at the 1998 World Cup in France?", left: "DRESON SUKER (CRO)", right: "RONALDO (BRA)" },
    tr: { question: "Fransa'daki 1998 Dünya Kupası'nda en golcü oyuncu kimdi?", left: "DAVOR SUKER (HIR)", right: "RONALDO (BRE)" },
    ar: { question: "من كان هداف كأس العالم 1998 في فرنسا؟", left: "دافور شوكر (كرواتيا)", right: "رونالدو (البرازيل)" }
  },
  d3_13: {
    en: { question: "Which European country hosted the UEFA Euro 2020?", left: "MULTIPLE COUNTRIES", right: "ENGLAND ONLY" },
    tr: { question: "Yarışmanın her tarafta oynandığı UEFA Euro 2020'ye hangisi ev sahipliği yaptı?", left: "ÇOKLU ÜLKELER", right: "SADECE İNGİLTERE" },
    ar: { question: "أي بلد أوروبي استضاف بطولة يورو 2020 الكروية؟", left: "دول متعددة مشاركة", right: "إنجلترا فقط" }
  },
  d3_14: {
    en: { question: "Who holds the record for most assists in Premier League history?", left: "RYAN GIGGS", right: "CESC FABREGAS" },
    tr: { question: "Premier Lig tarihinde en çok asist yapma rekorunu kim elinde tutuyor?", left: "RYAN GIGGS", right: "CESC FABREGAS" },
    ar: { question: "من يحمل الرقم القياسي لأكبر عدد من التمريرات الحاسمة في تاريخ الدوري الإنجليزي الممتاز؟", left: "رايان غيغز", right: "سيسك فابريغاس" }
  }
};

/**
 * Helper to dynamically translate a question item based on the active language.
 */
export const translateQuestion = (
  qId: string,
  lang: Language,
  fallbackQuestion: string,
  fallbackLeft: string,
  fallbackRight: string
) => {
  const trData = QUESTION_TRANSLATIONS[qId];
  if (trData && trData[lang]) {
    return {
      question: trData[lang].question,
      left: trData[lang].left,
      right: trData[lang].right,
    };
  }
  return {
    question: fallbackQuestion,
    left: fallbackLeft,
    right: fallbackRight,
  };
};

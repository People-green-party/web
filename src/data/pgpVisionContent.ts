/**
 * Official PGP Vision content from leadership (Hindi source of truth).
 * English strings are faithful translations for the language toggle.
 */

export type VisionGift = {
  id: string;
  hi: { title: string; subtitle: string };
  en: { title: string; subtitle: string };
};

export type VisionSection = {
  id: string;
  hi: { title: string; paragraphs: string[]; bullets?: string[] };
  en: { title: string; paragraphs: string[]; bullets?: string[] };
};

export const pgpVisionGifts: VisionGift[] = [
  {
    id: "liberty",
    hi: { title: "व्यक्तिगत स्वतंत्रता", subtitle: "लिबर्टी" },
    en: { title: "Individual Liberty", subtitle: "Liberty" },
  },
  {
    id: "democracy",
    hi: { title: "लोकतंत्र", subtitle: "डिमॉक्रेसी" },
    en: { title: "Democracy", subtitle: "Democracy" },
  },
  {
    id: "equality",
    hi: { title: "समानता", subtitle: "इक्वालिटी" },
    en: { title: "Equality", subtitle: "Equality" },
  },
  {
    id: "prosperity",
    hi: { title: "समृद्धि", subtitle: "प्रॉस्पेरिटी" },
    en: { title: "Prosperity", subtitle: "Prosperity" },
  },
  {
    id: "dignity",
    hi: { title: "गरिमा पूर्ण जीवन", subtitle: "रिस्पेक्टफूल लाइफ़" },
    en: { title: "A life of dignity", subtitle: "Respectful Life" },
  },
];

export const pgpVisionMeta = {
  hi: {
    pageTitle: "पीपल्स ग्रीन पार्टी — विज़न",
    brandLine: "पीपल्स ग्रीन पार्टी",
    homeEyebrow: "",
    homeTitle: "पीपल्स ग्रीन पार्टी क्या है?",
    homeIntro:
      "पीपल्स ग्रीन पार्टी एक नई पार्टी है जो भारत देश को पूरी तरह से आधुनिक और विकसित बनाने का स्वप्न लेकर बनी है। हम भारत में दुनिया की सबसे ईमानदार लोकतांत्रिक शासन व्यवस्था स्थापित करना चाहते है। एक भारत, मज़बूत भारत और श्रेष्ठ भारत हमारा एकमात्र धेय है।",
    giftsHeading: "एक बेहतर भारत के पाँच स्तंभ",
    giftsLead:
      "पीपल्स ग्रीन पार्टी देश के हर नागरिक तक ये पाँच स्तंभ पहुँचाना चाहती है—",
    cta: "पूरा विज़न पढ़ें",
    backHome: "होम पर वापस",
    tocTitle: "विषयों की सूची",
    readSections: "नीचे पूरा आधिकारिक विज़न पढ़ें",
  },
  en: {
    pageTitle: "Peoples Green Party — Vision",
    brandLine: "Peoples Green Party",
    homeEyebrow: "",
    homeTitle: "What is Peoples Green Party?",
    homeIntro:
      "Peoples Green Party is a new party founded with the dream of making India fully modern and developed. We seek to establish the world’s most honest democratic system of governance in India. One India, a strong India, and an excellent India is our only aim.",
    giftsHeading: "Five pillars of a better India",
    giftsLead:
      "Peoples Green Party wants every citizen to receive these five pillars—",
    cta: "Read the full vision",
    backHome: "Back to home",
    tocTitle: "On this page",
    readSections: "Read the complete official vision below",
  },
};

export const pgpVisionIntro = {
  hi: [
    "पीपल्स ग्रीन पार्टी एक नई पार्टी है जो भारत देश को पूरी तरह से आधुनिक और विकसित बनाने का स्वप्न लेकर बनी है। हम भारत में दुनिया की सबसे ईमानदार लोकतांत्रिक शासन व्यवस्था स्थापित करना चाहते है। हम भारत को बेहतरीन मानव संसाधन सूचकांक स्तर, सर्वश्रेष्ठ मानवअधिकार और गौरवशाली नैतिक मूल्यों वाला राष्ट्र बनाना चाहते है। संपूर्ण विश्व के लिये ख़ुशहाली और बराबरी हमारा लक्ष्य है। एक भारत, मज़बूत भारत और श्रेष्ठ भारत हमारा एकमात्र धेय है।",
  ],
  en: [
    "Peoples Green Party is a new party founded with the dream of making India fully modern and developed. We want to establish the world’s most honest democratic system of governance in India. We want to make India a nation with the finest human development index, the strongest human rights, and glorious moral values. Prosperity and equality for the whole world is our goal. One India, a strong India, and an excellent India is our only aim.",
  ],
};

export const pgpVisionSections: VisionSection[] = [
  {
    id: "philosophy",
    hi: {
      title: "हमारा दर्शनः",
      paragraphs: [],
      bullets: [
        "हमें सभी के उत्थान पर काम करना है।",
        "किसी एक वर्ग या समूह की अपेक्षा हमें सभी की आर्थिक और सामाजिक स्थिति को बेहतर बनाना है।",
        "हमें एक मज़बूत और स्थिर सरकार नहीं बनानी अपितु हर एक व्यक्ति सक्षम व मज़बूत हो और उसके जीवन में स्थिरता आये इस पर काम करना है।",
        "सरकार खुद हमेशा सभी को बराबरी के भाव से देखे और सभी के साथ बराबरी का व्यवहार करे। न कोई वीआइपी हो न किसी का तिरस्कार हो।",
        "हमारे पास राज्य का बजट बनाते समय युवाओं के लिए भविष्योन्मुखी नीति होनी चाहिए। ऊर्जा से भरे युवा वर्ग को आर्थिक न्याय मिलना चाहिये।",
        "आज जो लोग राष्ट्र और समाज के निर्माण में कम योगदान दे पा रहे है, ऐसे पीछे रह गए तबके जैसे महिलाएँ, किसान, दलित, आदिवासी और गरीब के लिए विशेष प्रयोजन की ज़रूरत है। इन तबकों के आगे आने से हमारी आर्थिक शक्ति कई गुना बढ़ाई जा सकती है।",
        "जो उद्यमी और अग्रणी तबका है उनकी भूमिका राष्ट्र निर्माण में बहुत महत्व रखती है। उन्हें उत्प्रेरक बना कर भी किसी भी लक्ष्य को प्राप्त किया जा सकता है।",
        "हमें एक ऐसी आर्थिक शृंखला बनाने पर काम करना होगा जिसमें समृद्ध और सशक्त व्यक्ति कमज़ोर और अभावग्रस्त को प्रोत्साहित करे, भागीदार बनाये और उनके मार्ग को प्रशस्त करे।",
        "सरकार स्वयं कोई वाणिज्य या व्यवसाय न करे।",
        "काम धंधो में अधिक से अधिक नए और स्थानीय लोगों को भागीदारी देने की नीति पर काम करे।",
        "सरकार बाहरी बड़े निवेश करने की सम्भावना रखने वाले घरानों की जगह कम और मध्यम आय वाले स्थानीय लोगों को प्राथमिकता दें।",
      ],
    },
    en: {
      title: "Our philosophy",
      paragraphs: [],
      bullets: [
        "We must work for the uplift of everyone.",
        "Rather than favouring any one class or group, we must improve everyone’s economic and social condition.",
        "We must not merely build a strong and stable government; we must work so that every person becomes capable and strong, and finds stability in life.",
        "Government itself must always see everyone with a sense of equality and treat everyone equally. Let there be no VIP, and let no one be insulted.",
        "When preparing the state budget we must have a future-oriented policy for the youth. The energetic young generation must receive economic justice.",
        "Those who today contribute less to nation- and society-building — sections left behind such as women, farmers, Dalits, Adivasis and the poor — need special purpose programmes. Bringing these sections forward can multiply our economic strength many times.",
        "Entrepreneurs and leading sections play a vital role in nation-building. By making them catalysts, any goal can be achieved.",
        "We must build an economic chain in which the prosperous and empowered encourage the weak and deprived, make them partners, and clear their path.",
        "Government itself should not run commerce or business.",
        "In livelihoods, policy must give maximum participation to new and local people.",
        "Instead of prioritising large external investing houses, government should prioritise local people of low and middle income.",
      ],
    },
  },
  {
    id: "caste",
    hi: {
      title: "जातपात से दूरी — अब केवल समृद्धि",
      paragraphs: [
        "भारत में व्याप्त जातिवाद और संप्रदायवाद का वर्तमान स्वरूप हमारे मिशन के लिए एक चुनौती है और इस विभेदकारी व्यवस्था को मिटाना अतिआवश्यक है। यहाँ हम जाति और धर्म को लेकर अपनी सोच को स्पष्ट करना चाहते है।",
        "हम जानते है कि भारत कई जातियों में बँटा होने के कारण कमजोर और विभाजित रहा है, यही वजह हमारी हज़ार साला ग़ुलामी का मूल कारण रही है, अंधकार के इस दौर ने हमारे दस करोड़ पूर्वजों का बलिदान लिया है। एक भारत अनेक जातीय समूहों में बंट जाने से टूटता रहा है, परिणामस्वरूप कई छोटे और अपेक्षाकृत कमजोर समूह भी हमें पराजित करने में कामयाब हो गये। इसी दुःखद जातिव्यवस्था जिसके मूल में आदिम क़बीलाई सोच है, के चलते हमारे देश का एक बड़ा हिस्सा ग़रीब है और घोर निराशा में है। सच्चाई यह है कि शेष दुनिया किसी दूसरे लोक में है और हम इक्कीसवीं सदी में भी तकलीफ़देह पिछले दौर में ही विचर रहे है। पीपल्स ग्रीन पार्टी भारत को जातिविहीन समाज में परिवर्तित करना चाहती है, यानी सबके लिए हर प्रकार के अवसर की बराबरी की कल्पना करती है।",
        "जातियों के अस्तित्व में होने से “व्यक्ति”, जिसमें विकास की अनंत संभावना होती है, का महत्व समाप्त होता है। व्यक्ति को एक कबाइली जातिगत थैले या वर्ग में सीमित कर दिया जाता है। जातिगत राजनीतिक धड़ेबंदी और समूहगत स्वार्थ के चलते ना चाहते हुए प्रबुद्ध इंसान भी भेड़ों के समूह की तरह व्यवहार करने को मजबूर हो जाता है। इन सबके चलते पूरा भारत विभिन्न जातीय स्वार्थ समूहों में बँटा हुआ नज़र आता है। अगर इसे रोकने के लिए कोई सृजनात्मक आंदोलन नहीं खड़ा किया गया तो भारत में जातीय संघर्ष अवश्यंभावी है। पीपल्स ग्रीन पार्टी इस जातीय संघर्ष को रोकने के लिए प्रण-प्राण से प्रयासरत है और रहेगी।",
        "सरकारी नीतियाँ जिनका आधार ही “बाँटों और राज करो” होता है के चलते आज जातियाँ आगे है और बेचारा व्यक्ति बहुत पीछे छूट गया है, स्वाभाविक है कि वर्तमान में व्यक्तिगत आज़ादी बेमानी हो कर अपने सबसे निचले स्तर पर पहुँच गई है। जबकि मानवाधिकार चार्टर और हमारा संविधान हमें व्यक्तिगत अधिकार और स्वतंत्रता देने की गारंटी देते है।",
        "पीपल्स ग्रीन पार्टी के रूप में हम इन आदिम जातिसमूहों को पुरातन और ग़ैर ज़रूरी परंपरा मानते हुए हर प्रकार से कमजोर करेंगे और समाज को जातिविहीन करने के लक्ष्य पर निरंतर प्रयास करेंगे। जाति को गिरोह की तरह इस्तेमाल करने की किसी को अनुमति नहीं देंगे और कथित समाज के ठेकेदार जो अपनी निजी स्वार्थ के चलते देश के भीतर इस प्रकार की गिरोह बंदी करते है और व्यक्ति, जिसमें सृजन की अनंत संभावना होती है, को आगे नहीं बढ़ने देते है, ऐसे विभाजनकारी और प्रतिगामी जातीय समूहों का समूल नाश करना हमारे मिशन का एक हिस्सा होगा।",
      ],
    },
    en: {
      title: "Distance from casteism — only prosperity now",
      paragraphs: [
        "The present form of casteism and communalism prevalent in India is a challenge to our mission, and ending this discriminatory system is absolutely essential. Here we want to make our thinking on caste and religion clear.",
        "We know that India has remained weak and divided because it is split into many castes; this has been the root cause of our thousand years of slavery. That dark age took the sacrifice of our ten crore ancestors. One India kept breaking as it was divided into many caste groups; as a result, even many small and relatively weak groups succeeded in defeating us. Because of this tragic caste system, rooted in primitive tribal thinking, a large part of our country is poor and in deep despair. The truth is that the rest of the world is in another realm, while even in the twenty-first century we are still wandering in a painful past. Peoples Green Party wants to transform India into a casteless society — imagining equality of opportunity of every kind for all.",
        "The existence of castes ends the importance of the “individual”, in whom there is infinite potential for development. The person is confined to a tribal caste bag or class. Because of caste-based political factionalism and group self-interest, even enlightened people are forced to behave like a flock of sheep against their will. Because of all this, the whole of India appears divided into various caste interest groups. If no creative movement is raised to stop this, caste conflict in India is inevitable. Peoples Green Party is and will remain committed with all its strength to preventing this caste conflict.",
        "Because of government policies whose very basis is “divide and rule”, castes are ahead today and the poor individual is left far behind; naturally, individual liberty has become meaningless and reached its lowest level. Yet the human rights charter and our Constitution guarantee us individual rights and freedom.",
        "As Peoples Green Party we will weaken these primitive caste groups in every way, treating them as outdated and unnecessary tradition, and will continuously work toward a casteless society. We will not allow anyone to use caste like a gang, and destroying divisive and reactionary caste groups — the so-called contractors of society who form such gangs inside the country for private interest and do not let the individual, who has infinite creative potential, move forward — will be part of our mission.",
      ],
    },
  },
  {
    id: "religion",
    hi: {
      title: "राष्ट्रधर्म, धर्म और संप्रदाय",
      paragraphs: [
        "हिंदू-मुस्लिम या अन्य धर्म-संप्रदायों को लेकर पीपल्स ग्रीन पार्टी का मानना है कि हमारे संविधान में निहित नागरिकों के हित के दृष्टिगत देश को अब “राष्ट्रधर्म” के पथ पर चलना चाहिए। संपूर्ण भारत को धार्मिक पूर्वाग्रहों से मुक्त कर ज्ञान आधारित आधुनिक समाज में परिवर्तित करना हमारे मिशन का हिस्सा होगा। अगर हम चाहते है कि भारत वैश्विक समुदाय में गर्व से खड़ा हो सके तो इसके लिए नई पीढ़ी को ज्ञान, तर्क और विज्ञान के मार्ग पर ले जाना ही होगा।",
        "हालाँकि कि हम मानते है कि सभी देश वासियों को अपनी पूजा पद्धति को मनाने और अपने ढंग से अपने धार्मिक विश्वासों के अनुरूप ज़िंदगी जीने का अधिकार होना चाहिए किंतु शासन यानी सरकार को किसी भी धर्म या मज़हब को समर्थन या संरक्षण नहीं करना चाहिए, हम जितने बहुसंख्यकवाद के ख़िलाफ़ है उतने ही अल्पसंख्यकवाद को भी बुरा मानते है। देश की शासन व्यवस्था को सभी धर्म, संप्रदाय या मज़हब के लिए तटस्थ और निष्पक्ष होना चाहिए। किसी भी व्यक्ति या समूह के धर्म, संप्रदाय या मज़हब को दूसरे के धर्म, मज़हब या संप्रदाय पर किसी भी प्रकार से प्रभावी नहीं होना चाहिए। हर व्यक्ति, उसका परिवार या कोई भी समूह अपनी पूजा पद्धति को अपने तरीक़े उस सीमा तक अपनाए जहां तक दूसरे के हितों का या उनकी पूजा पद्धति का अतिक्रमण नहीं हो रहा हो। अपने घर या किसी भी और कितने भी निजी परिसर में हर संप्रदाय अपने तरीक़े से ईश्वर में आस्था व्यक्त करने के लिए स्वतंत्र होना चाहिए किंतु सार्वजनिक स्थल किसी भी धर्म, संप्रदाय या मज़हब के प्रदर्शनों और क्रियाकलापों से मुक्त ही रहे तो यह राष्ट्र हित में होगा। सार्वजनिक स्थान पर माइक से पूजा-पाठ, भजन, अजान या आरती ध्वनि प्रदूषण करती है और वातावरण को नुक़सान पहुँचाती है, इसे रोक देना ही श्रेयस्कर होगा। सड़क पर आम लोगो के यातायात को अवरुद्ध कर धार्मिक या मज़हबी जुलूस, या किसी भी तरह का वीआईपी मूवमेंट इत्यादि सभी के लिए अस्वीकार्य होंगे। इसी प्रकार देश में अब किसी भी तरह का धर्मांतरण, घरवापसी और जेहाद पूरी तरह से अस्वीकार्य होगा। सरकारी टैक्स से किसी भी धार्मिक या मज़हबी स्थल के उत्थान पर रुपया खर्च करना निहायत संविधान विरोधी कार्य है।",
        "साथ ही, भारत की सहस्राब्दियों की सांस्कृतिक विरासत को अक्षुण्य रखना भी हमारा राष्ट्रधर्म है और हमें इस धरोहर को संरक्षित भी करना ही है। लोक संस्कृति, भाषा और इतिहास राष्ट्र के लिये मातृवृत होती है, इन्ही से राष्ट्र का जन्म होता है और इन्ही से पीढ़ियों के लिए गौरवशाली क्षण आते है। ऐसी परम्पराएँ जो अब वैश्विक मापदंडों के अनुरूप नहीं हो उन्हें समाप्त करते हुए अपनी संस्कृति और उसकी श्रेष्ठता को अगली पीढ़ी को सौंपना हमारा नैतिक कर्तव्य है।",
      ],
    },
    en: {
      title: "Nation-dharma, faith and community",
      paragraphs: [
        "On Hindu–Muslim or other religions and communities, Peoples Green Party believes that, looking to the interests of citizens enshrined in our Constitution, the country should now walk the path of “nation-dharma”. Transforming the whole of India into a knowledge-based modern society free from religious prejudice will be part of our mission. If we want India to stand with pride in the global community, we must take the new generation onto the path of knowledge, reason and science.",
        "We do believe every countryman should have the right to practise their form of worship and live according to their religious beliefs in their own way; yet the state — that is, the government — should neither support nor protect any religion. We are as opposed to majoritarianism as we consider minority-ism wrong. The country’s system of governance must be neutral and impartial toward every religion, sect or faith. No person or group’s religion, sect or faith should in any way dominate another’s. Every person, family or group may practise their worship in their own way only to the extent that it does not encroach on others’ interests or forms of worship. In one’s home or any private premises of any size, every community should be free to express faith in God in its own way; but it will be in the national interest if public places remain free of displays and activities of any religion, sect or faith. On public places, worship, bhajans, azaan or aarti on loudspeakers cause noise pollution and harm the environment — stopping this is advisable. Religious or faith processions that block common people’s traffic on the road, or any VIP movement, will be unacceptable for all. Likewise, any kind of religious conversion, ghar wapsi and jihad will be completely unacceptable in the country. Spending public tax money on the uplift of any religious place is thoroughly unconstitutional.",
        "At the same time, keeping intact India’s millennia-old cultural heritage is also our nation-dharma, and we must preserve this inheritance. Folk culture, language and history are the maternal roots of the nation; from them the nation is born, and from them come glorious moments for generations. Ending traditions that no longer meet global standards, while handing our culture and its excellence to the next generation, is our moral duty.",
      ],
    },
  },
  {
    id: "corruption",
    hi: {
      title: "भ्रष्टाचार हो अब अलविदा!",
      paragraphs: [
        "देश की आम जनता भी इस बात को भली भाँति जानती है कि करप्शन यानी भ्रष्टाचार देश की प्रगति के लिए एक दीमक की तरह कार्य कर रहा है और ग़रीबी के लिये ये खाद का काम कर रहा है। पिछले 75 सालों में हमने इसका ख़ामियाज़ा भुगता है। ग़ुलामी काल के क़ानून आज़ादी के बाद भी चलते रहे, बरसों की ग़रीबी हमारे ब्यूरोक्रेट्स के दिमाग़ से निकल नहीं सकी और सत्ता ख़ुद को स्थापित करने के लिए या व्यवस्था को ख़रीदने के लिए धन एकत्र कर रही होती है तो अधीनस्थ को भी भ्रष्ट बना देना चाहती है। कुल मिलाकर पूरे तंत्र में भ्रष्टाचार भांग की तरह घुल गया। पार्टियाँ आयी और गई, मुख्यमंत्री बने और बदले, ये गंदगी चलती ही रही!",
        "पीपल्स ग्रीन पार्टी भ्रष्टाचार पर जीरो टॉलरेंस चाहती है। आटे में नमक के बराबर भी मंज़ूर नहीं!",
        "अब सरकार को पुराने ऐसे क़ानून निरंतर बदलने होंगे जो अधिकारी या नेता को डिस्क्रीशन या डिस्क्रिमिनेशन के अधिकार देते हो। व्यवस्था में ट्रांसपेरेंसी लायी जानी चाहिए, अधिकांश कार्य को ऑनलाइन और फेसलेस कीजिए। ब्लॉकचेन को इस्तेमाल कीजिए।",
        "अधिकारियों और सत्ता में बैठे नेताओं को लगातार मोरल एजूकेशन देनी ही होगी। किसी भी राजकीय कर्मी का सुविधा शुल्क या काम जल्द करने के नाम पर रुपया वसूलना या किसी भी रूप में भ्रष्टाचार करना पाप है। राजकीय कर्मियों को अच्छी मासिक वेतन मिलती है उन्हें अधिक लालच न करते हुए इसी सीमा में रहना होगा। यदि वे अधिक धन अर्जित करने की चाह रखते है तो उन्हें राजकीय सेवा छोड़ कर उद्यमिता में अपना भाग्य आज़माना चाहिए। हर वर्ष सभी कर्मचारी अपनी आय और जमा सम्पति को स्वयं पब्लिक डोमेन में डाल दें, स्वयं पिछले वर्ष से तुलनात्मक रिपोर्ट भी दें।",
        "भ्रष्ट व्यक्ति या समूह पर सख़्त कार्यवाही करनी ही होगी। जाँच जल्दी होनी चाहिए। तुरंत चालान पेश हो और जल्द न्याय हो। साबित होते ही पदमुक्त कीजिये। आय से अधिक सम्पति को जनताकोष को तुरंत लौटाना ही होगा।",
        "यदि सिस्टम, सरकार या व्यक्ति इस पर सही से कार्यवाही नहीं करेंगे तो देश, लोकतंत्र और एक भारतीय के रक्षार्थ पीजीपी का विस्सल ब्लोअर ऐसे राष्ट्रद्रोहियों पर सीधी कार्यवाही कर सकता है।",
      ],
    },
    en: {
      title: "Corruption — goodbye now!",
      paragraphs: [
        "The common people of the country also know well that corruption works like a termite on the nation’s progress and like fertiliser for poverty. For the last 75 years we have paid its price. Laws of the colonial era continued after freedom; years of poverty could not leave our bureaucrats’ minds; and when power collects money to establish itself or to buy the system, it also wants to make subordinates corrupt. In short, corruption has dissolved into the whole machinery like bhang. Parties came and went, chief ministers rose and changed — this filth kept running!",
        "Peoples Green Party wants zero tolerance on corruption. Not even as much as salt in flour is acceptable!",
        "Government must continuously change old laws that give officers or leaders discretion or discrimination. Transparency must be brought into the system; make most work online and faceless. Use blockchain.",
        "Officers and leaders in power must continually be given moral education. For any public servant to take money as a facilitation fee or in the name of faster work, or to practise corruption in any form, is a sin. Public servants receive a good monthly salary; they must stay within that limit without more greed. If they wish to earn more money, they should leave public service and try their fortune in entrepreneurship. Every year all employees should put their income and accumulated assets in the public domain themselves, and also give a comparative report versus the previous year.",
        "Strict action must be taken against a corrupt person or group. Investigation must be quick. Chargesheets must be filed at once and justice delivered soon. On proof, dismiss from post. Wealth beyond income must be returned immediately to the public treasury.",
        "If the system, government or individuals do not act correctly on this, then in defence of the country, democracy and an Indian, PGP’s whistleblower may take direct action against such traitors to the nation.",
      ],
    },
  },
  {
    id: "women",
    hi: {
      title: "बहन भी हो शक्तिशाली!",
      paragraphs: [
        "महिलाओं को लेकर भारत की क्या सोच है ये अधिक स्पष्ट होनी चाहिए। जो विचार संविधान रखता है वो अभी तक पूरी तरह से समाज समझ नहीं सका है कि देश में हर तरह से औरत और आदमी बराबर है। हर स्थान पर यानी परिवार के भीतर और बाहर, सामाजिक, आर्थिक या सांस्कृतिक हर स्थान और मोर्चे पर बिलकुल बराबर है। अब पुरानी परंपरा कैसी भी रही हो या कोई भी सामाजिक धड़ा कुछ भी सोचता हो। जाति पंचायत और समाज के ठेकेदार क़ानूनी रूप से या नैतिक रूप से किसी भी प्रकार से इसके विपरीत विचार नहीं रख सकते। आधे लोगो को शक्ति देने से और शेष आधे लोगो को पीछे रखने से हम अपने आधे लक्ष्य को ही प्राप्त कर सकेंगे जो किसी भी सूरत में हमें मंज़ूर नहीं है।",
        "अब ये सिर्फ़ एक राजनीतिक मसला नहीं है अपितु इसके लिए लंबे सामाजिक आंदोलन की ज़रूरत है। पीपल्स ग्रीन पार्टी इस संबंध में बिलकुल ईमानदार है एवम् इस बराबरी को हर जगह, हर कागज में और हर दिल में स्थापित करने को प्रतिबद्ध है। ये भले संसद हो या विधानसभा या कोई भी सदन, कोई भी कार्यालय, परिवार की सम्पति का मामला हो हर स्थान पर महिलाओं को पुरुष के बिलकुल बराबर अवसर और बिलकुल बराबर स्थान मिलना ही चाहिए। जब तक हम इसे पाने में कामयाबी न हासिल कर सके, हमारी आज़ादी अधूरी है और हमारा मिशन भी अधूरा है।",
        "इसी से संबंधित मसला महिला उत्पीड़न और महिला अपराध का है। इस बात को बहुत ज़ोर से सभी को बताना होगा कि महिला और पुरुष हर प्रकार से बराबर है और सभी को इस सिद्धांत को मानना होगा। बाहर से अधिक घर के भीतर हो रहे उत्पीड़न पर पूरे समुदाय को शिक्षित करना सभी का कर्तव्य है। दोनों पक्ष एक दूसरे का सम्मान करे और दूसरे का दमन न करे। परंपरा के नाम पर परिवारों में महिलाओं पर हो रहे अत्याचार का मुखर विरोध किया जाना अत्यंत आवश्यक है। यह संपूर्ण मसला क़ानून से अधिक सामाजिक सोच से जुड़ा हुआ है, इस मुद्दे पर क़ानून पर्याप्त रूप से निर्मित है किंतु सामाजिक सुधार कर एक आंदोलन खड़ा किया जाना है।",
        "इस लक्ष्य को प्राप्त करने के लिए शासन महिलाओं के लिए आत्मनिर्भरता पर कार्यक्रम चलाये और रोज़गार, शिक्षा और अवसर की बराबरी पर निरंतर काम करे। पीपल्स ग्रीन पार्टी इस मसले को आधारभूत स्तर पर माइक्रो मैनेजमेंट द्वारा सफल करने के लिए प्रतिबद्ध है। पार्टी का इरादा राजकीय सेवाओं में और सरकार द्वारा प्रदत्त सभी अवसरों में महिला वर्ग को आधा हिस्सा देने का है।",
      ],
    },
    en: {
      title: "Let sisters be powerful too!",
      paragraphs: [
        "India’s thinking on women must become clearer. Society has still not fully understood what the Constitution holds: that woman and man are equal in every way in the country. Everywhere — inside the family and outside, on every social, economic or cultural front — they are absolutely equal. Whatever old tradition may have been, or whatever any social faction may think, caste panchayats and contractors of society cannot hold the opposite view legally or morally in any way. Giving power to half the people and keeping the other half behind will achieve only half our goals — which is unacceptable to us in any circumstance.",
        "This is no longer only a political issue; it needs a long social movement. Peoples Green Party is completely honest on this and committed to establishing this equality everywhere, on every paper and in every heart. Whether Parliament, assembly or any house, any office, or family property — women must get absolutely equal opportunity and absolutely equal place with men everywhere. Until we succeed in achieving this, our freedom is incomplete and our mission is incomplete too.",
        "Related to this is the issue of women’s oppression and crimes against women. Everyone must be told forcefully that women and men are equal in every way and everyone must accept this principle. Educating the whole community about oppression happening more inside the home than outside is everyone’s duty. Both sides must respect each other and not suppress the other. Vocal opposition to atrocities on women in families in the name of tradition is extremely necessary. This whole issue is linked more to social thinking than to law; on this issue the law is sufficiently made, but a movement for social reform must be raised.",
        "To achieve this goal, government should run self-reliance programmes for women and continuously work on equality of employment, education and opportunity. Peoples Green Party is committed to succeeding on this issue at the grassroots through micro-management. The party’s intention is to give women half the share in public services and in all opportunities provided by government.",
      ],
    },
  },
  {
    id: "farmers",
    hi: {
      title: "किसान हो समर्थ",
      paragraphs: [
        "देश का बहुसंख्यक वर्ग ग्रामीण क्षेत्र का वासी है और किसी न किसी रूप से कृषि पर आधारित अर्थव्यवस्था का हिस्सा है। आज़ादी के बाद ख़ास तौर से औद्योगिक विकास के दौरान या सेवा क्षेत्र के विकास के दौर में कृषि को अलाभकारी और अप्रतिष्ठापूर्ण कार्य समझ इसकी अवहेलना हुई है फिर इतनी बड़ी आबादी को कोई विकल्प भी उपलब्ध नहीं कराया गया और देश की GDP में इस बड़ी आबादी का योगदान काफ़ी कम रह जाने से इस वर्ग को भी बड़ा भारी नुक़सान हुआ है और उससे भी आगे हमारे देश को भी बड़ी हानि हो रही है।",
        "पीपल्स ग्रीन पार्टी इस संबंध में अलग तरह की सोच रखती है और किसान आत्मनिर्भरता और उनके सशक्तिकरण पर काम करना चाहती है। पार्टी के अनुसार राजस्थान में विषम प्राकृतिक स्थिति होने के उपरांत भी कृषि और संबंधित क्षेत्र इस पर निर्भर वर्ग के लिए अत्यंत लाभप्रद हो सकते है। हम कृषि, पशुपालन, डेयरी और फ़ूड प्रोसेसिंग पर सही से काम कर चमत्कारी नतीजे हासिल कर सकते है। इन क्षेत्रों में बेहतर काम कर न केवल राज्य की GDP को तीन गुना कर सकते है अपितु राजस्व को भी ढाई गुना कर सकते है जिससे विकास के नये आयाम गठित करेंगे और राजस्थान को देश का अग्रणी राज्य बना देंगे साथ ही राज्य में विकसित राष्ट्र वाला स्तर उपलब्ध करा सकेंगे। हमारा इरादा माइक्रो इकोनॉमिक मैनेजमेंट द्वारा पूरे राज्य को एक हज़ार क्लस्टर में विभाजित कर इन सभी एक हज़ार क्लस्टर के लिए अलग अलग विकास मॉडल बनाने का है। समान प्राकृतिक संसाधनों और समान जलवायु वाले क्षेत्र से बनाये जा रहे एक क्लस्टर के आर्थिक विकास के लिए ख़ास प्लान तैयार कर उसे लागू किया जाना है। इस क्लस्टर्स को आर्थिक रूप से आत्मनिर्भर और सशक्त बनायेंगे। यहाँ रहने वाले किसान, महिला और युवा वर्ग के सशक्तिकरण हेतु सभी यथासंभव प्रयास करेंगे। कृषि और पशुपालन प्रोत्साहन के लिए कटिंग एज टेक्नोलॉजी की सहायता लेंगे। खाद, बीज और उर्वरक के साथ पानी बिजली, ट्रेनिंग, स्किलिंग आदि सहायता उपलब्ध होगी। एफ़पीओ और ओएफ़पीओ या सहकारी तरह से प्रोसेसिंग व मार्केटिंग प्लेस की व्यवस्था भी करेंगे। बीमा और सीड मनी सिस्टम को सही करेंगे। कुल मिलाकर कह सकते है कि जिस किसान को पिछले 75 साल में आपने क़र्ज़दार और कमजोर बना दिया उसे समर्थ और सशक्त बना देंगे। उत्पादन और GDP को हर हाल में तीन गुना करेंगे।",
      ],
    },
    en: {
      title: "Let the farmer be capable",
      paragraphs: [
        "The majority of the country lives in rural areas and is part of an agriculture-based economy in some form. After independence, especially during industrial development or the growth of the service sector, agriculture was neglected as unprofitable and undignified work; then no alternative was given to such a large population; and with this large population’s contribution to the country’s GDP remaining quite low, this class suffered heavy loss — and beyond that our country too is suffering great harm.",
        "Peoples Green Party thinks differently here and wants to work on farmer self-reliance and empowerment. According to the party, even with Rajasthan’s harsh natural conditions, agriculture and related sectors can be extremely profitable for those who depend on them. By working properly on agriculture, animal husbandry, dairy and food processing we can achieve miraculous results. By doing better in these sectors we can not only triple the state’s GDP but also increase revenue two-and-a-half times, opening new dimensions of development, making Rajasthan a leading state of the country and providing a developed-nation level of living in the state. Our intention is to divide the whole state into one thousand clusters through micro-economic management and build a separate development model for each of these one thousand clusters. A special plan must be prepared and implemented for the economic development of each cluster formed from areas with similar natural resources and climate. We will make these clusters economically self-reliant and strong. We will make every possible effort to empower farmers, women and youth living here. We will use cutting-edge technology to promote agriculture and animal husbandry. Along with manure, seed and fertiliser, water, electricity, training, skilling and other support will be available. We will also arrange FPO and OFPO or cooperative-style processing and marketing places. We will fix insurance and seed-money systems. In short, the farmer you made indebted and weak over the last 75 years — we will make capable and strong. We will triple production and GDP in every circumstance.",
      ],
    },
  },
  {
    id: "youth",
    hi: {
      title: "युवा होगा सक्षम",
      paragraphs: [
        "राज्य में पिछले लंबे अरसे से क़रीब 25 % बेरोज़गारी दर है यानी राज्य की चौथाई आबादी बेकार है और रोज़गार की तलाश में बूढ़ी होती जा रही है। निराशा और हताशा में नशे में एक पूरी पीढ़ी डूब रही है। हमारी युवा पीढ़ी का ख़ुद पर से भरोसा समाप्त होता जा रहा है। दिग्भ्रमित है और उम्मीद का कोई कारण नहीं है। आबादी का एक बड़ा हिस्सा शिक्षा के अवसर से वंचित है, एक बड़ा हिस्सा नान अटेंडिंग एजूकेशन में रजिस्टर्ड है। जो डिग्री धारी है वो",
      ],
    },
    en: {
      title: "Youth will be capable",
      paragraphs: [
        "For a long time the state has had about a 25% unemployment rate — that is, a quarter of the state’s population is idle and growing older in search of work. In despair and frustration a whole generation is drowning in addiction. Our young generation’s confidence in itself is ending. They are confused and have no reason for hope. A large part of the population is deprived of education opportunity; a large part is registered in non-attending education. Those who hold degrees —",
      ],
    },
  },
  {
    id: "youth-steps",
    hi: {
      title: "नए युवाओं के लिए क्रांतिकारी कदम",
      paragraphs: [
        "राजस्थान में 18 वर्ष से 35 वर्ष यानी युवाओं की आबादी 2 करोड़ से भी अधिक है और इस उम्र समूह के 80% युवा आज बेरोज़गार है और बेकार बैठे है, अनेक युवा नशा, उधार, ऑनलाइन सट्टा और ग़ैर क़ानूनी कार्यो में उलझ गए है। सरकार ने 75 लाख युवाओं को बीस साल से सरकारी नौकरी के झाँसे में उलझा कर रखा है। पिछले दो दशक में सरकार के अदूरदर्शिता पूर्ण रवैये के चलते निराश युवा अंधकार युग में जी रहे है।",
        "वस्तुतः देश भर में छात्र आज बिना किसी उद्देश्य के मूल्यहीन डिग्रियाँ हासिल करने की होड़ में लग कर पढ़े लिखे बेरोज़गार बनने की पाँति में जा खड़े हो रहे है। हम उनको मूल्यवान शिक्षा और दीक्षा देने का अभियान चलाने जा रहे है। विद्यालय शिक्षा के उपरांत बड़ी संख्या में नौजवानों को वोकेशनल, स्किल, अपरेंटिसशिप और एंटरप्रेन्योरशिप कार्यक्रमों के लिए तैयार किया जाना चाहिये ताकि उनको रोज़गार भी ठीक से मिल सके और इंडस्ट्री को भी बेहतर मैनपॉवर प्राप्त हो जाए।",
        "पीपल्स ग्रीन पार्टी युवाओं को सक्षम, समर्थ और आत्मनिर्भर बनाने के लिये एक बड़ा विज़न रखती है। दुनिया के सबसे बडे युवा कार्यक्रम को तैयार किया गया है। जिसमें विश्व के सबसे बड़े इनक्युबेशन कार्यक्रम के तहत दस लाख युवाओं पर कार्य किया जाएगा यानी हर विधानसभा से क़रीब 5000 युवाओं को अवसर उपलब्ध कराया जाएगा।",
        "शुरू में अलग अलग 200 प्रकार की विधाओ से संबंधित एक हज़ार प्रशिक्षण, स्किलिंग व इनक्युबेशन केंद्र स्थापित किया जाना है। यहाँ से प्रशिक्षित युवाओं को आगे जाकर प्रस्तावित 1000 रूरल इकोनॉमिक जोन में माइक्रो एंटरप्रेन्योर या ट्रेडर, स्किल मैनपावर बन सकने का अवसर प्रदान किया जाएगा। जहां उन्हें निशुल्क इंडस्ट्रियल प्लॉट, शॉप या अन्य संसाधन उपलब्ध कराये जाएँगे। साथ ही 10 लाख रुपये तक सीड मनी, सब्सिडी और लोन सुविधा भी उपलब्ध होगी। उल्लेखनीय है कि उनके उत्पादन के विक्रय के लिए एक इनोवेटिव मार्केट आईडिया भी तैयार किया गया है। इस ट्रेनिंग पर सरकार प्रति विद्यार्थी को दो लाख रुपये तक की सहायता भी प्रदान करेगी।",
        "उच्च शिक्षा के लिए इच्छुक ग़रीब और ज़रूरत मंद वर्ग के विद्यार्थी के लिए चार वर्ष तक एक लाख रुपये तक की राजकीय सहायता उपलब्ध होगी, इसमें सभी एस सी, एस टी, ग़रीब ओबीसी व सामान्य वर्ग के विद्यार्थी शामिल होंगे। इसके अतिरिक्त उच्च शिक्षा प्राप्त करने के पश्चात जो विद्यार्थी शोध या नवाचार या उद्यमशीलता पर कार्य करना चाहते होंगे उनके लिए सरकार आवश्यक प्रबंध भी करेगी।",
        "साथ ही सरकारी नौकरी का एक वार्षिक कैलेंडर हर वर्ष जारी होगा और बेहद व्यवस्थित और ईमानदार तरीक़े से बिना किसी फ़ीस के चयन प्रक्रिया पूर्ण कर समय बद्ध नियुक्ति प्रदान की जायेगी।",
        "युवा विद्यार्थियों को सरकार एक लाख पेड इंटर्नशिप के अवसर प्रदान करेगी।",
        "प्रदेश में एक-एक हज़ार खेल मैदान काम्प्लेक्स, लाइब्रेरी, फिटनेस केंद्र तथा रंगमंच व कला केंद्र स्थापित किए जाएँगे और एक लाख युवाओं को प्रोत्साहन हेतु एक लाख रुपये तक की स्कालरशिप उपलब्ध होगी।",
        "प्रोटीन डाइट व अन्य पोषक खाद्य पर सब्सिडी मिलेगी। कंप्यूटर, लैपटॉप, इलेक्ट्रॉनिक गैजाट, स्टेशनरी, इंटरनेट डेटा और स्पोर्ट किट पर विशेष छूट होगी।",
      ],
    },
    en: {
      title: "Revolutionary steps for the new youth",
      paragraphs: [
        "In Rajasthan the youth population aged 18 to 35 is more than 2 crore, and 80% of this age group is unemployed and sitting idle today; many youth are entangled in addiction, debt, online betting and illegal work. Government has kept 75 lakh youth trapped for twenty years in the illusion of government jobs. Because of the government’s short-sighted approach over the last two decades, disappointed youth are living in a dark age.",
        "In fact across the country students today are racing to acquire purposeless, valueless degrees and standing in the queue of educated unemployed. We are going to run a campaign to give them valuable education and initiation. After school education a large number of young people should be prepared for vocational, skill, apprenticeship and entrepreneurship programmes so they get proper employment and industry also gets better manpower.",
        "Peoples Green Party holds a big vision to make youth capable, strong and self-reliant. The world’s largest youth programme has been prepared. Under the world’s largest incubation programme, work will be done on ten lakh youth — that is, about 5000 youth from every assembly constituency will get opportunity.",
        "At the start, one thousand training, skilling and incubation centres related to 200 different disciplines are to be established. Youth trained here will later get the chance to become micro-entrepreneurs or traders, or skilled manpower, in the proposed 1000 rural economic zones — where they will get free industrial plots, shops or other resources. Seed money, subsidy and loan facilities up to ₹10 lakh will also be available. Notably, an innovative market idea has also been prepared for selling their production. On this training the government will also provide assistance of up to ₹2 lakh per student.",
        "For poor and needy students wishing higher education, state assistance of up to ₹1 lakh for four years will be available, including all SC, ST, poor OBC and general category students. In addition, after higher education, for students who want to work on research, innovation or entrepreneurship, government will also make necessary arrangements.",
        "Alongside, an annual calendar of government jobs will be issued every year, and selection will be completed in a highly organised and honest way without any fee, with time-bound appointments.",
        "Government will provide one lakh paid internship opportunities to young students.",
        "One thousand each of sports ground complexes, libraries, fitness centres, and theatre and arts centres will be established in the state, and scholarships of up to ₹1 lakh will be available to encourage one lakh youth.",
        "There will be subsidy on protein diet and other nutritious food. Special discounts on computers, laptops, electronic gadgets, stationery, internet data and sports kits.",
      ],
    },
  },
];

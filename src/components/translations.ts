import { visionCards } from "@/data/visionData";

export const translations = {
    en: {
        nav: {
            home: "Home",
            about: "About",
            constitution: "Constitution",
            donate: "Donate",
            declaration: "Declaration",
            join: "Join Us",
            login: "Login",
            dashboard: "Dashboard",
            election: "Election",
            weAreAravali: "We are Aravali",
            leaders: "Leadership"
        },
        heroSlides: [
            {
                titleLine1: "Catalyzing innovation",
                titleLine2: "for a better future",
                subtitle: "Committed to sustainable progress and transformative ideas."
            },
            {
                titleLine1: "Empowering Rural",
                titleLine2: "Communities Together",
                subtitle: "Building self-reliant villages through modern agriculture."
            },
            {
                titleLine1: "Green Energy",
                titleLine2: "Revolution Begins",
                subtitle: "Adopting sustainable energy for a cleaner tomorrow."
            },
            {
                titleLine1: "Education for All",
                titleLine2: "Knowledge is Power",
                subtitle: "Ensuring quality education reaches every child."
            },
            {
                titleLine1: "Justice & Equality",
                titleLine2: "For Every Citizen",
                subtitle: "Standing up for the rights of the people."
            }
        ],
        quickLinks: [
            { title: "Join the New Era\nof Politics", path: "/constitution" },
            { title: "Our New Rajasthan Bill Will Change the World", path: "/join" },
            { title: "War on Corruption\nHonest Government", path: "/donation" },
            { title: "Nature Conservation\nProtection of Humanity", path: "/about" },
            { title: "A Small Donation\nBoon for Change", path: "/declaration" }
        ],
        visionSection: {
            title: "Our Vision for a Better Tomorrow",
            sub: "Advocating for change, fostering growth, and ensuring a prosperous and just society.",
            cards: visionCards.map(card => ({
                title: card.en.title,
                desc: card.en.desc,
                image: card.image,
                link: card.link
            })),
            footerText: "Now the people's PGP will defeat the dishonest.",
            viewMore: "View More",
            viewLess: "View Less"
        },
        overlappingSection: {
            title: "Jaipur Vision",
            desc: "Together, we can make Jaipur a model of sustainable development and ecological harmony. Join our green movement today.",
            cards: [
                { title: "New farming capable farmer", desc: "Assist patients in recovering from injuries and surgeries." },
                { title: "Sustainable Use and Conservation", desc: "Ensuring balanced development while protecting nature." },
                { title: "Control Over Population Growth", desc: "Ensuring a Balanced Future Through Population Control." },
                { title: "Safe & Empowered Women", desc: "Ensuring safety and equal opportunities for women in all sectors." }
            ],
            expandedCards: [
                { title: "Youth Employment", desc: "Creating job opportunities for the young generation." },
                { title: "Healthcare Access", desc: "Ensuring affordable medical care for every citizen." },
                { title: "Cultural Heritage", desc: "Preserving Rajasthan's rich history and traditions." },
                { title: "Digital Literacy", desc: "Empowering rural areas with digital skills and connectivity." }
            ],
            button: "View More"
        },
        leader: {
            title: "Meet Our Ideological Leader",
            sub: "The Face of Change, The Voice of the People.",
            quote: "“The Green Talks with Dr. Sudhanshu.”",
            role: "– Dr. Sudhanshu Sharma, President",
            bio: "Dr. Sudhanshu is an Indian academician, politician, green activist, and climate change scientist. He is the co-founder of Suresh Gyan Vihar University, one of the NAAC 'A+' graded universities in Rajasthan. He also served as the founding First Vice-President of Suresh Gyan Vihar University between 2008–2010. In 2011, he founded the Bharatiya People's Green Party, based in Rajasthan, as its national president. The party is affiliated with the Naya Rajasthan think-tank and promotes the formation of a people's green zone."
        },
        stats: {
            header: "Our Growing Impact Across Rajasthan",
            sub: "Together, we can make Rajasthan a model of sustainable development and ecological harmony. Join our green movement today.",
            items: [
                { label: "Working Volunteers", sub: "People dedicated to driving impactful change across all major regions." },
                { label: "Explored Rajasthan Cities", sub: "Expanding our reach across the state through continuous field efforts." },
                { label: "Private & Domestic Land", sub: "Promoting sustainable green development within urban residential zones." },
                { label: "People Engaged", sub: "Communities actively participating in our initiatives commitment." },
            ]
        },
        news: {
            title: "News and Publications",
            sub: "Stay updated with the party’s latest statements and announcements."
        },
        gallery: {
            title: "Media Gallery",
            sub: "Glimpses of our journey and events.",
            viewMore: "View More",
            viewLess: "View Less"
        },
        committee: {
            title: "Meet Our Committee Members",
            sub: "Dedicated leaders working together to guide our vision for a sustainable future.",
            button: "View More",
            roles: {
                president: "President",
                vicePresident: "Vice President",
                genSecretary: "Gen. Secretary",
                secretary: "Secretary",
                pradeshAdhyaksh: "Pradesh Adhyaksh Rajasthan"
            }
        },
        dashboard: {
            memberCardTitle: "Member Identification Card",
            downloadCard: "Download ID Card",
            uploadPhoto: "Upload Photo",
            changePhoto: "Change Photo",
            uploading: "Uploading…",
            remove: "Remove",
            leadershipTitle: "Leadership Program",
            leadershipJoined: "You have joined the Leadership Program!",
            leaderOptInPrompt: "🎖️ Do you want to become a Leader of your region?",
            leaderOptInYes: "Yes, Become a Leader",
            becomeLeaderTitle: "Become the leader of your area",
            becomeLeaderSubtitle: "Recruit 5 people from your Local Unit to unlock your appointment letter and become CWC President.",
            myTeamTitle: "My Team",
            inviteTitle: "Invite your 5 team members",
            inviteSubtitle: "Share your link on WhatsApp to quickly recruit members from your Local Unit.",
            inviteShareText: "Join Peoples Green Party using my invite link:",
            shareWhatsApp: "Share on WhatsApp",
            copyLink: "Copy Link",
            referralTitle: "Your Referral Code",
            referralSubtitle: "People can scan or use this code to join.",
            referralLabel: "Your referral code",
            leaderLabel: "Leader",
            slotLabel: "Slot",
            slotsHint: "Complete your team by adding 5 influential people from your region.",
            appointmentTitle: "Appointment Letter",
            appointmentReady: "Your official appointment letter is ready for download.",
            appointmentLocked: "Recruit 5 members in your Local Unit to unlock your appointment letter.",
            download: "Download",
            locked: "Locked",
            partyName: "Peoples Green Party",
            dear: "Dear",
            appointmentBody: "We are pleased to officially appoint you within the Peoples Green Party. Your commitment to our vision of a greener, cleaner, and more equitable India is highly valued.",
            appointmentClosing: "This appointment acknowledges your leadership in building our grassroots movement. We trust that you will continue to serve with integrity and dedication.",
            empoweringIndia: "Empowering India Together",
            appointmentLetterHeader: "APPOINTMENT LETTER",
            loksabhaLabel: "Loksabha",
            cwcLabel: "CWC",
            designationLabel: "Designation",
            cwcPresident: "CWC President",
            dateLabel: "Date",
            authorizedSignatory: "Authorized Signatory",
            name: "Name",
            membershipId: "Membership ID",
            role: "Role:",
            ward: "Ward:",
            recruitsTitle: "Recruits",
            referralCode: "Referral Code:",
            copy: "Copy",
            target: "",
            recruitedMembers: "Recruited Members",
            roles: {
                member: "Member",
                worker: "Worker"
            },
            placeholderName: "Name Here",
            placeholderMemberId: "PGP-XXXXXX",
            placeholderWard: "Ward Details",
            wardLabel: "Ward No.",
            memberLabel: "Member",
            teamMembers: "Team Members",
            recentlyRecruited: "Your recently recruited members",
            mobile: "Mobile",
            loksabha: "Loksabha",
            cwc: "CWC",
            joiningDate: "Joining Date",
            profile: "Profile",
            verifiedEliteMember: "Verified Elite Member",
            downloadAppointmentLetter: "Download Appointment Letter",
            membershipIdLabel: "Membership ID",
            mobileNumberLabel: "Mobile Number",
            congratulations: "Congratulations!",
            appointmentLetterUnlocked: "Your Appointment Letter is unlocked",
            status: "Status",
            recruits: "Recruits",
            noRecruitsYet: "No members yet. Start recruiting!"
        },
        join: {
            inviteShareText: "Join Peoples Green Party using my invite link:",
        },
        election: {
            title: "Election 2026",
            subtitle: "Time to vote for a just, prosperous, sustain party.",
            tableTitle: "Election 2026",
            tableSubtitle: "Your vote shapes the future—stand for democracy in 2026.",
            selectYear: "Select Year",
            table: {
                sno: "S.no",
                name: "Name of Elections",
                candidates: "Candidates",
                startDate: "Start Date",
                endDate: "End Date",
                status: "Status",
                vote: "Your Vote",
                voted: "Voted",
                notVoted: "Not Voted",
                ongoing: "Ongoing",
                demoElectionName: "XYZ Elections"
            }
        },
        footer: {
            follow: "Follow Us",
            useful: "Useful Links",
            additional: "Additional Links",
            contact: "Contact Us",
            address: "Ham Badlenge Bhawan, 02 Mission Compound, Ajmer Puliya, Jaipur, Rajasthan",
            audit: "Audit Report and Information About Donation",
            eci: "ECI Disclosure",
            criminal: "Declaration about criminal antecedents of candidates set up by the party"
        },
        jaipurVisionPage: {
            title: "Jaipur Vision 2030",
            subtitle: "Restoring Glory, Building Future",
            intro: "Our vision for Jaipur balances its rich heritage with the needs of a modern, sustainable metropolis.",
            points: [
                { title: "Green Mobility", desc: "100% Electric Public Transport and Dedicated Cycle Tracks." },
                { title: "Heritage Conservation", desc: "Reviving the Walled City with smart infrastructure and cleanliness." },
                { title: "Waste Free Jaipur", desc: "Zero-landfill policy with advanced waste-to-energy plants." },
                { title: "Urban Forests", desc: "Creating micro-forests in every zone to combat heat & pollution." }
            ]
        }
    },
    hi: {
        nav: {
            home: "होम",
            about: "हमारे बारे में",
            constitution: "संविधान",
            donate: "दान करें",
            declaration: "घोषणा पत्र",
            join: "जुड़ें",
            login: "लॉगिन",
            dashboard: "डैशबोर्ड",
            election: "चुनाव",
            weAreAravali: "वी आर अरावली",
            leaders: "नेतृत्व"
        },
        heroSlides: [
            {
                titleLine1: "बेहतर भविष्य के लिए",
                titleLine2: "नवाचार को प्रेरित करना",
                subtitle: "सतत प्रगति और परिवर्तनकारी विचारों के लिए प्रतिबद्ध।"
            },
            {
                titleLine1: "ग्रामीण समुदायों को",
                titleLine2: "सशक्त बनाना",
                subtitle: "आधुनिक कृषि के माध्यम से आत्मनिर्भर गांव बनाना।"
            },
            {
                titleLine1: "हरित ऊर्जा",
                titleLine2: "क्रांति की शुरुआत",
                subtitle: "स्वच्छ कल के लिए स्थायी ऊर्जा अपनाना।"
            },
            {
                titleLine1: "सभी के लिए शिक्षा",
                titleLine2: "ज्ञान ही शक्ति है",
                subtitle: "हर बच्चे तक गुणवत्तापूर्ण शिक्षा सुनिश्चित करना।"
            },
            {
                titleLine1: "न्याय और समानता",
                titleLine2: "हर नागरिक के लिए",
                subtitle: "जनता के अधिकारों के लिए खड़े होना।"
            }
        ],
        quickLinks: [
            { title: "नए युग की राजनीति\nसे जुड़िए", path: "/constitution" },
            { title: "हमारा नया राजस्थान बिल, बदलेगा दुनिया", path: "/join" },
            { title: "करप्शन पर वर चाहिए ईमानदार सरकार", path: "/donation" },
            { title: "प्रकृति का संरक्षण मानवता की रक्षा", path: "/about" },
            { title: "थोड़ा सा दान बदलाव के लिए वरदान", path: "/declaration" }
        ],
        visionSection: {
            title: "बेहतर कल के लिए हमारा दृष्टिकोण",
            sub: "बदलाव की वकालत, विकास को बढ़ावा देना और एक समृद्ध व न्यायपूर्ण समाज सुनिश्चित करना।",
            cards: visionCards.map(card => ({
                title: card.hi.title,
                desc: card.hi.desc,
                image: card.image,
                link: card.link
            })),
            footerText: "अब जनता की PGP बेईमानों को हराएगी।",
            viewMore: "और देखें",
            viewLess: "कम देखें"
        },
        overlappingSection: {
            title: "जयपुर विजन",
            desc: "साथ मिलकर, हम जयपुर को सतत विकास और पारिस्थितिक संतुलन का एक मॉडल बना सकते हैं। आज ही हमारे हरित आंदोलन में शामिल हों।",
            cards: [
                { title: "नई खेती में सक्षम किसान", desc: "चोटों और सर्जरी से उबरने में रोगियों की सहायता करें।" },
                { title: "प्राकृतिक संसाधनों का संरक्षण", desc: "प्रकृति की रक्षा करते हुए संतुलित विकास सुनिश्चित करना।" },
                { title: "जनसंख्या वृद्धि पर नियंत्रण", desc: "जनसंख्या नियंत्रण के माध्यम से एक संतुलित भविष्य सुनिश्चित करना।" },
                { title: "सुरक्षित और सशक्त महिलाएं", desc: "सभी क्षेत्रों में महिलाओं के लिए सुरक्षा और समान अवसर सुनिश्चित करना।" }
            ],
            expandedCards: [
                { title: "युवा रोजगार", desc: "युवा पीढ़ी के लिए नौकरी के अवसर पैदा करना।" },
                { title: "स्वास्थ्य सेवा तक पहुंच", desc: "हर नागरिक के लिए सस्ती चिकित्सा देखभाल सुनिश्चित करना।" },
                { title: "सांस्कृतिक विरासत", desc: "राजस्थान के समृद्ध इतिहास और परंपराओं का संरक्षण।" },
                { title: "डिजिटल साक्षरता", desc: "डिजिटल कौशल और कनेक्टिविटी के साथ ग्रामीण क्षेत्रों को सशक्त बनाना।" }
            ],
            button: "और देखें"
        },
        leader: {
            title: "अपने वैचारिक नेता से मिलें",
            sub: "बदलाव का चेहरा, जनता की आवाज़।",
            quote: "“डॉ. सुधांशु के साथ द ग्रीन टॉक्स।”",
            role: "– डॉ. सुधांशु शर्मा, अध्यक्ष",
            bio: "डॉ. सुधांशु एक भारतीय शिक्षाविद, राजनीतिज्ञ, हरित कार्यकर्ता और जलवायु परिवर्तन वैज्ञानिक हैं। वह सुरेश ज्ञान विहार विश्वविद्यालय के सह-संस्थापक हैं, जो राजस्थान में NAAC 'A+' ग्रेडेड विश्वविद्यालयों में से एक है। उन्होंने 2008-2010 के बीच सुरेश ज्ञान विहार विश्वविद्यालय के संस्थापक प्रथम उपाध्यक्ष के रूप में भी काम किया। 2011 में, उन्होंने राजस्थान में स्थित भारतीय पीपुल्स ग्रीन पार्टी की स्थापना की।"
        },
        stats: {
            header: "राजस्थान में हमारा बढ़ता प्रभाव",
            sub: "साथ मिलकर, हम राजस्थान को सतत विकास और पारिस्थितिक संतुलन का मॉडल बना सकते हैं।",
            items: [
                { label: "कार्यरत स्वयंसेवक", sub: "सभी प्रमुख क्षेत्रों में प्रभावशाली परिवर्तन लाने के लिए समर्पित लोग।" },
                { label: "राजस्थान के शहरों का अन्वेषण", sub: "निरंतर क्षेत्रीय प्रयासों के माध्यम से राज्य भर में अपनी पहुंच का विस्तार।" },
                { label: "निजी और घरेलू भूमि", sub: "शहरी आवासीय क्षेत्रों में सतत हरित विकास को बढ़ावा देना।" },
                { label: "जुड़े हुए लोग", sub: "समुदाय सक्रिय रूप से हमारी पहल और प्रतिबद्धता में भाग ले रहे हैं।" },
            ]
        },
        news: {
            title: "समाचार और प्रकाशन",
            sub: "पार्टी के नवीनतम बयानों और घोषणाओं से अपडेट रहें।"
        },
        gallery: {
            title: "मीडिया गैलरी",
            sub: "हमारी यात्रा और कार्यक्रमों की झलकियाँ।",
            viewMore: "और देखें",
            viewLess: "कम देखें"
        },
        committee: {
            title: "हमारी समिति के सदस्यों से मिलें",
            sub: "एक स्थायी भविष्य के लिए हमारे दृष्टिकोण का मार्गदर्शन करने वाले समर्पित नेता।",
            button: "और देखें",
            roles: {
                president: "अध्यक्ष",
                vicePresident: "उपाध्यक्ष",
                genSecretary: "महासचिव",
                secretary: "सचिव",
                pradeshAdhyaksh: "प्रदेश अध्यक्ष राजस्थान"
            }
        },
        dashboard: {
            memberCardTitle: "सदस्य पहचान पत्र",
            downloadCard: "आईडी कार्ड डाउनलोड करें",
            uploadPhoto: "फोटो अपलोड करें",
            changePhoto: "फोटो बदलें",
            uploading: "अपलोड हो रहा है…",
            remove: "हटाएँ",
            leadershipTitle: "लीडरशिप प्रोग्राम",
            leadershipJoined: "आप लीडरशिप प्रोग्राम में शामिल हो गए हैं!",
            leaderOptInPrompt: "🎖️ क्या आप अपने क्षेत्र के लीडर बनना चाहते हैं?",
            leaderOptInYes: "हाँ, लीडर बनें",
            becomeLeaderTitle: "अपने क्षेत्र के लीडर बनें",
            becomeLeaderSubtitle: "अपने लोकल यूनिट से 5 लोगों को जोड़ें और नियुक्ति पत्र अनलॉक करके CWC अध्यक्ष बनें।",
            myTeamTitle: "मेरी टीम",
            inviteTitle: "अपने 5 टीम सदस्यों को आमंत्रित करें",
            inviteSubtitle: "अपने लोकल यूनिट से सदस्यों को जल्दी जोड़ने के लिए WhatsApp पर अपना लिंक साझा करें।",
            inviteShareText: "मेरे इनवाइट लिंक से Peoples Green Party से जुड़ें:",
            shareWhatsApp: "WhatsApp पर शेयर करें",
            copyLink: "लिंक कॉपी करें",
            referralTitle: "आपका रेफरल कोड",
            referralSubtitle: "लोग स्कैन करके या इस कोड से जुड़ सकते हैं।",
            referralLabel: "आपका रेफरल कोड",
            leaderLabel: "लीडर",
            slotLabel: "स्लॉट",
            slotsHint: "अपने क्षेत्र के 5 प्रभावशाली लोगों को जोड़कर टीम पूरी करें।",
            appointmentTitle: "नियुक्ति पत्र",
            appointmentReady: "आपका आधिकारिक नियुक्ति पत्र डाउनलोड के लिए तैयार है।",
            appointmentLocked: "अपने लोकल यूनिट में 5 सदस्य जोड़कर नियुक्ति पत्र अनलॉक करें।",
            download: "डाउनलोड",
            locked: "लॉक्ड",
            partyName: "पीपल्स ग्रीन पार्टी",
            dear: "प्रिय",
            appointmentBody: "हमें आपको पीपल्स ग्रीन पार्टी के भीतर आधिकारिक तौर पर नियुक्त करते हुए खुशी हो रही है। एक सुखी, स्वच्छ और अधिक न्यायसंगत भारत के हमारे दृष्टिकोण के प्रति आपकी प्रतिबद्धता अत्यंत मूल्यवान है।",
            appointmentClosing: "यह नियुक्ति हमारे जमीनी स्तर के आंदोलन के निर्माण में आपके नेतृत्व को स्वीकार करती है। हमें विश्वास है कि आप ईमानदारी और समर्पण के साथ सेवा करना जारी रखेंगे।",
            empoweringIndia: "साथ मिलकर भारत को सशक्त बनाना",
            appointmentLetterHeader: "नियुक्ति पत्र",
            loksabhaLabel: "लोकसभा",
            cwcLabel: "सीडब्ल्यूसी",
            designationLabel: "पद",
            cwcPresident: "CWC अध्यक्ष",
            dateLabel: "तारीख",
            authorizedSignatory: "अधिकृत हस्ताक्षरकर्ता",
            name: "नाम",
            membershipId: "सदस्यता आईडी",
            role: "भूमिका:",
            ward: "वार्ड:",
            recruitsTitle: "भर्ती",
            referralCode: "रेफरल कोड:",
            copy: "कॉपी",
            target: "",
            recruitedMembers: "भर्ती किए गए सदस्य",
            roles: {
                member: "सदस्य",
                worker: "कार्यकर्ता"
            },
            placeholderName: "नाम यहाँ",
            placeholderMemberId: "PGP-XXXXXX",
            placeholderWard: "वार्ड विवरण",
            wardLabel: "वार्ड नं.",
            memberLabel: "सदस्य",
            teamMembers: "टीम के सदस्य",
            recentlyRecruited: "आपके हाल ही में भर्ती किए गए सदस्य",
            mobile: "मोबाइल",
            loksabha: "लोकसभा",
            cwc: "सीडब्ल्यूसी",
            joiningDate: "जुड़ने की तिथि",
            profile: "प्रोफ़ाइल",
            verifiedEliteMember: "सत्यापित एलीट सदस्य",
            downloadAppointmentLetter: "नियुक्ति पत्र डाउनलोड करें",
            membershipIdLabel: "सदस्यता आईडी",
            mobileNumberLabel: "मोबाइल नंबर",
            congratulations: "बधाई हो!",
            appointmentLetterUnlocked: "आपका नियुक्ति पत्र अनलॉक हो गया है",
            status: "स्थिति",
            recruits: "भर्ती",
            noRecruitsYet: "अभी तक कोई सदस्य नहीं है। भर्ती शुरू करें!"
        },
        election: {
            title: "चुनाव 2026",
            subtitle: "एक न्यायपूर्ण, समृद्ध, टिकाऊ पार्टी के लिए वोट करने का समय।",
            tableTitle: "चुनाव 2026",
            tableSubtitle: "आपका वोट भविष्य को आकार देता है - 2026 में लोकतंत्र के लिए खड़े हों।",
            selectYear: "वर्ष चुनें",
            table: {
                sno: "क्रमांक",
                name: "चुनावों का नाम",
                candidates: "उम्मीदवार",
                startDate: "प्रारंभ तिथि",
                endDate: "अंतिम तिथि",
                status: "स्थिति",
                vote: "आपका वोट",
                voted: "वोट दिया",
                notVoted: "वोट नहीं दिया",
                ongoing: "चल रहा है",
                demoElectionName: "XYZ चुनाव"
            }
        },
        footer: {
            follow: "हमें फॉलो करें",
            useful: "उपयोगी लिंक",
            additional: "अतिरिक्त लिंक",
            contact: "संपर्क करें",
            address: "हम बदलेंगे भवन, 02 मिशन कंपाउंड, अजमेर पुलिया, जयपुर, राजस्थान",
            audit: "ऑडिट रिपोर्ट और दान के बारे में जानकारी",
            eci: "ECI प्रकटीकरण",
            criminal: "उम्मीदवारों के आपराधिक पूर्ववृत्त के बारे में घोषणा"
        },
        jaipurVisionPage: {
            title: "जयपुर विजन 2030",
            subtitle: "गौरव की पुनर्स्थापना, भविष्य का निर्माण",
            intro: "जयपुर के लिए हमारा दृष्टिकोण इसकी समृद्ध विरासत को एक आधुनिक, टिकाऊ महानगर की जरूरतों के साथ संतुलित करता है।",
            points: [
                { title: "हरित गतिशीलता", desc: "100% इलेक्ट्रिक सार्वजनिक परिवहन और समर्पित साइकिल ट्रैक।" },
                { title: "विरासत संरक्षण", desc: "स्मार्ट इंफ्रास्ट्रक्चर और स्वच्छता के साथ परकोटा शहर का पुनरुद्धार।" },
                { title: "कचरा मुक्त जयपुर", desc: "उन्नत वेस्ट-टू-एनर्जी संयंत्रों के साथ जीरो-लैंडफिल नीति।" },
                { title: "शहरी वन", desc: "गर्मी और प्रदूषण से लड़ने के लिए हर जोन में सूक्ष्म वन बनाना।" }
            ]
        }
    }
};

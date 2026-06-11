export const translations = {
  en: {
    nav: {
      features: "Features",
      gallery: "Gallery",
      memberships: "Memberships",
      location: "Location",
      signIn: "Sign In",
      joinNow: "Join Now",
      toggleMenu: "Toggle navigation menu",
    },
    hero: {
      badge: "Premium Training · Suhareka",
      titleStart: "Push your limits. Be ",
      titleHighlight: "fit for life",
      titleEnd: ".",
      subtitle:
        "Suhareka's premier fitness destination — state-of-the-art equipment, expert coaches, and a community built to keep you moving toward your strongest self.",
      ctaPrimary: "Join Now",
      ctaSecondary: "View Memberships",
    },
    features: {
      badge: "Be Fit Gym",
      titleStart: "Everything you need to ",
      titleHighlight: "train your best",
      items: [
        {
          title: "Premium Cardio & Strength Equipment",
          description:
            "Train on top-tier machines and free weights, regularly maintained and updated to keep every session efficient and safe.",
        },
        {
          title: "Professional Training",
          description:
            "Work with certified coaches who build personalized programs and keep you accountable on the way to your goals.",
        },
        {
          title: "Spacious Workout Zones",
          description:
            "Move freely across dedicated zones for cardio, strength, and functional training — never crowded, always comfortable.",
        },
      ],
    },
    gallery: {
      badge: "Gallery",
      titleStart: "A look ",
      titleHighlight: "inside our gym",
      placeholder: "Photo coming soon",
    },
    pricing: {
      badge: "Memberships",
      titleStart: "Plans built for ",
      titleHighlight: "every goal",
      joinNow: "Join Now",
      startingFrom: "Starting from",
      genders: {
        female: {
          title: "Female",
          description: "Dedicated training passes for women, at a discounted rate.",
        },
        male: {
          title: "Male",
          description: "Full access training passes for men.",
        },
      },
      passes: {
        "1day": "1 Day Pass",
        "1week": "1 Week Pass",
        "1month": "1 Month Pass",
        "3months": "3 Month Pass",
        "6months": "6 Month Pass",
        "1year": "1 Year Pass",
      },
    },
    contact: {
      badge: "Visit Us",
      titleStart: "Find us in ",
      titleHighlight: "Suhareka",
      subtitle:
        "Drop by, give us a call, or message us on WhatsApp — our team is happy to help you start your fitness journey.",
      addressTitle: "Address",
      addressValue: "Rruga Brigada 123, Suhareka 23000, Kosovo",
      hoursTitle: "Operating Hours",
      hours: [
        { days: "Monday – Friday", time: "06:00 – 23:00" },
        { days: "Saturday", time: "07:00 – 23:00" },
        { days: "Sunday", time: "Closed" },
      ],
      phoneTitle: "Phone",
      whatsappCta: "Chat on WhatsApp",
      whatsappMessage: "Hi! I'd like to know more about Be Fit Gym Suhareka.",
      mapTitle: "Be Fit Gym Suhareka location",
    },
    footer: {
      tagline: "Suhareka, Kosovo",
      poweredByPrefix: "Powered by",
    },
    joinModal: {
      closeAria: "Close join modal",
      membershipBadge: (tier: string) => `${tier} Membership`,
      titleStart: "Join ",
      titleHighlight: "Be Fit Gym",
      subtitle:
        "Tell us about yourself and choose how you'd like to pay — you'll be training in no time.",
      steps: { personalInfo: "Personal Info", paymentMethod: "Payment Method" },
      fields: {
        fullName: "Full name",
        fullNamePlaceholder: "Jane Doe",
        email: "Email address",
        emailPlaceholder: "jane@example.com",
        phone: "Phone number",
        phonePlaceholder: "+383 4X XXX XXX",
        gender: "Gender",
        membershipPlan: "Pass duration",
        paymentMethod: "Payment method",
      },
      errors: {
        fullName: "Please enter your full name.",
        email: "Enter a valid email address.",
        phone: "Enter a valid phone number.",
        gender: "Select your gender.",
        passId: "Select a pass duration.",
        paymentMethod: "Select a payment method.",
        bankTerminal: "Couldn't reach the bank terminal. Please try again.",
      },
      buttons: {
        back: "Back",
        continue: "Continue",
        proceedToPayment: "Proceed to Payment",
        confirmPayment: "Confirm Payment",
        close: "Close",
      },
      paymentMethods: {
        card: { label: "Card", description: "Pay securely online" },
        transfer: { label: "Bank Transfer", description: "Pay via bank transfer" },
        cash: { label: "Cash at Gym", description: "Pay when you arrive" },
      },
      infoPanels: {
        card: {
          title: "Secure card payment",
          description:
            "After you continue you'll be redirected to your bank's secure payment page to enter your card details. Be Fit Gym never sees or stores your card number.",
        },
        transfer: {
          title: "Pay by bank transfer",
          description:
            "We'll email you our gym's IBAN and a payment reference once you submit this form. Most local banks process gym membership transfers within one business day.",
        },
        cash: {
          title: "Pay cash at the front desk",
          description:
            "Reserve your spot now and settle your membership fee in cash on your first visit. Just bring a valid ID to complete registration.",
        },
      },
      bankRedirect: "Redirecting to secure bank terminal...",
      submitting: "Securing transaction connection...",
      success: {
        titleStart: "Welcome to the ",
        titleHighlight: "Team!",
        subtitlePrefix: "Your ",
        subtitleSuffix: " membership is confirmed and ready to activate.",
        membershipCodeLabel: "Membership code",
        whatsappCta: "Message Gym on WhatsApp to Activate Key",
        whatsappMessage: (tier: string, code: string) =>
          `Hi! I just signed up for the ${tier} membership (code ${code}). I'd like to activate my key.`,
        close: "Close",
      },
    },
    checkout: {
      success: {
        confirming: "Confirming transaction clearance with bank system...",
        badge: "Payment Successful",
        titleStart: "Payment Verified. ",
        titleHighlight: "Your Membership is Active.",
        bankConfirmation: "Bank Confirmation",
        detailLabels: { Response: "Response", "Auth Code": "Auth Code", "Return Code": "Return Code", "Order ID": "Order ID" },
        oneLastStep: "One last step",
        descriptionPrefix:
          "A confirmation email with your receipt is on its way. Please show it at the front desk when you visit ",
        descriptionSuffix: " so we can activate your access card.",
        locationLabel: "Be Fit Gym, Suhareka",
        saveToWhatsApp: "Save Pass to WhatsApp",
        whatsappPassMessage: (tierName: string, phone: string, membershipId: string) =>
          `Hi! I just completed payment for my ${tierName} membership. Phone: ${phone}, Membership ID: ${membershipId}. I'd like to activate my access card.`,
        backToHome: "Back to Home",
      },
      failure: {
        badge: "Payment Declined",
        title: "Your transaction was declined or canceled",
        description:
          "The bank did not complete this payment, so your membership has not been charged or activated. This can happen if the payment was canceled, the card was declined, or the session timed out.",
        tryAgain: "Try Another Payment Method or Pay at Desk",
        backToHome: "Back to Home",
      },
    },
  },
  sq: {
    nav: {
      features: "Veçoritë",
      gallery: "Galeria",
      memberships: "Anëtarësimet",
      location: "Lokacioni",
      signIn: "Hyr",
      joinNow: "Fillo Tani",
      toggleMenu: "Shfaq/fshih menynë e navigimit",
    },
    hero: {
      badge: "Stërvitje Premium · Suharekë",
      titleStart: "Tejkalo kufijtë. Be ",
      titleHighlight: "fit për jetë",
      titleEnd: ".",
      subtitle:
        "Destinacioni kryesor i fitnesit në Suharekë — pajisje moderne, trajnerë ekspertë dhe një komunitet i krijuar për të të mbajtur në lëvizje drejt versionit tënd më të fortë.",
      ctaPrimary: "Fillo Tani",
      ctaSecondary: "Shiko Anëtarësimet",
    },
    features: {
      badge: "Be Fit Gym",
      titleStart: "Gjithçka që të duhet për të ",
      titleHighlight: "u stërvitur më së miri",
      items: [
        {
          title: "Pajisje Premium për Cardio dhe Forcë",
          description:
            "Stërvitu me makineri dhe pesha të nivelit të lartë, të mirëmbajtura dhe të përditësuara rregullisht për ta bërë çdo seancë efikase dhe të sigurt.",
        },
        {
          title: "Trajnim Profesional",
          description:
            "Puno me trajnerë të çertifikuar që ndërtojnë programe të personalizuara dhe të mbajnë të përgjegjshëm gjatë rrugës drejt qëllimeve tua.",
        },
        {
          title: "Zona të Gjera për Stërvitje",
          description:
            "Lëviz lirshëm nëpër zona të dedikuara për kardio, forcë dhe stërvitje funksionale — kurrë të mbushura, gjithmonë komode.",
        },
      ],
    },
    gallery: {
      badge: "Galeria",
      titleStart: "Një vështrim ",
      titleHighlight: "brenda sallës sonë",
      placeholder: "Fotoja vjen së shpejti",
    },
    pricing: {
      badge: "Anëtarësimet",
      titleStart: "Plane të krijuara për ",
      titleHighlight: "çdo qëllim",
      joinNow: "Fillo Tani",
      startingFrom: "Duke filluar nga",
      genders: {
        female: {
          title: "Femra",
          description: "Pasa stërvitje të dedikuara për femra, me çmim të zbritur.",
        },
        male: {
          title: "Meshkuj",
          description: "Pasa stërvitje me qasje të plotë për meshkuj.",
        },
      },
      passes: {
        "1day": "Pass 1 Ditë",
        "1week": "Pass 1 Javë",
        "1month": "Pass 1 Muaj",
        "3months": "Pass 3 Muaj",
        "6months": "Pass 6 Muaj",
        "1year": "Pass 1 Vit",
      },
    },
    contact: {
      badge: "Na Vizito",
      titleStart: "Na gjej në ",
      titleHighlight: "Suharekë",
      subtitle:
        "Kalo te ne, na telefono ose na shkruaj në WhatsApp — ekipi ynë gëzohet të të ndihmojë të nisësh udhëtimin tënd drejt formës fizike.",
      addressTitle: "Adresa",
      addressValue: "Rruga Brigada 123, Suharekë 23000, Kosovë",
      hoursTitle: "Orari i Punës",
      hours: [
        { days: "E hënë – E premte", time: "06:00 – 23:00" },
        { days: "E shtunë", time: "07:00 – 23:00" },
        { days: "E diel", time: "Mbyllur" },
      ],
      phoneTitle: "Telefoni",
      whatsappCta: "Shkruaj në WhatsApp",
      whatsappMessage: "Përshëndetje! Do të doja të mësoja më shumë rreth Be Fit Gym Suharekë.",
      mapTitle: "Lokacioni i Be Fit Gym Suharekë",
    },
    footer: {
      tagline: "Suharekë, Kosovë",
      poweredByPrefix: "Mundësuar nga",
    },
    joinModal: {
      closeAria: "Mbyll dritaren e bashkimit",
      membershipBadge: (tier: string) => `Anëtarësim ${tier}`,
      titleStart: "Bashkohu me ",
      titleHighlight: "Be Fit Gym",
      subtitle:
        "Na trego pak për veten dhe zgjidh mënyrën e pagesës — do të jesh duke u stërvitur shumë shpejt.",
      steps: { personalInfo: "Të Dhënat Personale", paymentMethod: "Mënyra e Pagesës" },
      fields: {
        fullName: "Emri i plotë",
        fullNamePlaceholder: "Jane Doe",
        email: "Adresa e email-it",
        emailPlaceholder: "jane@example.com",
        phone: "Numri i telefonit",
        phonePlaceholder: "+383 4X XXX XXX",
        gender: "Gjinia",
        membershipPlan: "Kohëzgjatja e pasit",
        paymentMethod: "Mënyra e pagesës",
      },
      errors: {
        fullName: "Të lutemi shkruaj emrin tënd të plotë.",
        email: "Shkruaj një adresë email-i të vlefshme.",
        phone: "Shkruaj një numër telefoni të vlefshëm.",
        gender: "Zgjidh gjininë.",
        passId: "Zgjidh kohëzgjatjen e pasit.",
        paymentMethod: "Zgjidh një mënyrë pagese.",
        bankTerminal: "Nuk u arrit të kontaktohej terminali bankar. Provo përsëri.",
      },
      buttons: {
        back: "Prapa",
        continue: "Vazhdo",
        proceedToPayment: "Vazhdo te Pagesa",
        confirmPayment: "Konfirmo Pagesën",
        close: "Mbyll",
      },
      paymentMethods: {
        card: { label: "Kartelë", description: "Paguaj online në mënyrë të sigurt" },
        transfer: { label: "Transfer Bankar", description: "Paguaj përmes transferit bankar" },
        cash: { label: "Cash në Sallë", description: "Paguaj kur të vish" },
      },
      infoPanels: {
        card: {
          title: "Pagesë e sigurt me kartelë",
          description:
            "Pasi të vazhdosh, do të ridrejtohesh te faqja e sigurt e pagesës së bankës tënde për të futur të dhënat e kartelës. Be Fit Gym nuk i sheh dhe nuk i ruan kurrë të dhënat e kartelës tënde.",
        },
        transfer: {
          title: "Paguaj me transfer bankar",
          description:
            "Do të të dërgojmë me email IBAN-in e sallës dhe një referencë pagese pasi ta dërgosh këtë formular. Shumica e bankave lokale i procesojnë transferet për anëtarësim brenda një dite pune.",
        },
        cash: {
          title: "Paguaj cash te recepsioni",
          description:
            "Rezervo vendin tënd tani dhe paguaj tarifën e anëtarësimit cash gjatë vizitës së parë. Mjafton të sjellësh një ID të vlefshme për të përfunduar regjistrimin.",
        },
      },
      bankRedirect: "Duke u ridrejtuar te terminali i sigurt bankar...",
      submitting: "Duke siguruar lidhjen e transaksionit...",
      success: {
        titleStart: "Mirë se erdhe në ",
        titleHighlight: "Ekip!",
        subtitlePrefix: "Anëtarësimi yt ",
        subtitleSuffix: " është konfirmuar dhe gati për t'u aktivizuar.",
        membershipCodeLabel: "Kodi i anëtarësimit",
        whatsappCta: "Shkruaj Sallës në WhatsApp për të Aktivizuar Çelësin",
        whatsappMessage: (tier: string, code: string) =>
          `Përshëndetje! Sapo u regjistrova për anëtarësimin ${tier} (kodi ${code}). Do të doja të aktivizoja çelësin tim.`,
        close: "Mbyll",
      },
    },
    checkout: {
      success: {
        confirming: "Duke konfirmuar kliringun e transaksionit me sistemin bankar...",
        badge: "Pagesa u Krye me Sukses",
        titleStart: "Pagesa u Verifikua. ",
        titleHighlight: "Anëtarësimi Yt është Aktiv.",
        bankConfirmation: "Konfirmimi Bankar",
        detailLabels: { Response: "Përgjigja", "Auth Code": "Kodi i Autorizimit", "Return Code": "Kodi i Kthimit", "Order ID": "ID e Porosisë" },
        oneLastStep: "Edhe një hap i fundit",
        descriptionPrefix:
          "Një email konfirmimi me faturën tënde është në rrugë. Të lutemi tregoje atë te recepsioni kur të na vizitosh në ",
        descriptionSuffix: " në mënyrë që të aktivizojmë kartën tënde të hyrjes.",
        locationLabel: "Be Fit Gym, Suharekë",
        saveToWhatsApp: "Ruaj Passin në WhatsApp",
        whatsappPassMessage: (tierName: string, phone: string, membershipId: string) =>
          `Përshëndetje! Sapo përfundova pagesën për anëtarësimin ${tierName}. Telefoni: ${phone}, ID e anëtarësimit: ${membershipId}. Dëshiroj të aktivizoj kartën time të hyrjes.`,
        backToHome: "Kthehu në Ballina",
      },
      failure: {
        badge: "Pagesa u Refuzua",
        title: "Transaksioni yt u refuzua ose u anulua",
        description:
          "Banka nuk e përfundoi këtë pagesë, prandaj anëtarësimi yt nuk është ngarkuar apo aktivizuar. Kjo mund të ndodhë nëse pagesa u anulua, kartela u refuzua, ose seanca skadoi.",
        tryAgain: "Provo një Mënyrë Tjetër Pagese ose Paguaj në Sallë",
        backToHome: "Kthehu në Ballina",
      },
    },
  },
} as const;

export type Language = keyof typeof translations;
export type Translations = (typeof translations)[Language];

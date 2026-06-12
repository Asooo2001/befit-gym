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
        "Drop by or give us a call — our team is happy to help you start your fitness journey.",
      addressTitle: "Address",
      addressValue: "Rruga Brigada 123, Suhareka 23000, Kosovo",
      hoursTitle: "Operating Hours",
      hours: [
        { days: "Monday – Friday", time: "06:00 – 23:00" },
        { days: "Saturday", time: "07:00 – 23:00" },
        { days: "Sunday", time: "Closed" },
      ],
      phoneTitle: "Phone",
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
        "Tell us about yourself — you'll pay securely by card and be training in no time.",
      steps: { personalInfo: "Personal Info", paymentMethod: "Payment" },
      fields: {
        fullName: "Full name",
        fullNamePlaceholder: "Jane Doe",
        email: "Email address",
        emailPlaceholder: "jane@example.com",
        phone: "Phone number",
        phonePlaceholder: "+383 4X XXX XXX",
        gender: "Gender",
        membershipPlan: "Pass duration",
      },
      errors: {
        fullName: "Please enter your full name.",
        email: "Enter a valid email address.",
        phone: "Enter a valid phone number.",
        gender: "Select your gender.",
        passId: "Select a pass duration.",
        bankTerminal: "Couldn't reach the bank terminal. Please try again.",
      },
      buttons: {
        back: "Back",
        continue: "Continue",
        proceedToPayment: "Proceed to Payment",
        close: "Close",
      },
      infoPanels: {
        card: {
          title: "Secure card payment",
          description:
            "After you continue you'll be redirected to your bank's secure payment page to enter your card details. Be Fit Gym never sees or stores your card number. Your membership and QR code activate immediately once payment is confirmed.",
        },
      },
      bankRedirect: "Redirecting to secure bank terminal...",
    },
    checkout: {
      success: {
        confirming: "Confirming transaction clearance with bank system...",
        badge: "Payment Successful",
        titleStart: "Payment Verified. ",
        titleHighlight: "Your Membership is Active.",
        bankConfirmation: "Bank Confirmation",
        detailLabels: { Response: "Response", "Auth Code": "Auth Code", "Return Code": "Return Code", "Order ID": "Order ID" },
        oneLastStep: "You're all set",
        descriptionPrefix:
          "Your membership is active immediately. A confirmation email with your QR code and receipt is on its way — show the QR code at the front desk when you visit ",
        descriptionSuffix: " to check in.",
        locationLabel: "Be Fit Gym, Suhareka",
        backToHome: "Back to Home",
      },
      failure: {
        badge: "Payment Declined",
        title: "Your transaction was declined or canceled",
        description:
          "The bank did not complete this payment, so your membership has not been charged or activated. This can happen if the payment was canceled, the card was declined, or the session timed out.",
        tryAgain: "Try Again",
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
        "Kalo te ne ose na telefono — ekipi ynë gëzohet të të ndihmojë të nisësh udhëtimin tënd drejt formës fizike.",
      addressTitle: "Adresa",
      addressValue: "Rruga Brigada 123, Suharekë 23000, Kosovë",
      hoursTitle: "Orari i Punës",
      hours: [
        { days: "E hënë – E premte", time: "06:00 – 23:00" },
        { days: "E shtunë", time: "07:00 – 23:00" },
        { days: "E diel", time: "Mbyllur" },
      ],
      phoneTitle: "Telefoni",
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
        "Na trego pak për veten — do të paguash në mënyrë të sigurt me kartelë dhe do të jesh duke u stërvitur shumë shpejt.",
      steps: { personalInfo: "Të Dhënat Personale", paymentMethod: "Pagesa" },
      fields: {
        fullName: "Emri i plotë",
        fullNamePlaceholder: "Jane Doe",
        email: "Adresa e email-it",
        emailPlaceholder: "jane@example.com",
        phone: "Numri i telefonit",
        phonePlaceholder: "+383 4X XXX XXX",
        gender: "Gjinia",
        membershipPlan: "Kohëzgjatja e pasit",
      },
      errors: {
        fullName: "Të lutemi shkruaj emrin tënd të plotë.",
        email: "Shkruaj një adresë email-i të vlefshme.",
        phone: "Shkruaj një numër telefoni të vlefshëm.",
        gender: "Zgjidh gjininë.",
        passId: "Zgjidh kohëzgjatjen e pasit.",
        bankTerminal: "Nuk u arrit të kontaktohej terminali bankar. Provo përsëri.",
      },
      buttons: {
        back: "Prapa",
        continue: "Vazhdo",
        proceedToPayment: "Vazhdo te Pagesa",
        close: "Mbyll",
      },
      infoPanels: {
        card: {
          title: "Pagesë e sigurt me kartelë",
          description:
            "Pasi të vazhdosh, do të ridrejtohesh te faqja e sigurt e pagesës së bankës tënde për të futur të dhënat e kartelës. Be Fit Gym nuk i sheh dhe nuk i ruan kurrë të dhënat e kartelës tënde. Anëtarësimi dhe kodi QR aktivizohen menjëherë pasi pagesa konfirmohet.",
        },
      },
      bankRedirect: "Duke u ridrejtuar te terminali i sigurt bankar...",
    },
    checkout: {
      success: {
        confirming: "Duke konfirmuar kliringun e transaksionit me sistemin bankar...",
        badge: "Pagesa u Krye me Sukses",
        titleStart: "Pagesa u Verifikua. ",
        titleHighlight: "Anëtarësimi Yt është Aktiv.",
        bankConfirmation: "Konfirmimi Bankar",
        detailLabels: { Response: "Përgjigja", "Auth Code": "Kodi i Autorizimit", "Return Code": "Kodi i Kthimit", "Order ID": "ID e Porosisë" },
        oneLastStep: "Gati je",
        descriptionPrefix:
          "Anëtarësimi yt është aktiv menjëherë. Një email konfirmimi me kodin QR dhe faturën tënde është në rrugë — tregoje kodin QR te recepsioni kur të na vizitosh në ",
        descriptionSuffix: " për check-in.",
        locationLabel: "Be Fit Gym, Suharekë",
        backToHome: "Kthehu në Ballina",
      },
      failure: {
        badge: "Pagesa u Refuzua",
        title: "Transaksioni yt u refuzua ose u anulua",
        description:
          "Banka nuk e përfundoi këtë pagesë, prandaj anëtarësimi yt nuk është ngarkuar apo aktivizuar. Kjo mund të ndodhë nëse pagesa u anulua, kartela u refuzua, ose seanca skadoi.",
        tryAgain: "Provo Përsëri",
        backToHome: "Kthehu në Ballina",
      },
    },
  },
} as const;

export type Language = keyof typeof translations;
export type Translations = (typeof translations)[Language];

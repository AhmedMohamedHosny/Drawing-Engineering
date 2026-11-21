/**
 * ============================================================================
 * القاموس الهندسي الاحترافي بلغة الموقع والمقاولين (CAD Engineering Dictionary)
 * ============================================================================
 * يغطي: الخرسانة المسلحة، الحدادة، النجارة، محطات المياه، الخزانات، المواسير،
 * فواصل الصب والعزل، أعمال التربة والدمك، والمصطلحات المعمارية والمساحية.
 *
 * يمكنك إضافة أي مصطلح جديد في قسم EXACT_PHRASES أو TERM_REPLACEMENTS بسطر واحد.
 */

window.EngineeringDict = (function () {
  // 1. تطابق كامل للعبارات الشائعة في لوحات الـ CAD (بدون حساسية لحالة الأحرف)
  const EXACT_PHRASES = {
    // --- أختام وعناوين التجهيز والمشاريع ---
    "FOR ADVANCE": "للتجهيز المسبق للحديد",
    "FOR ADVANCE : THIS DWG CAN BE USED ONLY FOR THE PREPARATION OF REBAR(TOP REBAR & BOT REBAR ONLY) IN BASE SLAB.":
      "للتجهيز المسبق: تُستخدم هذه اللوحة فقط لتقطيع وتجهيز حديد التسليح (الشبكة العلوية والسفلية فقط) في اللبشة المسلحة.",
    "THIS DWG CAN BE USED ONLY FOR THE PREPARATION OF REBAR(TOP REBAR & BOT REBAR ONLY) IN BASE SLAB.":
      "تُستخدم هذه اللوحة فقط لتقطيع وتجهيز حديد التسليح (الشبكة العلوية والسفلية فقط) في اللبشة المسلحة.",
    "ISSUED FOR CONSTRUCTION": "صادر للتنفيذ (IFC)",
    "ISSUED FOR REVIEW": "صادر للمراجعة (IFR)",
    "ISSUED FOR APPROVAL": "صادر للاعتماد (IFA)",
    "ISSUED FOR INFORMATION": "صادر للمعلومات (IFI)",
    "PRELIMINARY": "مبدئي (غير صالح للتنفيذ)",
    "AS BUILT": "مخطط تنفيذي نهائي (كما نُفذ)",
    "AS-BUILT": "مخطط تنفيذي نهائي (كما نُفذ)",
    "HOLD": "معلّق لحين التأكيد",
    "ON HOLD": "معلّق لحين التأكيد",

    // --- عناوين الخزانات وغرف المضخات واللوحات ---
    "INFLUENT WATER STORAGE TANK": "خزان تخزين المياه الواردة (الخام)",
    "INFLUENT WATER STORAGE": "خزان تخزين المياه الواردة",
    "INFLUENT OFF SPEC TANK": "خزان المياه غير المطابقة للمواصفات",
    "OFF SPEC TANK": "خزان المياه غير المطابقة للمواصفات",
    "INFLUENT TANK": "خزان المياه الواردة",
    "PUMP ROOM": "غرفة المضخات",
    "PUMP HOUSE": "مبنى المضخات",
    "SUMP PIT": "بيارة التجميع (حفرة السحب)",
    "PUMP ROOM SUMP PIT": "بيارة التجميع بغرفة المضخات",
    "GENERAL ARRANGEMENT PLAN": "المسقط الأفقي العام (التوزيع العام)",
    "GENERAL ARRANGEMENT": "المخطط العام",
    "INFLUENT TANK & PUMP ROOM GENERAL ARRANGEMENT PLAN": "المسقط الأفقي العام لخزان المياه الواردة وغرفة المضخات",
    "INFLUENT WATER STORAGE, OFF SPEC TANK AND PUMP ROOM": "خزانات المياه الواردة وغير المطابقة للمواصفات وغرفة المضخات",
    "OVERALL PLOT PLAN": "المخطط العام للموقع",
    "PLOT PLAN": "مخطط الموقع العام",
    "KEY PLAN": "مخطط الموقع العام (مفتاح اللوحة)",
    "SITE PLAN": "مخطط الموقع",
    "FOUNDATION PLAN": "مسقط أفقي للأساسات",
    "BASE SLAB PLAN": "مسقط أفقي للبشة المسلحة",
    "ROOF PLAN": "مسقط أفقي للسقف",
    "SECTION": "قطاع رأسي",
    "ELEVATION": "واجهة / منسوب",
    "DETAIL": "تفصيلة",
    "TYPICAL DETAIL": "تفصيلة نموذجية",
    "STRUCTURAL DETAILS": "التفاصيل الإنشائية",
    "STANDARD DRAWINGS": "اللوحات القياسية",
    "STANDARD DRAWINGS-GENERAL NOTES": "اللوحات القياسية - الملاحظات العامة",
    "STANDARD DRAWINGS-REINF. DETAILS": "اللوحات القياسية - تفاصيل حديد التسليح",
    "STANDARD DRAWINGS-STRUCTURAL DETAILS": "اللوحات القياسية - التفاصيل الإنشائية",
    "CALCULATION SHEET": "النوتة الحسابية",

    // --- جداول اللوحة والترويسة ---
    "MEMBER LIST": "جدول العناصر الإنشائية",
    "MEMBER": "العنصر",
    "NO": "الرمز",
    "NO.": "الرمز",
    "SIZE": "المقاس",
    "ABBREVIATIONS": "الاختصارات الهندسية",
    "REFERENCE DRAWINGS": "اللوحات المرجعية",
    "NOTES": "الملاحظات الفنية",
    "NOTES:": "الملاحظات الفنية:",
    "GENERAL NOTES": "الملاحظات العامة",
    "GENERAL NOTES:": "الملاحظات العامة:",
    "LEGEND": "مفتاح الرموز",
    "ITEM": "البند",
    "DESIGNATION": "الرمز",
    "PIPING SLEEVE NUMBER": "رقم جراب الماسورة",
    "LEVEL": "المنسوب",
    "SLEEVE": "جراب ماسورة",
    "OWNER": "المالك",
    "OWNER'S ENGINEER": "استشاري المالك",
    "CONSULTANT": "الاستشاري",
    "CONTRACTOR": "المقاول الرئيسي",
    "SUBCONTRACTOR": "مقاول الباطن",
    "PROJECT TITLE": "اسم المشروع",
    "DRAWING TITLE": "عنوان اللوحة",
    "OWNER DWG NO.": "رقم اللوحة (المالك)",
    "CONTRACTOR DWG NO.": "رقم اللوحة (المقاول)",
    "DWG NO.": "رقم اللوحة",
    "SCALE": "مقياس الرسم",
    "SCALE NTS": "بدون مقياس رسم",
    "NTS": "بدون مقياس رسم",
    "N.T.S": "بدون مقياس رسم",
    "N.T.S.": "بدون مقياس رسم",
    "REV": "مراجعة",
    "REV.": "مراجعة",
    "DATE": "التاريخ",
    "DESCRIPTION": "الوصف",
    "DRAWN": "رسم",
    "CHECKED": "مراجعة",
    "APPROVED": "اعتماد",
    "SHEET": "لوحة",
    "THIS DWG": "هذه اللوحة",
    "THIS DWG.": "هذه اللوحة",

    // --- اتجاهات الشمال والرياح ---
    "PLANT NORTH": "شمال المحطة",
    "TRUE NORTH": "الشمال الحقيقي",
    "MAGNETIC NORTH": "الشمال المغناطيسي",
    "PREVAILING WIND": "اتجاه الرياح السائد",
    "INSIDE": "الداخل",
    "OUTSIDE": "الخارج",

    // --- العناصر الإنشائية (لغة السوق) ---
    "CONC. WALL": "حائط خرساني",
    "CONCRETE WALL": "حائط خرساني مسلح",
    "CONC. GIRDER": "كمرة رئيسية",
    "GIRDER BEAM": "كمرة رئيسية",
    "GIRDER": "كمرة رئيسية",
    "CONC. COLUMN": "عمود خرساني",
    "COLUMN": "عمود خرساني",
    "PEDESTAL": "رقبة عمود / قاعدة",
    "SLEEPER": "مخدة مواسير (عارضة ارتكاز)",
    "PIPE SLEEPER": "مخدة مواسير (عارضة ارتكاز)",
    "BASE SLAB": "اللبشة المسلحة",
    "RAFT FOUNDATION": "لبشة مسلحة",
    "MAT FOUNDATION": "لبشة مسلحة",
    "SLAB ON GRADE": "دكة خرسانية على التربة",
    "FOOTING": "قاعدة خرسانية",
    "ISOLATED FOOTING": "قاعدة منفصلة",
    "COMBINED FOOTING": "قاعدة مشتركة",
    "STRIP FOOTING": "قاعدة شريطية",
    "TIE BEAM": "سمل / شداد أرضي",
    "GRADE BEAM": "ميدة / سمل أرضي",
    "RETAINING WALL": "حائط ساند",
    "SHEAR WALL": "حائط قص",
    "BEAM": "كمرة خرسانية",
    "SLAB": "بلاطة خرسانية",
    "DROP PANEL": "سقوط بلاطة",
    "STAIR": "سلم",
    "STAIRS": "سلالم",
    "HANDRAIL": "درابزين (حاجز أمان)",
    "GRATING": "مشاية معدنية (جريتينج)",
    "LADDER": "سلم بحاري",

    // --- الخرسانة والحديد والمواد ---
    "CONCRETE": "خرسانة مسلحة",
    "STRUCTURAL CONCRETE": "خرسانة مسلحة إنشائية",
    "LEAN CONCRETE": "خرسانة عادية (فرشة نظافة)",
    "BLINDING CONCRETE": "خرسانة عادية (فرشة نظافة)",
    "PLAIN CONCRETE": "خرسانة عادية",
    "MASS CONCRETE": "خرسانة عادية كتلية",
    "SCREED": "طبقة ميول / لياسة تسوية",
    "GROUT": "مونة جراوت",
    "NON-SHRINK GROUT": "مونة جراوت غير قابلة للانكماش",
    "CEMENT": "أسمنت",
    "REBAR": "حديد تسليح",
    "REINFORCEMENT": "حديد تسليح",
    "TOP REBAR": "حديد علوي",
    "BOT REBAR": "حديد سفلي",
    "BOTTOM REBAR": "حديد سفلي",
    "FUSION BONDED EPOXY COATED": "حديد تسليح مطلي بالإيبوكسي (مقاوم للصدأ)",
    "CYLINDER STRENGTH": "مقاومة الكسر للأسطوانة",
    "CUBE STRENGTH": "مقاومة الكسر للمكعب",
    "CONCRETE COVER": "الغطاء الخرساني",
    "WATERPROOFING": "عزل مائي",
    "COATING": "دهان عزل",
    "POLYETHYLENE": "مشمع بولي إيثيلين",
    "PRE-CAST": "سابقة الصب",
    "PRECAST": "سابقة الصب",
    "CAST IN PLACE": "صب في الموقع",
    "INSERT PLATE": "لوح معدني مدفون (بليت)",
    "EMBEDDED PLATE": "لوح معدني مدفون (بليت)",
    "ANCHOR BOLT": "مسمار تثبيت (أنكور بولت)",
    "HOT DIP GALVANIZED": "مجلفن على الساخن",

    // --- الفواصل والأكمام (جرابات المواسير) ---
    "ISOLATION JOINT": "فاصل عزل / هبوط",
    "EXPANSION JOINT": "فاصل تمدد",
    "CONSTRUCTION JOINT": "فاصل صب",
    "CONTROL JOINT": "فاصل تحكم (انكماش)",
    "WATER STOP": "شريط مانع تسرب (ووتر ستوب)",
    "PVC WATER STOP": "شريط ووتر ستوب PVC",
    "HYDROTITE WATER STOP": "شريط ووتر ستوب منتفخ (هيدروتايت)",
    "PUDDLE PLATE": "فلانشة مانعة للتسرب",
    "PUDDLE FLANGE": "فلانشة مانعة للتسرب",
    "NEOPRENE PAD": "وسادة مطاط نيوبرين",
    "NEOPRENE RUBBER": "شريط مطاط نيوبرين",
    "PIPE SLEEVE": "جراب / جلبة ماسورة",
    "PIPE WALL": "جدار الماسورة",
    "PIPE SLEEVE DETAIL": "تفصيلة جراب الماسورة",
    "ADJUSTED ACCORDING TO CONCRETE THICKNESS": "يُضبط الطول حسب سُمك الحائط الخرساني",
    "(ADJUSTED ACCORDING TO CONCRETE THICKNESS)": "(يُضبط الطول حسب سُمك الحائط الخرساني)",

    // --- الاختصارات الهندسية الشائعة ---
    "TOP OF CONCRETE": "منسوب ظهر الخرسانة",
    "BOTTOM OF CONCRETE": "منسوب بطن (أسفل) الخرسانة",
    "TOP OF GROUT": "منسوب ظهر الجراوت",
    "TOP OF GRATING": "منسوب ظهر المشاية المعدنية",
    "BOTTOM OF PIPE": "منسوب أسفل الماسورة",
    "CENTER OF PIPE": "منسوب محور الماسورة",
    "HIGHEST WATER LEVEL": "أعلى منسوب للمياه",
    "FINISHED FLOOR LEVEL": "منسوب التشطيب",
    "NATURAL GROUND LEVEL": "منسوب الأرض الطبيعية",
    "HIGH POINT OF PAVING": "أعلى منسوب للرصف (منسوب المرجع)",
    "MEAN SEA LEVEL": "متوسط منسوب سطح البحر",
    "TYP": "نموذجي",
    "TYP.": "نموذجي",
    "(TYP)": "(نموذجي)",
    "(TYP.)": "(نموذجي)",
    "METERS": "متر",
    "MILLIMETERS": "مليمتر"
  };

  // 2. استبدالات جزئية للعبارات المركبة قبل أو أثناء الترجمة (مرتبة تلقائياً من الأطول للأقصر)
  const PHRASE_REPLACEMENTS = [
    ["FOR ADVANCE", "للتجهيز المسبق"],
    ["THIS DWG CAN BE USED ONLY FOR THE PREPARATION OF REBAR", "تُستخدم هذه اللوحة فقط لتجهيز حديد التسليح"],
    ["TOP REBAR & BOT REBAR ONLY", "الشبكة العلوية والسفلية فقط"],
    ["IN BASE SLAB", "في اللبشة المسلحة"],
    ["INFLUENT WATER STORAGE, OFF SPEC TANK AND PUMP ROOM", "خزانات المياه الواردة وغير المطابقة للمواصفات وغرفة المضخات"],
    ["INFLUENT TANK & PUMP ROOM GENERAL ARRANGEMENT PLAN", "المسقط الأفقي العام لخزان المياه الواردة وغرفة المضخات"],
    ["INFLUENT WATER STORAGE TANK", "خزان تخزين المياه الواردة (الخام)"],
    ["INFLUENT OFF SPEC TANK", "خزان المياه غير المطابقة للمواصفات"],
    ["ZULUF WATER TREATMENT FACILITIES PHASE II", "محطة معالجة مياه الزلف - المرحلة الثانية"],
    ["WATER TREATMENT FACILITIES", "محطة معالجة المياه"],
    ["GENERAL ARRANGEMENT PLAN", "المسقط الأفقي العام"],
    ["PIPE SLEEVE DETAIL FOR", "تفصيلة جراب الماسورة لـ"],
    ["ADJUSTED ACCORDING TO CONCRETE THICKNESS", "يُضبط الطول حسب سُمك الحائط الخرساني"],
    ["MAXIMUM MODIFIED PROCTOR DENSITY", "أقصى كثافة لاختبار بروكتور المعدل"],
    ["MODIFIED PROCTOR DENSITY", "كثافة بروكتور المعدلة"],
    ["RELATIVE DENSITY", "الكثافة النسبية للتربة"],
    ["WATER RETAINING TANKS", "خزانات حجز المياه"],
    ["ALL THE CONSTRUCTION JOINTS OF", "جميع فواصل الصب في"],
    ["CONSTRUCTION JOINT / WATER STOP LOCATION", "موقع فاصل الصب وشريط منع التسرب (الووتر ستوب)"],
    ["CONSTRUCTION JOINT", "فاصل صب"],
    ["ISOLATION JOINT", "فاصل عزل / هبوط"],
    ["EXPANSION JOINT", "فاصل تمدد"],
    ["CHEMICAL RESISTANCE PVC WATER STOP", "شريط ووتر ستوب PVC مقاوم للكيماويات"],
    ["HYDROTITE WATER STOP", "شريط ووتر ستوب منتفخ (هيدروتايت)"],
    ["WATER STOP", "شريط مانع تسرب المياه (ووتر ستوب)"],
    ["WATER STOPS", "أشرطة منع تسرب المياه (الووتر ستوب)"],
    ["CENTRALLY PLACED AT ALL JOINTS", "يُثبّت في منتصف السُمك بجميع الفواصل"],
    ["FUSION BONDED EPOXY COATED", "مطلي بالإيبوكسي (مقاوم للصدأ)"],
    ["NON-SHRINK GROUT", "مونة جراوت غير قابلة للانكماش"],
    ["LEAN CONCRETE", "خرسانة عادية (فرشة نظافة)"],
    ["STRUCTURAL CONCRETE", "خرسانة مسلحة إنشائية"],
    ["CYLINDER STRENGTH", "مقاومة الكسر للأسطوانة"],
    ["HOT DIP GALVANIZED", "مجلفن على الساخن"],
    ["STRUCTURAL AND EMBEDDED STEEL", "الحديد الإنشائي والأجزاء المعدنية المدفونة"],
    ["INTERIOR TANK COATING", "دهان العزل الداخلي للخزان"],
    ["INTERIOR PUMP ROOM", "الدهان الداخلي لغرفة المضخات"],
    ["UNDER GROUND", "تحت منسوب الأرض (عزل الأساسات)"],
    ["PUDDLE PLATE", "فلانشة مانعة للتسرب"],
    ["NEOPRENE RUBBER", "شريط مطاط نيوبرين"],
    ["NEOPRENE PAD", "وسادة مطاط نيوبرين"],
    ["WIDE ROLL", "رول بعرض"],
    ["PIPE SLEEVES MATERIAL", "توريد خامات جرابات المواسير"],
    ["PIPE SLEEVES", "جرابات المواسير"],
    ["PIPE SLEEVE", "جراب ماسورة"],
    ["PIPING SCOPE", "نطاق أعمال المواسير (الميكانيكا)"],
    ["CIVIL SCOPE", "نطاق أعمال المدني"],
    ["INSTALLATION OF THESE SLEEVES", "تركيب هذه الجرابات"],
    ["LADDER & SAFETY CAGE DETAILS", "تفاصيل السلم البحاري وقفص الحماية"],
    ["HANDRAIL DETAIL", "تفصيلة الدرابزين"],
    ["STAIR DETAIL", "تفصيلة السلم"],
    ["ABBREVIATION & SYMBOLS", "الاختصارات والرموز الهندسية"],
    ["SEE DETAIL", "انظر تفصيلة"],
    ["SEE DWG. NO.", "انظر لوحة رقم"],
    ["SEE DWG NO.", "انظر لوحة رقم"],
    ["UNLESS NOTED OTHERWISE", "ما لم يُذكر خلاف ذلك"],
    ["OR EQUIVALENT", "أو ما يعادله معتمداً"],
    ["TO AVOID CLASH WITH", "لتفادي التعارض مع"],
    ["AT SITE", "بالموقع"],
    ["AT 28 DAYS", "بعد 28 يوم"],
    ["PUMP ROOM", "غرفة المضخات"],
    ["CONCRETE WALL", "حائط خرساني"],
    ["PIPE WALL", "جدار الماسورة"],
    ["BASE SLAB", "اللبشة المسلحة"],
    ["SUMP PIT", "بيارة التجميع"],
    ["FOR PIPE ND", "للماسورة قطر اسمي"],
    ["EA-COLUMN", "عمود خرساني - العدد "],
    ["THK.", "سُمك"],
    ["THK", "سُمك"],
    ["T.O.C EL.", "منسوب ظهر الخرسانة"],
    ["T.O.C", "منسوب ظهر الخرسانة"],
    ["B.O.C", "منسوب أسفل الخرسانة"],
    ["C.O.P EL.", "منسوب محور الماسورة"],
    ["B.O.P", "منسوب أسفل الماسورة"],
    ["T.O.G", "منسوب ظهر الجراوت"],
    ["T.O.GR", "منسوب ظهر الجريتينج"],
    ["H.W.L", "أعلى منسوب مياه"],
    ["G.L", "منسوب الأرض"],
    ["KEY PLAN", "مخطط الموقع العام"],
    ["MEMBER LIST", "جدول العناصر الإنشائية"],
    ["REFERENCE DRAWINGS", "اللوحات المرجعية"],
    ["ABBREVIATIONS", "الاختصارات الهندسية"],
    ["PEDESTAL", "رقبة عمود / قاعدة"],
    ["SLEEPER", "مخدة مواسير"],
    ["CONC. GIRDER", "كمرة رئيسية"],
    ["CONC. WALL", "حائط خرساني"],
    ["CONC. COLUMN", "عمود خرساني"],
    ["SCREED", "طبقة ميول / تسوية"],
    ["FOOTING", "القاعدة الخرسانية"],
    ["SOIL BELOW & ADJACENT TO", "التربة أسفل وبجوار"],
    ["SHALL BE COMPACTED TO AT LEAST", "تُدمك بنسبة لا تقل عن"],
    ["SHALL BE PROVIDED WITH", "يجب تزويدها بـ"],
    ["SHALL BE SUPPLIED BY", "يتم توريدها بمعرفة"],
    ["SHALL SHOW NO SIGNIFICANT CHANGE IN PROPERTY AT TEMPERATURES UP TO", "يجب ألا يتأثر خواصها حتى درجة حرارة"]
  ];

  // 3. تصحيح الترجمات الحرفية السيئة لو مر النص على ترجمة جوجل
  const POST_FIX_RULES = [
    [/المياه المؤثرة/g, "المياه الواردة (الخام)"],
    [/التأثير خارج\s*خزان\s*المواصفات/g, "خزان المياه غير المطابقة للمواصفات"],
    [/التأثير خارج المواصفات/g, "المياه غير المطابقة للمواصفات"],
    [/خزان خارج المواصفات/g, "خزان المياه غير المطابقة للمواصفات"],
    [/المتدفق/g, "الواردة (الخام)"],
    [/خطة الترتيبات العامة/g, "المسقط الأفقي العام"],
    [/خطة الترتيب العام/g, "المسقط الأفقي العام"],
    [/الخطة الرئيسية/g, "مخطط الموقع العام"],
    [/للتقدم/g, "للتجهيز المسبق للحديد"],
    [/الخرسانة العجاف|الخرسانة الهزيلة|خرسانة رقيقة/g, "خرسانة عادية (فرشة نظافة)"],
    [/قاعدة التمثال|الركيزة التمثالية/g, "رقبة عمود / قاعدة خرسانية"],
    [/النائم|عوارض النوم/g, "مخدة مواسير (عارضة ارتكاز)"],
    [/لوحة البركة|طبق البركة/g, "فلانشة مانعة للتسرب (بادل بليت)"],
    [/توقف المياه|توقف الماء|موقف المياه/g, "شريط مانع تسرب (ووتر ستوب)"],
    [/كم الأنابيب|أكمام الأنابيب|الأكمام/g, "جراب / جلبة ماسورة"],
    [/حفرة الحوض|حوض الحوض/g, "بيارة التجميع"],
    [/مفاصل البناء|وصلة البناء/g, "فواصل الصب"],
    [/مفصل العزل|وصلة العزل/g, "فاصل عزل / هبوط"],
    [/مفصل التمدد/g, "فاصل تمدد"],
    [/حديد التسليح العلوي والسفلي فقط/g, "الشبكة العلوية والسفلية فقط"],
    [/لوح القاعدة|بلاطة القاعدة/g, "اللبشة المسلحة"],
    [/الصلب الهيكلي والمدمج/g, "الحديد الإنشائي والأجزاء المعدنية المدفونة"],
    [/مغموس على الساخن مجلفن|المجلفن بالغمس الساخن/g, "مجلفن على الساخن"],
    [/كثافة بروكتور المعدلة القصوى/g, "أقصى كثافة لاختبار بروكتور المعدل"],
    [/نطاق الأنابيب/g, "نطاق أعمال المواسير"],
    [/النطاق المدني/g, "نطاق أعمال المدني"],
    [/نموذجية|عادي(?=\))/g, "نموذجي"],
    [/المترجم الهندسي/g, "المترجم الهندسي"]
  ];

  // تطبيع النص للمقارنة الدقيقة
  function normalizeKey(str) {
    return str
      .replace(/\s+/g, " ")
      .replace(/[‐‑‒–—]/g, "-")
      .trim()
      .toUpperCase();
  }

  // تجهيز خريطة التطابق الكامل بصيغة UpperCase
  const EXACT_MAP = new Map();
  for (const [k, v] of Object.entries(EXACT_PHRASES)) {
    EXACT_MAP.set(normalizeKey(k), v);
  }

  // ترتيب الاستبدالات الجزئية من الأطول للأقصر لضمان أولوية العبارات المركبة
  const SORTED_PHRASES = [...PHRASE_REPLACEMENTS].sort(
    (a, b) => b[0].length - a[0].length
  );

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * محاولة الترجمة المباشرة من القاموس الهندسي بدون الحاجة لإنترنت
   * ترجع: { text: string, fullyTranslated: boolean }
   */
  function lookupLocal(rawText) {
    const clean = rawText.replace(/\s+/g, " ").trim();
    if (!clean) return { text: "", fullyTranslated: true };

    const norm = normalizeKey(clean);

    // 1) فحص التطابق التام مباشرة
    if (EXACT_MAP.has(norm)) {
      return { text: EXACT_MAP.get(norm), fullyTranslated: true };
    }

    // 2) أنماط متكررة في جداول المقاسات (مثل: 1000 THK. أو 22EA-COLUMN)
    const thkMatch = clean.match(/^(\d+(?:\.\d+)?)\s*(MM\s*)?THK\.?$/i);
    if (thkMatch) {
      return { text: `سُمك ${thkMatch[1]} مم`, fullyTranslated: true };
    }

    const eaColMatch = clean.match(/^(\d+)\s*EA[-\s]*COLUMN\s*(\([^)]+\))?$/i);
    if (eaColMatch) {
      const dims = eaColMatch[2] ? ` ${eaColMatch[2]}` : "";
      return { text: `عدد ${eaColMatch[1]} عمود خرساني${dims}`, fullyTranslated: true };
    }

    const tocElMatch = clean.match(/^(T\.O\.C|B\.O\.C|T\.O\.G|C\.O\.P|B\.O\.P)\s*EL\.?\s*([+-]?\d+(?:\.\d+)?)$/i);
    if (tocElMatch) {
      const code = tocElMatch[1].toUpperCase();
      const mapLabel = {
        "T.O.C": "منسوب ظهر الخرسانة",
        "B.O.C": "منسوب أسفل الخرسانة",
        "T.O.G": "منسوب ظهر الجراوت",
        "C.O.P": "منسوب محور الماسورة",
        "B.O.P": "منسوب أسفل الماسورة"
      };
      return { text: `${mapLabel[code]} ${tocElMatch[2]}`, fullyTranslated: true };
    }

    // 3) استبدال العبارات الهندسية المعروفة داخل الجملة
    let working = clean;
    for (const [en, ar] of SORTED_PHRASES) {
      const re = new RegExp(`(?<![A-Za-z0-9])${escapeRegex(en)}(?![A-Za-z0-9])`, "gi");
      working = working.replace(re, ar);
    }

    // هل تبقى كلمات إنجليزية حقيقية غير الأكواد والوحدات؟
    const strippedCodes = working
      .replace(/\b(?:ASTM|AISI|API|BS|ISO|ACI|DIN|APCS|PVC|MPa|kPa|mm|cm|m|kg|EL|ND|ID|OD|WT|SH|PW|CW|WAT|SL|ZWTF\d*)[A-Za-z0-9\-/.]*\b/gi, "")
      .replace(/\b[A-Z]{1,4}[-_]?\d+[A-Z0-9\-/]*\b/g, "");

    const hasRemainingEnglish = /[a-zA-Z]{3,}/.test(strippedCodes);
    return {
      text: working.replace(/\s+/g, " ").trim(),
      fullyTranslated: !hasRemainingEnglish
    };
  }

  /**
   * حماية الأكواد الهندسية (مثل ASTM C150 و APCS-2E و WAT-201A) قبل إرسال الجملة الطويلة للترجمة
   */
  function protectTechCodes(text) {
    const tokens = [];
    const pattern =
      /\b(?:ZWTF[A-Z0-9-]+|ASTM\s*[A-Z]\d+(?:\/[A-Z]\d+[A-Z]*)?|APCS-[A-Z0-9]+|WAT-\d+[A-Z]?|SL-\d+|301-SH-\d+|EL\.?\s*[+-]?\d+(?:\.\d+)?|\d+(?:\.\d+)?\s*(?:MPa|kPa|mm|°C|%|"))\b/gi;

    const masked = text.replace(pattern, (match) => {
      const idx = tokens.length;
      tokens.push(match);
      return `[[CODE_${idx}]]`;
    });

    return { masked, tokens };
  }

  function restoreTechCodes(text, tokens) {
    let out = text;
    tokens.forEach((val, idx) => {
      const re = new RegExp(`\\[\\[\\s*CODE_?${idx}\\s*\\]\\]`, "gi");
      out = out.replace(re, val);
    });
    return out;
  }

  /**
   * تطبيق قواعد تصحيح لغة السوق بعد الترجمة الآلية
   */
  function postProcessArabic(text) {
    let result = String(text || "").trim();
    for (const [regex, replacement] of POST_FIX_RULES) {
      result = result.replace(regex, replacement);
    }
    return result.replace(/\s+/g, " ").trim();
  }

  return {
    lookupLocal,
    protectTechCodes,
    restoreTechCodes,
    postProcessArabic,
    EXACT_PHRASES,
    PHRASE_REPLACEMENTS
  };
})();

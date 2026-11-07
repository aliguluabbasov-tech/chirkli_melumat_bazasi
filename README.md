# 🏛️ Gov-AI Reyestr Auditoru: Məlumat Keyfiyyəti və Ağıllı Triage Mühərriki

## 📌 Strateji Kontekst və Problemin Qoyuluşu
Dövlət rəqəmsal xidmətlərinin (MyGov) "reaktiv" modeldən "proaktiv" modelə keçidində ən böyük texniki maneə arxa planda işləyən ilkin dövlət reyestrlərindəki məlumat kirliliyidir (uyğunsuzluqlar, dublikatlar, məntiqi xətalar). Səhv və ya natamam məlumat üzərində qurulan hər hansı rəqəmsal xidmət vətəndaş məmnuniyyətsizliyi yaradır və müraciətlərin sayını artırır. 

Bu MVP (Minimum Viable Product), İRİA-nın **"Dövlət Məlumat Hövzəsi"** yaradılması və reyestrlərin inventarlaşdırılması üzrə fəaliyyət planına birbaşa texniki cavabdır.

## ⚙️ Həll Arxitekturası və İşləmə Məntiqi
Sistem insan müdaxiləsi olmadan böyük həcmli dövlət məlumatlarını analiz edən avtonom Süni İntellekt mühərrikidir. Əsas imkanları:

* **Obyektlərin Uyğunlaşdırılması (Entity Resolution):** Müxtəlif reyestrlərdə transliterasiya xətaları ilə yazılmış (məs: *Məmmədov / Mamedov*) eyni şəxsə aid dublikat qeydlərin tapılması.
* **Qayda və Anomaliya Mühərriki:** Məntiqi ziddiyyətlərin aşkarlanması (məsələn: 14 yaşlı vətəndaşın sürücülük vəsiqəsinin aktiv olması və ya doğum tarixindən əvvəl qeyd olunan nikah tarixi).
* **Boş Sahələrin Aşkarlanması:** FİN kod və ya digər kritik identifikatorların olmadığı qeydlərin təcrid edilməsi.
* **Vizual Təqdimat (Dashboard):** Rəhbərlik üçün real vaxt rejimində məlumat kirliliyinin statistikasını göstərən idarəetmə paneli.

## 🚀 İnfrastruktur və Təhlükəsizlik
* **Texnoloji Stek:** Node.js, Vanilla JS (Maksimum sürət və minimal asılılıq üçün xarici kitabxanalardan istifadə edilməyib).
* **Məlumat Suverenliyi:** Sistem tamamilə qapalı mühitdə (On-Premise / G-Cloud) işləmək üçün dizayn edilib. Heç bir dövlət və ya vətəndaş məlumatı xarici serverlərə (API) ötürülmür.

## 📊 İRİA üçün Gözlənilən Biznes Dəyəri (ROI)
Bu mühərrikin dövlət reyestrlərinə inteqrasiyası ilə aşağıdakı ölçülə bilən nəticələr hədəflənir:
1. Aşkarlanmış məlumat uyğunsuzluqlarının **90%**-nin avtomatik təsnif edilməsi.
2. Məlumat xətaları ilə bağlı vətəndaşlardan gələn şikayətlərin **40%** azaldılması.
3. Proaktiv dövlət xidmətlərinin qurulması üçün təmiz məlumat bazasının təmin edilməsi.

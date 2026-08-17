import { Phone, MapPin, Clock, Zap, Navigation, Map } from "lucide-react";
import { useContent } from "../store/ContentContext.jsx";
import Led from "./Led.jsx";
import Brand from "./Brand.jsx";
import OpenStatus from "./OpenStatus.jsx";

/** "יש שאלות?" — call CTA, store details, opening hours, WhatsApp + footer. */
export default function VisitContact() {
    const { content } = useContent();
    const c = content.contact;

    // Build a wa.me link: strip non-digits, drop a leading 0, prepend 972 (IL).
    const waNumber = "972" + c.whatsapp.replace(/\D/g, "").replace(/^0/, "");
    const waLink = `https://wa.me/${waNumber}`;

    // Directions — one-tap navigation to the physical store.
    const q = encodeURIComponent(`${c.street} ${c.city}`);
    const wazeLink = `https://waze.com/ul?q=${q}&navigate=yes`;
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${q}`;

    return (
        <section id="visit" className="t-bg">
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                <div className="text-center mb-10 md:mb-14">
                    <div className="uppercase-mono t-green mb-3">
                        {content.ui.visitKicker}
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl mb-2">
                        {content.ui.visitTitle}
                    </h2>
                    <p className="text-base md:text-lg t-mute">
                        {content.ui.visitSubtitle}
                    </p>
                </div>

                <a
                    href={`tel:${c.phoneTel}`}
                    className="block group border-2 transition-all p-6 md:p-10 text-center t-card hover:bg-[var(--green-bg)] hover:text-[#0a0a0a]"
                    style={{ borderColor: "var(--green-bg)" }}
                >
                    <div className="uppercase-mono t-green group-hover:text-[#0a0a0a] mb-3 transition-colors flex items-center justify-center gap-2">
                        <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                        קו ישיר
                    </div>
                    <div
                        dir="ltr"
                        className="font-display text-5xl md:text-8xl lg:text-9xl t-green group-hover:text-[#0a0a0a] leading-none transition-colors"
                    >
                        {c.phone}
                    </div>
                    <div className="uppercase-mono t-mute group-hover:text-[#0a0a0a] mt-4 transition-colors opacity-70">
                        הקישו לחיוג
                    </div>
                </a>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 border-t t-rule pt-10">
                    {/* החנות */}
                    <div>
                        <div className="uppercase-mono t-green mb-3 flex items-center gap-2">
                            <MapPin className="w-3 h-3" strokeWidth={2.5} />
                            החנות
                        </div>
                        <div className="font-bold mb-1 font-heb">
                            {c.street}, {c.city}
                        </div>
                        <div className="t-mute text-sm">{c.addressHe}</div>
                        <div className="t-mute text-sm mb-4">{c.landmark}</div>

                        <div className="dir-btns">
                            <a
                                href={wazeLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dir-btn"
                            >
                                <Navigation
                                    className="w-4 h-4"
                                    strokeWidth={2.2}
                                />
                                ניווט ב-Waze
                            </a>
                            <a
                                href={mapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dir-btn"
                            >
                                <Map className="w-4 h-4" strokeWidth={2.2} />
                                Google Maps
                            </a>
                        </div>
                    </div>

                    {/* שעות פתיחה */}
                    <div>
                        <div className="uppercase-mono t-green mb-3 flex items-center gap-2">
                            <Clock className="w-3 h-3" strokeWidth={2.5} />
                            שעות פתיחה
                        </div>
                        <div className="mb-4">
                            <OpenStatus />
                        </div>
                        <div className="hours-list">
                            {content.hours.map((h) => (
                                <div key={h.days} className="hours-row">
                                    <span className="days">{h.days}</span>
                                    <span className="time">
                                        {h.time}
                                        {h.note && (
                                            <span className="note">
                                                {h.note}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* וואטסאפ */}
                    <div>
                        <div className="uppercase-mono t-green mb-3 flex items-center gap-2">
                            <Zap className="w-3 h-3" strokeWidth={2.5} />
                            {content.ui.whatsappTitle}
                        </div>
                        <div className="t-mute mb-2 text-sm">
                            {content.ui.whatsappDesc}
                        </div>
                        <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm font-bold h-green transition-colors"
                            dir="ltr"
                        >
                            {c.whatsapp}
                        </a>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t t-rule flex flex-wrap items-center justify-between gap-3 uppercase-mono t-mute">
                    <div className="flex items-center gap-3">
                        <Led px={6} />
                        <Brand size="text-base" />
                        <span>· משנת {content.brand.established}</span>
                    </div>
                    <div>{content.ui.footerNote}</div>
                </div>
            </div>
        </section>
    );
}

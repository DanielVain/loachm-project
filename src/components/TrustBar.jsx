import { TRUST, iconFor } from "../data/content.js";

/** Four trust badges shown under the hero. */
export default function TrustBar() {
    return (
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-px t-bg-2 border t-rule">
            {TRUST.map((t) => {
                const Icon = iconFor(t.icon);
                return (
                    <div
                        key={t.title}
                        className="t-bg p-4 md:p-5 flex items-start gap-3"
                    >
                        <Icon
                            className="w-[18px] h-[18px] t-green flex-shrink-0 mt-0.5"
                            strokeWidth={1.6}
                        />
                        <div>
                            <div className="font-bold text-sm md:text-base">
                                {t.title}
                            </div>
                            <div className="text-xs t-mute mt-0.5">
                                {t.desc}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

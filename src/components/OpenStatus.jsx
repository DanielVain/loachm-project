import { useEffect, useState } from "react";
import { storeStatus } from "../data/content.js";
import { useContent } from "../store/ContentContext.jsx";

/** Live "פתוח / סגור" badge, re-evaluated every 30s in Israel time. */
export default function OpenStatus({ className = "", showDetail = true }) {
    const { content } = useContent();
    const hours = content.hours;
    const [status, setStatus] = useState(() => storeStatus(hours));

    useEffect(() => {
        const tick = () => setStatus(storeStatus(hours));
        tick();
        const id = setInterval(tick, 30000);
        return () => clearInterval(id);
    }, [hours]);

    const detail = status.open
        ? status.closesLabel
            ? `· עד ${status.closesLabel}`
            : ""
        : status.opensLabel
          ? `· נפתח ${status.opensWhen} ב-${status.opensLabel}`
          : "";

    return (
        <span
            className={`open-badge ${
                status.open ? "open-badge--open" : "open-badge--closed"
            } ${className}`}
        >
            <span className="open-badge-dot" />
            {status.open ? (
                <>
                    פתוח<span className="open-badge-now">&nbsp;עכשיו</span>
                </>
            ) : (
                "סגור"
            )}
            {showDetail && detail && (
                <span className="open-badge-detail">{detail}</span>
            )}
        </span>
    );
}

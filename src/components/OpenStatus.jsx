import { useEffect, useState } from "react";
import { storeStatus } from "../data/content.js";

/** Live "פתוח עכשיו / סגור" badge, re-evaluated every 30s in Israel time. */
export default function OpenStatus({ className = "", showDetail = true }) {
    const [status, setStatus] = useState(() => storeStatus());

    useEffect(() => {
        const tick = () => setStatus(storeStatus());
        tick();
        const id = setInterval(tick, 30000);
        return () => clearInterval(id);
    }, []);

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
            {status.open ? "פתוח עכשיו" : "סגור"}
            {showDetail && detail && (
                <span className="open-badge-detail">{detail}</span>
            )}
        </span>
    );
}

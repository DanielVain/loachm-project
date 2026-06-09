/** Blinking status LED. `px` controls the diameter. */
export default function Led({ px = 6 }) {
    return <span className="led" style={{ width: px, height: px }} />;
}

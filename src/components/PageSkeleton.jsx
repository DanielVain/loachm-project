/** Full-page loading skeleton — mirrors the storefront layout while the
    content loads, so nothing pops in abruptly on a slow connection. */
export default function PageSkeleton() {
    return (
        <div aria-hidden="true">
            {/* Hero */}
            <section className="scanlines border-b t-rule">
                <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                    <div className="flex items-center justify-between mb-10">
                        <div className="sk h-4 w-40" />
                        <div className="sk h-4 w-56 hidden md:block" />
                    </div>

                    <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
                        <div className="col-span-12 md:col-span-8 flex flex-col gap-5">
                            <div className="sk h-5 w-64" />
                            <div className="sk h-24 md:h-40 w-full max-w-xl" />
                            <div className="sk h-7 w-56" />
                            <div className="sk h-5 w-full max-w-2xl" />
                            <div className="sk h-5 w-4/5 max-w-2xl" />
                        </div>
                        <div className="col-span-12 md:col-span-4">
                            <div className="sk h-48 w-full" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="sk h-16" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Board */}
            <section className="border-b t-rule">
                <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20">
                    <div className="flex items-end justify-between gap-4 mb-8">
                        <div className="flex flex-col gap-2">
                            <div className="sk h-3 w-24" />
                            <div className="sk h-9 w-40" />
                        </div>
                        <div className="sk h-11 w-56 hidden sm:block" />
                    </div>

                    <div className="flex flex-wrap gap-2.5 mb-8">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="sk h-9 w-24 rounded-full" />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="deal-skeleton" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Extras / contact */}
            <section className="t-bg">
                <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-14 md:py-20 flex flex-col gap-8">
                    <div className="sk h-8 w-56 mx-auto" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="sk h-28" />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

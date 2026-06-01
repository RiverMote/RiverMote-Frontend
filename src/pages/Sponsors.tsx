export default function Sponsors() {
    return (
        <div className="underline-links max-w-3xl mx-auto px-6 py-20">
            <div className="mb-14 text-center">
                <span className="inline-block mb-3 text-xs text-forest-400 uppercase tracking-widest"></span>
                <h1 className="text-5xl font-bold text-slate-900">Our Sponsors</h1>
                <h2 className="text-3xl text-slate-900 px-10 mt-5">
                    Contact us at{" "}
                    <b>
                        <a href="mailto:info@rivermote.org?subject='I want to be a sponsor'">info@rivermote.org</a>
                    </b>{" "}
                    to learn how to be a sponsor.
                </h2>
            </div>
            <hr />
            <div className="mb-14 text-center">
                <span className="inline-block mb-3 text-xs text-forest-400 uppercase tracking-widest"></span>
                <h1 className="text-3xl font-bold text-slate-900">Friends of River Mote</h1>
                <div className="flex flex-wrap justify-center gap-10 mt-10">
                    <img src="UR_logo.png" className="h-28 w-44 object-contain" />
                    <img src="argonne-logo.png" className="h-28 w-44 object-contain" />
                    <img src="1nce_logo.png" className="h-28 w-44 object-contain" />
                </div>
            </div>
        </div>
    );
}

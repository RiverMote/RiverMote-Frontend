export default function Adopt() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-20">
            <div className="mb-14 text-center">
                <span className="inline-block mb-3 text-xs text-forest-400 uppercase tracking-widest"></span>
                <h1 className="text-5xl font-bold text-slate-900">Adopt-a-Mote</h1>
                <h2 className="text-3xl text-slate-900 px-10">
                    Ever wanted to be part of a citizen science project but didn't know how? Now is your chance.
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
                <div>
                    <img src="UR_logo.png" width="175" height="175"></img>
                    <img src="argonne-logo.png" width="175" height="175"></img>
                </div>
            </div>
        </div>
    );
}

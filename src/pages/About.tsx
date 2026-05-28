export default function About() {
    return (
        <div className="about-page max-w-3xl mx-auto px-6 py-20">
            <div className="mb-14 text-center">
                <span className="inline-block mb-3 text-xs text-forest-400 uppercase tracking-widest"></span>
                <img src="/RM_logo.png" className="mx-auto"></img>
                <br />
                <h1 className="text-5xl font-bold text-slate-900">The River Mote Project</h1>
                <p className="mt-4 text-slate-500 text-lg leading-relaxed">
                    Tracking and monitoring conditions in the Chicago river in real-time
                </p>
            </div>

            <div className="flex flex-col gap-10">
                <section key="?" className="panel p-4">
                    <h2 className="text-2xl text-slate-600 font-semibold mb-4">The Project</h2>
                    <p className="text-slate-500 leading-relaxed">
                        River Mote is a citizen science project aimed at building a variety of inexpensive platforms for
                        collecting real-time atmospheric and water quality data at scale.
                    </p>
                </section>
            </div>

            <div className="flex flex-col gap-10">
                <section key="?" className="panel p-4">
                    <h2 className="text-2xl text-slate-600 font-semibold mb-4">What is a mote?</h2>
                    <p className="text-slate-500 leading-relaxed">
                        From IoT and ubiquitous computing the term 'mote' refers to a small device (preferably almost
                        invisible, like a dust mote) that can interact with it's physical environment.
                        <br /> For the River Mote project that means creating, building, and deploying small inexpensive
                        units that can interrogate and report on conditions both in and around the Chicago river
                        <a href="#f1">
                            <sup>1</sup>
                        </a>
                        .
                    </p>
                </section>
            </div>

            <div className="flex flex-col gap-10">
                <section key="?" className="panel p-4">
                    <h2 className="text-2xl text-slate-600 font-semibold mb-4">Why River Mote?</h2>
                    <p className="text-slate-500 leading-relaxed">
                        The planet is endowed with many natural resources, one of which is clean water, that we (humans)
                        continually abuse. Fortunately, after over a century of industry (much of it in and around the
                        river e.g. Bubbly Creek) now in this twenty-first century we are just starting to try to use our
                        technological prowess to make amends for the damages wrought before us. And one way to start
                        fixing things is through the application of science to gain insight and knowledge into the
                        environment around us (and the problems in it). Thus, given Chicago's relationship to the lake,
                        as well as its vast network of rivers and interconnected waterways, all of which have been
                        transformed over the centuries by and for man-made/commercial applications, it is an essential
                        step to understand those transformations and how they have affected and continue to affect the
                        flora, fauna, and aquatic life of our local water system(s). <br />
                        One way to do this is by carefully and constantly monitoring environmental conditions,
                        especially those that can adversely change the natural condition. Towards that end we like to
                        think of River Mote as a “knowledge platform” or in other words, as a mechanized way to gather
                        information about the well-being of the river and the waters around us to help us better manage
                        them as a resource for future generations.
                        <br />
                        We have a strong scientific philosophy that all too frequently problems are studied only once
                        they occur, while often what is lacking is knowledge of prior conditions. Thus it is the
                        ambition of River Mote to proactively gather data about <i>current</i> conditions and then share
                        that data with anyway who can help enact positive change.{" "}
                    </p>
                </section>
            </div>

            <div className="flex flex-col gap-10">
                <section key="?" className="panel p-4">
                    <h2 className="text-2xl text-slate-600 font-semibold mb-4">The Hardware</h2>
                    <p className="text-slate-500 leading-relaxed">
                        Since it's inception
                        <a href="#f2">
                            <sup>2</sup>
                        </a>{" "}
                        one of the main ambitions of River Mote is to come up with plans for an easy-to-construct device
                        which can be assembled by anyone (think schools and citizen scientists) at little cost, then
                        easily deployed anywhere environmental monitoring is needed. With both River Mote (an autonomous
                        vehicle) as well as the Mini Motes (stationary data buoys) each are constructed from common materials such
                        as PVC pipe which can be purchased from local stores and online.
                        <br />
                        With the advent of inexpensive yet increasingly accurate sensors, plus ever more powerful
                        microcontrollers to connect them to, along with the decreasing cost of cellular data, it is now
                        possible for anyone to create near-scientific-grade monitoring platforms. <br />
                        Thus by designing around inexpensive materials and electronics, and in turn being able to
                        quickly fabricate devices, it is now possible to deploy large numbers of sensors across large
                        areas, transmitting data at frequent intervals, for nearly the same cost as a single device for
                        traditional monitoring.
                    </p>
                </section>
            </div>

            <div className="flex flex-col gap-10">
                <section key="?" className="panel p-4">
                    <h2 className="text-2xl text-slate-600 font-semibold mb-4">The Software</h2>
                    <p className="text-slate-500 leading-relaxed">
                        lots of crazy software written by a genius (take a bow Myles). The code can be found here
                        [github link]
                    </p>
                </section>
            </div>

            <div className="flex flex-col gap-10">
                <section key="?" className="panel p-4">
                    <h2 className="text-2xl text-slate-600 font-semibold mb-4">The Data</h2>
                    <p className="text-slate-500 leading-relaxed">
                        River Mote supports a variety of sensors which continuously monitor both water and atmospheric
                        conditions.
                        <ul className="list-disc pl-5">
                            <li>
                                <b>Turbidity</b> - turbidity is the measure of the clarity of water, which can be
                                affected by any number of factors e.g. silt from rainwater runoff, algal blooms, human
                                pollution, etc.{" "}
                            </li>
                            <li>
                                <b>TDS</b> - Total Dissolved Solids is an electro-chemical measure of material in the
                                water. Like turbidity changes in TDS can be caused by a variety of sources and can
                                change with conditions.
                            </li>
                            <li>
                                <b>Water & air temperature</b> - readings are taken both above and below water and are
                                in standard units of Fahrenheit and Celsius.
                            </li>
                            <li>
                                <b>Ozone</b> - a greenhouse gas, which when mixed with other pollutants (car exhaust,
                                chemical leaks, etc) is harmful to human health. Measuring ozone on the river and
                                comparing it to other nearby land based ones (if there are any) might help indicate
                                whether large bodies of water can mitigate pollution.
                            </li>
                            <li>
                                <b>PM1/2.5/10</b> - particulate matter is a measure of pollution, specifically small
                                particles from combustion of fossil fuel, which can be hazardous to respiratory
                                health.{" "}
                            </li>
                            <li>
                                <b>UV</b> - ultraviolet radiation can contribute to biological activity e.g. algal
                                blooms in the water. Likewise people recreating on the river should wear sunscreen to
                                protect themselves from excessive UV.
                            </li>
                        </ul>
                        An essential part of the River Mote project is making the data we collect open and freely
                        available. So as well as the live & historical data dashboard here, our data is also free to
                        download. If you are a researcher, scientist, or other data user with questions, comments, or
                        ideas please reach out here to{" "}
                        <a href="mailto:info@rivermote.org?subject='I want data!'">talk to us</a>.
                    </p>
                </section>
            </div>

            <div className="flex flex-col gap-10">
                <section key="?" className="panel p-4">
                    <h2 className="text-2xl text-slate-600 font-semibold mb-4">Get Involved</h2>
                    <p className="text-slate-500 leading-relaxed">
                        We can be reached at <a href="mailto:info@rivermote.org">info@rivermote.org</a>
                        <br />
                        You can also read about the history of the project and get updates by subscribing to{" "}
                        <a
                            href="https://open.substack.com/pub/rivermote/p/river-mote?r=5hsy8x&utm_campaign=post-expanded-share&utm_medium=web"
                            target="_blank"
                        >
                            rivermote.substack.com
                        </a>
                    </p>
                    <p className="text-slate-500 leading-relaxed">
                        Keep an eye out for our upcoming Adopt-a-Mote program (
                        <a href="mailto:info@rivermote.org">contact us</a> to be put on the list)
                    </p>
                    <p className="text-slate-500 leading-relaxed">
                        If you are interested in building your own mote please reach out to{" "}
                        <a href="mailto:do.until.design@gmail.com">do.until.design@gmail.com</a> for our open source
                        plans.
                    </p>
                    <p className="text-slate-500 leading-relaxed">
                        River Mote is a privately funded project and{" "}
                        <a href="https://www.paypal.com/ncp/payment/RD9RWVQY7P2QW" target="_blank">
                            donations
                        </a>{" "}
                        are greatly appreciated. Likewise if you or someone you know would like to be a sponsor please
                        reach out.
                    </p>
                </section>
            </div>

            <p className="text-slate-500 leading-relaxed mt-2" id="f1">
                <sup>1</sup> While focused on the Chicago river, River Mote can technically be used in any body of water
                such as a pond, stream, or creek
                <br />
                <sup id="f2">2</sup> River Mote is a project of{" "}
                <a href="http://www.dountil.design" target="_blank">
                    doUntil() design
                </a>{" "}
                which originally began in 2019, but with the onset of COVID our ambitions were twarted until our{" "}
                <a
                    href="https://open.substack.com/pub/rivermote/p/a-launch?r=5hsy8x&utm_campaign=post-expanded-share&utm_medium=web"
                    target="_blank"
                >
                    first launch
                </a>{" "}
                in 2025. You can read more about our journey to where we are today on Substack.
            </p>
        </div>
    );
}

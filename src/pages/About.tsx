const sections = [
    {
        title: "The Project",
        body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed suscipit mauris eu augue malesuada, sit amet gravida nibh molestie. Donec a facilisis dolor. Duis iaculis ligula et lacus vehicula vestibulum. Sed vel lorem ac eros porttitor sollicitudin vehicula tincidunt justo. In hac habitasse platea dictumst. Donec vitae faucibus tellus, id accumsan enim. Etiam ultrices erat vitae orci egestas aliquet eget ut dolor. Donec interdum sapien et ligula interdum, vel volutpat massa mollis. Praesent ultrices rhoncus felis sit amet gravida. Nullam id dignissim ligula. Praesent ultricies augue in neque efficitur faucibus. Duis vestibulum condimentum dolor, ut suscipit lacus ultrices eu.",
    },
    {
        title: "The Hardware",
        body: "Morbi a arcu sapien. Aenean fringilla neque id feugiat suscipit. Phasellus sed neque id enim feugiat viverra. Donec vitae libero pharetra est elementum suscipit a ullamcorper erat. Donec vitae condimentum leo. Morbi sagittis sodales urna. Aliquam ac dapibus risus. Vestibulum facilisis sagittis nisi, sed efficitur enim viverra et. Sed vulputate diam eget tortor aliquet, sed euismod nulla commodo. Suspendisse nec libero massa. Mauris a lobortis tortor. Duis malesuada diam sed nisi posuere, vitae feugiat dolor fringilla. Sed sed neque sapien. Aenean vulputate feugiat convallis. Morbi in ligula ornare, varius elit at, condimentum orci.",
    },
    {
        title: "The Software",
        body: "Cras ac diam et quam consectetur semper. Maecenas ultricies consectetur aliquam. Phasellus nec imperdiet purus. Sed efficitur nisi vel ullamcorper tempus. Curabitur semper quis elit eget sodales. Morbi pellentesque dolor non libero consectetur, sed consectetur ipsum vestibulum. Vestibulum euismod, tortor vel pharetra iaculis, justo odio dignissim nulla, sed porttitor erat est in velit. Morbi sem ex, molestie id nisl non, iaculis vestibulum quam. Suspendisse tincidunt nec diam vitae malesuada. Nulla sed ullamcorper metus. Cras ac mattis lectus, eu malesuada leo. Ut at magna augue. Nunc gravida sapien sodales congue lacinia. Curabitur rutrum ante nibh, ac efficitur nisl tincidunt at. Nullam scelerisque enim eu ullamcorper vestibulum.",
    },
    {
        title: "Get Involved",
        body: "Aliquam ut dolor non nisi bibendum ullamcorper in sed est. In auctor, dui vel blandit facilisis, risus nibh rhoncus sapien, vel sodales purus mi vel urna. Etiam quis volutpat magna. Fusce convallis, tortor eget aliquet ultricies, ante dolor malesuada nulla, eget lobortis tortor urna dapibus neque. Pellentesque viverra velit vel ante fringilla pharetra. Donec consectetur sed massa at porta. Praesent rutrum vel ligula in condimentum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In finibus lacus eu pharetra efficitur. Sed accumsan nunc quis ultrices accumsan.",
    },
];

export default function About() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-20">
            <div className="mb-14 text-center">
                <span className="inline-block mb-3 text-xs text-forest-400 uppercase tracking-widest">About</span>
                <h1 className="text-5xl font-bold text-slate-900">The River Mote Project</h1>
                <p className="mt-4 text-slate-500 text-lg leading-relaxed">One-sentence elevator pitch goes here</p>
            </div>

            <div className="flex flex-col gap-10">
                {sections.map(s => (
                    <section key={s.title} className="panel p-4">
                        <h2 className="text-2xl text-slate-600 font-semibold mb-4">{s.title}</h2>
                        <p className="text-slate-500 leading-relaxed">{s.body}</p>
                    </section>
                ))}
            </div>
        </div>
    );
}

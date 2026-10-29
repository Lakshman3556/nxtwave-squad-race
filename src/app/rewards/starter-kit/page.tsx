import Link from "next/link";
import { Gift, Sparkles, BookOpen, ExternalLink, Code2, ArrowLeft } from "lucide-react";

export default function StarterKitPage() {
  const resources = [
    {
      title: "Interactive Google Colab AI Starter Templates",
      category: "Jupyter Notebooks",
      desc: "Pre-configured Google Colab notebooks covering Computer Vision, Text Classification, and LangChain RAG pipelines with free GPU setup.",
      link: "https://colab.research.google.com/",
    },
    {
      title: "Hugging Face Transformers 101 Guide",
      category: "Library Guide",
      desc: "Step-by-step documentation on loading open-source LLMs (Llama 3, Gemma, Mistral) locally and in web containers.",
      link: "https://huggingface.co/docs/transformers",
    },
    {
      title: "Free Vector Databases & Embeddings Cheatsheet",
      category: "Architecture",
      desc: "Architectural comparison of Pinecone, ChromaDB, and pgvector for engineering college mini-projects.",
      link: "https://github.com",
    },
    {
      title: "Resume Project Bullet Points Library",
      category: "Placement Prep",
      desc: "Curated collection of 50+ interview-tested bullet points demonstrating quantifiable impact for AI projects.",
      link: "https://github.com",
    },
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div>
        <Link
          href="/race"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Leaderboard</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tier 1 Milestone Unlocked</span>
        </div>
        <h1 className="text-3xl font-black text-white">AI Project Starter Kit</h1>
        <p className="text-sm text-slate-400 mt-1">
          Exclusive curated resources, Colab notebooks, and placement guides unlocked by bringing 3 verified classmates into your squad.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {resources.map((res, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/20">
                {res.category}
              </span>
              <h3 className="text-base font-bold text-white mt-2">{res.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{res.desc}</p>
            </div>

            <a
              href={res.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline pt-2"
            >
              <span>Access Resource</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

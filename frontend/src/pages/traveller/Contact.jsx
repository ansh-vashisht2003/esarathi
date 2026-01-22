import { useState } from "react";
import TravellerNavbar from "../components/TravellerNavbar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const traveller = JSON.parse(localStorage.getItem("traveller"));
  const travellerName = traveller?.name || "Traveller";
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      ListItem,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || editor.isEmpty) {
      alert("Subject and message are required");
      return;
    }

    setLoading(true);

    try {
      await fetch("/api/traveller/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: traveller?.name,
          email: traveller?.email,
          subject,
          message: editor.getHTML(),
        }),
      });

      editor.commands.clearContent();
      setSubject("");
      navigate("/contact-success");
    } catch {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* NAVBAR */}
      <TravellerNavbar travellerName={travellerName} />

      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-green-800 mb-6">
          Contact Us
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={traveller?.name || ""}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none"
          />

          <input
            value={traveller?.email || ""}
            readOnly
            className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none"
          />

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full px-4 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 ring-green-400"
          />

          {/* TOOLBAR */}
          <div className="flex flex-wrap gap-2 bg-green-100 p-2 rounded-lg border">
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()}>
              B
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()}>
              I
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()}>
              • List
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()}>
              Left
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()}>
              Center
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()}>
              Right
            </ToolbarButton>
          </div>

          {/* EDITOR */}
          <div className="bg-white border rounded-xl p-4 min-h-[180px] focus-within:ring-2 ring-green-400">
            <EditorContent editor={editor} />
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-medium transition ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* FAQ SECTION */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {[
              {
                q: "How do I book a ride?",
                a: "You can book a ride from your dashboard by selecting pickup and destination.",
              },
              {
                q: "How can I contact support?",
                a: "Use this contact form and our team will respond within 24 hours.",
              },
              {
                q: "Can I edit my profile details?",
                a: "Yes, you can update your profile information from the profile section.",
              },
              {
                q: "Is my data secure?",
                a: "Yes, we use secure systems to protect your personal data.",
              },
              {
                q: "Is the service free to use?",
                a: "Yes, our platform is free for travellers.",
              },
            ].map(({ q, a }) => (
              <FAQItem key={q} question={q} answer={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* TOOLBAR BUTTON */
const ToolbarButton = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-3 py-1 bg-white border rounded-md hover:bg-green-50 font-semibold text-sm transition"
  >
    {children}
  </button>
);

/* FAQ ITEM COMPONENT */
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-green-700 hover:bg-green-50 transition"
      >
        <span>{question}</span>
        <span className="text-xl font-bold">
          {open ? "−" : "+"}
        </span>
      </button>

      <div
        className={`px-5 text-gray-600 text-sm transition-all duration-300 overflow-hidden ${
          open ? "max-h-40 pb-4" : "max-h-0"
        }`}
      >
        {answer}
      </div>
    </div>
  );
};

export default Contact;

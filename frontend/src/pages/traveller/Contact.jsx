import { useState } from "react";
import TravellerNavbar from "../components/TravellerNavbar";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

const Contact = () => {
  const traveller = JSON.parse(localStorage.getItem("traveller"));

  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !editor?.getHTML()) {
      alert("Subject and message are required");
      return;
    }

    const payload = {
      name: traveller?.name,
      email: traveller?.email,
      subject,
      message: editor.getHTML(),
    };

    const res = await fetch("/api/traveller/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setStatus(data.message);
    setSubject("");
    editor.commands.clearContent();
  };

  return (
    <div style={{ background: "#f0fff6", minHeight: "100vh" }}>
      <TravellerNavbar />

      <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
        <h2>Contact Us</h2>

        <form onSubmit={handleSubmit}>
          <input
            value={traveller?.name || ""}
            readOnly
            style={inputStyle}
          />

          <input
            value={traveller?.email || ""}
            readOnly
            style={inputStyle}
          />

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            required
            style={inputStyle}
          />

          {/* TOOLBAR */}
          <div style={toolbarStyle}>
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
            <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</button>
            <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</button>
          </div>

          {/* EDITOR */}
          <div style={editorBox}>
            <EditorContent editor={editor} />
          </div>

          <button style={buttonStyle}>Send Message</button>
        </form>

        {status && <p style={{ marginTop: 10 }}>{status}</p>}

        {/* FAQs */}
        <h3 style={{ marginTop: 40 }}>FAQs</h3>

        <details>
          <summary>How do I book a ride?</summary>
          <p>Select pickup, destination, vehicle and confirm.</p>
        </details>

        <details>
          <summary>How can I contact support?</summary>
          <p>Use this contact form anytime.</p>
        </details>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const toolbarStyle = {
  display: "flex",
  gap: 8,
  marginBottom: 8,
};

const editorBox = {
  border: "1px solid #ccc",
  borderRadius: 6,
  padding: 10,
  minHeight: 150,
  marginBottom: 20,
};

const buttonStyle = {
  width: "100%",
  padding: 14,
  background: "#0a7c3a",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};

export default Contact;

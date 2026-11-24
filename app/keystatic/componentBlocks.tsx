import { component, fields } from "@keystatic/core";

/**
 * Custom blocks available in the Keystatic document editor.
 * Insert via the "+" (Insert) menu in the editor toolbar.
 */
export const componentBlocks = {
  htmlEmbed: component({
    label: "HTML Embed (iframe, video, etc.)",
    schema: {
      html: fields.text({
        label: "HTML",
        description: "Paste embed code, e.g. a YouTube/Google Maps/Spotify <iframe>. Note: <script> tags will not run.",
        multiline: true,
      }),
    },
    preview: (props) => {
      const html = props.fields.html.value;
      return (
        <div style={{ border: "1px dashed #a0856a", padding: 8, borderRadius: 4 }}>
          <div style={{ fontSize: 12, color: "#a0856a", marginBottom: 4 }}>HTML Embed</div>
          {html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <em>Click to add HTML…</em>}
        </div>
      );
    },
  }),
};

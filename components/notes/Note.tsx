import MDEditor, { commands } from "@uiw/react-md-editor";
import { useState } from "react";

export default function Note() {
    const [content, setContent] = useState<string>()
    return (
        <div className="">
            <MDEditor
					value={content}
					onChange={(value) => setContent(value || "")}
					height={400}
					commands={[
						commands.bold,
						commands.italic,
						commands.hr,
						commands.link,
						commands.code,
						commands.quote,
					]}
				/>
        </div>
    )
}

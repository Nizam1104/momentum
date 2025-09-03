"use client"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import Note from "@/components/notes/Note"

import { Day } from "@/types/states"

export default function DayComponent({ day }: { day: Day | null }) {
	return (
		<div className="w-full h-auto">
			<Accordion
				type="single"
				collapsible
				className="w-full"
				defaultValue="item-1"
			>
				<AccordionItem value="item-1">
				<AccordionTrigger>Date</AccordionTrigger>
				<AccordionContent>
				<div className="w-full h-auto flex justify-center items-center">
					<div className="w-full">
						<div className="max-w-xl">
						<Note />
						</div>
					</div>
				</div>
				</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
}

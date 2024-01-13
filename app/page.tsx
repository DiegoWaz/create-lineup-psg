import { title, subtitle } from "@/components/primitives";
import Formation from "@/components/formation";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4">
			<h1 className={title()}>{'Ma compo d\'équipe'}</h1>
			<br />
			<Formation />
		</section>
	);
}

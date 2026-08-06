import { ProjectForm, ProjectFormHeading } from "@/components/admin/project-form";
import { prisma } from "@/lib/prisma";

export default async function NewProjectPage() {
	const technologyCategories = await prisma.technologyCategory.findMany({
		orderBy: [{ sortOrder: "asc" }, { namePt: "asc" }],
		select: {
			id: true,
			namePt: true,
			nameEn: true,
			visible: true,
			technologies: {
				orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
				select: { id: true, name: true, slug: true, color: true, visible: true },
			},
		},
	});

	return (
		<div>
			<ProjectFormHeading editing={false} />
			<ProjectForm
				technologyCategories={technologyCategories}
				values={{
					slug: "",
					status: "DRAFT",
					featured: false,
					sortOrder: 0,
					repositoryUrl: "",
					demoUrl: "",
					startedAt: "",
					finishedAt: "",
					titlePt: "",
					summaryPt: "",
					problemPt: "",
					solutionPt: "",
					responsibilitiesPt: "",
					technicalChoicesPt: "",
					resultsPt: "",
					titleEn: "",
					summaryEn: "",
					problemEn: "",
					solutionEn: "",
					responsibilitiesEn: "",
					technicalChoicesEn: "",
					resultsEn: "",
					technologyIds: []
				}} />
		</div>
	);
}
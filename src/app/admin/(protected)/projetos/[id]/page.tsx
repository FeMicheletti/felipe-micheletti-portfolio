import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { ProjectFormValues } from "@/lib/projects/project-form";
import { ProjectForm, ProjectFormHeading } from "@/components/admin/project-form";

function dateInputValue(date: Date | null) {
	return date?.toISOString().slice(0, 10) ?? "";
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }>; }) {
	const { id } = await params;
	const [project, technologyCategories] = await Promise.all([
		prisma.project.findUnique({
			where: { id },
			include: {
				translations: true,
				technologies: {
					orderBy: { sortOrder: "asc" },
					select: { technologyId: true },
				},
			},
		}),
		prisma.technologyCategory.findMany({
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
		}),
	]);

	if (!project) notFound();

	const pt = project.translations.find((translation) => translation.locale === "PT_BR");
	const en = project.translations.find((translation) => translation.locale === "EN_US");

	const values: ProjectFormValues = {
		id: project.id,
		slug: project.slug,
		status: project.status,
		featured: project.featured,
		sortOrder: project.sortOrder,
		repositoryUrl: project.repositoryUrl ?? "",
		demoUrl: project.demoUrl ?? "",
		startedAt: dateInputValue(project.startedAt),
		finishedAt: dateInputValue(project.finishedAt),
		titlePt: pt?.title ?? "",
		summaryPt: pt?.summary ?? "",
		problemPt: pt?.problem ?? "",
		solutionPt: pt?.solution ?? "",
		responsibilitiesPt: pt?.responsibilities ?? "",
		technicalChoicesPt: pt?.technicalChoices ?? "",
		resultsPt: pt?.results ?? "",
		titleEn: en?.title ?? "",
		summaryEn: en?.summary ?? "",
		problemEn: en?.problem ?? "",
		solutionEn: en?.solution ?? "",
		responsibilitiesEn: en?.responsibilities ?? "",
		technicalChoicesEn: en?.technicalChoices ?? "",
		resultsEn: en?.results ?? "",
		technologyIds: project.technologies.map(({ technologyId }) => technologyId),
	};

	return (
		<div>
			<ProjectFormHeading editing />
			<ProjectForm values={values} technologyCategories={technologyCategories} />
		</div>
	);
}
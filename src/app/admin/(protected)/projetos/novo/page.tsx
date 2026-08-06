import { ProjectForm, ProjectFormHeading } from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <ProjectFormHeading editing={false} />
      <ProjectForm
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
        }}
      />
    </div>
  );
}

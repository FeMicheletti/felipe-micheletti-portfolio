"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import {
  projectFormSchema,
  type ProjectFormState,
} from "@/lib/projects/project-form";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function optionalValue(input: string) {
  return input || null;
}

function optionalDate(input: string) {
  return input ? new Date(`${input}T00:00:00.000Z`) : null;
}

function parseProjectForm(formData: FormData) {
  return projectFormSchema.safeParse({
    slug: value(formData, "slug"),
    status: value(formData, "status"),
    featured: formData.get("featured") === "on",
    sortOrder: value(formData, "sortOrder"),
    repositoryUrl: value(formData, "repositoryUrl"),
    demoUrl: value(formData, "demoUrl"),
    startedAt: value(formData, "startedAt"),
    finishedAt: value(formData, "finishedAt"),
    titlePt: value(formData, "titlePt"),
    summaryPt: value(formData, "summaryPt"),
    problemPt: value(formData, "problemPt"),
    solutionPt: value(formData, "solutionPt"),
    responsibilitiesPt: value(formData, "responsibilitiesPt"),
    technicalChoicesPt: value(formData, "technicalChoicesPt"),
    resultsPt: value(formData, "resultsPt"),
    titleEn: value(formData, "titleEn"),
    summaryEn: value(formData, "summaryEn"),
    problemEn: value(formData, "problemEn"),
    solutionEn: value(formData, "solutionEn"),
    responsibilitiesEn: value(formData, "responsibilitiesEn"),
    technicalChoicesEn: value(formData, "technicalChoicesEn"),
    resultsEn: value(formData, "resultsEn"),
  });
}

function translation(
  data: ReturnType<typeof projectFormSchema.parse>,
  locale: "PT_BR" | "EN_US",
) {
  const suffix = locale === "PT_BR" ? "Pt" : "En";

  return {
    locale,
    title: data[`title${suffix}`],
    summary: data[`summary${suffix}`],
    problem: optionalValue(data[`problem${suffix}`]),
    solution: optionalValue(data[`solution${suffix}`]),
    responsibilities: optionalValue(data[`responsibilities${suffix}`]),
    technicalChoices: optionalValue(data[`technicalChoices${suffix}`]),
    results: optionalValue(data[`results${suffix}`]),
  };
}

export async function createProjectAction(
  _state: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const result = parseProjectForm(formData);

  if (!result.success) {
    return {
      error: "Revise os campos destacados antes de salvar.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const existingProject = await prisma.project.findUnique({
    where: { slug: result.data.slug },
    select: { id: true },
  });

  if (existingProject) {
    return {
      error: "Já existe um projeto com esse slug.",
      fieldErrors: { slug: ["Escolha outro slug."] },
    };
  }

  const project = await prisma.project.create({
    data: {
      slug: result.data.slug,
      status: result.data.status,
      featured: result.data.status !== "ARCHIVED" && result.data.featured,
      sortOrder: result.data.sortOrder,
      repositoryUrl: optionalValue(result.data.repositoryUrl),
      demoUrl: optionalValue(result.data.demoUrl),
      startedAt: optionalDate(result.data.startedAt),
      finishedAt: optionalDate(result.data.finishedAt),
      publishedAt: result.data.status === "PUBLISHED" ? new Date() : null,
      translations: {
        create: [
          translation(result.data, "PT_BR"),
          translation(result.data, "EN_US"),
        ],
      },
    },
    select: { id: true },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projetos");
  redirect(`/admin/projetos/${project.id}`);
}

export async function updateProjectAction(
  projectId: string,
  _state: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const result = parseProjectForm(formData);

  if (!result.success) {
    return {
      error: "Revise os campos destacados antes de salvar.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const [project, conflictingSlug] = await Promise.all([
    prisma.project.findUnique({
      where: { id: projectId },
      select: { status: true, publishedAt: true },
    }),
    prisma.project.findFirst({
      where: { slug: result.data.slug, id: { not: projectId } },
      select: { id: true },
    }),
  ]);

  if (!project) {
    return { error: "Projeto não encontrado." };
  }

  if (conflictingSlug) {
    return {
      error: "Já existe um projeto com esse slug.",
      fieldErrors: { slug: ["Escolha outro slug."] },
    };
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      slug: result.data.slug,
      status: result.data.status,
      featured: result.data.status !== "ARCHIVED" && result.data.featured,
      sortOrder: result.data.sortOrder,
      repositoryUrl: optionalValue(result.data.repositoryUrl),
      demoUrl: optionalValue(result.data.demoUrl),
      startedAt: optionalDate(result.data.startedAt),
      finishedAt: optionalDate(result.data.finishedAt),
      publishedAt:
        result.data.status === "PUBLISHED"
          ? (project.publishedAt ?? new Date())
          : project.publishedAt,
      translations: {
        upsert: ["PT_BR", "EN_US"].map((locale) => {
          const content = translation(result.data, locale as "PT_BR" | "EN_US");
          return {
            where: { projectId_locale: { projectId, locale: content.locale } },
            create: content,
            update: content,
          };
        }),
      },
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projetos");
  revalidatePath(`/admin/projetos/${projectId}`);
  redirect("/admin/projetos");
}

export async function archiveProjectAction(projectId: string) {
  await requireAdmin();
  await prisma.project.update({
    where: { id: projectId },
    data: { status: "ARCHIVED", featured: false },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projetos");
}

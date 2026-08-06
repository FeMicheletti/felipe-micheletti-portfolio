import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  ContactRound,
  GitBranch,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const copy = {
  PT_BR: {
    navigation: { projects: "Projetos", stacks: "Stacks", contact: "Contato" },
    available: "Disponível para novas oportunidades",
    heroTitle:
      "Desenvolvedor Full-Stack criando produtos digitais que resolvem problemas reais.",
    heroSubtitle:
      "Atuo do planejamento à produção, construindo experiências web, APIs e plataformas escaláveis com foco em qualidade e resultado.",
    viewProjects: "Ver projetos",
    contactMe: "Entrar em contato",
    years: "anos de experiência",
    projects: "projetos publicados",
    technologies: "tecnologias",
    projectsEyebrow: "Trabalho selecionado",
    projectsTitle: "Projetos que transformam ideias em produto",
    projectsDescription:
      "Cases reais, decisões técnicas e resultados construídos em diferentes contextos de negócio.",
    featured: "Destaque",
    viewDemo: "Ver projeto",
    viewCode: "Código",
    noProjects: "Os primeiros cases serão publicados em breve.",
    stacksEyebrow: "Tecnologias",
    stacksTitle: "Ferramentas escolhidas para cada desafio",
    stacksDescription:
      "Uma base multidisciplinar para trabalhar entre produto, frontend, backend, mobile, dados e infraestrutura.",
    contactEyebrow: "Vamos conversar",
    contactTitle: "Tem um desafio interessante em mente?",
    contactDescription:
      "Estou aberto a oportunidades internacionais, projetos de software e conversas sobre tecnologia.",
    location: "Rio de Janeiro, Brasil",
    sendEmail: "Enviar e-mail",
    footer:
      "Desenvolvido com Next.js, TypeScript e muita atenção aos detalhes.",
  },
  EN_US: {
    navigation: { projects: "Projects", stacks: "Stack", contact: "Contact" },
    available: "Available for new opportunities",
    heroTitle:
      "Full-Stack Developer building digital products that solve real problems.",
    heroSubtitle:
      "I work from planning to production, building web experiences, APIs and scalable platforms with a focus on quality and results.",
    viewProjects: "View projects",
    contactMe: "Get in touch",
    years: "years of experience",
    projects: "published projects",
    technologies: "technologies",
    projectsEyebrow: "Selected work",
    projectsTitle: "Projects that turn ideas into products",
    projectsDescription:
      "Real cases, technical decisions and results built across different business contexts.",
    featured: "Featured",
    viewDemo: "View project",
    viewCode: "Code",
    noProjects: "The first case studies will be published soon.",
    stacksEyebrow: "Technologies",
    stacksTitle: "Tools chosen for each challenge",
    stacksDescription:
      "A multidisciplinary foundation for working across product, frontend, backend, mobile, data and infrastructure.",
    contactEyebrow: "Let's talk",
    contactTitle: "Have an interesting challenge in mind?",
    contactDescription:
      "I am open to international opportunities, software projects and conversations about technology.",
    location: "Rio de Janeiro, Brazil",
    sendEmail: "Send an email",
    footer: "Built with Next.js, TypeScript and close attention to detail.",
  },
} as const;

type PublicLocale = keyof typeof copy;

function externalLinkProps() {
  return { target: "_blank", rel: "noreferrer" } as const;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale: PublicLocale = lang === "en" ? "EN_US" : "PT_BR";
  const languageQuery = locale === "EN_US" ? "?lang=en" : "";
  const content = copy[locale];

  const [
    settings,
    projects,
    categories,
    publishedProjects,
    visibleTechnologies,
  ] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "main" } }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [
        { featured: "desc" },
        { sortOrder: "asc" },
        { publishedAt: "desc" },
      ],
      take: 6,
      select: {
        id: true,
        slug: true,
        featured: true,
        repositoryUrl: true,
        demoUrl: true,
        translations: {
          where: { locale },
          take: 1,
          select: { title: true, summary: true },
        },
        technologies: {
          where: { technology: { visible: true, category: { visible: true } } },
          orderBy: { sortOrder: "asc" },
          take: 5,
          select: {
            technology: { select: { id: true, name: true, color: true } },
          },
        },
        media: {
          where: { role: "COVER" },
          take: 1,
          select: { mediaId: true, altPt: true, altEn: true },
        },
      },
    }),
    prisma.technologyCategory.findMany({
      where: { visible: true, technologies: { some: { visible: true } } },
      orderBy: [{ sortOrder: "asc" }, { namePt: "asc" }],
      select: {
        id: true,
        namePt: true,
        nameEn: true,
        technologies: {
          where: { visible: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: { id: true, name: true, color: true },
        },
      },
    }),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.technology.count({
      where: { visible: true, category: { visible: true } },
    }),
  ]);

  const heroTitle =
    (locale === "PT_BR" ? settings?.heroTitlePt : settings?.heroTitleEn) ||
    content.heroTitle;
  const heroSubtitle =
    (locale === "PT_BR"
      ? settings?.heroSubtitlePt
      : settings?.heroSubtitleEn) || content.heroSubtitle;
  const availability =
    (locale === "PT_BR"
      ? settings?.availabilityPt
      : settings?.availabilityEn) || content.available;
  const contactEmail =
    settings?.contactEmail || "felipemicheletti.dev@gmail.com";
  const githubUrl = settings?.githubUrl || "https://github.com/FeMicheletti";
  const linkedinUrl =
    settings?.linkedinUrl || "https://www.linkedin.com/in/felipe-micheletti";

  return (
    <div className="dark min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-100 selection:bg-violet-500/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(109,40,217,0.16),transparent_32%),radial-gradient(circle_at_85%_30%,rgba(79,70,229,0.1),transparent_25%)]" />

      <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${languageQuery}`}
            className="flex items-center gap-3 font-semibold tracking-tight"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-950/50">
              <Code2 className="size-5" />
            </span>
            <span className="hidden sm:inline">Felipe Micheletti</span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
            <a href="#projects" className="transition-colors hover:text-white">
              {content.navigation.projects}
            </a>
            <a href="#stacks" className="transition-colors hover:text-white">
              {content.navigation.stacks}
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              {content.navigation.contact}
            </a>
          </nav>

          <div className="flex items-center rounded-full border border-white/10 bg-white/3 p-1 text-xs font-medium">
            <Link
              href="/"
              className={
                locale === "PT_BR"
                  ? "rounded-full bg-violet-600 px-3 py-1.5 text-white"
                  : "px-3 py-1.5 text-zinc-500 hover:text-white"
              }
            >
              PT
            </Link>
            <Link
              href="/?lang=en"
              className={
                locale === "EN_US"
                  ? "rounded-full bg-violet-600 px-3 py-1.5 text-white"
                  : "px-3 py-1.5 text-zinc-500 hover:text-white"
              }
            >
              EN
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] lg:px-8 lg:py-28">
          <div>
            {settings?.availableForWork !== false ? (
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1.5 text-xs font-medium text-emerald-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                {availability}
              </div>
            ) : null}

            <p className="mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-violet-300">
              <Sparkles className="size-4" />
              Senior Full-Stack Developer
            </p>
            <h1 className="max-w-4xl text-4xl leading-[1.08] font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
              {heroSubtitle}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-violet-600 px-5 text-white shadow-xl shadow-violet-950/40 hover:bg-violet-500"
              >
                <a href="#projects">
                  {content.viewProjects}
                  <ArrowDown />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/10 bg-white/3 px-5 text-zinc-200 hover:bg-white/8 hover:text-white"
              >
                <a href={`mailto:${contactEmail}`}>
                  {content.contactMe}
                  <Mail />
                </a>
              </Button>
            </div>

            <div className="mt-9 flex items-center gap-2">
              {[
                { label: "GitHub", href: githubUrl, icon: GitBranch },
                { label: "LinkedIn", href: linkedinUrl, icon: ContactRound },
                { label: "E-mail", href: `mailto:${contactEmail}`, icon: Mail },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  {...(href.startsWith("http") ? externalLinkProps() : {})}
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/8 bg-white/3 text-zinc-500 transition hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
            <div className="absolute -inset-8 rounded-full bg-violet-600/12 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-violet-500/12 via-zinc-900/90 to-zinc-950 p-7 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/8 pb-5">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="font-mono text-[10px] tracking-wider text-zinc-600">
                  portfolio.ts
                </span>
              </div>
              <div className="space-y-4 py-7 font-mono text-sm leading-7">
                <p>
                  <span className="text-violet-400">const</span>{" "}
                  <span className="text-sky-300">developer</span>{" "}
                  <span className="text-zinc-500">=</span>{" "}
                  <span className="text-zinc-400">&#123;</span>
                </p>
                <p className="pl-5">
                  <span className="text-zinc-500">name:</span>{" "}
                  <span className="text-emerald-300">&quot;Felipe&quot;</span>,
                </p>
                <p className="pl-5">
                  <span className="text-zinc-500">focus:</span>{" "}
                  <span className="text-emerald-300">&quot;Impact&quot;</span>,
                </p>
                <p className="pl-5">
                  <span className="text-zinc-500">location:</span>{" "}
                  <span className="text-emerald-300">&quot;Brazil&quot;</span>,
                </p>
                <p className="pl-5">
                  <span className="text-zinc-500">next:</span>{" "}
                  <span className="text-emerald-300">&quot;Japan&quot;</span>,
                </p>
                <p>
                  <span className="text-zinc-400">&#125;</span>;
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 border-t border-white/8 pt-5 text-center">
                {[
                  {
                    value: `${new Date().getFullYear() - 2020}+`,
                    label: content.years,
                  },
                  { value: publishedProjects, label: content.projects },
                  {
                    value: `${visibleTechnologies}+`,
                    label: content.technologies,
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xl font-semibold text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-zinc-600">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="projects"
          className="scroll-mt-20 border-y border-white/5 bg-zinc-900/30 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={content.projectsEyebrow}
              title={content.projectsTitle}
              description={content.projectsDescription}
            />

            {projects.length ? (
              <div className="mt-12 grid gap-5 lg:grid-cols-2">
                {projects.map((project, index) => {
                  const translation = project.translations[0];
                  const cover = project.media[0];
                  return (
                    <article
                      key={project.id}
                      className="group overflow-hidden rounded-2xl border border-white/8 bg-zinc-950/60 transition duration-300 hover:-translate-y-1 hover:border-violet-500/25 hover:shadow-2xl hover:shadow-violet-950/20"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/5 bg-linear-to-br from-violet-900/30 to-zinc-900">
                        {cover ? (
                          <Image
                            src={`/api/media/${cover.mediaId}`}
                            alt={
                              (locale === "PT_BR"
                                ? cover.altPt
                                : cover.altEn) ||
                              translation?.title ||
                              project.slug
                            }
                            fill
                            unoptimized
                            loading={index < 2 ? "eager" : "lazy"}
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BriefcaseBusiness className="size-10 text-violet-400/35" />
                          </div>
                        )}
                        {project.featured ? (
                          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-violet-400/20 bg-zinc-950/80 px-3 py-1 text-xs font-medium text-violet-200 backdrop-blur">
                            <Sparkles className="size-3" />
                            {content.featured}
                          </span>
                        ) : null}
                      </div>
                      <div className="p-6 sm:p-7">
                        <h3 className="text-xl font-semibold tracking-tight text-white">
                          {translation?.title || project.slug}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                          {translation?.summary}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {project.technologies.map(({ technology }) => (
                            <span
                              key={technology.id}
                              className="rounded-full border border-white/8 bg-white/3 px-2.5 py-1 text-[11px] text-zinc-400"
                              style={
                                technology.color
                                  ? { borderColor: `${technology.color}35` }
                                  : undefined
                              }
                            >
                              {technology.name}
                            </span>
                          ))}
                        </div>
                        {project.demoUrl || project.repositoryUrl ? (
                          <div className="mt-6 flex flex-wrap gap-3">
                            {project.demoUrl ? (
                              <a
                                href={project.demoUrl}
                                {...externalLinkProps()}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 hover:text-violet-200"
                              >
                                {content.viewDemo}
                                <ArrowUpRight className="size-4" />
                              </a>
                            ) : null}
                            {project.repositoryUrl ? (
                              <a
                                href={project.repositoryUrl}
                                {...externalLinkProps()}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white"
                              >
                                <GitBranch className="size-4" />
                                {content.viewCode}
                              </a>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-12 rounded-2xl border border-dashed border-violet-500/20 bg-violet-500/3 px-6 py-14 text-center text-sm text-zinc-500">
                {content.noProjects}
              </div>
            )}
          </div>
        </section>

        <section id="stacks" className="scroll-mt-20 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={content.stacksEyebrow}
              title={content.stacksTitle}
              description={content.stacksDescription}
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-white/8 bg-white/2.5 p-6 transition hover:border-violet-500/20 hover:bg-violet-500/4"
                >
                  <h3 className="flex items-center gap-2 font-medium text-white">
                    <Code2 className="size-4 text-violet-300" />
                    {locale === "PT_BR" ? category.namePt : category.nameEn}
                  </h3>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {category.technologies.map((technology) => (
                      <span
                        key={technology.id}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/6 bg-zinc-950/50 px-3 py-2 text-xs text-zinc-300"
                      >
                        <span
                          className="size-1.5 rounded-full"
                          style={{
                            backgroundColor: technology.color || "#8b5cf6",
                          }}
                        />
                        {technology.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="scroll-mt-20 px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8"
        >
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-violet-500/20 bg-linear-to-br from-violet-950/70 via-zinc-900 to-zinc-950 px-6 py-14 sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-16">
            <div className="pointer-events-none absolute -top-32 right-0 size-80 rounded-full bg-violet-600/15 blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-medium text-violet-300">
                <Mail className="size-4" />
                {content.contactEyebrow}
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {content.contactTitle}
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-zinc-400">
                {content.contactDescription}
              </p>
              <p className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
                <MapPin className="size-4 text-violet-300" />
                {settings?.location || content.location}
              </p>
            </div>
            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:flex-col">
              <Button
                asChild
                size="lg"
                className="h-12 bg-white px-5 text-zinc-950 hover:bg-zinc-200"
              >
                <a href={`mailto:${contactEmail}`}>
                  {content.sendEmail}
                  <ArrowUpRight />
                </a>
              </Button>
              <div className="flex justify-center gap-2">
                {[
                  { label: "GitHub", href: githubUrl, icon: GitBranch },
                  { label: "LinkedIn", href: linkedinUrl, icon: ContactRound },
                ].map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    {...externalLinkProps()}
                    aria-label={label}
                    className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/5 py-7">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Felipe Micheletti.</p>
          <p>{content.footer}</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="flex items-center gap-2 text-sm font-medium text-violet-300">
        <CheckCircle2 className="size-4" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl leading-7 text-zinc-400">{description}</p>
    </div>
  );
}

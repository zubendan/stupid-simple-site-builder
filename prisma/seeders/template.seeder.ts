import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';

export const seedTemplates = async (db: PrismaClient) => {
  if (await db.template.count()) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(
      `Template table not empty; skipping seeding. (template.seeder.ts)`,
    );
    return;
  }

  const templates: Prisma.TemplateCreateManyInput[] = [];
  const tags: Prisma.TagCreateManyInput[] = [];

  for (let i = 0; i < 100; i++) {
    const orgId = faker.number.int({ min: 1, max: 99 });
    const templateName = `${faker.word.adverb()} ${faker.word.adjective()} ${faker.word.noun()}`;
    templates.push({
      createdByOrganizationId: orgId,
      name: templateName,
      description: faker.lorem.paragraph(),
      isPublic: false,
    });
    tags.push({
      name: faker.word.sample(),
    });
  }

  await db.template.createMany({ data: templates });
  await db.tag.createMany({ data: tags, skipDuplicates: true });

  const seededTemplates = await db.template.findMany();
  const seeededTags = await db.tag.findMany();

  const organizationTempaltes: Prisma.OrganizationTemplateCreateManyInput[] =
    [];
  const templateTags: Prisma.TemplateTagCreateManyInput[] = [];
  const versions: Prisma.VersionCreateManyInput[] = [];

  for (const template of seededTemplates) {
    organizationTempaltes.push({
      templateId: template.id,
      organizationId: template.createdByOrganizationId,
      templateName: template.name,
    });
    for (let i = 0; i < 10; i++) {
      const tagidx = faker.number.int({ min: 0, max: seeededTags.length - 1 });
      const tag = seeededTags[tagidx];
      if (!tag) continue;
      templateTags.push({
        templateId: template.id,
        tagId: tag.id,
      });
    }
    versions.push({
      templateId: template.id,
      version: `${template.createdByOrganizationId}-1.0`,
      description: faker.lorem.paragraph(),
    });
  }

  db.organizationTemplate.createMany({ data: organizationTempaltes });
  db.templateTag.createMany({ data: templateTags });
  await db.version.createMany({ data: versions });

  const seededVersions = await db.version.findMany();

  const pages: Prisma.PageCreateManyInput[] = [];

  for (const version of seededVersions) {
    pages.push({
      versionId: version.id,
      pageName: 'Home',
      pagePath: '/',
      pageType: 'home',
    });
  }

  const templateInstances = await db.template.findMany({
    include: {
      versions: {
        include: {
          pages: true,
        },
      },
    },
  });

  const components: Prisma.ComponentUncheckedCreateInput[] = [];

  for (const instance of templateInstances) {
    const page = instance.versions[0]?.pages[0];
    if (!page) continue;

    components.push({
      pageId: page.id,
      type: 'div',
      className: 'min-h-screen grid grid-cols-[300px_1fr] grid-rows-1',
      components: {
        create: [
          {
            pageId: page.id,
            type: 'div',
            className: 'bg-gray-900 text-white text-center',
            components: {
              create: {
                pageId: page.id,
                type: 'html',
                html: '<h1>Sidebar</h1>',
              },
            },
          },
          {
            pageId: page.id,
            type: 'div',
            className: 'bg-gray-100 p-4',
            components: {
              create: {
                pageId: page.id,
                type: 'html',
                html: `<h1>${instance.name}'s Main Content</h1>`,
              },
            },
          },
        ],
      },
    });
  }

  await db.component.createMany({ data: components });
};

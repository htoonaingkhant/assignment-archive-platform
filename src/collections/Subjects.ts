import { APIError, type CollectionBeforeDeleteHook, type CollectionConfig } from 'payload'

import { adminOnly, publicRead } from '@/access/roles'

const preventDeleteWhenInUse: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const { totalDocs } = await req.payload.count({
    collection: 'semester-subjects',
    overrideAccess: true,
    req,
    where: {
      subject: {
        equals: id,
      },
    },
  })

  if (totalDocs > 0) {
    throw new APIError(
      `This subject is used by ${totalDocs} semester subject${totalDocs === 1 ? '' : 's'}. Delete those semester-subject records first.`,
      409,
      undefined,
      true,
    )
  }
}

export const Subjects: CollectionConfig = {
  slug: 'subjects',
  admin: {
    defaultColumns: ['code', 'name', 'updatedAt'],
    group: 'Academic Structure',
    useAsTitle: 'code',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: publicRead,
    update: adminOnly,
  },
  defaultSort: 'code',
  hooks: {
    beforeDelete: [preventDeleteWhenInUse],
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}

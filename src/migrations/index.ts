import * as migration_20260811_072802_initial_schema from './20260811_072802_initial_schema'
import * as migration_20260811_081122_add_study_year_inline_upload from './20260811_081122_add_study_year_inline_upload'
import * as migration_20260811_082744_convert_study_year_to_collection from './20260811_082744_convert_study_year_to_collection'

export const migrations = [
  {
    up: migration_20260811_072802_initial_schema.up,
    down: migration_20260811_072802_initial_schema.down,
    name: '20260811_072802_initial_schema',
  },
  {
    up: migration_20260811_081122_add_study_year_inline_upload.up,
    down: migration_20260811_081122_add_study_year_inline_upload.down,
    name: '20260811_081122_add_study_year_inline_upload',
  },
  {
    up: migration_20260811_082744_convert_study_year_to_collection.up,
    down: migration_20260811_082744_convert_study_year_to_collection.down,
    name: '20260811_082744_convert_study_year_to_collection',
  },
]

# @evy/db

## Typical operations

### Migrations

1. Add necessary changes to `schema.prisma`
2. Execute `npm run db:migrate` from `packages/db` folde

- WARNING!: Make sure local or unnecessary DB is targeted, which is in sync with PROD

### Undo migration

1. Target PROD, or any other DB with previous version
2. Execute script to generate `down.sql` script

```sh
npm run with-env prisma migrate diff -- \
--from-schema-datamodel prisma/schema.prisma \
--to-schema-datasource prisma/schema.prisma \
--script > down.sql
```

3. Edit `down.sql` script to include following line in the end: (replace **\_ with migration name)
   `DELETE FROM "\_prisma_migrations" WHERE "migration_name" = '\***'`

4. Execute down script
   `npm run with-env prisma db execute -- --file ./down.sql --schema prisma/schema.prisma`

Now a new migration can be done

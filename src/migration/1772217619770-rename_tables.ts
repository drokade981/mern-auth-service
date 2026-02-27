import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTables1772217619770 implements MigrationInterface {
  name = "RenameTables1772217619770";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe"`,
    );

    await queryRunner.renameTable("user", "users");
    await queryRunner.renameTable("refresh_token", "refreshTokens");

    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_5e0a01181da36ecd50cacef092f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshtokens" DROP CONSTRAINT "FK_5e0a01181da36ecd50cacef092f"`,
    );

    await queryRunner.renameTable("users", "user");
    await queryRunner.renameTable("refreshtokens", "refresh_token");
  }
}

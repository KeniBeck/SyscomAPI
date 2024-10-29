/*
  Warnings:

  - Added the required column `id_categoria` to the `productos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `productos` ADD COLUMN `id_categoria` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `productos` ADD CONSTRAINT `productos_id_categoria_fkey` FOREIGN KEY (`id_categoria`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

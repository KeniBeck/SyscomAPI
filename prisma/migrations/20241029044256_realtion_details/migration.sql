-- CreateTable
CREATE TABLE `DetalleProducto` (
    `id` VARCHAR(191) NOT NULL,
    `id_producto` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NULL,
    `marca` VARCHAR(191) NULL,
    `sat_key` VARCHAR(191) NULL,
    `img_portada` VARCHAR(191) NULL,
    `link_privado` VARCHAR(191) NULL,
    `pvol` DOUBLE NULL,
    `marca_logo` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,
    `descripcion` VARCHAR(191) NULL,
    `peso` DOUBLE NULL,
    `alto` DOUBLE NULL,
    `largo` DOUBLE NULL,
    `ancho` DOUBLE NULL,
    `unidad_de_medida` VARCHAR(191) NULL,
    `precio_1` DOUBLE NULL,
    `precio_especial` DOUBLE NULL,
    `precio_descuento` DOUBLE NULL,
    `precio_lista` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Caracteristica` (
    `id` VARCHAR(191) NOT NULL,
    `id_detalle` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Imagen` (
    `id` VARCHAR(191) NOT NULL,
    `id_detalle` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `orden` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recurso` (
    `id` VARCHAR(191) NOT NULL,
    `id_detalle` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DetalleProducto` ADD CONSTRAINT `DetalleProducto_id_producto_fkey` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Caracteristica` ADD CONSTRAINT `Caracteristica_id_detalle_fkey` FOREIGN KEY (`id_detalle`) REFERENCES `DetalleProducto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Imagen` ADD CONSTRAINT `Imagen_id_detalle_fkey` FOREIGN KEY (`id_detalle`) REFERENCES `DetalleProducto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recurso` ADD CONSTRAINT `Recurso_id_detalle_fkey` FOREIGN KEY (`id_detalle`) REFERENCES `DetalleProducto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

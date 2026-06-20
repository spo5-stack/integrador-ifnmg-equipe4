-- DropForeignKey
ALTER TABLE `leituras_sensor` DROP FOREIGN KEY `leituras_sensor_dispositivos_id_fkey`;

-- AddForeignKey
ALTER TABLE `leituras_sensor` ADD CONSTRAINT `leituras_sensor_dispositivos_id_fkey` FOREIGN KEY (`dispositivos_id`) REFERENCES `dispositivos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `token_version` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `codigos_recuperacao_senha` (
    `id` VARCHAR(191) NOT NULL,
    `usuario_id` VARCHAR(191) NOT NULL,
    `codigo_hash` VARCHAR(191) NOT NULL,
    `reset_token_hash` VARCHAR(191) NULL,
    `reset_token_expira_em` DATETIME(3) NULL,
    `tentativas` INTEGER NOT NULL DEFAULT 0,
    `expira_em` DATETIME(3) NOT NULL,
    `usado_em` DATETIME(3) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `codigos_recuperacao_senha_reset_token_hash_key`(`reset_token_hash`),
    INDEX `codigos_recuperacao_senha_usuario_id_idx`(`usuario_id`),
    INDEX `codigos_recuperacao_senha_expira_em_idx`(`expira_em`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `codigos_recuperacao_senha` ADD CONSTRAINT `codigos_recuperacao_senha_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

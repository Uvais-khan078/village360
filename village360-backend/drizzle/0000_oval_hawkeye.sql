CREATE TABLE `amenities` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`village_id` varchar(36) NOT NULL,
	`amenity_type` text NOT NULL,
	`available` int DEFAULT 0,
	`required` int DEFAULT 0,
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `amenities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`village_id` varchar(36) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`status` enum('planning','ongoing','completed','delayed','cancelled') NOT NULL DEFAULT 'planning',
	`start_date` timestamp,
	`end_date` timestamp,
	`budget` decimal(12,2),
	`progress` int DEFAULT 0,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`project_id` varchar(36),
	`report_type` enum('progress','completion','gap_analysis','monthly') NOT NULL,
	`title` text NOT NULL,
	`content` text,
	`file_url` text,
	`created_by` varchar(36) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` enum('admin','district_officer','block_officer','public_viewer') NOT NULL DEFAULT 'public_viewer',
	`district` text,
	`block` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `villages` (
	`id` varchar(36) NOT NULL,
	`name` text NOT NULL,
	`district` text NOT NULL,
	`block` text NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`population` int,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `villages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `amenities` ADD CONSTRAINT `amenities_village_id_villages_id_fk` FOREIGN KEY (`village_id`) REFERENCES `villages`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_village_id_villages_id_fk` FOREIGN KEY (`village_id`) REFERENCES `villages`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `reports` ADD CONSTRAINT `reports_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
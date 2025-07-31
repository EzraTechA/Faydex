-- Customer Identifier
CREATE TABLE IF NOT EXISTS `customer_identifier` (
  `customer_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_email` VARCHAR(100) NOT NULL UNIQUE,
  `customer_phone_number` VARCHAR(20) NOT NULL,
  `customer_added_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `customer_hash` VARCHAR(255) NOT NULL
);

-- Customer Info
CREATE TABLE IF NOT EXISTS `customer_info` (
  `customer_info_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `customer_first_name` VARCHAR(100) NOT NULL,
  `customer_last_name` VARCHAR(100) NOT NULL,
  `active_customer_status` TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (`customer_id`) REFERENCES customer_identifier(`customer_id`) ON DELETE CASCADE
);

-- Customer KYC Status
CREATE TABLE IF NOT EXISTS `customer_kyc_status` (
  `kyc_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `kyc_verified` BOOLEAN DEFAULT FALSE,
  `kyc_verification_date` DATETIME,
  FOREIGN KEY (`customer_id`) REFERENCES customer_identifier(`customer_id`) ON DELETE CASCADE
);

-- Wallets
CREATE TABLE IF NOT EXISTS `wallets` (
  `wallet_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT NOT NULL,
  `balance` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(10) DEFAULT 'ETB',
  FOREIGN KEY (`customer_id`) REFERENCES customer_identifier(`customer_id`) ON DELETE CASCADE
);

-- Transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `transaction_id` INT AUTO_INCREMENT PRIMARY KEY,
  `wallet_id` INT NOT NULL,
  `type` ENUM('deposit', 'withdrawal', 'trade', 'refund') NOT NULL,
  `amount` DECIMAL(18,2) NOT NULL,
  `status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  `timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `description` TEXT,
  FOREIGN KEY (`wallet_id`) REFERENCES wallets(`wallet_id`) ON DELETE CASCADE
);

-- Login Activity
CREATE TABLE IF NOT EXISTS `login_activity` (
  `log_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT,
  `ip_address` VARCHAR(45),
  `user_agent` TEXT,
  `login_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `successful` BOOLEAN,
  FOREIGN KEY (`customer_id`) REFERENCES customer_identifier(`customer_id`) ON DELETE SET NULL
);

-- Sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` VARCHAR(255) PRIMARY KEY,
  `customer_id` INT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `expires_at` DATETIME,
  FOREIGN KEY (`customer_id`) REFERENCES customer_identifier(`customer_id`) ON DELETE CASCADE
);

-- OIDC Tokens
CREATE TABLE IF NOT EXISTS `oidc_tokens` (
  `token_id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_id` INT,
  `id_token` TEXT,
  `access_token` TEXT,
  `issued_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `expires_in` INT,
  FOREIGN KEY (`customer_id`) REFERENCES customer_identifier(`customer_id`) ON DELETE CASCADE
);

-- Company Roles
CREATE TABLE IF NOT EXISTS `company_roles` (
  `company_role_id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_role_name` VARCHAR(100) UNIQUE NOT NULL
);

-- Employee
CREATE TABLE IF NOT EXISTS `employee` (
  `employee_id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_email` VARCHAR(100) UNIQUE NOT NULL,
  `active_employee` TINYINT NOT NULL DEFAULT 1,
  `added_date` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employee Info
CREATE TABLE IF NOT EXISTS `employee_info` (
  `employee_info_id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT NOT NULL,
  `employee_first_name` VARCHAR(100),
  `employee_last_name` VARCHAR(100),
  `employee_phone` VARCHAR(20),
  FOREIGN KEY (`employee_id`) REFERENCES employee(`employee_id`) ON DELETE CASCADE
);

-- Employee Passwords
CREATE TABLE IF NOT EXISTS `employee_pass` (
  `employee_pass_id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT NOT NULL,
  `employee_password_hashed` VARCHAR(255),
  FOREIGN KEY (`employee_id`) REFERENCES employee(`employee_id`) ON DELETE CASCADE
);

-- Employee Roles
CREATE TABLE IF NOT EXISTS `employee_role` (
  `employee_role_id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT NOT NULL,
  `company_role_id` INT NOT NULL,
  FOREIGN KEY (`employee_id`) REFERENCES employee(`employee_id`) ON DELETE CASCADE,
  FOREIGN KEY (`company_role_id`) REFERENCES company_roles(`company_role_id`) ON DELETE CASCADE
);

-- Common Services
CREATE TABLE IF NOT EXISTS `common_services` (
  `service_id` INT AUTO_INCREMENT PRIMARY KEY,
  `service_name` VARCHAR(255),
  `service_description` TEXT
);

-- Orders
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` INT AUTO_INCREMENT PRIMARY KEY,
  `employee_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `active_order` TINYINT NOT NULL DEFAULT 1,
  `order_hash` VARCHAR(255),
  FOREIGN KEY (`employee_id`) REFERENCES employee(`employee_id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES customer_identifier(`customer_id`) ON DELETE CASCADE
);

-- Order Info
CREATE TABLE IF NOT EXISTS `order_info` (
  `order_info_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `order_total_price` DECIMAL(10,2),
  `estimated_completion_date` DATETIME,
  `completion_date` DATETIME,
  `additional_request` TEXT,
  `notes_for_internal_use` TEXT,
  `notes_for_customer` TEXT,
  `additional_requests_completed` TINYINT NOT NULL DEFAULT 0,
  FOREIGN KEY (`order_id`) REFERENCES orders(`order_id`) ON DELETE CASCADE
);

-- Order Services
CREATE TABLE IF NOT EXISTS `order_services` (
  `order_service_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `service_completed` TINYINT NOT NULL DEFAULT 0,
  FOREIGN KEY (`order_id`) REFERENCES orders(`order_id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES common_services(`service_id`) ON DELETE CASCADE
);

-- Order Status
CREATE TABLE IF NOT EXISTS `order_status` (
  `order_status_id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `order_status` TINYINT NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES orders(`order_id`) ON DELETE CASCADE
);

-- Insert default roles
INSERT IGNORE INTO `company_roles` (`company_role_name`) VALUES
  ('Employee'), ('Manager'), ('Admin');

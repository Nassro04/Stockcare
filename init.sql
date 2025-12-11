-- Script de création de la base de données pour StockCare (MySQL)

-- Table des rôles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ex: 'Admin', 'Pharmacist', 'Technician'
);

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Table des catégories de produits
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- Table des fournisseurs
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des emplacements de stockage
CREATE TABLE locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- Ex: 'REF-01-A', 'SHELF-12-B'
    description TEXT
);

-- Table des produits (médicaments)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE, -- Stock Keeping Unit
    barcode VARCHAR(255) UNIQUE, -- Code-barres
    category_id INT,
    supplier_id INT,
    alert_threshold INT DEFAULT 10, -- Seuil de stock pour les alertes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- Table des lots de stock (le coeur du système)
CREATE TABLE stock_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    lot_number VARCHAR(100) NOT NULL, -- Numéro de lot
    quantity INT NOT NULL CHECK (quantity >= 0),
    expiry_date DATE NOT NULL, -- Date de péremption (DLU)
    location_id INT,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (product_id, lot_number), -- Un lot est unique pour un produit donné
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Table des mouvements de stock (pour la traçabilité)
CREATE TABLE stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_item_id INT NOT NULL,
    user_id INT NOT NULL,
    type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    quantity_change INT NOT NULL,
    reason TEXT, -- Ex: 'Livraison fournisseur', 'Dispensation patient', 'Inventaire'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_item_id) REFERENCES stock_items(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des alertes
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    stock_item_id INT,
    type ENUM('LOW_STOCK', 'NEAR_EXPIRY') NOT NULL,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (stock_item_id) REFERENCES stock_items(id)
);

-- Table des logs d'audit
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL, -- Ex: 'USER_LOGIN', 'PRODUCT_UPDATE'
    details JSON, -- Pour stocker des détails contextuels
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index (MySQL crée automatiquement des index sur les FK, mais on garde les autres)
CREATE INDEX idx_stock_items_expiry_date ON stock_items(expiry_date);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_stock_movements_created_at ON stock_movements(created_at);

-- Insertion des rôles de base
INSERT INTO roles (name) VALUES ('Admin'), ('User'), ('Pharmacien'), ('Magasinier'), ('Auditeur') ON DUPLICATE KEY UPDATE name=name;

-- Ajout d'un utilisateur admin par défaut. Mot de passe : 'admin'
-- Le hash est compatible (bcrypt)
INSERT INTO users (username, email, password_hash, role_id) VALUES ('admin', 'admin@stockcare.com', '$2b$10$k9/eY.PnBUVP/PAPCO17HuxIh1pGJZT9Ytv6xOjMN5OTKNr3imgL6n', 1);

-- Vue pour l'état du stock actuel (Inventory Health)
CREATE OR REPLACE VIEW v_powerbi_stock_status AS
SELECT 
    p.name AS product_name,
    c.name AS category_name,
    s.name AS supplier_name,
    si.lot_number,
    si.quantity,
    si.expiry_date,
    CASE 
        WHEN si.expiry_date < CURDATE() THEN 'Expired'
        WHEN si.expiry_date < DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN 'Near Expiry'
        ELSE 'OK'
    END AS status,
    l.name AS location_name
FROM stock_items si
JOIN products p ON si.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN suppliers s ON p.supplier_id = s.id
LEFT JOIN locations l ON si.location_id = l.id;

-- Vue pour les mouvements de stock (Turnover & Activity)
CREATE OR REPLACE VIEW v_powerbi_movements AS
SELECT 
    sm.created_at,
    p.name AS product_name,
    c.name AS category_name,
    sm.type AS movement_type,
    sm.quantity_change,
    sm.reason,
    u.username AS user_name
FROM stock_movements sm
JOIN stock_items si ON sm.stock_item_id = si.id
JOIN products p ON si.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN users u ON sm.user_id = u.id;

-- Vue pour les alertes (Quality & Compliance)
CREATE OR REPLACE VIEW v_powerbi_alerts AS
SELECT 
    a.created_at,
    a.type AS alert_type,
    a.message,
    a.is_resolved,
    p.name AS product_name
FROM alerts a
LEFT JOIN products p ON a.product_id = p.id;
